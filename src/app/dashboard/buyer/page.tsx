import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BuyerDashboardShell } from '@/components/buyer/BuyerDashboardShell'

export default async function BuyerDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login?callbackUrl=/dashboard/buyer')
  return <BuyerDashboardShell user={session.user} />
}
