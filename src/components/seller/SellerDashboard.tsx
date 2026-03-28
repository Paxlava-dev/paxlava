'use client'
import { useSellerStats } from '@/hooks/useSellerStats'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="p-5 border-r-2 border-black last:border-r-0 text-center">
      <div className="text-2xl font-black tracking-tight">{value}</div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  const max = Math.max(...data.map(d => d.revenue), 1)
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Monthly Revenue</div>
      <div className="flex items-end gap-2.5 h-28">
        {data.map(({ month, revenue }) => (
          <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className="w-full bg-black rounded-t-md transition-all duration-500"
              style={{ height: `${Math.round((revenue / max) * 100)}%`, minHeight: revenue > 0 ? 4 : 0 }}
            />
            <span className="text-[10px] font-bold text-gray-400">{month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const STATUS_BADGE: Record<string, React.ReactElement> = {
  completed: <Badge variant="green">Delivered</Badge>,
  in_escrow: <Badge variant="yellow">In escrow</Badge>,
  pending:   <Badge variant="lav">Pending</Badge>,
  disputed:  <Badge variant="red">Disputed</Badge>,
}

export function SellerDashboard() {
  const { stats, loading, error } = useSellerStats()

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 font-semibold text-gray-500">Loading your dashboard…</p>
      </div>
    )
  }

  if (error || !stats) {
    return <div className="p-10 text-center text-red-600 font-semibold">{error || 'Failed to load'}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Your seller performance at a glance</p>
      </div>

      {/* KPIs */}
      <div className="flex border-2 border-black rounded-xl overflow-hidden bg-white">
        <KpiCard label="Total Earnings"   value={formatPrice(stats.totalRevenue)}    sub="after fees" />
        <KpiCard label="Total Sales"      value={String(stats.totalSales)} />
        <KpiCard label="Total Views"      value={stats.totalViews.toLocaleString()} />
        <KpiCard label="Active Listings"  value={String(stats.totalListings)} />
        {stats.pendingEarnings > 0 && (
          <KpiCard label="In Escrow" value={formatPrice(stats.pendingEarnings)} sub="pending release" />
        )}
      </div>

      {/* Revenue chart */}
      <div className="bg-white border-2 border-black rounded-xl p-6">
        <RevenueChart data={stats.monthly} />
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="font-black text-lg mb-3">Recent Sales</h2>
        <div className="bg-white border-2 border-black rounded-xl overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-cream border-b-2 border-black">
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wide text-gray-500">Project</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wide text-gray-500">Buyer</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wide text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wide text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wide text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400 font-semibold">No sales yet — list your first project!</td>
                </tr>
              )}
              {stats.recentOrders.map((order: any, i: number) => (
                <tr key={i} className="border-b border-black/10 hover:bg-cream transition-colors">
                  <td className="px-4 py-3 font-semibold">{order.projectTitle}</td>
                  <td className="px-4 py-3 text-gray-500">@{order.buyerName}</td>
                  <td className="px-4 py-3 font-black">{formatPrice(order.sellerReceives)}</td>
                  <td className="px-4 py-3 text-gray-500">{order.createdAt ? formatDate(new Date(order.createdAt)) : '—'}</td>
                  <td className="px-4 py-3">{STATUS_BADGE[order.status] || <Badge>{order.status}</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
