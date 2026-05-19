import { useState, useEffect, useCallback } from 'react'
import type { Subscription } from '../types'

interface UseSubscriptionsParams {
  category?: string
  status?: string
}

interface UseSubscriptionsResult {
  data: Subscription[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useSubscriptions(params?: UseSubscriptionsParams): UseSubscriptionsResult {
  const [data, setData] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL('http://localhost:3001/api/subscriptions')
      if (params?.category) url.searchParams.set('category', params.category)
      if (params?.status) url.searchParams.set('status', params.status)

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      const json = await response.json()
      if (!json.success) {
        throw new Error(json.error ?? 'Unknown error')
      }
      setData(json.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions')
    } finally {
      setLoading(false)
    }
  }, [params?.category, params?.status])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
