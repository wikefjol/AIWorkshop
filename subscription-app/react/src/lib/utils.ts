export function annualEquivalent(cost: number, frequency: string): number {
  switch (frequency) {
    case 'daily':
      return cost * 365
    case 'weekly':
      return cost * 52
    case 'monthly':
      return cost * 12
    case 'yearly':
      return cost * 1
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
      return cost * 1
    case 'yearly':
      return cost / 12
    default:
      return cost
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}
