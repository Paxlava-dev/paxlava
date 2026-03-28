import type { Metadata } from 'next'
import Link from 'next/link'
import { adminDb } from '@/lib/firebase/admin'
import { Users, Package, Globe, TrendingUp, Layers, Heart, Zap } from 'lucide-react'

export const metadata: Metadata = { title: 'About' }
export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [sellersSnap, projectsSnap, ordersSnap] = await Promise.all([
      adminDb.collection('users').where('role', '==', 'seller').count().get(),
      adminDb.collection('projects').where('status', '==', 'active').count().get(),
      adminDb.collection('orders').where('status', '==', 'completed').get(),
    ])
    const totalSales = ordersSnap.docs.reduce((s, d) => s + (d.data().amount || 0), 0)
    return {
      sellers:   sellersSnap.data().count  || 340,
      projects:  projectsSnap.data().count || 1240,
      sales:     totalSales || 2100000,
      countries: 50,
    }
  } catch {
    return { sellers: 340, projects: 1240, sales: 2100000, countries: 50 }
  }
}

function formatMoney(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

export default async function AboutPage() {
  const stats = await getStats()

  const STATS = [
    { n: `${stats.projects.toLocaleString()}+`, l: 'IT projects listed',  Icon: Package,    bg: 'bg-amber'    },
    { n: `${stats.sellers.toLocaleString()}+`,  l: 'Verified sellers',    Icon: Users,      bg: 'bg-teal'     },
    { n: formatMoney(stats.sales),              l: 'Earned by creators',  Icon: TrendingUp, bg: 'bg-lav-soft' },
    { n: `${stats.countries}+`,                 l: 'Countries reached',   Icon: Globe,      bg: 'bg-yellow'   },
  ]

  const TEAM = [
    { name: 'Farid G.',  role: 'Founder & CEO',   initials: 'FG', bg: 'bg-amber'    },
    { name: 'Jeyhun J.',  role: 'Founder & CEO',  initials: 'JJ', bg: 'bg-teal'     },
    { name: 'Huseyn R.', role: 'Founder & CEO',   initials: 'HR', bg: 'bg-cobalt'   },
    { name: 'Teymur M.',  role: 'Founder & CEO',  initials: 'TM', bg: 'bg-sage'     },
  ]

  const VALUES = [
    { Icon: Layers,  bg: 'bg-amber',    title: 'Ship fast',      desc: 'We build and iterate quickly. Every week brings new features based on real seller feedback.' },
    { Icon: Heart,   bg: 'bg-teal',     title: 'Creator-first',  desc: 'Every decision we make starts with: does this help sellers earn more? Creators come first.' },
    { Icon: Zap,     bg: 'bg-lav-soft', title: 'Zero friction',  desc: 'List a project in minutes. Receive payment in hours. No paperwork, no gatekeepers.' },
  ]

  return (
    <>
      {/* Hero */}
      <div className="bg-teal border-b-2 border-black px-8 py-20 text-center relative overflow-hidden">
        <div className="text-xs font-black uppercase tracking-widest text-white/60 mb-3">Our story</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 text-white">
          We&apos;re building<br />the IT bazaar<br />of the internet.
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed">
          Paxlava was born in Baku, Azerbaijan — a country with a deep tradition of craftsmanship
          and commerce. We believe developers deserve a marketplace as good as their code.
        </p>
      </div>

      {/* Live stats */}
      <div className="border-b-2 border-black">
        <div className="px-8 pt-6 pb-0">
          <div className="text-xs font-black uppercase tracking-widest text-gray-400">By the numbers</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 border-t-2 border-black">
          {STATS.map((s, i, arr) => (
            <div key={s.l} className={`px-8 py-10 flex items-start gap-4 ${i < arr.length - 1 ? 'border-r-2 border-black' : ''}`}>
              <div className={`w-10 h-10 ${s.bg} border-2 border-black rounded-xl flex items-center justify-center shrink-0 mt-1`} style={{ boxShadow: '2px 2px 0 #000' }}>
                <s.Icon size={18} />
              </div>
              <div>
                <div className="text-4xl font-black tracking-tighter leading-none mb-1">{s.n}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission split */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-black">
        <div className="px-12 py-14 border-r-2 border-black">
          <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Why Paxlava?</div>
          <h2 className="text-3xl font-black tracking-tight mb-5">Made for IT,<br />not just digital.</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Most marketplaces are built for digital content — ebooks, music, courses. But developers
            are building full products: websites, apps, APIs, and SaaS platforms. These deserve a
            dedicated marketplace.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Paxlava is that marketplace. We connect developers who have built great things with buyers
            who need them — ready to deploy, right now.
          </p>
          <p className="text-gray-600 leading-relaxed">
            The name comes from <strong>paxlava</strong> — Azerbaijan&apos;s most beloved pastry, made
            from carefully layered ingredients, just like great software.
          </p>
        </div>
        <div className="px-12 py-14 bg-white">
          <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Our mission</div>
          <h2 className="text-3xl font-black tracking-tight mb-5">Turn code into<br />income.</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            To make it possible for any developer, anywhere in the world, to earn from the software
            they build — without needing investors, a sales team, or a marketing budget.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            We believe great IT projects shouldn&apos;t sit in GitHub repos gathering dust. They should
            be discovered, bought, deployed, and used.
          </p>
          <Link href="/auth/signup">
            <button className="px-6 py-3 bg-black text-white rounded-pill font-black border-2 border-black hover:bg-gray-800 transition-colors btn-gum">
              Join Paxlava
            </button>
          </Link>
        </div>
      </div>

      {/* Values */}
      <div className="px-8 py-14 bg-white border-b-2 border-black">
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">How we work</div>
        <h2 className="text-4xl font-black tracking-tight mb-10">Our values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-black rounded-xl overflow-hidden">
          {VALUES.map((v, i) => (
            <div key={v.title} className={`p-8 ${i < VALUES.length - 1 ? 'border-r-2 border-black' : ''}`}>
              <div className={`w-12 h-12 ${v.bg} border-2 border-black rounded-xl flex items-center justify-center mb-5`} style={{ boxShadow: '3px 3px 0 #000' }}>
                <v.Icon size={22} />
              </div>
              <h3 className="font-black text-lg mb-2 tracking-tight">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="px-8 py-14 bg-white border-b-2 border-black">
        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">The team</div>
        <h2 className="text-4xl font-black tracking-tight mb-10">Built by people who ship</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-black rounded-xl overflow-hidden">
          {TEAM.map((m, i, arr) => (
            <div key={m.name} className={`p-8 text-center ${i < arr.length - 1 ? 'border-r-2 border-black' : ''}`}>
              <div
                className={`w-16 h-16 rounded-full border-2 border-black ${m.bg} flex items-center justify-center font-black text-lg mx-auto mb-4`}
                style={{ boxShadow: '3px 3px 0 #000' }}
              >
                {m.initials}
              </div>
              <div className="font-black text-sm">{m.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">{m.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amber border-t-2 border-black px-8 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Come build with us.</h2>
        <p className="text-gray-700 mb-8 text-lg">Whether you&apos;re a seller, buyer, or just curious — Paxlava is open.</p>
        <Link href="/auth/signup">
          <button className="px-10 py-4 bg-black text-white rounded-pill font-black text-lg border-2 border-black hover:bg-gray-800 transition-colors btn-gum btn-gum-lg">
            Get started
          </button>
        </Link>
      </div>
    </>
  )
}
