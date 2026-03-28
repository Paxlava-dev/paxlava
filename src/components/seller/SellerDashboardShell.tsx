'use client'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { BarChart3, Package, Plus, MessageCircle, Home, LogOut, TrendingUp } from 'lucide-react'
import { SellerDashboard } from './SellerDashboard'
import { ListProjectForm } from './ListProjectForm'
import { useProjects } from '@/hooks/useProjects'
import { ProjectGrid } from '@/components/marketplace/ProjectGrid'
import { PaxlavaLogo } from '@/components/shared/PaxlavaLogo'
import { useLang } from '@/contexts/LangContext'

type Tab = 'overview' | 'projects' | 'new'

interface ShellProps {
  user: { id: string; name?: string | null; email?: string | null; image?: string | null; role: string }
}

const TABS: { id: Tab; label: string; mobileLabel: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview',    mobileLabel: 'Overview', icon: <BarChart3 size={16} /> },
  { id: 'projects', label: 'My Projects', mobileLabel: 'Projects', icon: <Package size={16} /> },
  { id: 'new',      label: 'New Listing', mobileLabel: 'New',      icon: <Plus size={16} /> },
]

export function SellerDashboardShell({ user }: ShellProps) {
  const [tab, setTab] = useState<Tab>('overview')
  const { t } = useLang()

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#F5F3EE]">

      {/* Mobile tab bar */}
      <div className="md:hidden flex border-b-2 border-black bg-white overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-black whitespace-nowrap border-b-2 transition-colors flex-1 justify-center ${
              tab === t.id ? 'border-black bg-black text-white' : 'border-transparent hover:bg-cream'
            }`}
          >
            {t.icon} {t.mobileLabel}
          </button>
        ))}
        <Link href="/messages" className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-black whitespace-nowrap border-b-2 border-transparent hover:bg-cream flex-1 justify-center">
          <MessageCircle size={16} /> Chat
        </Link>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 border-r-2 border-black bg-white flex-col shrink-0 min-h-[calc(100vh-60px)]">

          {/* Logo + brand */}
          <div className="px-6 py-5 border-b-2 border-black flex items-center gap-2.5">
            <PaxlavaLogo size={28} />
            <span className="font-black text-base tracking-tight">Paxlava</span>
          </div>

          {/* User profile */}
          <div className="px-6 py-5 border-b-2 border-black">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-black bg-amber flex items-center justify-center font-black text-base overflow-hidden shrink-0" style={{boxShadow:'2px 2px 0 #000'}}>
                {user.image
                  ? <img src={user.image} alt="" className="w-full h-full object-cover" />
                  : user.name?.slice(0, 2).toUpperCase()
                }
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm truncate">{user.name}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal" />
                  <span className="text-xs text-gray-500 font-semibold">Seller · Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                  tab === t.id
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-700 hover:bg-[#F5F3EE]'
                }`}
              >
                <span className={tab === t.id ? 'text-white' : 'text-gray-400'}>{t.icon}</span>
                {t.label}
              </button>
            ))}
            <Link href="/messages" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-[#F5F3EE] transition-all">
              <span className="text-gray-400"><MessageCircle size={16} /></span>
              Messages
            </Link>
          </nav>

          {/* Bottom links */}
          <div className="px-3 py-4 border-t-2 border-black space-y-0.5">
            <Link href="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-[#F5F3EE] transition-all">
              <span className="text-gray-400"><Home size={16} /></span>
              Marketplace
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut size={16} /> {t.dashboard.logout}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-5 sm:p-8">
          {/* Page header */}
          <div className="mb-6 pb-5 border-b-2 border-black/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
              <TrendingUp size={12} /> Seller Dashboard
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {tab === 'overview' ? 'Overview' : tab === 'projects' ? 'My Projects' : 'New Listing'}
            </h1>
          </div>

          {tab === 'overview' && <SellerDashboard />}
          {tab === 'projects' && <SellerProjectsList userId={user.id} onNewListing={() => setTab('new')} />}
          {tab === 'new' && <ListProjectForm />}
        </main>
      </div>
    </div>
  )
}

function SellerProjectsList({ userId, onNewListing }: { userId: string; onNewListing: () => void }) {
  const { projects, loading, error } = useProjects({ limit: 24 })
  const mine = projects.filter(p => p.sellerId === userId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{mine.length} project{mine.length !== 1 ? 's' : ''} listed</p>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-pill font-bold text-sm border-2 border-black hover:bg-gray-800 transition-colors btn-gum"
          onClick={onNewListing}
        >
          <Plus size={14} /> New listing
        </button>
      </div>
      <ProjectGrid projects={mine} loading={loading} error={error} emptyText="You haven't listed any projects yet" />
    </div>
  )
}
