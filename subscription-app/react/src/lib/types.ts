export interface Subscription {
  id: string
  name: string
  cost: number
  currency: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  category: 'streaming' | 'software' | 'utilities' | 'health' | 'other'
  status: 'active' | 'cancelled'
  startDate: string
  nextBillingDate: string
}
