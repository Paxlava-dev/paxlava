import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminDashboardShell } from '@/components/admin/AdminDashboardShell'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login?callbackUrl=/dashboard/admin')
  if (session.user.role !== 'admin') redirect('/')
  return <AdminDashboardShell user={session.user} />
}
