import { renderHook, act } from '@testing-library/react'
import { useTheme } from './useTheme'

beforeEach(() => {
  document.documentElement.classList.remove('dark')
  localStorage.clear()
})

describe('useTheme — initial state', () => {
  it('starts with light theme when localStorage has no value', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('starts with dark theme and applies class when localStorage has "dark"', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('starts with light theme when localStorage has "light"', () => {
    localStorage.setItem('theme', 'light')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

describe('useTheme — toggle()', () => {
  it('toggle() adds "dark" class to document.documentElement', () => {
    const { result } = renderHook(() => useTheme())
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    act(() => { result.current.toggle() })
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('calling toggle() again removes the "dark" class (toggles back to light)', () => {
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggle() })
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    act(() => { result.current.toggle() })
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggle() updates theme state to "dark"', () => {
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggle() })
    expect(result.current.theme).toBe('dark')
  })

  it('calling toggle() twice returns theme to "light"', () => {
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggle() })
    act(() => { result.current.toggle() })
    expect(result.current.theme).toBe('light')
  })
})

describe('useTheme — localStorage persistence', () => {
  it('toggle() writes "dark" to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggle() })
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('toggle() back to light writes "light" to localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => { result.current.toggle() })
    act(() => { result.current.toggle() })
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
