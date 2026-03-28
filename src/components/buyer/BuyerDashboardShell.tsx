'use client'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Receipt, Heart, MessageCircle, Search, LogOut, ShoppingBag, Download, Package } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { PaxlavaLogo } from '@/components/shared/PaxlavaLogo'
import { useLang } from '@/contexts/LangContext'
import type { Order } from '@/types'

type Tab = 'purchases' | 'saved'

interface ShellProps {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role: string }
}

export function BuyerDashboardShell({ user }: ShellProps) {
  const [tab, setTab] = useState<Tab>('purchases')
  const { t } = useLang()

  const TABS = [
    { id: 'purchases' as Tab, label: t.dashboard.purchases, mobileLabel: 'Purchases', icon: <Receipt size={16} /> },
    { id: 'saved'     as Tab, label: t.dashboard.saved,     mobileLabel: 'Saved',     icon: <Heart size={16} /> },
  ]

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#F5F3EE]">

      {/* Mobile tab bar */}
      <div className="md:hidden flex border-b-2 border-black bg-white overflow-x-auto">
        {TABS.map(tb => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-black whitespace-nowrap border-b-2 transition-colors flex-1 justify-center ${
              tab === tb.id ? 'border-black bg-black text-white' : 'border-transparent hover:bg-cream'
            }`}
          >
            {tb.icon} {tb.mobileLabel}
          </button>
        ))}
        <Link href="/messages" className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-black whitespace-nowrap border-b-2 border-transparent hover:bg-cream flex-1 justify-center">
          <MessageCircle size={16} /> Chat
        </Link>
        <Link href="/discover" className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-black whitespace-nowrap border-b-2 border-transparent hover:bg-cream flex-1 justify-center">
          <Search size={16} /> Browse
        </Link>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 border-r-2 border-black bg-white flex-col shrink-0 min-h-[calc(100vh-60px)]">

          {/* Logo */}
          <div className="px-6 py-5 border-b-2 border-black flex items-center gap-2.5">
            <PaxlavaLogo size={28} />
            <span className="font-black text-base tracking-tight">Paxlava</span>
          </div>

          {/* User profile */}
          <div className="px-6 py-5 border-b-2 border-black">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-black bg-cobalt flex items-center justify-center font-black text-base overflow-hidden shrink-0 text-white" style={{boxShadow:'2px 2px 0 #000'}}>
                {user.image
                  ? <img src={user.image} alt="" className="w-full h-full object-cover" />
                  : user.name?.slice(0, 2).toUpperCase()
                }
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm truncate">{user.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-cobalt" />
                  <span className="text-xs text-gray-500 font-semibold">Buyer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {TABS.map(tb => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                  tab === tb.id
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-[#F5F3EE]'
                }`}
              >
                <span className={tab === tb.id ? 'text-white' : 'text-gray-400'}>{tb.icon}</span>
                {tb.label}
              </button>
            ))}
            <Link href="/messages" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-[#F5F3EE] transition-all">
              <span className="text-gray-400"><MessageCircle size={16} /></span>
              {t.nav.messages}
            </Link>
            <Link href="/discover" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-[#F5F3EE] transition-all">
              <span className="text-gray-400"><Search size={16} /></span>
              {t.dashboard.browse}
            </Link>
          </nav>

          {/* Bottom */}
          <div className="px-3 py-4 border-t-2 border-black">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={16} /> {t.dashboard.logout}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-5 sm:p-8">
          <div className="mb-6 pb-5 border-b-2 border-black/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              <Package size={12} /> Buyer Dashboard
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {tab === 'purchases' ? t.dashboard.purchases : t.dashboard.saved}
            </h1>
          </div>

          {tab === 'purchases' && <PurchasesTab userId={user.id} />}
          {tab === 'saved'     && <SavedTab />}
        </main>
      </div>
    </div>
  )
}

function PurchasesTab({ userId }: { userId: string }) {
  const [orders, setOrders]   = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders?role=buyer')
      .then(r => r.json())
      .then(j => { if (j.ok) setOrders(j.data.orders) })
      .finally(() => setLoading(false))
  }, [])

  const total = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount, 0)

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="flex border-2 border-black rounded-xl overflow-hidden bg-white">
        <div className="flex-1 p-5 border-r-2 border-black text-center">
          <div className="text-2xl font-black">{orders.length}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mt-1">Projects owned</div>
        </div>
        <div className="flex-1 p-5 text-center">
          <div className="text-2xl font-black">{formatPrice(total)}</div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mt-1">Total spent</div>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center">
          <div className="inline-block w-7 h-7 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-black/20 rounded-2xl bg-white">
          <ShoppingBag size={44} className="mx-auto mb-4 opacity-20" />
          <p className="font-black text-lg mb-2">No purchases yet</p>
          <p className="text-sm text-gray-400 mb-5">Find your first project in the marketplace.</p>
          <Link href="/discover" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-pill font-bold text-sm hover:bg-gray-800 transition-colors btn-gum">
            Browse projects
          </Link>
        </div>
      ) : (
        <div className="bg-white border-2 border-black rounded-xl overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#F5F3EE] border-b-2 border-black">
                <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500">Project</th>
                <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500 hidden sm:table-cell">Seller</th>
                <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500">Paid</th>
                <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500 hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {orders.map((o, i) => (
                <tr key={i} className="hover:bg-[#F5F3EE] transition-colors">
                  <td className="px-5 py-4 font-semibold">
                    <Link href={`/projects/${o.projectId}`} className="hover:underline line-clamp-1">{o.projectTitle}</Link>
                  </td>
                  <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">@{o.sellerName}</td>
                  <td className="px-5 py-4 font-black">{formatPrice(o.amount)}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs hidden md:table-cell">{formatDate(o.createdAt)}</td>
                  <td className="px-5 py-4">
                    {o.status === 'completed' ? (
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-pill text-xs font-bold hover:bg-gray-800 transition-colors">
                        <Download size={11} /> Download
                      </button>
                    ) : (
                      <Badge variant={o.status === 'in_escrow' ? 'yellow' : 'lav'}>{o.status}</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function SavedTab() {
  return (
    <div className="text-center py-20 border-2 border-dashed border-black/20 rounded-2xl bg-white">
      <Heart size={44} className="mx-auto mb-4 opacity-20" />
      <p className="font-black text-lg mb-2">No saved projects yet</p>
      <p className="text-sm text-gray-400 mb-5">Click the heart icon on any project to save it here.</p>
      <Link href="/discover" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-pill font-bold text-sm hover:bg-gray-800 transition-colors btn-gum">
        Browse projects
      </Link>
    </div>
  )
}
