'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  ShoppingCart, BarChart3, Smartphone, Bot, Globe, Code,
  Gamepad2, Lock, Lightbulb, Shield, MessageCircle, Play,
  Package, TrendingUp, ArrowRight, Star, Zap,
} from 'lucide-react'
import { ProjectCard } from '@/components/marketplace/ProjectCard'
import { PaxlavaLogo } from '@/components/shared/PaxlavaLogo'
import { CATEGORY_LABELS } from '@/lib/utils'
import { useLang } from '@/contexts/LangContext'
import type { Project } from '@/types'

const CATEGORY_META: Record<string, { icon: React.ReactNode; bg: string }> = {
  'e-commerce':    { icon: <ShoppingCart size={22} />, bg: 'bg-amber' },
  'saas':          { icon: <BarChart3 size={22} />,    bg: 'bg-teal' },
  'mobile-app':    { icon: <Smartphone size={22} />,   bg: 'bg-cobalt/30' },
  'ai-automation': { icon: <Bot size={22} />,          bg: 'bg-lav-soft' },
  'landing-page':  { icon: <Globe size={22} />,        bg: 'bg-[#B7E4C7]' },
  'script-api':    { icon: <Code size={22} />,         bg: 'bg-yellow' },
  'game':          { icon: <Gamepad2 size={22} />,     bg: 'bg-coral/30' },
  'security':      { icon: <Lock size={22} />,         bg: 'bg-teal/20' },
  'other':         { icon: <Lightbulb size={22} />,    bg: 'bg-amber/40' },
}

const STAT_NUMS = ['1,200+', '340+', '$2.1M', '98%']
const HOW_ICONS = [<Package size={24} />, <MessageCircle size={24} />, <Shield size={24} />]

// Scrolling marquee tags
const MARQUEE_ROW_1 = [
  'Next.js E-Commerce', 'Telegram Bot', 'SaaS Dashboard', 'AI Chatbot', 'Mobile App',
  'Landing Page', 'REST API', 'Admin Panel', 'React Template', 'Firebase App',
  'Stripe Integration', 'Auth System', 'Blog Platform', 'Portfolio Site', 'Task Manager',
  'Next.js E-Commerce', 'Telegram Bot', 'SaaS Dashboard', 'AI Chatbot', 'Mobile App',
  'Landing Page', 'REST API', 'Admin Panel', 'React Template', 'Firebase App',
  'Stripe Integration', 'Auth System', 'Blog Platform', 'Portfolio Site', 'Task Manager',
]
const MARQUEE_ROW_2 = [
  'Flutter App', 'Python Script', 'Discord Bot', 'Web Scraper', 'CRM System',
  'Invoice Generator', 'Real-time Chat', 'Job Board', 'URL Shortener', 'Newsletter App',
  'Crypto Tracker', 'Food Delivery', 'Event Booking', 'Video Platform', 'Quiz App',
  'Flutter App', 'Python Script', 'Discord Bot', 'Web Scraper', 'CRM System',
  'Invoice Generator', 'Real-time Chat', 'Job Board', 'URL Shortener', 'Newsletter App',
  'Crypto Tracker', 'Food Delivery', 'Event Booking', 'Video Platform', 'Quiz App',
]
const MARQUEE_ROW_3 = [
  'Vue.js Dashboard', 'Laravel Backend', 'Node.js API', 'GraphQL Server', 'PWA App',
  'SEO Tool', 'Analytics Platform', 'School System', 'Healthcare App', 'E-Learning',
  'Social Network', 'Marketplace Clone', 'POS System', 'Booking System', 'DevOps Tool',
  'Vue.js Dashboard', 'Laravel Backend', 'Node.js API', 'GraphQL Server', 'PWA App',
  'SEO Tool', 'Analytics Platform', 'School System', 'Healthcare App', 'E-Learning',
  'Social Network', 'Marketplace Clone', 'POS System', 'Booking System', 'DevOps Tool',
]

