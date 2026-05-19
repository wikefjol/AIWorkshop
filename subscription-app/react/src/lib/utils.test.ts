import type { Subscription } from './types'
import {
  annualEquivalent,
  monthlyEquivalent,
  totalMonthly,
  totalAnnual,
  formatCurrency,
  upcomingRenewals,
  spendingByCategory,
  savingsPotential,
} from './utils'

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeSub(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: '1',
    name: 'Test',
    cost: 10,
    currency: 'USD',
    frequency: 'monthly',
    category: 'streaming',
    status: 'active',
    startDate: '2020-01-01',
    nextBillingDate: '2099-01-01',
    ...overrides,
  }
}

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

// ── annualEquivalent ──────────────────────────────────────────────────────────

describe('annualEquivalent', () => {
  it('daily: multiplies by 365', () => {
    expect(annualEquivalent(1, 'daily')).toBe(365)
  })
  it('weekly: multiplies by 52', () => {
    expect(annualEquivalent(1, 'weekly')).toBe(52)
  })
  it('monthly: multiplies by 12', () => {
    expect(annualEquivalent(10, 'monthly')).toBe(120)
  })
  it('yearly: returns cost as-is', () => {
    expect(annualEquivalent(100, 'yearly')).toBe(100)
  })
  it('unknown frequency: defaults to monthly (×12)', () => {
    expect(annualEquivalent(10, 'quarterly')).toBe(120)
  })
})

// ── monthlyEquivalent ─────────────────────────────────────────────────────────

describe('monthlyEquivalent', () => {
  it('daily: (cost × 365) / 12', () => {
    expect(monthlyEquivalent(12, 'daily')).toBeCloseTo((12 * 365) / 12)
  })
  it('weekly: (cost × 52) / 12', () => {
    expect(monthlyEquivalent(12, 'weekly')).toBeCloseTo((12 * 52) / 12)
  })
  it('monthly: returns cost as-is', () => {
    expect(monthlyEquivalent(9.99, 'monthly')).toBe(9.99)
  })
  it('yearly: cost / 12', () => {
    expect(monthlyEquivalent(120, 'yearly')).toBeCloseTo(10)
  })
})

// ── totalMonthly ──────────────────────────────────────────────────────────────

describe('totalMonthly', () => {
  it('sums only active subscriptions', () => {
    const subs = [
      makeSub({ cost: 10, frequency: 'monthly', status: 'active' }),
      makeSub({ cost: 20, frequency: 'monthly', status: 'cancelled' }),
    ]
    expect(totalMonthly(subs)).toBe(10)
  })

  it('handles mixed frequencies', () => {
    const subs = [
      makeSub({ cost: 120, frequency: 'yearly', status: 'active' }),
      makeSub({ cost: 5, frequency: 'monthly', status: 'active' }),
    ]
    expect(totalMonthly(subs)).toBeCloseTo(15)
  })

  it('returns 0 for empty array', () => {
    expect(totalMonthly([])).toBe(0)
  })
})

// ── totalAnnual ───────────────────────────────────────────────────────────────

describe('totalAnnual', () => {
  it('sums only active subscriptions', () => {
    const subs = [
      makeSub({ cost: 10, frequency: 'monthly', status: 'active' }),
      makeSub({ cost: 20, frequency: 'monthly', status: 'cancelled' }),
    ]
    expect(totalAnnual(subs)).toBe(120)
  })

  it('returns 0 for empty array', () => {
    expect(totalAnnual([])).toBe(0)
  })
})

// ── formatCurrency ────────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats USD', () => {
    expect(formatCurrency(9.99, 'USD')).toBe('$9.99')
  })
  it('defaults to USD when currency omitted', () => {
    expect(formatCurrency(5)).toBe('$5.00')
  })
})

// ── upcomingRenewals ──────────────────────────────────────────────────────────

describe('upcomingRenewals', () => {
  const today = new Date('2024-06-15T00:00:00')

  it('includes billing date exactly today', () => {
    const sub = makeSub({ nextBillingDate: '2024-06-15' })
    expect(upcomingRenewals([sub], today, 7)).toHaveLength(1)
  })

  it('includes billing date exactly today+days', () => {
    const sub = makeSub({ nextBillingDate: '2024-06-22' })
    expect(upcomingRenewals([sub], today, 7)).toHaveLength(1)
  })

  it('excludes billing date today+days+1', () => {
    const sub = makeSub({ nextBillingDate: '2024-06-23' })
    expect(upcomingRenewals([sub], today, 7)).toHaveLength(0)
  })

  it('excludes billing date yesterday', () => {
    const sub = makeSub({ nextBillingDate: '2024-06-14' })
    expect(upcomingRenewals([sub], today, 7)).toHaveLength(0)
  })

  it('excludes cancelled subscriptions even when billing date is in range', () => {
    const sub = makeSub({ nextBillingDate: '2024-06-16', status: 'cancelled' })
    expect(upcomingRenewals([sub], today, 7)).toHaveLength(0)
  })

  it('returns [] for empty array', () => {
    expect(upcomingRenewals([], today, 7)).toEqual([])
  })

  it('sorts results by nextBillingDate ascending', () => {
    const subs = [
      makeSub({ id: 'b', nextBillingDate: '2024-06-20' }),
      makeSub({ id: 'a', nextBillingDate: '2024-06-17' }),
    ]
    const result = upcomingRenewals(subs, today, 7)
    expect(result.map((s) => s.id)).toEqual(['a', 'b'])
  })
})

// ── spendingByCategory ────────────────────────────────────────────────────────

describe('spendingByCategory', () => {
  it('returns monthly equivalent for a single active streaming sub', () => {
    const sub = makeSub({ cost: 10, frequency: 'monthly', category: 'streaming' })
    expect(spendingByCategory([sub])).toEqual({ streaming: 10 })
  })

  it('excludes cancelled subscriptions', () => {
    const sub = makeSub({ cost: 10, frequency: 'monthly', category: 'streaming', status: 'cancelled' })
    expect(spendingByCategory([sub])).toEqual({})
  })

  it('sums two active subs in the same category', () => {
    const subs = [
      makeSub({ id: '1', cost: 5, frequency: 'monthly', category: 'software' }),
      makeSub({ id: '2', cost: 15, frequency: 'monthly', category: 'software' }),
    ]
    expect(spendingByCategory(subs)).toEqual({ software: 20 })
  })

  it('returns {} for empty array', () => {
    expect(spendingByCategory([])).toEqual({})
  })
})

// ── savingsPotential ──────────────────────────────────────────────────────────

describe('savingsPotential', () => {
  const today = new Date('2024-06-15')

  it('returns annual cost for active sub started more than 1 year ago', () => {
    const sub = makeSub({ cost: 10, frequency: 'monthly', status: 'active', startDate: '2022-06-14' })
    expect(savingsPotential(sub, today)).toBe(120)
  })

  it('returns null for active sub started only 6 months ago', () => {
    const sub = makeSub({ cost: 10, frequency: 'monthly', status: 'active', startDate: '2023-12-15' })
    expect(savingsPotential(sub, today)).toBeNull()
  })

  it('returns null for cancelled sub even if started more than 1 year ago', () => {
    const sub = makeSub({ cost: 10, frequency: 'monthly', status: 'cancelled', startDate: '2022-01-01' })
    expect(savingsPotential(sub, today)).toBeNull()
  })

  it('returns null for active sub started exactly 1 year ago (must be MORE than 1 year)', () => {
    const sub = makeSub({ cost: 10, frequency: 'monthly', status: 'active', startDate: '2023-06-15' })
    expect(savingsPotential(sub, today)).toBeNull()
  })
})
