'use client'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types'

function SkeletonCard() {
  return (
    <div className="border-r-2 border-b-2 border-black bg-cream animate-pulse">
      <div className="aspect-video bg-gray-200 border-b-2 border-black" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 rounded-full bg-gray-200" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex gap-1.5">
          {[1,2,3].map(i => <div key={i} className="h-5 w-16 bg-gray-200 rounded-pill" />)}
        </div>
        <div className="flex justify-between pt-3 border-t-2 border-black">
          <div className="h-6 w-16 bg-gray-200 rounded" />
          <div className="h-7 w-20 bg-gray-200 rounded-pill" />
        </div>
      </div>
    </div>
  )
}

interface ProjectGridProps {
  projects: Project[]
  loading:  boolean
  error?:   string | null
  emptyText?: string
}

export function ProjectGrid({ projects, loading, error, emptyText = 'No projects found' }: ProjectGridProps) {
  if (error) {
    return (
      <div className="col-span-full text-center py-20 text-gray-500">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-bold">{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-l-2 border-black">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!projects.length) {
    return (
      <div className="text-center py-24 border-t-2 border-black">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-black text-xl mb-2">{emptyText}</p>
        <p className="text-gray-500 text-sm">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-l-2 border-black">
      {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    </div>
  )
}
