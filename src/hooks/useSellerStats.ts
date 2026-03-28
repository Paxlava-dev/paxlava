'use client'
import { useState, useEffect } from 'react'

export interface SellerStats {
  totalRevenue:    number
  totalSales:      number
  totalViews:      number
  totalListings:   number
  pendingEarnings: number
  recentOrders:    any[]
  monthly:         { month: string; revenue: number }[]
}

export function useSellerStats() {
  const [stats, setStats]   = useState<SellerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/seller/stats')
      .then(r => r.json())
      .then(json => {
        if (!json.ok) throw new Error(json.error?.message)
        setStats(json.data)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading, error }
}
