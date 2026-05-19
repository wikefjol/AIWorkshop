import { SubscriptionSchema, UpdateSubscriptionSchema, FREQUENCIES, CATEGORIES, STATUSES } from './schema'

const validPayload = {
  name: '  Netflix  ',
  cost: 15.99,
  currency: 'USD',
  frequency: 'monthly',
  category: 'streaming',
  status: 'active',
  startDate: '2024-01-01',
  nextBillingDate: '2024-02-01',
}

describe('SubscriptionSchema — valid inputs', () => {
  it('parses a complete valid payload and trims name', () => {
    const result = SubscriptionSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Netflix')
    }
  })

  it('trims name with whitespace', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, name: '  Spotify  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Spotify')
    }
  })

  it('applies defaults for missing optional fields', () => {
    const { currency, frequency, category, status, ...required } = validPayload
    const result = SubscriptionSchema.safeParse(required)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.currency).toBe('USD')
      expect(result.data.frequency).toBe('monthly')
      expect(result.data.category).toBe('other')
      expect(result.data.status).toBe('active')
    }
  })

  it('accepts cost as integer', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, cost: 10 })
    expect(result.success).toBe(true)
  })
})

describe('SubscriptionSchema — invalid inputs', () => {
  it('fails for empty name', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, name: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('fails for name with only spaces', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, name: '   ' })
    expect(result.success).toBe(false)
  })

  it('fails for cost = 0', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, cost: 0 })
    expect(result.success).toBe(false)
  })

  it('fails for cost = -5', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, cost: -5 })
    expect(result.success).toBe(false)
  })

  it('fails for cost as string', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, cost: '9.99' })
    expect(result.success).toBe(false)
  })

  it('fails for startDate = not-a-date', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, startDate: 'not-a-date' })
    expect(result.success).toBe(false)
  })

  it('fails for startDate = 2024-13-01 (invalid date)', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, startDate: '2024-13-01' })
    expect(result.success).toBe(false)
  })

  it('fails for startDate = 20240101 (no dashes)', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, startDate: '20240101' })
    expect(result.success).toBe(false)
  })

  it('fails for invalid nextBillingDate format', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, nextBillingDate: 'not-a-date' })
    expect(result.success).toBe(false)
  })

  it('fails for nextBillingDate = 2024-13-01', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, nextBillingDate: '2024-13-01' })
    expect(result.success).toBe(false)
  })

  it('fails for nextBillingDate without dashes', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, nextBillingDate: '20240101' })
    expect(result.success).toBe(false)
  })

  it('fails for frequency = quarterly', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, frequency: 'quarterly' })
    expect(result.success).toBe(false)
  })

  it('fails for category = gaming', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, category: 'gaming' })
    expect(result.success).toBe(false)
  })

  it('fails for status = paused', () => {
    const result = SubscriptionSchema.safeParse({ ...validPayload, status: 'paused' })
    expect(result.success).toBe(false)
  })
})

describe('UpdateSubscriptionSchema', () => {
  it('fails for empty object', () => {
    const result = UpdateSubscriptionSchema.safeParse({})
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('No valid fields to update')
    }
  })

  it('succeeds for { name: "Netflix" }', () => {
    const result = UpdateSubscriptionSchema.safeParse({ name: 'Netflix' })
    expect(result.success).toBe(true)
  })

  it('fails for { cost: 0 }', () => {
    const result = UpdateSubscriptionSchema.safeParse({ cost: 0 })
    expect(result.success).toBe(false)
  })

  it('fails for { frequency: "quarterly" }', () => {
    const result = UpdateSubscriptionSchema.safeParse({ frequency: 'quarterly' })
    expect(result.success).toBe(false)
  })
})

describe('Exported constants', () => {
  it('FREQUENCIES has correct values', () => {
    expect(FREQUENCIES).toEqual(['daily', 'weekly', 'monthly', 'yearly'])
  })

  it('CATEGORIES has correct values', () => {
    expect(CATEGORIES).toEqual(['streaming', 'software', 'utilities', 'health', 'other'])
  })

  it('STATUSES has correct values', () => {
    expect(STATUSES).toEqual(['active', 'cancelled'])
  })
})
