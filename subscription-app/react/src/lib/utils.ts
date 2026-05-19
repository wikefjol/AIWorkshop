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

export function upcomingRenewals(subs: Subscription[], today: Date, days: number): Subscription[] {
  const end = new Date(today)
  end.setDate(today.getDate() + days)

  return subs
    .filter((s) => {
      if (s.status !== 'active') return false
      const billing = new Date(s.nextBillingDate + 'T00:00:00')
      return billing >= today && billing <= end
    })
    .sort((a, b) => a.nextBillingDate.localeCompare(b.nextBillingDate))
}

export function spendingByCategory(subs: Subscription[]): Record<string, number> {
  return subs
    .filter((s) => s.status === 'active')
    .reduce<Record<string, number>>((acc, sub) => {
      acc[sub.category] = (acc[sub.category] ?? 0) + monthlyEquivalent(sub.cost, sub.frequency)
      return acc
    }, {})
}

export function savingsPotential(sub: Subscription, today: Date): number | null {
  if (sub.status !== 'active') return null

  // Compare purely by calendar date to avoid timezone skew between Date constructors.
  const todayStr = today.toISOString().slice(0, 10)
  const [sy, sm, sd] = sub.startDate.split('-').map(Number)
  const [ty, tm, td] = todayStr.split('-').map(Number)

  const startPlusOneYear = `${sy + 1}-${String(sm).padStart(2, '0')}-${String(sd).padStart(2, '0')}`

  const todayCmp = `${ty}-${String(tm).padStart(2, '0')}-${String(td).padStart(2, '0')}`

  if (todayCmp <= startPlusOneYear) return null

  return annualEquivalent(sub.cost, sub.frequency)
}
