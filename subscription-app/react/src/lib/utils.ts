import type { Subscription } from './types'

export function annualEquivalent(cost: number, frequency: string): number {
  switch (frequency) {
    case 'daily':
      return cost * 365
    case 'weekly':
      return cost * 52
    case 'monthly':
      return cost * 12
    case 'yearly':
      return cost
    default:
      return cost * 12
  }
}

export function monthlyEquivalent(cost: number, frequency: string): number {
  switch (frequency) {
    case 'daily':
      return (cost * 365) / 12
    case 'weekly':
      return (cost * 52) / 12
    case 'monthly':
      return cost
    case 'yearly':
      return cost / 12
    default:
      return cost
  }
}

export function totalMonthly(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + monthlyEquivalent(s.cost, s.frequency), 0)
}

export function totalAnnual(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + annualEquivalent(s.cost, s.frequency), 0)
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
