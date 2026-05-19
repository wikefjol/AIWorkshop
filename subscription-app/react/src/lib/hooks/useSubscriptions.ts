import { useState, useEffect, useCallback } from 'react'
import type { Subscription } from '../types'
import { listSubscriptions } from '../api'

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
      const result = await listSubscriptions({ category: params?.category, status: params?.status })
      setData(result)
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
