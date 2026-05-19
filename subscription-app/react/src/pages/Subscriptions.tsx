import { useState } from 'react'
import { Search } from 'lucide-react'
import { useSubscriptions } from '../lib/hooks/useSubscriptions'
import { useDebounce } from '../lib/hooks/useDebounce'
import SubscriptionTable from '../lib/components/SubscriptionTable'

export default function Subscriptions() {
  const { data: subscriptions, loading, error, refetch } = useSubscriptions()
  const [searchInput, setSearchInput] = useState('')
  const searchQuery = useDebounce(searchInput, 300)

  const matchCount = subscriptions.filter(
    (s) => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Subscriptions</h1>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        {!loading && (
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery
              ? `${matchCount} of ${subscriptions.length} subscription${subscriptions.length !== 1 ? 's' : ''}`
              : `${subscriptions.length} subscription${subscriptions.length !== 1 ? 's' : ''}`}
          </p>
        )}
      </div>

      <SubscriptionTable
        subscriptions={subscriptions}
        loading={loading}
        error={error}
        onRefetch={refetch}
        searchQuery={searchQuery}
      />
    </div>
  )
}
