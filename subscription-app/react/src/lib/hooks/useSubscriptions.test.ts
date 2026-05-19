import { renderHook, waitFor } from '@testing-library/react'
import { useSubscriptions } from './useSubscriptions'

vi.mock('../api', () => ({
  listSubscriptions: vi.fn(),
}))

import { listSubscriptions } from '../api'
const mockListSubscriptions = listSubscriptions as ReturnType<typeof vi.fn>

import type { Subscription } from '../types'

const sub: Subscription = {
  id: 'abc-123',
  name: 'Netflix',
  cost: 15.99,
  currency: 'USD',
  frequency: 'monthly',
  category: 'streaming',
  status: 'active',
  startDate: '2024-01-01',
  nextBillingDate: '2024-02-01',
}

beforeEach(() => {
  mockListSubscriptions.mockReset()
})

describe('useSubscriptions — initial fetch', () => {
  it('starts with loading=true, data=[], error=null', () => {
    mockListSubscriptions.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useSubscriptions())
    expect(result.current.loading).toBe(true)
    expect(result.current.data).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('after resolution sets data and loading=false', async () => {
    mockListSubscriptions.mockResolvedValue([sub])
    const { result } = renderHook(() => useSubscriptions())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual([sub])
    expect(result.current.error).toBeNull()
  })

  it('uses the mocked listSubscriptions, not raw fetch', async () => {
    mockListSubscriptions.mockResolvedValue([sub])
    renderHook(() => useSubscriptions())
    await waitFor(() => expect(mockListSubscriptions).toHaveBeenCalledTimes(1))
  })
})

describe('useSubscriptions — params filtering', () => {
  it('calls listSubscriptions with no params when called with no args', async () => {
    mockListSubscriptions.mockResolvedValue([])
    renderHook(() => useSubscriptions())
    await waitFor(() => expect(mockListSubscriptions).toHaveBeenCalledTimes(1))
    expect(mockListSubscriptions).toHaveBeenCalledWith({ category: undefined, status: undefined })
  })

  it('calls listSubscriptions with { category: "streaming" } when called with { category: "streaming" }', async () => {
    mockListSubscriptions.mockResolvedValue([])
    renderHook(() => useSubscriptions({ category: 'streaming' }))
    await waitFor(() => expect(mockListSubscriptions).toHaveBeenCalledTimes(1))
    expect(mockListSubscriptions).toHaveBeenCalledWith({ category: 'streaming', status: undefined })
  })

  it('calls listSubscriptions with { status: "active" } when called with { status: "active" }', async () => {
    mockListSubscriptions.mockResolvedValue([])
    renderHook(() => useSubscriptions({ status: 'active' }))
    await waitFor(() => expect(mockListSubscriptions).toHaveBeenCalledTimes(1))
    expect(mockListSubscriptions).toHaveBeenCalledWith({ category: undefined, status: 'active' })
  })
})

describe('useSubscriptions — error handling', () => {
  it('when listSubscriptions throws, sets error message and loading=false', async () => {
    mockListSubscriptions.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useSubscriptions())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Network error')
    expect(result.current.data).toEqual([])
  })
})

describe('useSubscriptions — refetch', () => {
  it('calling refetch() calls listSubscriptions again', async () => {
    mockListSubscriptions.mockResolvedValue([sub])
    const { result } = renderHook(() => useSubscriptions())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(mockListSubscriptions).toHaveBeenCalledTimes(1)
    result.current.refetch()
    await waitFor(() => expect(mockListSubscriptions).toHaveBeenCalledTimes(2))
  })
})
