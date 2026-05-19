import { useState, useEffect } from 'react'
import SubscriptionTable from '../lib/components/SubscriptionTable'

export default function Subscriptions() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('http://localhost:3001/api/subscriptions')
      .then((res) => res.json())
      .then((data: unknown[]) => setCount(data.length))
      .catch(() => setCount(null))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Subscriptions</h1>
        {count !== null && (
          <p className="text-sm text-gray-500 mt-1">{count} subscription{count !== 1 ? 's' : ''}</p>
        )}
      </div>
      <SubscriptionTable />
    </div>
  )
}
