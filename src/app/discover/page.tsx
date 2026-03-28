import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchFilters } from '@/components/marketplace/SearchFilters'
import { DiscoverResults } from '@/components/marketplace/DiscoverResults'

export const metadata: Metadata = { title: 'Discover IT Projects' }

export default function DiscoverPage() {
  return (
    <>
      <div className="px-8 py-10 border-b-2 border-black">
        <div className="section-label">Marketplace</div>
        <h1 className="heading-lg">All IT Projects</h1>
      </div>
      <Suspense fallback={null}>
        <SearchFilters />
      </Suspense>
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-l-2 border-black">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border-r-2 border-b-2 border-black bg-cream animate-pulse">
              <div className="aspect-video bg-gray-200 border-b-2 border-black" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      }>
        <DiscoverResults />
      </Suspense>
    </>
  )
}
