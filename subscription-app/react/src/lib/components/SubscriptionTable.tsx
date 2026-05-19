import { useState, useEffect, useCallback } from 'react'
import { Pencil, Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react'
import type { Subscription } from '../types'
import { formatCurrency, annualEquivalent } from '../utils'
import SubscriptionModal from './SubscriptionModal'

type CategoryFilter = 'all' | Subscription['category']
type StatusFilter = 'all' | Subscription['status']
type SortDirection = 'asc' | 'desc'

const categoryBadgeClass: Record<Subscription['category'], string> = {
  streaming: 'bg-blue-50 text-blue-700',
  software: 'bg-purple-50 text-purple-700',
  utilities: 'bg-yellow-50 text-yellow-700',
  health: 'bg-green-50 text-green-700',
  other: 'bg-gray-50 text-gray-700',
}

export default function SubscriptionTable() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [costSortDir, setCostSortDir] = useState<SortDirection>('desc')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:3001/api/subscriptions')
      if (!res.ok) throw new Error('Failed to fetch subscriptions')
      const data: Subscription[] = await res.json()
      setSubscriptions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      const res = await fetch(`http://localhost:3001/api/subscriptions/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete subscription')
      await fetchSubscriptions()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  function handleEdit(sub: Subscription) {
    setEditingSubscription(sub)
    setModalOpen(true)
  }

  function handleAdd() {
    setEditingSubscription(null)
    setModalOpen(true)
  }

  function handleModalClose() {
    setModalOpen(false)
    setEditingSubscription(null)
  }

  function toggleCostSort() {
    setCostSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  }

  // Filter and sort
  const filtered = subscriptions
    .filter((s) => categoryFilter === 'all' || s.category === categoryFilter)
    .filter((s) => statusFilter === 'all' || s.status === statusFilter)
    .sort((a, b) => {
      const diff = a.cost - b.cost
      return costSortDir === 'asc' ? diff : -diff
    })

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="all">All Categories</option>
            <option value="streaming">Streaming</option>
            <option value="software">Software</option>
            <option value="utilities">Utilities</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          Add Subscription
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading subscriptions...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 text-sm">{error}</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={toggleCostSort}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
                    Cost
                    {costSortDir === 'desc' ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronUp size={14} />
                    )}
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual Equivalent
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                      {sub.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${categoryBadgeClass[sub.category]}`}
                      >
                        {sub.category.charAt(0).toUpperCase() + sub.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-[var(--color-text)]">
                      {formatCurrency(sub.cost, sub.currency)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                      {sub.frequency}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-[var(--color-text)]">
                      {formatCurrency(annualEquivalent(sub.cost, sub.frequency), sub.currency)}
                    </td>
                    <td className="px-4 py-3">
                      {sub.status === 'active' ? (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(sub)}
                          className="text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                          aria-label="Edit"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id, sub.name)}
                          className="text-gray-400 hover:text-[var(--color-danger)] transition-colors"
                          aria-label="Delete"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <SubscriptionModal
        open={modalOpen}
        onClose={handleModalClose}
        subscription={editingSubscription}
        onSaved={fetchSubscriptions}
      />
    </div>
  )
}
