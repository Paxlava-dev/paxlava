import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'
import { platformFee, sellerReceives } from '@/lib/utils'

// ── GET /api/orders ────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const asSeller = searchParams.get('role') === 'seller'

  try {
    const field = asSeller ? 'sellerId' : 'buyerId'
    const snap = await adminDb.collection('orders')
      .where(field, '==', session.user.id)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()

    const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    return NextResponse.json({ ok: true, data: { orders } })
  } catch (err) {
    console.error('GET /api/orders', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to fetch orders' } }, { status: 500 })
  }
}

// ── POST /api/orders ───────────────────────────────────────────
// Creates a pending order (escrow). Stripe payment happens client-side.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })

  try {
    const { projectId } = await req.json()
    if (!projectId) return NextResponse.json({ ok: false, error: { code: 'validation', message: 'projectId required' } }, { status: 400 })

    const projectSnap = await adminDb.collection('projects').doc(projectId).get()
    if (!projectSnap.exists) return NextResponse.json({ ok: false, error: { code: 'not_found', message: 'Project not found' } }, { status: 404 })

    const project = projectSnap.data()!
    if (project.status !== 'active') return NextResponse.json({ ok: false, error: { code: 'unavailable', message: 'Project is not available for purchase' } }, { status: 400 })
    if (project.sellerId === session.user.id) return NextResponse.json({ ok: false, error: { code: 'forbidden', message: 'Cannot buy your own project' } }, { status: 400 })

    const now = Timestamp.now()
    const order = {
      projectId,
      projectTitle:        project.title,
      projectThumbnailURL: project.thumbnailURL || null,
      buyerId:             session.user.id,
      buyerName:           session.user.name || '',
      sellerId:            project.sellerId,
      sellerName:          project.sellerName,
      amount:              project.price,
      platformFee:         platformFee(project.price),
      sellerReceives:      sellerReceives(project.price),
      currency:            'USD',
      status:              'pending',
      createdAt:           now,
      updatedAt:           now,
    }

    const ref = await adminDb.collection('orders').add(order)
    return NextResponse.json({ ok: true, data: { id: ref.id, ...order } }, { status: 201 })
  } catch (err) {
    console.error('POST /api/orders', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to create order' } }, { status: 500 })
  }
}
