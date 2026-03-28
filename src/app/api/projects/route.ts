import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'
import { projectSchema } from '@/lib/validations'
import { dollarsToCents } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const q        = searchParams.get('q')?.toLowerCase()
    const sort     = searchParams.get('sort') || 'newest'
    const demo     = searchParams.get('demo') === 'true'
    const limit    = Math.min(48, Number(searchParams.get('limit') || 12))

    // Fetch more than needed so we can do in-memory filtering
    let ref: any = adminDb.collection('projects').where('status', '==', 'active')
    if (category) ref = ref.where('category', '==', category)

    // No orderBy on Firestore query — avoids composite index requirement.
    // All sorting is done in-memory below.
    ref = ref.limit(200)

    const snap = await ref.get()
    let projects: any[] = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }))

    // Default: sort newest first in-memory
    projects.sort((a: any, b: any) => {
      const aMs = a.createdAt?.seconds ?? 0
      const bMs = b.createdAt?.seconds ?? 0
      return bMs - aMs
    })

    // In-memory filters
    if (demo) projects = projects.filter((p: any) => p.hasDemo)

    if (q) {
      projects = projects.filter((p: any) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.techStack?.some((t: string) => t.toLowerCase().includes(q)) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q))
      )
    }

    // In-memory sort for price/rating
    if (sort === 'price-asc')  projects.sort((a: any, b: any) => a.price - b.price)
    if (sort === 'price-desc') projects.sort((a: any, b: any) => b.price - a.price)
    if (sort === 'rating')     projects.sort((a: any, b: any) => b.rating - a.rating)

    const total = projects.length
    projects = projects.slice(0, limit)
    const hasMore = total > limit

    return NextResponse.json({ ok: true, data: { projects, hasMore } })
  } catch (err) {
    console.error('GET /api/projects', err)
    return NextResponse.json(
      { ok: false, error: { code: 'server_error', message: 'Failed to fetch projects' } },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json(
    { ok: false, error: { code: 'unauthorized', message: 'Login required' } },
    { status: 401 }
  )
  if (session.user.role !== 'seller') return NextResponse.json(
    { ok: false, error: { code: 'forbidden', message: 'Seller account required' } },
    { status: 403 }
  )

  try {
    const body   = await req.json()
    const parsed = projectSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json(
      { ok: false, error: { code: 'validation', message: parsed.error.issues[0].message } },
      { status: 400 }
    )

    const { price, demoURL, ...rest } = parsed.data
    const now = Timestamp.now()

    const newProject = {
      ...rest,
      sellerId:       session.user.id,
      sellerName:     session.user.name ?? '',
      sellerPhotoURL: session.user.image ?? null,
      price:          dollarsToCents(price),
      currency:       'USD',
      status:         'pending_review',
      screenshots:    [],
      demoURL:        demoURL || null,
      hasDemo:        !!demoURL,
      views:          0,
      purchases:      0,
      rating:         0,
      reviewCount:    0,
      tags:           rest.tags ?? [],
      createdAt:      now,
      updatedAt:      now,
    }

    const ref = await adminDb.collection('projects').add(newProject)
    return NextResponse.json(
      { ok: true, data: { id: ref.id, ...newProject } },
      { status: 201 }
    )
  } catch (err) {
    console.error('POST /api/projects', err)
    return NextResponse.json(
      { ok: false, error: { code: 'server_error', message: 'Failed to create project' } },
      { status: 500 }
    )
  }
}