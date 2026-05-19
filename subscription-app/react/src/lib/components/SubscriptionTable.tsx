import { useState } from 'react'
import { Pencil, Trash2, Plus, ChevronUp, ChevronDown, Download } from 'lucide-react'
import { toast } from 'sonner'
import type { Subscription } from '../types'
import { formatCurrency, annualEquivalent, savingsPotential } from '../utils'
import { exportToCsv } from '../csv'
import SubscriptionModal from './SubscriptionModal'
import HighlightedText from './HighlightedText'
import { CATEGORIES, STATUSES } from '../schema'
import { deleteSubscription } from '../api'

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

interface SubscriptionTableProps {
  subscriptions: Subscription[]
  loading: boolean
  error: string | null
  onRefetch: () => void
  searchQuery?: string
}

export default function SubscriptionTable({ subscriptions, loading, error, onRefetch, searchQuery = '' }: SubscriptionTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [costSortDir, setCostSortDir] = useState<SortDirection>('desc')
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

  async function handleDelete(id: string) {
    try {
      await deleteSubscription(id)
      toast.success('Subscription deleted')
      setConfirmingId(null)
      onRefetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete')
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

  function handleExport() {
    const today = new Date().toISOString().slice(0, 10)
    exportToCsv(filtered, `subscriptions-${today}.csv`)
  }

  const filtered = subscriptions
    .filter((s) => categoryFilter === 'all' || s.category === categoryFilter)
    .filter((s) => statusFilter === 'all' || s.status === statusFilter)
    .filter((s) => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const diff = a.cost - b.cost
      return costSortDir === 'asc' ? diff : -diff
    })

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            title="Export to CSV"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>

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
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th
                  className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={toggleCostSort}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
                    Cost
                    {costSortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Equivalent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                      <HighlightedText text={sub.name} query={searchQuery} />
                      {savingsPotential(sub, new Date()) !== null && (
                        <span className="ml-2 text-xs text-red-600 font-medium">
                          Cancel & Save {formatCurrency(savingsPotential(sub, new Date())!, sub.currency)}/yr
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${categoryBadgeClass[sub.category]}`}>
                        {sub.category.charAt(0).toUpperCase() + sub.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-[var(--color-text)]">
                      {formatCurrency(sub.cost, sub.currency)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{sub.frequency}</td>
                    <td className="px-4 py-3 text-sm text-right text-[var(--color-text)]">
                      {formatCurrency(annualEquivalent(sub.cost, sub.frequency), sub.currency)}
                    </td>
                    <td className="px-4 py-3">
                      {sub.status === 'active' ? (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Active</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Cancelled</span>
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
                        {confirmingId === sub.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(sub.id)}
                              className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition-colors"
                            >
                              Confirm?
                            </button>
                            <button
                              onClick={() => setConfirmingId(null)}
                              className="text-xs font-medium text-gray-600 hover:text-gray-800 px-2 py-1 rounded border border-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setConfirmingId(sub.id)}
                            className="text-gray-400 hover:text-[var(--color-danger)] transition-colors"
                            aria-label="Delete"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
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
        onSaved={onRefetch}
      />
    </div>
  )
}
