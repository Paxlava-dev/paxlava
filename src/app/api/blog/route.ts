import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const snap = await adminDb
      .collection('blogPosts')
      .where('published', '==', true)
      .limit(20)
      .get()

    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]

    posts.sort((a, b) => {
      const aMs = a.createdAt?.seconds ?? 0
      const bMs = b.createdAt?.seconds ?? 0
      return bMs - aMs
    })

    return NextResponse.json({ ok: true, data: posts })
  } catch (err) {
    console.error('GET /api/blog', err)
    return NextResponse.json(
      { ok: false, error: { code: 'server_error', message: 'Failed to fetch posts' } },
      { status: 500 },
    )
  }
}
