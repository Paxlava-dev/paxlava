'use client'
import { useState, useEffect } from 'react'
import {
  collection, query, where, orderBy, limit,
  onSnapshot, type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Message, Thread } from '@/types'

// Real-time messages listener for a single thread
export function useMessages(threadId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!threadId) { setLoading(false); return }

    const q: ReturnType<typeof query> = query(
      collection(db, 'threads', threadId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(200)
    )

    const unsub: Unsubscribe = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...(d.data() as object) } as Message)))
      setLoading(false)
    }, () => setLoading(false))

    return () => unsub()
  }, [threadId])

  return { messages, loading }
}

// Real-time threads list for current user — uses two separate WHERE queries
// because Firestore does not support OR queries across different fields.
export function useThreads(userId: string | null) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setLoading(false); return }

    let buyerSnap: Thread[] = []
    let sellerSnap: Thread[] = []
    let loadedCount = 0

    function merge() {
      // Deduplicate & sort by lastMessageAt desc
      const seen = new Set<string>()
      const combined = [...buyerSnap, ...sellerSnap].filter(t => {
        if (!t.id || seen.has(t.id)) return false
        seen.add(t.id)
        return true
      })
      combined.sort((a, b) => {
        const aMs = (a.lastMessageAt as any)?.toMillis?.() ?? 0
        const bMs = (b.lastMessageAt as any)?.toMillis?.() ?? 0
        return bMs - aMs
      })
      setThreads(combined)
    }

    // Listener 1: threads where user is buyer
    const q1 = query(
      collection(db, 'threads'),
      where('buyerId', '==', userId),
      orderBy('lastMessageAt', 'desc'),
      limit(50)
    )

    // Listener 2: threads where user is seller
    const q2 = query(
      collection(db, 'threads'),
      where('sellerId', '==', userId),
      orderBy('lastMessageAt', 'desc'),
      limit(50)
    )

    const unsub1 = onSnapshot(q1, snap => {
      buyerSnap = snap.docs.map(d => ({ id: d.id, ...(d.data() as object) } as Thread))
      loadedCount++
      if (loadedCount >= 2) setLoading(false)
      merge()
    }, () => { loadedCount++; if (loadedCount >= 2) setLoading(false) })

    const unsub2 = onSnapshot(q2, snap => {
      sellerSnap = snap.docs.map(d => ({ id: d.id, ...(d.data() as object) } as Thread))
      loadedCount++
      if (loadedCount >= 2) setLoading(false)
      merge()
    }, () => { loadedCount++; if (loadedCount >= 2) setLoading(false) })

    return () => { unsub1(); unsub2() }
  }, [userId])

  return { threads, loading }
}

// Send a message via API
export async function sendMessage(payload: {
  threadId?: string
  projectId?: string
  receiverId?: string
  text: string
}) {
  const res = await fetch('/api/messages', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  return res.json()
}
