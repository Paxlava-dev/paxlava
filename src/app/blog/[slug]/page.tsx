import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { adminDb } from '@/lib/firebase/admin'
import {
  Lightbulb, TrendingUp, Lock, BarChart3, Globe, Zap,
  ArrowLeft, Clock, Calendar,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const TAG_META: Record<string, { Icon: React.ComponentType<{ size?: number; className?: string }>; bg: string }> = {
  'Seller guide':    { Icon: Lightbulb,  bg: 'bg-amber'    },
  'Success story':   { Icon: TrendingUp, bg: 'bg-teal'     },
  'Platform update': { Icon: Lock,       bg: 'bg-cobalt'   },
  'Tips':            { Icon: BarChart3,  bg: 'bg-yellow'   },
  'Community':       { Icon: Globe,      bg: 'bg-sage'     },
  'Trends':          { Icon: Zap,        bg: 'bg-lav-soft' },
}

const FALLBACK_POSTS: Record<string, { tag: string; title: string; excerpt: string; content: string; date: string; readTime: string }> = {
  '1': { tag: 'Seller guide',    title: 'How to price your IT project on Paxlava',           excerpt: 'Pricing a ready-made project is part art, part science. We break down how top sellers set prices that attract buyers without leaving money on the table.', content: `## Setting the right price\n\nPricing a ready-made project is part art, part science. Here are the key factors top sellers use.\n\n### 1. Research comparable projects\n\nBrowse similar projects on Paxlava. If your e-commerce template has more features and better design, price above the average.\n\n### 2. Calculate your time\n\nEstimate how long a buyer would take to build this from scratch. If it's 40 hours at $50/hr, your project is worth at least $500.\n\n### 3. Consider the target buyer\n\nIs your buyer a startup founder, an agency, or a freelancer? Startups can pay more; freelancers are price-sensitive.\n\n### 4. Test with a lower price first\n\nList at a mid-range price and increase as you collect reviews and build social proof.\n\n### 5. Bundle extras\n\nOffer setup help or 30 days of support as an add-on. Buyers pay a premium for peace of mind.`, date: 'Mar 20, 2025', readTime: '5 min read' },
  '2': { tag: 'Success story',   title: "@azer_hub's story: from side project to $10k",      excerpt: "Azer started by listing a simple Next.js e-commerce template. Six months later, he's made over $10,000 from that one listing.",                    content: `## How it started\n\nAzer Mammadov is a frontend developer from Baku. In early 2024, he had a side project — a clean Next.js e-commerce template he'd built for a client who never paid.\n\n"I figured I'd list it and see what happens," he told us.\n\n## The first sale\n\nThree days after listing, Azer got his first sale for $89. "I was shocked. I thought maybe I'd get one sale a month."\n\n## Scaling up\n\nHe updated the template with more features, raised the price to $149, and started responding to messages within the hour. Buyers left great reviews.\n\nBy month three, he was averaging $1,700/month from a single listing.\n\n## The lesson\n\n"The live demo was everything. Buyers could try the actual product before buying. That removed all doubt."`, date: 'Mar 15, 2025', readTime: '7 min read' },
  '3': { tag: 'Platform update', title: 'Introducing escrow payments for all sellers',        excerpt: "Starting today, all transactions on Paxlava are protected by Stripe-backed escrow.", content: `## What is escrow?\n\nEscrow holds payment funds in a secure account until both the buyer and seller confirm the transaction is complete.\n\n## How it works on Paxlava\n\n1. Buyer pays — funds go into escrow\n2. Seller delivers the project\n3. Buyer confirms delivery (or auto-confirms after 72h)\n4. Funds release to seller's account\n\n## Why we built this\n\nBefore escrow, we saw disputes where sellers claimed payment never arrived or buyers said they never received the files. Escrow eliminates both problems.\n\n## Dispute resolution\n\nIf a buyer opens a dispute, our team reviews the message history and delivery evidence. Funds stay in escrow until resolved.\n\nThis is a major step forward for trust on Paxlava.`, date: 'Mar 10, 2025', readTime: '4 min read' },
  '4': { tag: 'Tips',            title: '5 things every IT project listing needs',            excerpt: 'A live demo, a clear tech stack, good screenshots, a competitive price, and a fast seller response rate.', content: `## The 5 essentials\n\nAnalysis of the top 50 listings on Paxlava reveals 5 things they all have in common.\n\n### 1. A live demo link\n\nListings with a live demo convert 3x better. Buyers want to see the product working before they buy.\n\n### 2. A clear tech stack\n\nList every technology used. Buyers need to know if they can maintain and deploy your project themselves.\n\n### 3. At least 5 screenshots\n\nShow the UI, the admin panel, mobile views, and any interesting features. More visuals = more trust.\n\n### 4. A competitive price\n\nSearch for similar projects. Price within 20% of comparable listings unless your project is significantly better.\n\n### 5. Fast response rate\n\nBuyers message before buying. Sellers who respond within 2 hours close 40% more deals.`, date: 'Mar 5, 2025', readTime: '6 min read' },
  '5': { tag: 'Community',       title: 'Why Azerbaijani developers are leading IT sales',    excerpt: "Azerbaijan's fast-growing tech community is outperforming global averages on Paxlava.", content: `## A surprising pattern\n\nWhen we looked at our top-performing sellers, a clear pattern emerged: Azerbaijani developers punch far above their weight.\n\nWith less than 10M people, Azerbaijan accounts for over 30% of our top 100 sellers.\n\n## Why?\n\n### Strong technical education\n\nADA University, UFAZ, and the Azerbaijani government's STEP program have produced a generation of skilled developers.\n\n### Price competitiveness\n\nLocal cost of living means Azerbaijani sellers can price competitively while still earning well.\n\n### Community support\n\nThe Baku tech community is tight-knit. Sellers share knowledge, refer buyers, and help each other improve listings.\n\n## The future\n\nWe're doubling down on the Azerbaijani market with AZN payouts, local meetups, and a dedicated seller community.`, date: 'Feb 28, 2025', readTime: '5 min read' },
  '6': { tag: 'Trends',          title: 'AI tools are the fastest growing category on Paxlava', excerpt: "Telegram bots, GPT-powered dashboards, and automation scripts are selling out.", content: `## The AI wave\n\nIn Q1 2025, AI tools became the fastest growing category on Paxlava — up 340% year-over-year.\n\n## What's selling\n\n### Telegram bots with AI\n\nBots that use GPT-4 for customer service, content generation, or business automation are the top sellers. Average price: $299.\n\n### AI dashboards\n\nReady-made analytics dashboards with AI-powered insights. Buyers are paying $500–$2000 for these.\n\n### Automation scripts\n\nPython scripts that automate repetitive tasks using AI APIs. Popular in e-commerce and marketing.\n\n## What buyers want\n\nBuyers prioritize:\n1. Easy setup (Docker or one-click deploy)\n2. Clear API documentation\n3. A working demo with their own prompts\n4. Source code included\n\n## What to build next\n\nVoice AI agents, RAG systems for internal docs, and multi-modal bots are gaining traction fast.`, date: 'Feb 20, 2025', readTime: '4 min read' },
}

async function getPost(slug: string) {
  try {
    const doc = await adminDb.collection('blogPosts').doc(slug).get()
    if (doc.exists) {
      const data = doc.data()!
      return {
        slug:     doc.id,
        tag:      data.tag      ?? 'Update',
        title:    data.title    ?? '',
        excerpt:  data.excerpt  ?? '',
        content:  data.content  ?? '',
        date:     data.date     ?? '',
        readTime: data.readTime ?? '5 min read',
      }
    }
  } catch { /* fall through */ }

  return FALLBACK_POSTS[slug] ? { slug, ...FALLBACK_POSTS[slug] } : null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  return { title: post?.title ?? 'Blog Post' }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const meta = TAG_META[post.tag] ?? TAG_META['Trends']
  const { Icon, bg } = meta

  // Simple markdown-like rendering — split on ## headings and ### subheadings
  const renderContent = (md: string) => {
    return md.split('\n').map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-black tracking-tight mt-8 mb-3">{line.slice(4)}</h3>
      if (line.startsWith('## '))  return <h2 key={i} className="text-2xl font-black tracking-tight mt-10 mb-4 pt-6 border-t-2 border-black">{line.slice(3)}</h2>
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
        return <li key={i} className="ml-4 mb-1.5 text-gray-700 leading-relaxed">{line.slice(3)}</li>
      }
      if (line === '') return <div key={i} className="h-2" />
      return <p key={i} className="text-gray-700 leading-relaxed mb-0">{line}</p>
    })
  }

  return (
    <>
      {/* Back nav */}
      <div className="px-8 py-4 border-b-2 border-black bg-white">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all">
          <ArrowLeft size={14} /> Back to blog
        </Link>
      </div>

      {/* Header */}
      <div className={`${bg} border-b-2 border-black px-8 py-16`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/30 border-2 border-black rounded-xl flex items-center justify-center" style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.25)' }}>
              <Icon size={22} />
            </div>
            <span className="px-3 py-1 rounded-pill border-2 border-black text-xs font-black bg-white/50">
              {post.tag}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm font-semibold text-black/70">
            <span className="flex items-center gap-1.5"><Calendar size={13} /> {post.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border-b-2 border-black">
        <div className="max-w-3xl mx-auto px-8 py-14">
          <p className="text-xl text-gray-600 leading-relaxed mb-10 font-semibold border-l-4 border-black pl-5">
            {post.excerpt}
          </p>
          <div className="prose-custom space-y-1">
            {renderContent(post.content)}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-amber border-t-2 border-black px-8 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">Ready to start selling?</h2>
        <p className="text-gray-700 mb-6">List your first IT project for free today.</p>
        <Link href="/auth/signup">
          <button className="px-8 py-3.5 bg-black text-white rounded-pill font-black border-2 border-black hover:bg-gray-800 transition-colors btn-gum">
            Create free account
          </button>
        </Link>
      </div>
    </>
  )
}
