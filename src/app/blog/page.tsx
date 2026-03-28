import type { Metadata } from 'next'
import Link from 'next/link'
import { adminDb } from '@/lib/firebase/admin'
import {
  Lightbulb, TrendingUp, Lock, BarChart3, Globe, Zap,
  ArrowRight, Clock,
} from 'lucide-react'

export const metadata: Metadata = { title: 'Blog' }
export const dynamic = 'force-dynamic'

// ── Icon map by tag ──────────────────────────────────────────────────────────
const TAG_META: Record<string, { Icon: React.ComponentType<{ size?: number; className?: string }>; bg: string }> = {
  'Seller guide':    { Icon: Lightbulb,   bg: 'bg-amber'    },
  'Success story':   { Icon: TrendingUp,  bg: 'bg-teal'     },
  'Platform update': { Icon: Lock,        bg: 'bg-cobalt'   },
  'Tips':            { Icon: BarChart3,   bg: 'bg-yellow'   },
  'Community':       { Icon: Globe,       bg: 'bg-sage'     },
  'Trends':          { Icon: Zap,         bg: 'bg-lav-soft' },
}

const FALLBACK_POSTS = [
  { slug: '1', tag: 'Seller guide',    title: 'How to price your IT project on Paxlava',           excerpt: 'Pricing a ready-made project is part art, part science. We break down how top sellers set prices that attract buyers without leaving money on the table.', date: 'Mar 20, 2025', readTime: '5 min read' },
  { slug: '2', tag: 'Success story',   title: "From side project to $10k: @azer_hub's story",      excerpt: "Azer started by listing a simple Next.js e-commerce template. Six months later, he's made over $10,000 from that one listing.",                    date: 'Mar 15, 2025', readTime: '7 min read' },
  { slug: '3', tag: 'Platform update', title: 'Introducing escrow payments for all sellers',        excerpt: "Starting today, all transactions on Paxlava are protected by Stripe-backed escrow. Here's what this means for buyers and sellers.",                date: 'Mar 10, 2025', readTime: '4 min read' },
  { slug: '4', tag: 'Tips',            title: '5 things every IT project listing needs',            excerpt: 'A live demo, a clear tech stack, good screenshots, a competitive price, and a fast seller response rate. We explain why each one matters.',           date: 'Mar 5, 2025',  readTime: '6 min read' },
  { slug: '5', tag: 'Community',       title: 'Why Azerbaijani developers are dominating IT sales', excerpt: 'Azerbaijan has a fast-growing tech community — and Paxlava sellers from Baku are outperforming global averages on conversion rates.',                 date: 'Feb 28, 2025', readTime: '5 min read' },
  { slug: '6', tag: 'Trends',          title: 'AI tools are the fastest growing category',          excerpt: 'Telegram bots, GPT-powered dashboards, and automation scripts are selling out. Here\'s what buyers are looking for in 2025.',                       date: 'Feb 20, 2025', readTime: '4 min read' },
]

async function getPosts() {
  try {
    const snap = await adminDb
      .collection('blogPosts')
      .where('published', '==', true)
      .limit(20)
      .get()

    if (snap.empty) return FALLBACK_POSTS

    const posts = snap.docs.map(d => {
      const data = d.data()
      return {
        slug:     d.id,
        tag:      data.tag      ?? 'Update',
        title:    data.title    ?? '',
        excerpt:  data.excerpt  ?? '',
        date:     data.date     ?? '',
        readTime: data.readTime ?? '5 min read',
      }
    })

    posts.sort((a, b) => {
      const aD = new Date(a.date).getTime()
      const bD = new Date(b.date).getTime()
      return bD - aD
    })

    return posts
  } catch {
    return FALLBACK_POSTS
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  const [featured, ...rest] = posts

  return (
    <>
      {/* Hero */}
      <div className="bg-yellow border-b-2 border-black px-8 py-20 text-center relative overflow-hidden">
        <div className="text-xs font-black uppercase tracking-widest text-gray-600 mb-3">Paxlava Blog</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4">
          Stories, tips &amp;<br />seller insights
        </h1>
        <p className="text-gray-700 text-lg max-w-lg mx-auto">
          Guides, interviews, and product updates for IT creators and buyers.
        </p>
      </div>

      {/* Featured post */}
      {featured && (() => {
        const meta = TAG_META[featured.tag] ?? TAG_META['Trends']
        const { Icon, bg } = meta
        return (
          <Link href={`/blog/${featured.slug}`} className="block border-b-2 border-black group">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className={`${bg} border-r-2 border-black flex items-center justify-center p-16`}>
                <div className="w-24 h-24 bg-white/30 border-2 border-black rounded-2xl flex items-center justify-center" style={{ boxShadow: '4px 4px 0 #000' }}>
                  <Icon size={44} />
                </div>
              </div>
              <div className="px-12 py-14 bg-white group-hover:bg-cream transition-colors flex flex-col justify-center">
                <span className="inline-block px-3 py-1 rounded-pill border-2 border-black text-xs font-black mb-4 bg-amber w-fit">
                  Featured
                </span>
                <h2 className="text-3xl font-black tracking-tight leading-tight mb-4">{featured.title}</h2>
                <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-semibold">
                    <span>{featured.date}</span>
                    <span>·</span>
                    <Clock size={11} className="inline" />
                    <span>{featured.readTime}</span>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-black group-hover:gap-2 transition-all">
                    Read <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )
      })()}

      {/* Posts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-l-2 border-black">
        {rest.map(post => {
          const meta = TAG_META[post.tag] ?? TAG_META['Trends']
          const { Icon, bg } = meta
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="border-r-2 border-b-2 border-black bg-white hover:bg-cream transition-colors group"
            >
              <div className={`w-full aspect-video ${bg} border-b-2 border-black flex items-center justify-center`}>
                <div className="w-14 h-14 bg-white/30 border-2 border-black rounded-xl flex items-center justify-center" style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.2)' }}>
                  <Icon size={26} />
                </div>
              </div>
              <div className="p-5">
                <span className="inline-block px-2.5 py-1 rounded-pill border-2 border-black text-xs font-black mb-3 bg-cream">
                  {post.tag}
                </span>
                <h2 className="font-black text-lg leading-tight mb-2 tracking-tight">{post.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <ArrowRight size={14} className="text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-teal border-t-2 border-black px-8 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">Get updates in your inbox.</h2>
        <p className="text-white/80 mb-8 text-lg">New posts, seller success stories, and platform updates — weekly.</p>
        <div className="flex items-center gap-0 max-w-md mx-auto border-2 border-black rounded-pill overflow-hidden bg-white" style={{ boxShadow: '4px 4px 0 #000' }}>
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-5 py-3 text-sm font-semibold outline-none bg-transparent"
          />
          <button className="px-6 py-3 bg-black text-white font-black text-sm shrink-0 hover:bg-gray-800 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </>
  )
}
