import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'
import { profileSchema } from '@/lib/validations'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })

  try {
    const snap = await adminDb.collection('users').doc(session.user.id).get()
    if (!snap.exists) return NextResponse.json({ ok: false, error: { code: 'not_found', message: 'User not found' } }, { status: 404 })
    return NextResponse.json({ ok: true, data: { id: snap.id, ...snap.data() } })
  } catch (err) {
    console.error('GET /api/users/me', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to fetch profile' } }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = profileSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ ok: false, error: { code: 'validation', message: parsed.error.issues[0].message } }, { status: 400 })

    await adminDb.collection('users').doc(session.user.id).update({
      ...parsed.data,
      updatedAt: Timestamp.now(),
    })
    return NextResponse.json({ ok: true, data: parsed.data })
  } catch (err) {
    console.error('PATCH /api/users/me', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to update profile' } }, { status: 500 })
  }
}
