import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'
import { Timestamp, FieldValue } from 'firebase-admin/firestore'
import { messageSchema } from '@/lib/validations'
import { filterMessage } from '@/lib/contact-filter'

// ── GET /api/messages?threadId=xxx ────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const threadId = searchParams.get('threadId')

  try {
    if (threadId) {
      // Fetch single thread + its messages
      const threadSnap = await adminDb.collection('threads').doc(threadId).get()
      if (!threadSnap.exists) return NextResponse.json({ ok: false, error: { code: 'not_found', message: 'Thread not found' } }, { status: 404 })

      const thread = threadSnap.data()!
      // Ensure user is a participant
      if (thread.buyerId !== session.user.id && thread.sellerId !== session.user.id) {
        return NextResponse.json({ ok: false, error: { code: 'forbidden', message: 'Not a participant' } }, { status: 403 })
      }

      const msgSnap = await adminDb
        .collection('threads').doc(threadId)
        .collection('messages')
        .orderBy('createdAt', 'asc')
        .limit(200)
        .get()

      const messages = msgSnap.docs.map(d => ({ id: d.id, ...d.data() }))

      // Mark as read
      await adminDb.collection('threads').doc(threadId).update({
        [`unreadCount.${session.user.id}`]: 0,
      })

      return NextResponse.json({ ok: true, data: { thread: { id: threadSnap.id, ...thread }, messages } })
    }

    // Fetch all threads for current user
    const snap = await adminDb.collection('threads')
      .where('buyerId', '==', session.user.id)
      .orderBy('lastMessageAt', 'desc')
      .limit(50)
      .get()

    const snap2 = await adminDb.collection('threads')
      .where('sellerId', '==', session.user.id)
      .orderBy('lastMessageAt', 'desc')
      .limit(50)
      .get()

    const threads = [
      ...snap.docs.map(d => ({ id: d.id, ...d.data() })),
      ...snap2.docs.map(d => ({ id: d.id, ...d.data() })),
    ].sort((a: any, b: any) => b.lastMessageAt?.seconds - a.lastMessageAt?.seconds)

    return NextResponse.json({ ok: true, data: { threads } })
  } catch (err) {
    console.error('GET /api/messages', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to fetch messages' } }, { status: 500 })
  }
}

// ── POST /api/messages ────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })

  try {
    const body = await req.json()
    const { threadId, projectId, receiverId, text } = body

    const parsed = messageSchema.safeParse({ text })
    if (!parsed.success) return NextResponse.json({ ok: false, error: { code: 'validation', message: parsed.error.issues[0].message } }, { status: 400 })

    // Filter contact info
    const { blocked, reason, sanitised } = filterMessage(text)

    const now = Timestamp.now()
    let resolvedThreadId = threadId

    // Create thread if it doesn't exist yet
    if (!threadId) {
      if (!projectId || !receiverId) {
        return NextResponse.json({ ok: false, error: { code: 'validation', message: 'projectId and receiverId required for new thread' } }, { status: 400 })
      }

      // Check for existing thread
      const existing = await adminDb.collection('threads')
        .where('projectId', '==', projectId)
        .where('buyerId',   '==', session.user.id)
        .limit(1)
        .get()

      if (!existing.empty) {
        resolvedThreadId = existing.docs[0].id
      } else {
        // Fetch project + receiver info
        const [projectSnap, receiverSnap] = await Promise.all([
          adminDb.collection('projects').doc(projectId).get(),
          adminDb.collection('users').doc(receiverId).get(),
        ])

        const project  = projectSnap.data()
        const receiver = receiverSnap.data()

        const newThread = {
          projectId,
          projectTitle: project?.title || 'Unknown Project',
          buyerId:         session.user.id,
          buyerName:       session.user.name || '',
          buyerPhotoURL:   session.user.image || null,
          sellerId:        receiverId,
          sellerName:      receiver?.displayName || '',
          sellerPhotoURL:  receiver?.photoURL || null,
          lastMessage:     blocked ? '[Message blocked]' : sanitised,
          lastMessageAt:   now,
          unreadCount:     { [receiverId]: 1 },
          createdAt:       now,
        }

        const ref = await adminDb.collection('threads').add(newThread)
        resolvedThreadId = ref.id
      }
    }

    // Save message
    const message = {
      threadId:    resolvedThreadId,
      senderId:    session.user.id,
      senderName:  session.user.name || '',
      text:        blocked ? '[Message blocked — contact info detected]' : sanitised,
      blocked,
      blockedReason: blocked ? reason : null,
      createdAt:   now,
    }

    const msgRef = await adminDb
      .collection('threads').doc(resolvedThreadId)
      .collection('messages').add(message)

    // Update thread's last message + unread count
    if (!blocked) {
      const threadSnap = await adminDb.collection('threads').doc(resolvedThreadId).get()
      const thread = threadSnap.data()
      const otherUserId = thread?.buyerId === session.user.id ? thread?.sellerId : thread?.buyerId

      await adminDb.collection('threads').doc(resolvedThreadId).update({
        lastMessage:   sanitised,
        lastMessageAt: now,
        ...(otherUserId ? { [`unreadCount.${otherUserId}`]: FieldValue.increment(1) } : {}),
      })
    }

    return NextResponse.json({
      ok: true,
      data: {
        message:  { id: msgRef.id, ...message },
        threadId: resolvedThreadId,
        blocked,
        blockedReason: reason,
      },
    }, { status: 201 })
  } catch (err) {
    console.error('POST /api/messages', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to send message' } }, { status: 500 })
  }
}
