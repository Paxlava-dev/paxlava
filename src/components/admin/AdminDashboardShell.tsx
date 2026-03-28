'use client'
import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { BarChart3, Clock, CheckCircle2, Home, LogOut, Search, RefreshCw, ExternalLink, Shield, Package, Users } from 'lucide-react'
import { formatPrice, formatDate, CATEGORY_LABELS } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PaxlavaLogo } from '@/components/shared/PaxlavaLogo'
import { useLang } from '@/contexts/LangContext'
import type { Project } from '@/types'

type Tab = 'overview' | 'pending' | 'active'

interface ShellProps {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role: string }
}

interface AdminStats {
  totalUsers:      number
  activeProjects:  number
  pendingProjects: number
  totalOrders:     number
  platformRevenue: number
}

const TABS: { id: Tab; label: string; mobileLabel: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview',        mobileLabel: 'Overview', icon: <BarChart3 size={16} /> },
  { id: 'pending',  label: 'Pending Review',  mobileLabel: 'Pending',  icon: <Clock size={16} /> },
  { id: 'active',   label: 'Active Listings', mobileLabel: 'Active',   icon: <CheckCircle2 size={16} /> },
]

export function AdminDashboardShell({ user }: ShellProps) {
  const [tab, setTab] = useState<Tab>('overview')
  const { t } = useLang()

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
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 border-r-2 border-black bg-white flex-col shrink-0 min-h-[calc(100vh-60px)]">

          {/* Logo */}
          <div className="px-6 py-5 border-b-2 border-black flex items-center gap-2.5">
            <PaxlavaLogo size={28} />
            <span className="font-black text-base tracking-tight">Paxlava</span>
          </div>

          {/* Admin profile */}
          <div className="px-6 py-5 border-b-2 border-black">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-black bg-lav flex items-center justify-center font-black text-base overflow-hidden shrink-0" style={{boxShadow:'2px 2px 0 #000'}}>
                {user.image
                  ? <img src={user.image} alt="" className="w-full h-full object-cover" />
                  : user.name?.slice(0, 2).toUpperCase()
                }
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm truncate">{user.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield size={10} className="text-lav" />
                  <span className="text-xs text-gray-500 font-semibold">Admin</span>
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
            <Link href="/discover" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-[#F5F3EE] transition-all">
              <span className="text-gray-400"><Home size={16} /></span>
              Marketplace
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
              <Shield size={12} /> Admin Dashboard
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {tab === 'overview' ? 'Overview' : tab === 'pending' ? 'Pending Review' : 'Active Listings'}
            </h1>
          </div>

          {tab === 'overview' && <OverviewTab />}
          {tab === 'pending'  && <ProjectsTab status="pending_review" />}
          {tab === 'active'   && <ProjectsTab status="active" />}
        </main>
      </div>
    </div>
  )
}

