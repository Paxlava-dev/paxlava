'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type Lang, type Translations, translations } from '@/lib/i18n'

interface LangContextType {
  lang:    Lang
  setLang: (l: Lang) => void
  t:       Translations
}

const LangContext = createContext<LangContextType>({
  lang:    'EN',
  setLang: () => {},
  t:       translations.EN,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('EN')

  useEffect(() => {
    const saved = localStorage.getItem('paxlava_lang') as Lang | null
    if (saved === 'EN' || saved === 'AZ' || saved === 'RU') setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('paxlava_lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
