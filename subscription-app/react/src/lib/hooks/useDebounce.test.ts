import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('does NOT update immediately when value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )
    rerender({ value: 'updated', delay: 300 })
    expect(result.current).toBe('initial')
  })

  it('updates after the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )
    rerender({ value: 'updated', delay: 300 })
    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe('updated')
  })

  it('only emits the last value after rapid typing', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: '', delay: 300 } }
    )
    rerender({ value: 'n', delay: 300 })
    act(() => { vi.advanceTimersByTime(100) })
    rerender({ value: 'ne', delay: 300 })
    act(() => { vi.advanceTimersByTime(100) })
    rerender({ value: 'net', delay: 300 })
    act(() => { vi.advanceTimersByTime(100) })
    expect(result.current).toBe('')
    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe('net')
  })
})