interface HomeClientProps {
  featured: Project[]
}

export function HomeClient({ featured }: HomeClientProps) {
  const { data: session } = useSession()
  const { t } = useLang()

  return (
    <div className="bg-cream min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b-2 border-black overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-8 pt-16 pb-12 grid lg:grid-cols-2 gap-12 items-center min-h-[95vh]">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-black rounded-pill px-4 py-1.5 bg-amber mb-7 text-sm font-bold btn-gum">
              <PaxlavaLogo size={18} />
              {t.hero.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.92] mb-6">
              {t.hero.h1a}<br />{t.hero.h1b}<br />
              <span className="text-teal">{t.hero.h1c}</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              {t.hero.sub}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-black text-base rounded-pill border-2 border-black hover:bg-gray-900 transition-all btn-gum-lg"
              >
                {t.hero.browse} <ArrowRight size={18} />
              </Link>
              <Link
                href={session ? '/dashboard/seller' : '/auth/signup?role=seller'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber text-black font-black text-base rounded-pill border-2 border-black hover:bg-amber-light transition-all btn-gum-lg"
              >
                <TrendingUp size={18} /> {t.hero.sell}
              </Link>
            </div>
          </div>

          {/* Right — floating cards */}
          <div className="relative h-[420px] hidden lg:block">
            <div className="absolute top-0 left-10 w-64 bg-white border-2 border-black rounded-xl p-4 card-lift animate-float-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-amber border-2 border-black flex items-center justify-center text-xs font-black">AH</div>
                <div>
                  <div className="text-xs font-black">@azeridev</div>
                  <div className="text-[10px] text-gray-400">Full-Stack Developer</div>
                </div>
                <span className="ml-auto text-xs font-black text-teal">$2,400 earned</span>
              </div>
              <div className="text-sm font-bold mb-1.5">Next.js E-Commerce + Admin</div>
              <div className="flex gap-1 flex-wrap">
                {['Next.js', 'Stripe', 'Tailwind'].map(t => (
                  <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-pill border border-black bg-cream">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/10">
                <span className="font-black text-lg">$349</span>
                <span className="inline-flex items-center gap-1 bg-[#B7E4C7] border border-black rounded-pill px-2 py-0.5 text-[10px] font-bold">
                  <Play size={8} className="fill-current" /> Live Demo
                </span>
              </div>
            </div>

            <div className="absolute top-28 right-0 w-60 bg-teal text-white border-2 border-black rounded-xl p-4 card-lift animate-float-2">
              <div className="text-xs font-bold opacity-70 mb-1 flex items-center gap-1.5">
                <Zap size={11} /> New sale
              </div>
              <div className="text-base font-black mb-0.5">SaaS Dashboard Pro</div>
              <div className="text-2xl font-black mt-2">$599</div>
              <div className="text-xs opacity-70 mt-1">+ 3 more today</div>
            </div>

            <div className="absolute bottom-8 left-4 w-56 bg-white border-2 border-black rounded-xl p-4 card-lift animate-float-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <span className="text-xs font-bold">5.0</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                &ldquo;Got the full source, deployed in 2 hours. Worth every penny.&rdquo;
              </p>
              <div className="text-[10px] font-bold text-gray-400 mt-2">— @baku_coder</div>
            </div>

            <div className="absolute bottom-2 right-6 w-44 bg-amber border-2 border-black rounded-xl p-3 card-lift animate-float-4">
              <div className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp size={11} /> This week</div>
              <div className="text-2xl font-black">47 sales</div>
              <div className="text-xs text-gray-700 mt-0.5">across 12 projects</div>
            </div>
          </div>
        </div>

        {/* ── Three-panel showcase ── */}
        <div className="border-t-2 border-black grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-black">

          {/* Panel 1 — Buyers */}
          <div className="bg-amber px-8 py-14 flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 shadow-hard">
              <Package size={28} className="text-amber" />
            </div>
            <div className="text-[2.2rem] font-black leading-tight tracking-tight mb-4 whitespace-pre-line">
              {t.home.p1Title}
            </div>
            <p className="text-sm text-black/70 leading-relaxed mb-8 flex-1">{t.home.p1Desc}</p>
            <div className="flex flex-col gap-3">
              {[t.home.p1I1, t.home.p1I2, t.home.p1I3].map(item => (
                <div key={item} className="flex items-center gap-2.5 bg-white/60 border border-black/20 rounded-pill px-4 py-2">
                  <div className="w-2 h-2 rounded-full bg-black shrink-0"/>
                  <span className="text-xs font-bold">{item}</span>
                </div>
              ))}
              <Link href="/discover" className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-black text-sm rounded-pill border-2 border-black btn-gum self-start">
                {t.home.p1Cta} <ArrowRight size={14}/>
              </Link>
            </div>
          </div>

          {/* Panel 2 — Sellers */}
          <div className="bg-teal text-white px-8 py-14 flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 shadow-hard">
              <TrendingUp size={28} className="text-teal" />
            </div>
            <div className="text-[2.2rem] font-black leading-tight tracking-tight mb-4 whitespace-pre-line">
              {t.home.p2Title}
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-8 flex-1">{t.home.p2Desc}</p>
            <div className="flex flex-col gap-3">
              {([
                { label: t.home.p2F1, sub: t.home.p2F1Sub },
                { label: t.home.p2F2, sub: t.home.p2F2Sub },
                { label: t.home.p2F3, sub: t.home.p2F3Sub },
              ] as const).map(f => (
                <div key={f.label} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5">
                  <div className="w-2 h-2 rounded-full bg-white shrink-0"/>
                  <div>
                    <div className="text-xs font-black">{f.label}</div>
                    <div className="text-[10px] text-white/60">{f.sub}</div>
                  </div>
                </div>
              ))}
              <Link href="/auth/signup?role=seller" className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-black text-sm rounded-pill border-2 border-black btn-gum self-start">
                {t.home.p2Cta} <ArrowRight size={14}/>
              </Link>
            </div>
          </div>

          {/* Panel 3 — Trust */}
          <div className="bg-[#F9C74F] px-8 py-14 flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center mb-6 shadow-hard">
              <Shield size={28} className="text-[#F9C74F]" />
            </div>
            <div className="text-[2.2rem] font-black leading-tight tracking-tight mb-4 whitespace-pre-line">
              {t.home.p3Title}
            </div>
            <p className="text-sm text-black/70 leading-relaxed mb-8 flex-1">{t.home.p3Desc}</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {([
                { n: '98%',  l: t.home.p3S1 },
                { n: '$0',   l: t.home.p3S2 },
                { n: '24h',  l: t.home.p3S3 },
                { n: '100%', l: t.home.p3S4 },
              ] as const).map(s => (
                <div key={s.l} className="bg-white/60 border border-black/20 rounded-xl p-3 text-center">
                  <div className="text-xl font-black">{s.n}</div>
                  <div className="text-[10px] font-bold text-black/60 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
            <Link href="/features" className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-black text-sm rounded-pill border-2 border-black btn-gum self-start">
              {t.home.p3Cta} <ArrowRight size={14}/>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t-2 border-black grid grid-cols-2 md:grid-cols-4">
          {([
            { n: STAT_NUMS[0], l: t.stats.projects     },
            { n: STAT_NUMS[1], l: t.stats.sellers      },
            { n: STAT_NUMS[2], l: t.stats.paid         },
            { n: STAT_NUMS[3], l: t.stats.satisfaction },
          ] as const).map(s => (
            <div key={s.l} className="text-center py-5 border-r-2 border-black last:border-r-0 odd:border-b-2 md:odd:border-b-0 border-b-2 md:border-b-0">
              <div className="text-2xl font-black">{s.n}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCROLLING MARQUEE ────────────────────────────────── */}
      <section className="border-b-2 border-black bg-white py-10 overflow-hidden">
        <div className="text-center mb-6 px-8">
          <div className="section-label">{t.home.marqueeLabel}</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t.home.marqueeH2}</h2>
        </div>
        <div className="flex flex-col gap-3 overflow-hidden select-none">
          {/* Row 1 — scrolls left */}
          <div className="flex gap-3 w-max animate-marquee-left marquee-track">
            {MARQUEE_ROW_1.map((tag, i) => (
              <Link
                key={i}
                href={`/discover?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border-2 border-black bg-cream text-sm font-semibold shrink-0 hover:bg-amber hover:border-black transition-colors"
              >
                <Code size={13} className="opacity-50" /> {tag}
              </Link>
            ))}
          </div>
          {/* Row 2 — scrolls right */}
          <div className="flex gap-3 w-max animate-marquee-right marquee-track">
            {MARQUEE_ROW_2.map((tag, i) => (
              <Link
                key={i}
                href={`/discover?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border-2 border-black bg-cream text-sm font-semibold shrink-0 hover:bg-teal hover:text-white hover:border-black transition-colors"
              >
                <Globe size={13} className="opacity-50" /> {tag}
              </Link>
            ))}
          </div>
          {/* Row 3 — scrolls left slow */}
          <div className="flex gap-3 w-max animate-marquee-slow marquee-track">
            {MARQUEE_ROW_3.map((tag, i) => (
              <Link
                key={i}
                href={`/discover?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border-2 border-black bg-cream text-sm font-semibold shrink-0 hover:bg-lav-soft hover:border-black transition-colors"
              >
                <Bot size={13} className="opacity-50" /> {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="border-b-2 border-black px-8 py-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="section-label">{t.home.catLabel}</div>
          <h2 className="heading-lg mb-8">{t.home.catH2}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const meta = CATEGORY_META[key] || { icon: <Code size={22} />, bg: 'bg-cream' }
              return (
                <Link
                  key={key}
                  href={`/discover?category=${key}`}
                  className="flex flex-col items-center gap-3 p-5 bg-white border-2 border-black rounded-xl hover:shadow-hard transition-all group btn-gum"
                >
                  <div className={`w-11 h-11 rounded-xl ${meta.bg} border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {meta.icon}
                  </div>
                  <span className="text-xs font-black text-center leading-tight">{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="border-b-2 border-black">
          <div className="px-8 py-10">
            <div className="section-label">{t.home.featLabel}</div>
            <div className="flex items-end justify-between mb-6">
              <h2 className="heading-lg">{t.home.featH2}</h2>
              <Link
                href="/discover"
                className="inline-flex items-center gap-1 text-sm font-bold border-b-2 border-black hover:text-gray-500 transition-colors shrink-0 ml-4"
              >
                {t.home.featAll} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-l-2 border-black">
            {featured.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="border-b-2 border-black px-8 py-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="section-label">{t.home.howLabel}</div>
          <h2 className="heading-lg mb-12">{t.home.howH2}</h2>
          <div className="grid md:grid-cols-3 gap-0 border-2 border-black rounded-xl overflow-hidden">
            {([
              { step: '01', title: t.home.how1Title, desc: t.home.how1Desc },
              { step: '02', title: t.home.how2Title, desc: t.home.how2Desc },
              { step: '03', title: t.home.how3Title, desc: t.home.how3Desc },
            ] as const).map((item, i) => (
              <div
                key={item.step}
                className={`p-8 ${i < 2 ? 'border-b-2 md:border-b-0 md:border-r-2 border-black' : ''} bg-white hover:bg-cream transition-colors`}
              >
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-5">
                  {HOW_ICONS[i]}
                </div>
                <div className="text-5xl font-black text-black/8 mb-3 leading-none">{item.step}</div>
                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLER CTA ───────────────────────────────────────── */}
      <section className="border-b-2 border-black bg-black text-white px-8 py-20">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-label text-white/40">{t.home.sellerLabel}</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
              {t.home.sellerH2}
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              {t.home.sellerSub}
            </p>
            <Link
              href={session ? '/dashboard/seller' : '/auth/signup?role=seller'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber text-black font-black text-base rounded-pill border-2 border-amber hover:bg-amber-light transition-all btn-gum-lg"
            >
              <TrendingUp size={18} /> {t.home.sellerCta}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <TrendingUp size={20} />,   title: t.home.sF1, desc: t.home.sF1Desc, bg: 'bg-teal' },
              { icon: <Shield size={20} />,       title: t.home.sF2, desc: t.home.sF2Desc, bg: 'bg-amber' },
              { icon: <MessageCircle size={20} />,title: t.home.sF3, desc: t.home.sF3Desc, bg: 'bg-cobalt' },
              { icon: <Zap size={20} />,          title: t.home.sF4, desc: t.home.sF4Desc, bg: 'bg-coral' },
            ].map(f => (
              <div key={f.title} className="bg-white/8 border border-white/15 rounded-xl p-5">
                <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}>{f.icon}</div>
                <div className="font-black text-sm mb-1">{f.title}</div>
                <div className="text-xs text-white/50 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / PROTECTION ───────────────────────────────── */}
      <section className="border-b-2 border-black px-8 py-14">
        <div className="max-w-screen-xl mx-auto">
          <div className="section-label">{t.home.trustLabel}</div>
          <h2 className="heading-lg mb-10">{t.home.trustH2}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Shield size={24} />,        bg: 'bg-teal',   title: t.home.t1, desc: t.home.t1Desc },
              { icon: <MessageCircle size={24} />,  bg: 'bg-cobalt', title: t.home.t2, desc: t.home.t2Desc },
              { icon: <Play size={24} />,           bg: 'bg-amber',  title: t.home.t3, desc: t.home.t3Desc },
              { icon: <Star size={24} />,           bg: 'bg-yellow', title: t.home.t4, desc: t.home.t4Desc },
            ].map(f => (
              <div key={f.title} className="bg-white border-2 border-black rounded-xl p-6 hover:shadow-hard transition-all card-lift">
                <div className={`w-12 h-12 rounded-xl ${f.bg} border-2 border-black flex items-center justify-center mb-4`}>{f.icon}</div>
                <div className="font-black text-base mb-2">{f.title}</div>
                <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="px-8 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <PaxlavaLogo size={56} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-5">
            {t.home.ctaH2}
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            {t.home.ctaSub}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/discover"
              className="px-8 py-4 bg-black text-white font-black text-base rounded-pill border-2 border-black hover:bg-gray-900 transition-all btn-gum-lg"
            >
              {t.home.ctaBrowse}
            </Link>
            <Link
              href={session ? '/dashboard/seller' : '/auth/signup?role=seller'}
              className="px-8 py-4 bg-cream text-black font-black text-base rounded-pill border-2 border-black hover:bg-amber transition-all btn-gum-lg"
            >
              {t.home.ctaSell}
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="border-t-2 border-black px-8 py-10 bg-white">
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <PaxlavaLogo size={30} />
            <span className="font-black text-base">Paxlava</span>
            <span className="text-sm text-gray-400 ml-2">{t.footer.tagline}</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm font-semibold text-gray-500">
            <Link href="/discover"              className="hover:text-black transition-colors">{t.home.fDiscover}</Link>
            <Link href="/auth/signup?role=seller" className="hover:text-black transition-colors">{t.home.fSell}</Link>
            <Link href="/about"                 className="hover:text-black transition-colors">{t.home.fAbout}</Link>
            <Link href="/terms"                 className="hover:text-black transition-colors">{t.home.fTerms}</Link>
            <Link href="/privacy"               className="hover:text-black transition-colors">{t.home.fPrivacy}</Link>
          </nav>
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Paxlava. {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  )
}
