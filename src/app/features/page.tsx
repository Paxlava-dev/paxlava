import type { Metadata } from 'next'
import Link from 'next/link'
import { Store, Play, MessageCircle, Shield, BarChart3, Globe, Check, Bot, Code2, Terminal, Layers } from 'lucide-react'

export const metadata: Metadata = { title: 'Features' }

const FEATURES = [
  { bg: 'bg-amber',    Icon: Store,         title: 'Seller storefront',    desc: 'Build a professional profile showcasing all your projects. Custom URL, portfolio grid, and verified badge.', bullets: ['Custom seller profile URL', 'Portfolio showcase grid', 'Verified seller badge'] },
  { bg: 'bg-teal',     Icon: Play,          title: 'Live demo hosting',    desc: 'Link a live demo to your listing. Buyers try before they buy — proven to triple conversion rates.',            bullets: ['External demo URL linking', 'Demo badge on listings', 'Sandbox hosting (soon)'] },
  { bg: 'bg-cobalt',   Icon: MessageCircle, title: 'Safe messaging',       desc: 'Built-in buyer-seller chat with auto contact-info blocking. All conversations stay on-platform.',              bullets: ['Real-time messaging', 'Auto contact-info detection', 'Full message history'] },
  { bg: 'bg-yellow',   Icon: Shield,        title: 'Escrow payments',      desc: 'Funds held securely and only released when the buyer confirms delivery.',                                      bullets: ['Stripe-backed escrow', 'Multi-currency support', 'Dispute resolution'] },
  { bg: 'bg-sage',     Icon: BarChart3,     title: 'Seller analytics',     desc: 'Track views, click-through, messages, conversions, and earnings in real-time.',                               bullets: ['Revenue charts', 'Per-listing performance', 'Payout history'] },
  { bg: 'bg-lav-soft', Icon: Globe,         title: 'Global reach',         desc: 'Buyers from 50+ countries. Accept payments in multiple currencies automatically.',                             bullets: ['50+ country buyer base', 'Stripe global payments', 'AZN, USD, EUR, RUB'] },
]

