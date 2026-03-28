import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })
  if (session.user.role !== 'admin') return NextResponse.json({ ok: false, error: { code: 'forbidden', message: 'Admin access required' } }, { status: 403 })

  try {
    const [usersSnap, activeSnap, pendingSnap, ordersSnap] = await Promise.all([
      adminDb.collection('users').count().get(),
      adminDb.collection('projects').where('status', '==', 'active').count().get(),
      adminDb.collection('projects').where('status', '==', 'pending_review').count().get(),
      adminDb.collection('orders').where('status', '==', 'completed').get(),
    ])

    const totalRevenue = ordersSnap.docs.reduce((s, d) => s + (d.data().platformFee || 0), 0)

    return NextResponse.json({
      ok: true,
      data: {
        totalUsers:       usersSnap.data().count,
        activeProjects:   activeSnap.data().count,
        pendingProjects:  pendingSnap.data().count,
        totalOrders:      ordersSnap.size,
        platformRevenue:  totalRevenue,
      },
    })
  } catch (err) {
    console.error('GET /api/admin/stats', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to fetch stats' } }, { status: 500 })
  }
}
