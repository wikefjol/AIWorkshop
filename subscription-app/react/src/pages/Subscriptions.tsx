import { useSubscriptions } from '../lib/hooks/useSubscriptions'
import SubscriptionTable from '../lib/components/SubscriptionTable'

export default function Subscriptions() {
  const { data: subscriptions, loading, error, refetch } = useSubscriptions()
  const count = subscriptions.length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Subscriptions</h1>
        {!loading && (
          <p className="text-sm text-gray-500 mt-1">{count} subscription{count !== 1 ? 's' : ''}</p>
        )}
      </div>
      <SubscriptionTable subscriptions={subscriptions} loading={loading} error={error} onRefetch={refetch} />
    </div>
  )
}
