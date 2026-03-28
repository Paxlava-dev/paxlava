import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MessagesShell } from '@/components/shared/MessagesShell'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login?callbackUrl=/messages')
  return <MessagesShell userId={session.user.id} userName={session.user.name ?? ''} />
}
