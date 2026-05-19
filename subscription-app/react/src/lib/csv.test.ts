import { vi, beforeEach, afterEach } from 'vitest'
import { exportToCsv } from './csv'
import type { Subscription } from './types'

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: '1',
    name: 'Test Sub',
    cost: 10,
    currency: 'USD',
    frequency: 'monthly',
    category: 'streaming',
    status: 'active',
    startDate: '2024-01-01',
    nextBillingDate: '2024-07-01',
    ...overrides,
  }
}

let mockObjectUrl: string
let mockAnchor: { href: string; download: string; click: ReturnType<typeof vi.fn>; remove: ReturnType<typeof vi.fn> }

beforeEach(() => {
  mockObjectUrl = 'blob:mock-url'
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => mockObjectUrl),
    revokeObjectURL: vi.fn(),
  })
  mockAnchor = { href: '', download: '', click: vi.fn(), remove: vi.fn() }
  vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
    if (tag === 'a') return mockAnchor as unknown as HTMLElement
    return document.createElement.call(document, tag) as HTMLElement
  })
  vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('exportToCsv', () => {
  it('creates a Blob URL and triggers anchor click', () => {
    exportToCsv([makeSub()], 'subscriptions-2024-06-15.csv')
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
    expect(mockAnchor.click).toHaveBeenCalledOnce()
  })

  it('sets the correct filename on the anchor download attribute', () => {
    exportToCsv([makeSub()], 'subscriptions-2024-06-15.csv')
    expect(mockAnchor.download).toBe('subscriptions-2024-06-15.csv')
  })

  it('sets the anchor href to the blob URL', () => {
    exportToCsv([makeSub()], 'subscriptions-2024-06-15.csv')
    expect(mockAnchor.href).toBe(mockObjectUrl)
  })

  it('CSV content has correct header and one data row', async () => {
    let capturedBlob: Blob | null = null
    ;(URL.createObjectURL as ReturnType<typeof vi.fn>).mockImplementation((blob: Blob) => {
      capturedBlob = blob
      return mockObjectUrl
    })
    exportToCsv([makeSub({ name: 'Netflix', cost: 15.99, frequency: 'monthly', category: 'streaming', status: 'active' })], 'test.csv')
    const text = await capturedBlob!.text()
    const lines = text.trim().split('\n')
    expect(lines[0]).toBe('Name,Category,Cost,Frequency,Annual Equivalent,Status')
    expect(lines).toHaveLength(2)
    expect(lines[1]).toBe('Netflix,streaming,15.99,monthly,191.88,active')
  })

  it('produces one data row per subscription', async () => {
    let capturedBlob: Blob | null = null
    ;(URL.createObjectURL as ReturnType<typeof vi.fn>).mockImplementation((blob: Blob) => { capturedBlob = blob; return mockObjectUrl })
    exportToCsv([makeSub({ id: '1', name: 'Netflix' }), makeSub({ id: '2', name: 'Spotify' }), makeSub({ id: '3', name: 'GitHub' })], 'test.csv')
    const lines = (await capturedBlob!.text()).trim().split('\n')
    expect(lines).toHaveLength(4)
  })

  it('correctly calculates annual equivalent for daily frequency', async () => {
    let capturedBlob: Blob | null = null
    ;(URL.createObjectURL as ReturnType<typeof vi.fn>).mockImplementation((blob: Blob) => { capturedBlob = blob; return mockObjectUrl })
    exportToCsv([makeSub({ cost: 1, frequency: 'daily' })], 'test.csv')
    const lines = (await capturedBlob!.text()).trim().split('\n')
    expect(lines[1]).toContain(',365,')
  })

  it('correctly calculates annual equivalent for weekly frequency', async () => {
    let capturedBlob: Blob | null = null
    ;(URL.createObjectURL as ReturnType<typeof vi.fn>).mockImplementation((blob: Blob) => { capturedBlob = blob; return mockObjectUrl })
    exportToCsv([makeSub({ cost: 1, frequency: 'weekly' })], 'test.csv')
    const lines = (await capturedBlob!.text()).trim().split('\n')
    expect(lines[1]).toContain(',52,')
  })

  it('correctly calculates annual equivalent for yearly frequency', async () => {
    let capturedBlob: Blob | null = null
    ;(URL.createObjectURL as ReturnType<typeof vi.fn>).mockImplementation((blob: Blob) => { capturedBlob = blob; return mockObjectUrl })
    exportToCsv([makeSub({ cost: 100, frequency: 'yearly' })], 'test.csv')
    const lines = (await capturedBlob!.text()).trim().split('\n')
    expect(lines[1]).toContain(',100,')
  })

  it('wraps fields containing commas in double quotes', async () => {
    let capturedBlob: Blob | null = null
    ;(URL.createObjectURL as ReturnType<typeof vi.fn>).mockImplementation((blob: Blob) => { capturedBlob = blob; return mockObjectUrl })
    exportToCsv([makeSub({ name: 'Netflix, Premium' })], 'test.csv')
    const lines = (await capturedBlob!.text()).trim().split('\n')
    expect(lines[1]).toContain('"Netflix, Premium"')
  })

  it('handles empty subscription list — only header row', async () => {
    let capturedBlob: Blob | null = null
    ;(URL.createObjectURL as ReturnType<typeof vi.fn>).mockImplementation((blob: Blob) => { capturedBlob = blob; return mockObjectUrl })
    exportToCsv([], 'test.csv')
    const lines = (await capturedBlob!.text()).trim().split('\n')
    expect(lines).toHaveLength(1)
    expect(lines[0]).toBe('Name,Category,Cost,Frequency,Annual Equivalent,Status')
  })

  it('removes the anchor element after click', () => {
    exportToCsv([makeSub()], 'test.csv')
    expect(mockAnchor.remove).toHaveBeenCalledOnce()
  })

  it('escapes double-quote characters per RFC 4180', async () => {
    let capturedBlob: Blob | null = null
    ;(URL.createObjectURL as ReturnType<typeof vi.fn>).mockImplementation((blob: Blob) => { capturedBlob = blob; return mockObjectUrl })
    exportToCsv([makeSub({ name: 'Netflix "Premium"' })], 'test.csv')
    const lines = (await capturedBlob!.text()).trim().split('\n')
    expect(lines[1]).toContain('"Netflix ""Premium"""')
  })
})
