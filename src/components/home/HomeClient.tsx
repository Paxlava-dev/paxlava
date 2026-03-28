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

const STATS = [
  { n: '1,200+', l: 'Projects listed'   },
  { n: '340+',   l: 'Verified sellers'  },
  { n: '$2.1M',  l: 'Paid to sellers'   },
  { n: '98%',    l: 'Buyer satisfaction'},
]

const HOW_IT_WORKS = [
  { step: '01', icon: <Package size={24} />,       title: 'Browse & discover',   desc: 'Search hundreds of ready-to-deploy IT projects — e-commerce stores, SaaS dashboards, AI tools, mobile apps, and more.' },
  { step: '02', icon: <MessageCircle size={24} />, title: 'Message the seller',  desc: 'Ask anything directly in our secure messaging system. See a live demo before you commit. No contact info leaks — ever.' },
  { step: '03', icon: <Shield size={24} />,        title: 'Buy with confidence', desc: 'Pay once, own the full source code. Escrow protection ensures delivery before funds are released to the seller.' },
]

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

  return (
    <div className="bg-cream min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b-2 border-black overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-8 pt-16 pb-12 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-black rounded-pill px-4 py-1.5 bg-amber mb-7 text-sm font-bold btn-gum">
              <PaxlavaLogo size={18} />
              Built in Azerbaijan · For the world
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.92] mb-6">
              Buy &amp; sell<br />IT projects<br />
              <span className="text-teal">instantly.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              The marketplace where developers sell ready-to-deploy websites, apps, SaaS tools, and scripts. Full source code. One-time payment. Real escrow.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-black text-base rounded-pill border-2 border-black hover:bg-gray-900 transition-all btn-gum-lg"
              >
                Browse projects <ArrowRight size={18} />
              </Link>
              <Link
                href={session ? '/dashboard/seller' : '/auth/signup?role=seller'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber text-black font-black text-base rounded-pill border-2 border-black hover:bg-amber-light transition-all btn-gum-lg"
              >
                <TrendingUp size={18} /> Start selling
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

        {/* Hero scene — animated characters */}
        <div className="border-t-2 border-black h-[260px] sm:h-[300px] overflow-hidden bg-cream">
          <svg viewBox="0 0 1400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice" className="w-full h-full">
            {/* Sky gradient */}
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FAF8F3"/>
                <stop offset="100%" stopColor="#E8F4F3"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="1400" height="200" fill="url(#skyGrad)"/>

            {/* Background building/window block — right side */}
            <rect x="900" y="60" width="500" height="140" rx="4" fill="#B3CAFF" opacity=".4"/>
            <rect x="920" y="75" width="28" height="28" rx="3" fill="#fff" opacity=".7"/>
            <rect x="960" y="75" width="28" height="28" rx="3" fill="#fff" opacity=".7"/>
            <rect x="1000" y="75" width="28" height="28" rx="3" fill="#fff" opacity=".4"/>
            <rect x="920" y="115" width="28" height="28" rx="3" fill="#fff" opacity=".7"/>
            <rect x="960" y="115" width="28" height="28" rx="3" fill="#fff" opacity=".4"/>
            <rect x="1000" y="115" width="28" height="28" rx="3" fill="#E8A838" opacity=".7"/>

            {/* Small clouds */}
            <ellipse cx="150" cy="45" rx="50" ry="18" fill="#fff" opacity=".8"/>
            <ellipse cx="180" cy="38" rx="36" ry="22" fill="#fff" opacity=".8"/>
            <ellipse cx="120" cy="48" rx="30" ry="14" fill="#fff" opacity=".8"/>
            <ellipse cx="650" cy="30" rx="45" ry="16" fill="#fff" opacity=".7"/>
            <ellipse cx="680" cy="24" rx="32" ry="19" fill="#fff" opacity=".7"/>

            {/* Teal ground */}
            <rect x="0" y="200" width="1400" height="100" fill="#23A094"/>
            {/* Ground highlight stripe */}
            <rect x="0" y="200" width="1400" height="8" fill="#2BB5A8" opacity=".5"/>
            {/* Road / sidewalk */}
            <rect x="0" y="258" width="1400" height="42" fill="#F9C74F"/>
            <line x1="0" y1="264" x2="1400" y2="264" stroke="#000" strokeWidth="1.5" opacity=".2"/>
            {/* Road dashes */}
            {[100,300,500,700,900,1100,1300].map(x => (
              <rect key={x} x={x} y="276" width="60" height="5" rx="2.5" fill="#E8A838" opacity=".5"/>
            ))}

            {/* Ground bushes / hills */}
            <ellipse cx="310" cy="205" rx="90" ry="28" fill="#1A7A71"/>
            <ellipse cx="760" cy="208" rx="120" ry="30" fill="#1A7A71"/>
            <ellipse cx="1180" cy="205" rx="100" ry="26" fill="#1A7A71"/>

            {/* Grass tufts */}
            {[180,240,520,680,850,1050,1260,1360].map((x, i) => (
              <g key={i} stroke="#000" strokeWidth="1.3" opacity=".3">
                <line x1={x}   y1="200" x2={x-4}   y2="188"/>
                <line x1={x+5} y1="200" x2={x+5}   y2="186"/>
                <line x1={x+10} y1="200" x2={x+14} y2="189"/>
              </g>
            ))}

            {/* ── Football-goal structure ── */}
            <rect x="490" y="90" width="4" height="62" fill="#000"/>
            <rect x="534" y="90" width="4" height="62" fill="#000"/>
            <rect x="490" y="90" width="48" height="5" fill="#000"/>
            <rect x="498" y="105" width="30" height="4" fill="#F9C74F"/>
            <line x1="501" y1="95" x2="501" y2="109" stroke="#000" strokeWidth="1.5"/>
            <line x1="521" y1="95" x2="521" y2="109" stroke="#000" strokeWidth="1.5"/>
            {/* Leaning flag pole */}
            <rect x="568" y="88" width="5" height="68" fill="#000"/>
            <rect x="568" y="88" width="34" height="5" fill="#000"/>
            <line x1="602" y1="88" x2="573" y2="156" stroke="#E8A838" strokeWidth="6" strokeLinecap="round"/>

            {/* ── Character 1: person with phone (left) ── */}
            <g transform="translate(105,95)">
              {/* Speech bubble */}
              <rect x="-50" y="-38" width="42" height="30" rx="7" fill="#fff" stroke="#000" strokeWidth="2"/>
              <line x1="-30" y1="-8" x2="-22" y2="2" stroke="#000" strokeWidth="2"/>
              <text x="-29" y="-18" textAnchor="middle" fontSize="17" fontWeight="900" fill="#000" fontFamily="sans-serif">$</text>
              {/* Body */}
              <rect x="-13" y="22" width="26" height="30" rx="5" fill="#E8A838" stroke="#000" strokeWidth="2"/>
              {/* Head */}
              <ellipse cx="0" cy="10" rx="14" ry="14" fill="#E76F51" stroke="#000" strokeWidth="2"/>
              {/* Legs */}
              <line x1="-6" y1="52" x2="-10" y2="72" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
              <line x1="6"  y1="52" x2="4"   y2="72" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
              <rect x="-14" y="68" width="10" height="6" rx="3" fill="#000"/>
              <rect x="-1"  y="68" width="10" height="6" rx="3" fill="#000"/>
              {/* Arm holding phone */}
              <line x1="13" y1="30" x2="30" y2="40" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
              <rect x="26" y="33" width="14" height="22" rx="3" fill="#333" stroke="#000" strokeWidth="1.5"/>
              <rect x="28" y="36" width="10" height="14" rx="1" fill="#7B9CF5"/>
            </g>

            {/* ── Character 2: tree / shrub ── */}
            <g transform="translate(300,118)">
              <rect x="-4" y="18" width="8" height="32" fill="#7B3F00" stroke="#000" strokeWidth="1.5"/>
              <ellipse cx="-15" cy="8"  rx="13" ry="16" fill="#23A094" stroke="#000" strokeWidth="1.5"/>
              <ellipse cx="13"  cy="0"  rx="11" ry="15" fill="#23A094" stroke="#000" strokeWidth="1.5"/>
              <ellipse cx="0"   cy="-4" rx="9"  rx="9" ry="17" fill="#23A094" stroke="#000" strokeWidth="1.5"/>
              <rect x="-15" y="48" width="30" height="20" rx="4" fill="#E76F51" stroke="#000" strokeWidth="2"/>
            </g>

            {/* ── Character 3: unicyclist with speech bubble ── */}
            <g transform="translate(660,50)">
              {/* Speech bubble */}
              <rect x="-50" y="-10" width="92" height="34" rx="16" fill="#fff" stroke="#000" strokeWidth="2.5"/>
              <line x1="-18" y1="24" x2="0"   y2="38" stroke="#000" strokeWidth="2.5"/>
              <text x="-2" y="14" textAnchor="middle" fontSize="13" fontWeight="900" fill="#000" fontFamily="sans-serif">NEAT!</text>
              {/* Platform */}
              <rect x="-18" y="52" width="36" height="36" rx="5" fill="#fff" stroke="#000" strokeWidth="2"/>
              {/* Body */}
              <ellipse cx="0" cy="26" rx="18" ry="19" fill="#E8A838" stroke="#000" strokeWidth="2"/>
              {/* Head */}
              <ellipse cx="0" cy="11" rx="14" ry="14" fill="#E8A838" stroke="#000" strokeWidth="2"/>
              {/* Hair */}
              <ellipse cx="0" cy="-1" rx="13" ry="9" fill="#F9C74F" stroke="#000" strokeWidth="1.5"/>
              {/* Arms */}
              <ellipse cx="-28" cy="67" rx="8" ry="7" fill="#E8A838" stroke="#000" strokeWidth="1.5"/>
              <ellipse cx="28"  cy="59" rx="7" ry="7" fill="#E8A838" stroke="#000" strokeWidth="1.5"/>
              <line x1="-18" y1="64" x2="-28" y2="67" stroke="#000" strokeWidth="2.5"/>
              <line x1="18"  y1="64" x2="28"  y2="59" stroke="#000" strokeWidth="2.5"/>
              {/* Laptop */}
              <rect x="20" y="51" width="12" height="18" rx="2" fill="#333" stroke="#000" strokeWidth="1.5"/>
              {/* Legs */}
              <rect x="-15" y="88" width="11" height="56" rx="4" fill="#000"/>
              <rect x="4"   y="88" width="11" height="56" rx="4" fill="#000"/>
              {/* Wheel */}
              <circle cx="0" cy="155" r="22" fill="none" stroke="#000" strokeWidth="3.5"/>
              <circle cx="0" cy="155" r="6"  fill="#000"/>
              <line x1="0" y1="133" x2="0"  y2="155" stroke="#000" strokeWidth="2.5"/>
              <line x1="-22" y1="155" x2="22" y2="155" stroke="#000" strokeWidth="2" opacity=".4"/>
              {/* Unicycle pedals */}
              <ellipse cx="-9" cy="148" rx="8" ry="4.5" fill="#E76F51" stroke="#000" strokeWidth="1.5"/>
              <ellipse cx="9"  cy="148" rx="8" ry="4.5" fill="#E76F51" stroke="#000" strokeWidth="1.5"/>
            </g>

            {/* ── Character 4: seller at bench with laptop ── */}
            <g transform="translate(1060,112)">
              {/* "NEW SALE!" bubble */}
              <rect x="-55" y="-55" width="130" height="36" rx="9" fill="#fff" stroke="#000" strokeWidth="2.5"/>
              <line x1="-28" y1="-19" x2="-10" y2="4" stroke="#000" strokeWidth="2.5"/>
              <text x="8" y="-28" textAnchor="middle" fontSize="11" fontWeight="900" fill="#000" fontFamily="sans-serif">NEW SALE!</text>
              {/* Dollar bubble top-right */}
              <rect x="26" y="-68" width="28" height="28" rx="7" fill="#fff" stroke="#000" strokeWidth="2"/>
              <text x="40" y="-48" textAnchor="middle" fontSize="15" fontWeight="900" fill="#000" fontFamily="sans-serif">$</text>
              {/* Bench */}
              <rect x="-60" y="65" width="130" height="10" rx="3" fill="#7B3F00" stroke="#000" strokeWidth="2"/>
              <rect x="-50" y="74" width="8" height="26" fill="#7B3F00" stroke="#000" strokeWidth="1.5"/>
              <rect x="42"  y="74" width="8" height="26" fill="#7B3F00" stroke="#000" strokeWidth="1.5"/>
              {/* Body */}
              <rect x="-20" y="18" width="40" height="34" rx="6" fill="#E8A838" stroke="#000" strokeWidth="2"/>
              {/* Head */}
              <ellipse cx="0" cy="4"   rx="16" ry="16" fill="#E8A838" stroke="#000" strokeWidth="2"/>
              <ellipse cx="0" cy="-10" rx="14" ry="10" fill="#F9C74F" stroke="#000" strokeWidth="1.5"/>
              {/* Laptop on lap */}
              <rect x="-30" y="40" width="60" height="32" rx="5" fill="#333" stroke="#000" strokeWidth="2"/>
              <rect x="-26" y="44" width="52" height="24" rx="2" fill="#7B9CF5"/>
              <rect x="-36" y="71" width="72" height="5" rx="2.5" fill="#555" stroke="#000" strokeWidth="1.5"/>
              {/* Legs */}
              <line x1="-9" y1="52" x2="-14" y2="72" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
              <line x1="9"  y1="52" x2="20"  y2="72" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
            </g>

            {/* ── Character 5: person walking (far right) ── */}
            <g transform="translate(1300,105)">
              {/* Dollar bubble */}
              <rect x="-18" y="-28" width="36" height="32" rx="8" fill="#fff" stroke="#000" strokeWidth="2.5"/>
              <text x="0" y="-5" textAnchor="middle" fontSize="20" fontWeight="900" fill="#000" fontFamily="sans-serif">$</text>
              <line x1="-4" y1="4" x2="-8" y2="14" stroke="#000" strokeWidth="2"/>
              {/* Body */}
              <rect x="-12" y="26" width="24" height="30" rx="5" fill="#23A094" stroke="#000" strokeWidth="2"/>
              {/* Head */}
              <ellipse cx="0" cy="14" rx="13" ry="13" fill="#E76F51" stroke="#000" strokeWidth="2"/>
              {/* Arms */}
              <line x1="-12" y1="33" x2="-24" y2="46" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
              <line x1="12"  y1="33" x2="22"  y2="44" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
              {/* Legs walking */}
              <line x1="-5" y1="56" x2="-12" y2="74" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
              <line x1="5"  y1="56" x2="10"  y2="74" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
              <rect x="-16" y="70" width="10" height="6" rx="3" fill="#000"/>
              <rect x="5"   y="70" width="10" height="6" rx="3" fill="#000"/>
            </g>
          </svg>
        </div>

        {/* Stats bar */}
        <div className="border-t-2 border-black grid grid-cols-2 md:grid-cols-4">
          {STATS.map(s => (
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
          <div className="section-label">Unlimited possibilities</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Discover the best IT projects</h2>
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
          <div className="section-label">Browse by type</div>
          <h2 className="heading-lg mb-8">Every kind of IT project.</h2>
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
            <div className="section-label">Handpicked</div>
            <div className="flex items-end justify-between mb-6">
              <h2 className="heading-lg">Featured projects</h2>
              <Link
                href="/discover"
                className="inline-flex items-center gap-1 text-sm font-bold border-b-2 border-black hover:text-gray-500 transition-colors shrink-0 ml-4"
              >
                See all <ArrowRight size={14} />
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
          <div className="section-label">Simple process</div>
          <h2 className="heading-lg mb-12">How Paxlava works</h2>
          <div className="grid md:grid-cols-3 gap-0 border-2 border-black rounded-xl overflow-hidden">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                className={`p-8 ${i < HOW_IT_WORKS.length - 1 ? 'border-b-2 md:border-b-0 md:border-r-2 border-black' : ''} bg-white hover:bg-cream transition-colors`}
              >
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-5">
                  {item.icon}
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
            <div className="section-label text-white/40">For developers</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6">
              Turn your side project<br />into passive income.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              List your ready-to-deploy project, set your price, and connect with buyers worldwide. 10% platform fee. Instant payouts. No subscriptions.
            </p>
            <Link
              href={session ? '/dashboard/seller' : '/auth/signup?role=seller'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber text-black font-black text-base rounded-pill border-2 border-amber hover:bg-amber-light transition-all btn-gum-lg"
            >
              <TrendingUp size={18} /> Start selling today
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <TrendingUp size={20} />, title: '90% of revenue',    desc: 'Keep 90% of every sale. We take just 10%.',                  bg: 'bg-teal' },
              { icon: <Shield size={20} />,     title: 'Secure escrow',     desc: 'Funds held until buyer confirms delivery.',                   bg: 'bg-amber' },
              { icon: <MessageCircle size={20}/>, title: 'Direct messaging', desc: 'Communicate with buyers before every sale.',                  bg: 'bg-cobalt' },
              { icon: <Zap size={20} />,        title: 'Go live in minutes', desc: 'List your project and start selling today.',                  bg: 'bg-coral' },
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
          <div className="section-label">Why buyers trust us</div>
          <h2 className="heading-lg mb-10">Built-in protections.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Shield size={24} />,       bg: 'bg-teal',    title: 'Escrow payments',     desc: 'Money is held securely until you receive and verify the source code.' },
              { icon: <MessageCircle size={24} />, bg: 'bg-cobalt',  title: 'Blocked contact info', desc: 'No phone numbers or social handles in chat — all communication stays on-platform.' },
              { icon: <Play size={24} />,          bg: 'bg-amber',   title: 'Live demos',           desc: 'Try before you buy. Many listings include a live, working demo URL.' },
              { icon: <Star size={24} />,          bg: 'bg-yellow',  title: 'Verified sellers',     desc: 'Sellers are reviewed by our team before their listings go live.' },
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
            Ready to start?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Join hundreds of developers already buying and selling on Paxlava.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/discover"
              className="px-8 py-4 bg-black text-white font-black text-base rounded-pill border-2 border-black hover:bg-gray-900 transition-all btn-gum-lg"
            >
              Browse marketplace
            </Link>
            <Link
              href={session ? '/dashboard/seller' : '/auth/signup?role=seller'}
              className="px-8 py-4 bg-cream text-black font-black text-base rounded-pill border-2 border-black hover:bg-amber transition-all btn-gum-lg"
            >
              Sell a project
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
            <span className="text-sm text-gray-400 ml-2">Made in Azerbaijan</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm font-semibold text-gray-500">
            <Link href="/discover" className="hover:text-black transition-colors">Discover</Link>
            <Link href="/auth/signup?role=seller" className="hover:text-black transition-colors">Sell</Link>
            <Link href="/about"   className="hover:text-black transition-colors">About</Link>
            <Link href="/terms"   className="hover:text-black transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
          </nav>
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Paxlava. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
