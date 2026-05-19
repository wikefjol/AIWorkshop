import { renderHook } from '@testing-library/react'
import { useSSE } from './useSSE'

const SSE_EVENTS = ['subscription:created', 'subscription:updated', 'subscription:deleted']

describe('useSSE', () => {
  let MockEventSource: ReturnType<typeof vi.fn>

  beforeEach(() => {
    MockEventSource = vi.fn(function (this: { addEventListener: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn> }) {
      this.addEventListener = vi.fn()
      this.close = vi.fn()
    })
    vi.stubGlobal('EventSource', MockEventSource)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('opens an EventSource connection to the provided URL', () => {
    renderHook(() => useSSE('http://localhost:3001/api/events', vi.fn()))
    expect(MockEventSource).toHaveBeenCalledWith('http://localhost:3001/api/events')
  })

  it('registers listeners for all three subscription event types', () => {
    const onEvent = vi.fn()
    renderHook(() => useSSE('http://localhost:3001/api/events', onEvent))
    const instance = MockEventSource.mock.instances[0]
    for (const event of SSE_EVENTS) {
      expect(instance.addEventListener).toHaveBeenCalledWith(event, onEvent)
    }
  })

  it('closes the EventSource on unmount', () => {
    const { unmount } = renderHook(() => useSSE('http://localhost:3001/api/events', vi.fn()))
    const instance = MockEventSource.mock.instances[0]
    unmount()
    expect(instance.close).toHaveBeenCalledOnce()
  })
})
