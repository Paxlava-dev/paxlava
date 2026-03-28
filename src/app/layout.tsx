import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Providers } from '@/components/layout/Providers'
import { Navbar } from '@/components/layout/Navbar'
import '@/styles/globals.css'

const monaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-mona',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Paxlava',
    default:  'Paxlava — Buy & Sell IT Projects',
  },
  description: 'The marketplace for buying and selling fully built websites, apps, SaaS tools, and scripts. From Azerbaijan — for the world.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon:  '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    siteName: 'Paxlava',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en" className={monaSans.variable}>
      <body className="bg-cream font-sans text-black antialiased">
        <Providers session={session}>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
