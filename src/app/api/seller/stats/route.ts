import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })
  if (session.user.role !== 'seller') return NextResponse.json({ ok: false, error: { code: 'forbidden', message: 'Seller access only' } }, { status: 403 })

  try {
    const [ordersSnap, projectsSnap] = await Promise.all([
      adminDb.collection('orders')
        .where('sellerId', '==', session.user.id)
        .get(),
      adminDb.collection('projects')
        .where('sellerId', '==', session.user.id)
        .where('status', '==', 'active')
        .get(),
    ])

    const orders = ordersSnap.docs.map(d => d.data())
    const completedOrders = orders.filter(o => o.status === 'completed')

    const totalRevenue    = completedOrders.reduce((s, o) => s + (o.sellerReceives || 0), 0)
    const totalSales      = completedOrders.length
    const totalViews      = projectsSnap.docs.reduce((s, d) => s + (d.data().views || 0), 0)
    const totalListings   = projectsSnap.size
    const pendingEarnings = orders.filter(o => o.status === 'in_escrow').reduce((s, o) => s + (o.sellerReceives || 0), 0)

    // Monthly breakdown (last 6 months)
    const now = new Date()
    const monthly: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
      monthly[key] = 0
    }

    completedOrders.forEach(o => {
      const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt)
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
      if (key in monthly) monthly[key] += o.sellerReceives || 0
    })

    return NextResponse.json({
      ok: true,
      data: {
        totalRevenue,
        totalSales,
        totalViews,
        totalListings,
        pendingEarnings,
        recentOrders: orders.slice(0, 10).map(o => ({
          ...o,
          createdAt: o.createdAt?.toDate ? o.createdAt.toDate().toISOString() : null,
        })),
        monthly: Object.entries(monthly).map(([month, revenue]) => ({ month, revenue })),
      },
    })
  } catch (err) {
    console.error('GET /api/seller/stats', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to fetch stats' } }, { status: 500 })
  }
}