const TESTIMONIALS = [
  { name: '@azer_hub', role: 'E-Commerce Developer, Baku', av: 'AH', bg: 'bg-amber',    quote: '"I listed my e-commerce template and made $2,400 in the first month. Serious buyers, great escrow."' },
  { name: '@mkdev',    role: 'SaaS Builder',               av: 'MK', bg: 'bg-teal',     quote: '"The messaging restrictions kept everything professional. No more buyers trying to take deals off-platform."' },
  { name: '@techzero', role: 'AI Developer',               av: 'TZ', bg: 'bg-lav-soft', quote: '"Sold my Telegram bot to 12 buyers in 6 weeks. The live demo link was the key — try before you buy works."' },
]

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-yellow border-b-2 border-black px-8 py-16 text-center relative">
        <div className="text-xs font-black uppercase tracking-widest text-gray-600 mb-3">Product features</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">Built for new<br />beginnings</h1>
        <p className="text-gray-700 text-lg max-w-xl mx-auto mb-10">Paxlava puts a wide selection of tools at your fingertips — from listing your IT project to getting paid globally.</p>

        {/* Mobile: stacked steps */}
        <div className="lg:hidden flex flex-wrap justify-center gap-2 text-sm font-black">
          {['Create Account', 'List Project', 'Get Discovered', 'Close the Deal', 'Get Paid'].map((step, i, arr) => (
            <span key={step} className="flex items-center gap-2">
              <span className="bg-[#FF90E8] border-2 border-black rounded-pill px-4 py-1.5">{step}</span>
              {i < arr.length - 1 && <span className="text-gray-400">→</span>}
            </span>
          ))}
        </div>

        {/* Desktop: Gumroad-style oval flow diagram */}
        <div className="hidden lg:block relative h-64 xl:h-72 mx-auto mt-4 max-w-4xl overflow-hidden rounded-full border-2 border-black bg-[#FF90E8]" style={{padding:'10px'}}>
          <div className="flex h-full flex-col justify-between rounded-full border-2 border-black bg-[#FF90E8] px-6">

            {/* Top edge steps */}
            <div className="-mt-[13px] flex justify-between px-14">
              {['Create Account', 'List Project', 'Get Discovered'].map(step => (
                <div key={step} className="flex h-[26px] items-center bg-[#FF90E8] gap-2 pr-3">
                  <svg width="18" height="13" viewBox="0 0 28 19" fill="none" className="rotate-180 shrink-0">
                    <path d="M7.47288 18.165C7.2307 13.2867 4.32451 10.3806 -0.000161092 9.99999L-0.000160928 8.13038C4.32451 7.74981 7.2307 4.87823 7.47288 -1.73273e-06L10.6904 0.691946C10.5174 2.45641 9.8947 4.01329 8.85678 5.43179C7.78426 6.81568 6.57334 7.58483 5.18944 8L27.293 8L27.293 10L5.18944 9.99999C6.57334 10.4152 7.78426 11.3147 8.85678 12.7332C9.8947 14.1517 10.5174 15.7086 10.6904 17.4384L7.47288 18.165Z" fill="currentColor"/>
                  </svg>
                  <span className="font-black text-sm xl:text-base whitespace-nowrap">{step}</span>
                </div>
              ))}
            </div>

            {/* Center: IT category icons */}
            <div className="flex justify-around items-center px-8">
              {[
                { bg: 'bg-amber',    Icon: Layers,   label: 'Templates'  },
                { bg: 'bg-teal',     Icon: Bot,      label: 'AI Tools'   },
                { bg: 'bg-cobalt',   Icon: Code2,    label: 'APIs'       },
                { bg: 'bg-sage',     Icon: Terminal, label: 'Scripts'    },
              ].map(({ bg, Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 xl:w-14 xl:h-14 ${bg} border-2 border-black rounded-xl flex items-center justify-center`} style={{boxShadow:'3px 3px 0 #000'}}>
                    <Icon size={22} />
                  </div>
                  <span className="text-xs font-black">{label}</span>
                </div>
              ))}
            </div>

            {/* Bottom edge steps (reversed flow) */}
            <div className="-mb-[13px] flex justify-between px-14">
              {['Get Paid', 'Close the Deal'].map(step => (
                <div key={step} className="flex h-[26px] items-center bg-[#FF90E8] gap-2 pl-3">
                  <span className="font-black text-sm xl:text-base whitespace-nowrap">{step}</span>
                  <svg width="18" height="13" viewBox="0 0 28 19" fill="none" className="shrink-0">
                    <path d="M7.47288 18.165C7.2307 13.2867 4.32451 10.3806 -0.000161092 9.99999L-0.000160928 8.13038C4.32451 7.74981 7.2307 4.87823 7.47288 -1.73273e-06L10.6904 0.691946C10.5174 2.45641 9.8947 4.01329 8.85678 5.43179C7.78426 6.81568 6.57334 7.58483 5.18944 8L27.293 8L27.293 10L5.18944 9.99999C6.57334 10.4152 7.78426 11.3147 8.85678 12.7332C9.8947 14.1517 10.5174 15.7086 10.6904 17.4384L7.47288 18.165Z" fill="currentColor"/>
                  </svg>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Floating mini-cards (xl+) */}
        <div className="hidden xl:block pointer-events-none absolute left-16 top-1/2 -translate-y-8 rotate-[-4deg]">
          <div className="bg-white border-2 border-black rounded-xl p-3 w-40 text-left" style={{boxShadow:'3px 4px 0 #000'}}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-teal border border-black rounded-lg flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <span className="text-xs font-black leading-tight">Telegram AI Bot</span>
            </div>
            <div className="text-xl font-black">$299</div>
            <div className="text-xs text-gray-400">by @mkdev</div>
          </div>
        </div>
        <div className="hidden xl:block pointer-events-none absolute right-16 top-1/2 translate-y-4 rotate-[3deg]">
          <div className="bg-amber border-2 border-black rounded-xl p-3 w-40 text-left" style={{boxShadow:'3px 4px 0 #000'}}>
            <div className="text-xs font-black text-gray-600 mb-1">Sale complete</div>
            <div className="text-2xl font-black">+$299</div>
            <div className="text-xs text-gray-600">Payout in 24h</div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-l-2 border-black">
        {FEATURES.map(f => (
          <div key={f.title} className="border-r-2 border-b-2 border-black p-8 bg-white hover:bg-cream transition-colors">
            <div className={`w-12 h-12 ${f.bg} border-2 border-black rounded-xl flex items-center justify-center mb-5`} style={{boxShadow:'3px 3px 0 #000'}}>
              <f.Icon size={22} />
            </div>
            <h3 className="font-black text-lg mb-3 tracking-tight">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{f.desc}</p>
            <ul className="space-y-1.5">
              {f.bullets.map(b => (
                <li key={b} className="flex items-start gap-2 text-sm">
                  <Check size={14} className="text-teal mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="px-8 py-16 bg-white border-t-2 border-black">
        <h2 className="text-4xl font-black tracking-tight text-center mb-10">Loved by IT creators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-black rounded-xl overflow-hidden">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`p-7 ${i < 2 ? 'border-r-2 border-black' : ''}`}>
              <p className="text-sm font-semibold leading-relaxed mb-5">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full border-2 border-black ${t.bg} flex items-center justify-center font-black text-xs`}>{t.av}</div>
                <div>
                  <div className="font-black text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amber border-t-2 border-black px-8 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">Ready to start?</h2>
        <p className="text-gray-700 mb-8 text-lg">List your first IT project today and reach thousands of buyers.</p>
        <Link href="/auth/signup">
          <button className="px-10 py-4 bg-black text-white rounded-pill font-black text-lg border-2 border-black hover:bg-gray-800 transition-colors btn-gum btn-gum-lg">
            Start selling for free →
          </button>
        </Link>
      </div>
    </>
  )
}