function OverviewTab() {
  const [stats, setStats]   = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(j => { if (j.ok) setStats(j.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const KPI_CARDS = [
    { label: 'Total Users',      value: stats?.totalUsers?.toLocaleString() || '0',      icon: <Users size={20} />,       bg: 'bg-amber'    },
    { label: 'Active Listings',  value: stats?.activeProjects?.toLocaleString() || '0',  icon: <Package size={20} />,     bg: 'bg-teal'     },
    { label: 'Pending Review',   value: stats?.pendingProjects?.toLocaleString() || '0', icon: <Clock size={20} />,       bg: 'bg-yellow',  highlight: (stats?.pendingProjects ?? 0) > 0 },
    { label: 'Total Orders',     value: stats?.totalOrders?.toLocaleString() || '0',     icon: <CheckCircle2 size={20} />,bg: 'bg-cobalt'   },
    { label: 'Platform Revenue', value: formatPrice(stats?.platformRevenue || 0),         icon: <BarChart3 size={20} />,   bg: 'bg-lav-soft' },
  ]

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {KPI_CARDS.map(k => (
          <div key={k.label} className={`bg-white border-2 border-black rounded-xl p-5 ${k.highlight ? 'ring-2 ring-black ring-offset-2' : ''}`}>
            <div className={`w-10 h-10 ${k.bg} border-2 border-black rounded-xl flex items-center justify-center mb-3`} style={{boxShadow:'2px 2px 0 #000'}}>
              {k.icon}
            </div>
            <div className="text-2xl font-black leading-none mb-1">{k.value}</div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white border-2 border-black rounded-xl p-6">
        <h2 className="font-black text-base mb-4 uppercase tracking-wide text-gray-500">Quick actions</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-4 p-4 border-2 border-black rounded-xl hover:bg-[#F5F3EE] transition-colors cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-yellow border-2 border-black flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <div className="font-black text-sm">Review pending projects</div>
              <div className="text-xs text-gray-500 mt-0.5">{stats?.pendingProjects || 0} awaiting approval</div>
            </div>
          </div>
          <Link href="/discover" className="flex items-center gap-4 p-4 border-2 border-black rounded-xl hover:bg-[#F5F3EE] transition-colors">
            <div className="w-11 h-11 rounded-xl bg-teal/20 border-2 border-black flex items-center justify-center shrink-0">
              <Search size={20} />
            </div>
            <div>
              <div className="font-black text-sm">Browse marketplace</div>
              <div className="text-xs text-gray-500 mt-0.5">See what buyers see</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProjectsTab({ status }: { status: 'pending_review' | 'active' }) {
  const [projects, setProjects]   = useState<Project[]>([])
  const [loading, setLoading]     = useState(true)
  const [actioning, setActioning] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/projects?status=${status}`)
      .then(r => r.json())
      .then(j => { if (j.ok) setProjects(j.data.projects) })
      .finally(() => setLoading(false))
  }, [status])

  useEffect(() => { load() }, [load])

  const review = async (projectId: string, action: 'approve' | 'reject') => {
    setActioning(projectId)
    try {
      const res = await fetch('/api/admin/projects', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ projectId, action }),
      })
      const json = await res.json()
      if (json.ok) load()
    } finally {
      setActioning(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-black rounded-pill text-sm font-bold hover:bg-black hover:text-white transition-colors btn-gum"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-black/20 rounded-2xl bg-white">
          <div className="flex justify-center mb-4">
            {status === 'pending_review'
              ? <CheckCircle2 size={44} className="opacity-20" />
              : <Package size={44} className="opacity-20" />
            }
          </div>
          <p className="font-black text-lg">
            {status === 'pending_review' ? 'All clear — no pending projects' : 'No active listings'}
          </p>
        </div>
      ) : (
        <div className="bg-white border-2 border-black rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#F5F3EE] border-b-2 border-black">
                  <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500">Project</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500 hidden sm:table-cell">Seller</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500 hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500">Price</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500 hidden lg:table-cell">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-black uppercase tracking-wide text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/8">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-[#F5F3EE] transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/projects/${p.id}`} target="_blank" className="font-bold hover:underline line-clamp-1">
                        {p.title}
                      </Link>
                      {p.hasDemo && (
                        <span className="ml-2 text-[10px] bg-[#B7E4C7] border border-black rounded-pill px-2 py-0.5 font-bold">Demo</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">@{p.sellerName}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <Badge>{CATEGORY_LABELS[p.category] || p.category}</Badge>
                    </td>
                    <td className="px-5 py-4 font-black">{formatPrice(p.price)}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs hidden lg:table-cell">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-4">
                      {status === 'pending_review' ? (
                        <div className="flex gap-2">
                          <Button size="xs" variant="teal"    loading={actioning === p.id} onClick={() => review(p.id!, 'approve')}>Approve</Button>
                          <Button size="xs" variant="outline" loading={actioning === p.id} onClick={() => review(p.id!, 'reject')} className="text-red-600 border-red-400 hover:bg-red-50">Reject</Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Link href={`/projects/${p.id}`} target="_blank" className="inline-flex items-center gap-1 px-3 py-1.5 border-2 border-black rounded-pill text-xs font-bold hover:bg-black hover:text-white transition-colors">
                            <ExternalLink size={11} /> View
                          </Link>
                          <Button size="xs" variant="outline" loading={actioning === p.id} onClick={() => review(p.id!, 'reject')} className="text-red-600 border-red-400 hover:bg-red-50">Deactivate</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="p-16 text-center">
      <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-sm font-semibold text-gray-400">Loading…</p>
    </div>
  )
}
