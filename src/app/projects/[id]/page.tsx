import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'
import { formatPrice, CATEGORY_LABELS, timeAgo } from '@/lib/utils'
import type { Project, Review } from '@/types'

interface Props { params: { id: string } }

async function getProject(id: string): Promise<Project | null> {
  try {
    const snap = await adminDb.collection('projects').doc(id).get()
    if (!snap.exists) return null
    // Increment view count
    snap.ref.update({ views: (snap.data()!.views ?? 0) + 1 }).catch(() => {})
    return { id: snap.id, ...snap.data() } as Project
  } catch { return null }
}

async function getReviews(projectId: string): Promise<Review[]> {
  try {
    const snap = await adminDb.collection('reviews')
      .where('projectId', '==', projectId)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Review))
  } catch { return [] }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.id)
  if (!project) return { title: 'Project not found' }
  return {
    title: project.title,
    description: project.description,
  }
}

const BG: Record<string, string> = {
  'e-commerce': 'bg-amber', saas: 'bg-teal text-white',
  'mobile-app': 'bg-yellow', 'ai-automation': 'bg-[#C8B2FF]',
  'landing-page': 'bg-coral', 'script-api': 'bg-[#B7E4C7]',
}

export default async function ProjectPage({ params }: Props) {
  const [project, session, reviews] = await Promise.all([
    getProject(params.id),
    getServerSession(authOptions),
    getReviews(params.id),
  ])

  if (!project) notFound()

  const isOwner = session?.user.id === project.sellerId
  const bg      = BG[project.category] || 'bg-cream'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] border-t-2 border-black min-h-screen">
      {/* ── Main content ── */}
      <div className="px-10 py-10 border-r-2 border-black">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-6">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/discover" className="hover:text-black transition-colors">Discover</Link>
          <span>/</span>
          <span className="text-black">{CATEGORY_LABELS[project.category] || project.category}</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-5">
          {project.title}
        </h1>

        {/* Seller row */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-black flex-wrap">
          <div className="w-11 h-11 rounded-full border-2 border-black bg-amber flex items-center justify-center font-black text-base overflow-hidden flex-shrink-0">
            {project.sellerPhotoURL
              ? <Image src={project.sellerPhotoURL} alt={project.sellerName} width={44} height={44} className="object-cover" />
              : project.sellerName.slice(0, 2).toUpperCase()
            }
          </div>
          <div>
            <div className="font-black text-sm">@{project.sellerName}</div>
            <div className="text-xs text-gray-500">
              {project.rating > 0 ? `${'★'.repeat(Math.floor(project.rating))} ${project.rating.toFixed(1)} · ` : ''}
              {project.reviewCount} reviews
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2 flex-wrap">
            {project.hasDemo && (
              <span className="px-3 py-1 bg-[#B7E4C7] border-2 border-black rounded-pill text-xs font-bold">▶ Live Demo</span>
            )}
            <span className="px-3 py-1 bg-cream border-2 border-black rounded-pill text-xs font-bold">
              {CATEGORY_LABELS[project.category]}
            </span>
          </div>
          {isOwner && (
            <Link href={`/dashboard/seller?tab=projects`} className="ml-auto px-4 py-2 border-2 border-black rounded-pill text-xs font-bold hover:bg-black hover:text-white transition-colors">
              Edit listing
            </Link>
          )}
        </div>

        {/* Demo frame */}
        {project.hasDemo && project.demoURL && (
          <div className="border-2 border-black rounded-xl overflow-hidden mb-7">
            <div className="flex items-center gap-2 bg-black px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
              </div>
              <div className="flex-1 bg-white/15 rounded-md px-3 py-1 text-xs text-white/70 truncate">
                🔒 {project.demoURL}
              </div>
              <a href={project.demoURL} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1 border border-white/30 rounded-pill text-xs text-white font-bold hover:bg-white/15 transition-colors">
                Open ↗
              </a>
            </div>
            <a
              href={project.demoURL}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center h-52 ${bg} relative overflow-hidden group`}
            >
              <span className="absolute top-2.5 left-2.5 px-3 py-1 bg-teal text-white border-2 border-black rounded-pill text-xs font-bold">▶ LIVE DEMO</span>
              {project.thumbnailURL
                ? <Image src={project.thumbnailURL} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                : <span className="text-5xl">{project.category === 'e-commerce' ? '🛒' : project.category === 'saas' ? '📊' : '💻'}</span>
              }
            </a>
          </div>
        )}

        {/* Description */}
        <p className="text-[15px] leading-relaxed text-gray-700 mb-7 whitespace-pre-line">
          {project.longDescription || project.description}
        </p>

        {/* What's included */}
        <h2 className="font-black text-lg mb-4">What&apos;s included</h2>
        <ul className="space-y-2.5 mb-8">
          {project.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-teal font-black mt-0.5 flex-shrink-0">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Tech stack */}
        <h2 className="font-black text-lg mb-3">Tech stack</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {project.techStack.map(t => (
            <span key={t} className="px-3 py-1.5 rounded-pill border-2 border-black text-sm font-bold bg-cream">
              {t}
            </span>
          ))}
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <>
            <h2 className="font-black text-lg mb-5">
              Reviews ({project.reviewCount})
            </h2>
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="border-2 border-black rounded-xl p-5 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full border-2 border-black bg-amber flex items-center justify-center text-xs font-black">
                      {r.buyerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-sm">@{r.buyerName}</div>
                      <div className="text-xs text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Sidebar ── */}
      <div className="p-6 bg-cream sticky top-[60px] self-start">
        <div className="text-5xl font-black tracking-tighter mb-1">{formatPrice(project.price)}</div>
        <p className="text-sm text-gray-500 mb-6">One-time payment · Full source code</p>

        <div className="flex flex-col gap-3 mb-6">
          {session ? (
            <Link href={`/checkout/${project.id}`}>
              <button className="w-full py-4 bg-black text-white rounded-pill font-black text-base border-2 border-black hover:bg-gray-800 transition-colors">
                Buy now — {formatPrice(project.price)}
              </button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <button className="w-full py-4 bg-black text-white rounded-pill font-black text-base border-2 border-black hover:bg-gray-800 transition-colors">
                Log in to buy
              </button>
            </Link>
          )}
          <Link href={`/messages?projectId=${project.id}&sellerId=${project.sellerId}`}>
            <button className="w-full py-3 border-2 border-black rounded-pill font-bold text-sm hover:bg-black hover:text-white transition-colors">
              💬 Message seller
            </button>
          </Link>
          {project.hasDemo && project.demoURL && (
            <a href={project.demoURL} target="_blank" rel="noopener noreferrer">
              <button className="w-full py-3 border-2 border-black rounded-pill font-bold text-sm hover:bg-black hover:text-white transition-colors">
                ▶ View live demo
              </button>
            </a>
          )}
        </div>

        {/* Meta */}
        <div className="border-t-2 border-black pt-4 space-y-2.5">
          {[
            ['Category',    CATEGORY_LABELS[project.category]],
            ['Live demo',   project.hasDemo ? '✅ Available' : '❌ None'],
            ['Delivery',    'Instant (source code)'],
            ['Support',     '30 days included'],
            ['License',     'Commercial use ✅'],
            ['Escrow',      'Protected ✅'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm border-b border-black/10 pb-2 last:border-0">
              <span className="text-gray-500 font-semibold">{k}</span>
              <span className="font-bold">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
