import { useEffect } from 'react'

const SSE_EVENTS = ['subscription:created', 'subscription:updated', 'subscription:deleted'] as const

export function useSSE(url: string, onEvent: () => void) {
  useEffect(() => {
    const es = new EventSource(url)
    for (const event of SSE_EVENTS) {
      es.addEventListener(event, onEvent)
    }
    return () => es.close()
  }, [url, onEvent])
}
