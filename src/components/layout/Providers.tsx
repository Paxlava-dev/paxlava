'use client'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { LangProvider } from '@/contexts/LangContext'

interface ProvidersProps {
  children: React.ReactNode
  session:  Session | null
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <LangProvider>
        {children}
      </LangProvider>
    </SessionProvider>
  )
}
