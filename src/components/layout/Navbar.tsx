'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { MessageCircle, LayoutDashboard, Menu, X, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PaxlavaLogo } from '@/components/shared/PaxlavaLogo'
import { useLang } from '@/contexts/LangContext'
import type { Lang } from '@/lib/i18n'

const LANGS: Lang[] = ['EN', 'AZ', 'RU']

export function Navbar() {
  const { data: session, status } = useSession()
  const { lang, setLang, t }      = useLang()
  const [menuOpen, setMenuOpen]   = useState(false)

  const dashboardHref =
    session?.user.role === 'admin'  ? '/dashboard/admin'  :
    session?.user.role === 'seller' ? '/dashboard/seller' :
    '/dashboard/buyer'

  const NAV_LINKS = [
    { href: '/discover', label: t.nav.discover  },
    { href: '/blog',     label: t.nav.blog      },
    { href: '/pricing',  label: t.nav.pricing   },
    { href: '/features', label: t.nav.features  },
    { href: '/about',    label: t.nav.about     },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b-2 border-black">
      <div className="flex items-center px-4 sm:px-6 lg:px-8 h-[60px] gap-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <PaxlavaLogo size={32} />
          <span className="text-[18px] font-black tracking-tight hidden sm:block">Paxlava</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5 flex-1 ml-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-pill text-sm font-semibold hover:bg-black/8 transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {/* Language switcher */}
          <div className="flex items-center border-2 border-black rounded-pill p-0.5 bg-white">
            {LANGS.map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-pill text-[11px] font-bold tracking-wider transition-colors ${
                  lang === l ? 'bg-black text-white' : 'hover:bg-black/8'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {status === 'loading' ? (
            <div className="w-20 h-8 bg-gray-200 rounded-pill animate-pulse" />
          ) : session ? (
            <>
              <Link href="/messages" className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-sm font-semibold hover:bg-black/8 transition-colors">
                <MessageCircle size={14} /> {t.nav.messages}
              </Link>
              <Link href={dashboardHref}>
                <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black rounded-pill hover:bg-black hover:text-white transition-all text-sm font-bold btn-gum">
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="w-5 h-5 rounded-full" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-amber flex items-center justify-center text-[10px] font-black">
                      {session.user.name?.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <LayoutDashboard size={13} />
                  {t.nav.dashboard}
                </div>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut size={13} /> {t.nav.logout}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">{t.nav.login}</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="black" size="sm">{t.nav.signup}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile right: compact session indicator + hamburger */}
        <div className="flex items-center gap-2 ml-auto md:hidden">
          {session && (
            <Link href={dashboardHref} className="flex items-center gap-1.5 px-2.5 py-1.5 border-2 border-black rounded-pill text-xs font-bold hover:bg-black hover:text-white transition-all">
              {session.user.image ? (
                <img src={session.user.image} alt="" className="w-4 h-4 rounded-full" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-amber flex items-center justify-center text-[9px] font-black">
                  {session.user.name?.slice(0, 2).toUpperCase()}
                </span>
              )}
              <LayoutDashboard size={12} />
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-black/8 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden absolute top-[60px] left-0 right-0 bg-cream border-b-2 border-black shadow-lg z-50">
          {/* Nav links */}
          <div className="px-4 pt-4 pb-2 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl font-semibold hover:bg-black/8 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t-2 border-black/10 mx-4 my-2" />

          {/* Language switcher */}
          <div className="px-4 pb-3">
            <div className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Language</div>
            <div className="flex gap-2">
              {LANGS.map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-colors ${
                    lang === l ? 'bg-black text-white border-black' : 'border-black/20 hover:border-black'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-black/10 mx-4 my-2" />

          {/* Auth area */}
          <div className="px-4 pb-5">
            {status === 'loading' ? null : session ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border-2 border-black/10">
                  <div className="w-9 h-9 rounded-full bg-amber border-2 border-black flex items-center justify-center font-black text-sm overflow-hidden shrink-0">
                    {session.user.image
                      ? <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                      : session.user.name?.slice(0, 2).toUpperCase()
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm truncate">{session.user.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{session.user.role}</div>
                  </div>
                </div>
                <Link href="/messages" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold hover:bg-black/8 transition-colors w-full"
                >
                  <MessageCircle size={15} /> {t.nav.messages}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold hover:bg-black/8 transition-colors w-full text-red-600"
                >
                  <LogOut size={15} /> {t.nav.logout}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" fullWidth>{t.nav.login}</Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                  <Button variant="black" fullWidth>{t.nav.signup}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
