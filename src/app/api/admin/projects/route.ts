/**
 * Admin-only routes for project management.
 * GET  /api/admin/projects           — list all projects (any status)
 * POST /api/admin/projects/:action   — approve or reject a project
 */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'

type Session = Awaited<ReturnType<typeof getServerSession>>

function requireAdmin(session: Session): NextResponse | null {
  if (!session) return NextResponse.json({ ok: false, error: { code: 'unauthorized', message: 'Login required' } }, { status: 401 })
  if ((session as any).user?.role !== 'admin') return NextResponse.json({ ok: false, error: { code: 'forbidden', message: 'Admin access required' } }, { status: 403 })
  return null
}

// GET /api/admin/projects?status=pending_review
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const err = requireAdmin(session)
  if (err) return err

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'pending_review'
  const limit  = Math.min(Number(searchParams.get('limit') || '50'), 100)

  try {
    const snap = await adminDb
      .collection('projects')
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get()

    const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    return NextResponse.json({ ok: true, data: { projects } })
  } catch (err) {
    console.error('GET /api/admin/projects', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to fetch projects' } }, { status: 500 })
  }
}

// POST /api/admin/projects  body: { projectId, action: 'approve' | 'reject', reason? }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const err = requireAdmin(session)
  if (err) return err

  try {
    const { projectId, action, reason } = await req.json()
    if (!projectId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ ok: false, error: { code: 'validation', message: 'projectId and action (approve|reject) required' } }, { status: 400 })
    }

    const snap = await adminDb.collection('projects').doc(projectId).get()
    if (!snap.exists) return NextResponse.json({ ok: false, error: { code: 'not_found', message: 'Project not found' } }, { status: 404 })

    const newStatus = action === 'approve' ? 'active' : 'rejected'
    await snap.ref.update({
      status:    newStatus,
      updatedAt: Timestamp.now(),
      ...(reason ? { rejectionReason: reason } : {}),
    })

    return NextResponse.json({ ok: true, data: { projectId, status: newStatus } })
  } catch (err) {
    console.error('POST /api/admin/projects', err)
    return NextResponse.json({ ok: false, error: { code: 'server_error', message: 'Failed to update project' } }, { status: 500 })
  }
}
