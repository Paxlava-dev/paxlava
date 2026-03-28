import type { Metadata } from 'next'
import Link from 'next/link'
import { adminDb } from '@/lib/firebase/admin'
import { ProjectCard } from '@/components/marketplace/ProjectCard'
import { HomeClient } from '@/components/home/HomeClient'
import type { Project } from '@/types'

export const metadata: Metadata = {
  title: 'Paxlava — Buy & Sell IT Projects',
}

async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const snap = await adminDb
      .collection('projects')
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(3)
      .get()
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
  } catch { return [] }
}

export default async function HomePage() {
  const featured = await getFeaturedProjects()
  return <HomeClient featured={featured} />
}
