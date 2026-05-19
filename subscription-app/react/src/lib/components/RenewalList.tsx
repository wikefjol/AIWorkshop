import type { Subscription } from '../types'
import { formatCurrency } from '../utils'

interface RenewalListProps {
  subscriptions: Subscription[]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function RenewalList({ subscriptions }: RenewalListProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const in7Days = new Date(today)
  in7Days.setDate(today.getDate() + 7)

  const upcoming = subscriptions
    .filter((s) => {
      if (s.status !== 'active') return false
      const billing = new Date(s.nextBillingDate + 'T00:00:00')
      return billing >= today && billing <= in7Days
    })
    .sort((a, b) => a.nextBillingDate.localeCompare(b.nextBillingDate))

  if (upcoming.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4">
        No subscriptions renewing in the next 7 days.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {upcoming.map((sub) => (
        <li
          key={sub.id}
          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
        >
          <div>
            <p className="text-sm font-medium text-gray-800">{sub.name}</p>
            <p className="text-xs text-gray-500 capitalize">{sub.frequency}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              {formatCurrency(sub.cost, sub.currency)}
            </p>
            <p className="text-xs text-gray-400">{formatDate(sub.nextBillingDate)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
