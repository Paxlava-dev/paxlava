import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'
import { projectSchema } from '@/lib/validations'
import { dollarsToCents } from '@/lib/utils'

// ── GET /api/projects/:id ──────────────────────────────────────
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const snap = await adminDb.collection('projects').doc(params.id).get()
    if (!snap.exists) return NextResponse.json({ ok: false, error: { code: 'not_found', message: 'Project not found' } }, { status: 404 })

    // Increment view count (fire-and-forget)
    snap.ref.update({ views: (snap.data()!.views ?? 0) + 1 }).catch(() => {})

    return NextResponse.json({ ok: true, data: { id: snap.id, ...snap.data() } })
  } catch (err) {
    console.error('GET /api/projects/[id]', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to fetch project' } }, { status: 500 })
  }
}

// ── PATCH /api/projects/:id ────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })

  try {
    const snap = await adminDb.collection('projects').doc(params.id).get()
    if (!snap.exists) return NextResponse.json({ ok: false, error: { code: 'not_found', message: 'Project not found' } }, { status: 404 })

    const data = snap.data()!
    if (data.sellerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ ok: false, error: { code: 'forbidden', message: 'Not your project' } }, { status: 403 })
    }

    const body = await req.json()
    const parsed = projectSchema.partial().safeParse(body)
    if (!parsed.success) return NextResponse.json({ ok: false, error: { code: 'validation', message: parsed.error.issues[0].message } }, { status: 400 })

    const { price, demoURL, ...rest } = parsed.data
    const updates: Record<string, unknown> = {
      ...rest,
      updatedAt: Timestamp.now(),
    }
    if (price !== undefined) {
      updates.price   = dollarsToCents(price)
      updates.hasDemo = !!demoURL
    }
    if (demoURL !== undefined) {
      updates.demoURL = demoURL || null
      updates.hasDemo = !!demoURL
    }

    await snap.ref.update(updates)
    return NextResponse.json({ ok: true, data: { id: params.id, ...data, ...updates } })
  } catch (err) {
    console.error('PATCH /api/projects/[id]', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to update project' } }, { status: 500 })
  }
}

// ── DELETE /api/projects/:id ───────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })

  try {
    const snap = await adminDb.collection('projects').doc(params.id).get()
    if (!snap.exists) return NextResponse.json({ ok: false, error: { code: 'not_found', message: 'Project not found' } }, { status: 404 })

    const data = snap.data()!
    if (data.sellerId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ ok: false, error: { code: 'forbidden', message: 'Not your project' } }, { status: 403 })
    }

    // Soft delete: set status to 'paused' rather than hard delete
    await snap.ref.update({ status: 'paused', updatedAt: Timestamp.now() })
    return NextResponse.json({ ok: true, data: { deleted: true } })
  } catch (err) {
    console.error('DELETE /api/projects/[id]', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to delete project' } }, { status: 500 })
  }
}
