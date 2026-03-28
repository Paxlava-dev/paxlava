'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Project } from '@/types'

export interface ProjectFilters {
  category?: string
  q?:        string
  sort?:     'newest' | 'price-asc' | 'price-desc' | 'rating'
  demo?:     boolean
  page?:     number
  limit?:    number
}

interface UseProjectsResult {
  projects: Project[]
  loading:  boolean
  error:    string | null
  hasMore:  boolean
  refetch:  () => void
}

export function useProjects(filters: ProjectFilters = {}): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [hasMore, setHasMore]   = useState(false)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.set('category', filters.category)
      if (filters.q)        params.set('q',        filters.q)
      if (filters.sort)     params.set('sort',      filters.sort)
      if (filters.demo)     params.set('demo',      'true')
      if (filters.page)     params.set('page',      String(filters.page))
      if (filters.limit)    params.set('limit',     String(filters.limit))

      const res  = await fetch(`/api/projects?${params}`)
      const json = await res.json()
      if (!json.ok) throw new Error(json.error?.message || 'Failed to load')
      setProjects(json.data.projects)
      setHasMore(json.data.hasMore)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [filters.category, filters.q, filters.sort, filters.demo, filters.page, filters.limit])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  return { projects, loading, error, hasMore, refetch: fetchProjects }
}

// ── Single project ─────────────────────────────────────────────
export function useProject(id: string | null) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(json => {
        if (!json.ok) throw new Error(json.error?.message)
        setProject(json.data)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  return { project, loading, error }
}
