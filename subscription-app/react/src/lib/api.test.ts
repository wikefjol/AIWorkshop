import type { Subscription } from './types'
import type { SubscriptionInput, UpdateSubscriptionInput } from './schema'
import {
  listSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  resetSubscriptions,
} from './api'

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

let mockFetch: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockFetch = vi.fn()
  vi.stubGlobal('fetch', mockFetch)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockOk(data: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true, data }),
  })
}

function mockError(status: number, error: string) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: async () => ({ success: false, error }),
  })
}

describe('listSubscriptions', () => {
  it('calls http://localhost:3001/api/subscriptions with no params', async () => {
    mockOk([sub])
    await listSubscriptions()
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/subscriptions')
  })

  it('appends ?category=streaming when category param given', async () => {
    mockOk([sub])
    await listSubscriptions({ category: 'streaming' })
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/subscriptions?category=streaming')
  })

  it('appends ?status=active when status param given', async () => {
    mockOk([sub])
    await listSubscriptions({ status: 'active' })
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/subscriptions?status=active')
  })

  it('appends both params together', async () => {
    mockOk([sub])
    await listSubscriptions({ category: 'streaming', status: 'active' })
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('category=streaming')
    expect(url).toContain('status=active')
  })

  it('returns the data array from response', async () => {
    mockOk([sub])
    const result = await listSubscriptions()
    expect(result).toEqual([sub])
  })

  it('throws when server returns { success: false, error: "Invalid category" }', async () => {
    mockError(400, 'Invalid category')
    await expect(listSubscriptions()).rejects.toThrow('Invalid category')
  })
})

describe('getSubscription', () => {
  it('calls http://localhost:3001/api/subscriptions/abc-123', async () => {
    mockOk(sub)
    await getSubscription('abc-123')
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/subscriptions/abc-123')
  })

  it('returns the subscription object', async () => {
    mockOk(sub)
    const result = await getSubscription('abc-123')
    expect(result).toEqual(sub)
  })

  it('throws with error message when response returns 404', async () => {
    mockError(404, 'Not found')
    await expect(getSubscription('abc-123')).rejects.toThrow('Not found')
  })
})

describe('createSubscription', () => {
  const input: SubscriptionInput = {
    name: 'Netflix',
    cost: 15.99,
    currency: 'USD',
    frequency: 'monthly',
    category: 'streaming',
    status: 'active',
    startDate: '2024-01-01',
    nextBillingDate: '2024-02-01',
  }

  it('calls POST http://localhost:3001/api/subscriptions with correct JSON body and Content-Type header', async () => {
    mockOk(sub)
    await createSubscription(input)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/subscriptions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(input),
      })
    )
  })

  it('returns the created subscription', async () => {
    mockOk(sub)
    const result = await createSubscription(input)
    expect(result).toEqual(sub)
  })
})

describe('updateSubscription', () => {
  const update: UpdateSubscriptionInput = { name: 'Netflix HD' }

  it('calls PUT http://localhost:3001/api/subscriptions/abc-123 with correct body', async () => {
    mockOk(sub)
    await updateSubscription('abc-123', update)
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/subscriptions/abc-123',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(update),
      })
    )
  })

  it('returns the updated subscription', async () => {
    mockOk(sub)
    const result = await updateSubscription('abc-123', update)
    expect(result).toEqual(sub)
  })
})

describe('deleteSubscription', () => {
  it('calls DELETE http://localhost:3001/api/subscriptions/abc-123', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
    await deleteSubscription('abc-123')
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/subscriptions/abc-123',
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('resolves without error on success', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
    await expect(deleteSubscription('abc-123')).resolves.toBeUndefined()
  })
})

describe('resetSubscriptions', () => {
  it('calls DELETE http://localhost:3001/api/subscriptions', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
    await resetSubscriptions()
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/subscriptions',
      expect.objectContaining({ method: 'DELETE' })
    )
  })

  it('resolves without error on success', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
    await expect(resetSubscriptions()).resolves.toBeUndefined()
  })
})
