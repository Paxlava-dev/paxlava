import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SellerDashboardShell } from '@/components/seller/SellerDashboardShell'

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login?callbackUrl=/dashboard/seller')
  if (session.user.role !== 'seller') redirect('/dashboard/buyer')
  return <SellerDashboardShell user={session.user} />
}
