'use client'
import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORY_LABELS } from '@/lib/utils'

const CATEGORIES = Object.entries(CATEGORY_LABELS)

export function SearchFilters() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ]    = useState(searchParams.get('q') || '')

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/discover?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex flex-wrap gap-2.5 px-8 py-4 border-b-2 border-black bg-white sticky top-[60px] z-20">
      {/* Search */}
      <div className="flex bg-cream border-2 border-black rounded-pill overflow-hidden flex-1 min-w-[200px]">
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && update('q', q)}
          placeholder="Search projects…"
          className="flex-1 px-4 py-2 bg-transparent text-sm font-medium focus:outline-none"
        />
        <button
          onClick={() => update('q', q)}
          className="px-4 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Category */}
      <select
        value={searchParams.get('category') || ''}
        onChange={e => update('category', e.target.value)}
        className="px-4 py-2 border-2 border-black rounded-pill bg-cream text-sm font-semibold appearance-none cursor-pointer min-w-[160px]"
      >
        <option value="">All categories</option>
        {CATEGORIES.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={searchParams.get('sort') || ''}
        onChange={e => update('sort', e.target.value)}
        className="px-4 py-2 border-2 border-black rounded-pill bg-cream text-sm font-semibold appearance-none cursor-pointer"
      >
        <option value="newest">Newest first</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating">Highest rated</option>
      </select>

      {/* Demo toggle */}
      <label className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-pill bg-cream text-sm font-semibold cursor-pointer hover:bg-[#edeae1] transition-colors">
        <input
          type="checkbox"
          checked={searchParams.get('demo') === 'true'}
          onChange={e => update('demo', e.target.checked ? 'true' : '')}
          className="w-4 h-4 accent-black"
        />
        Live demo only
      </label>
    </div>
  )
}
