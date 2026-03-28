'use client'
import { useSearchParams } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import { ProjectGrid } from './ProjectGrid'
import type { ProjectFilters } from '@/hooks/useProjects'

export function DiscoverResults() {
  const params = useSearchParams()

  const filters: ProjectFilters = {
    q:        params.get('q')        || undefined,
    category: params.get('category') || undefined,
    sort:     (params.get('sort') as ProjectFilters['sort']) || 'newest',
    demo:     params.get('demo') === 'true',
    limit:    12,
  }

  const { projects, loading, error, hasMore } = useProjects(filters)

  return (
    <div className="pb-16">
      <ProjectGrid
        projects={projects}
        loading={loading}
        error={error}
        emptyText="No projects match your search"
      />
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 mb-3">Showing {projects.length} projects</p>
          <button className="px-6 py-3 border-2 border-black rounded-pill font-bold text-sm hover:bg-black hover:text-white transition-colors">
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
