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
  streaming: 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  software: 'bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  utilities: 'bg-yellow-50 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  health: 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  other: 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
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

  const selectClass = 'border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)} className={selectClass}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className={selectClass}>
            <option value="all">All Statuses</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
      <div className="bg-white dark:bg-gray-800 rounded-[8px] shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">Loading subscriptions...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 text-sm">{error}</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th
                  className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none"
                  onClick={toggleCostSort}
                >
                  <span className="inline-flex items-center gap-1 justify-end">
                    Cost
                    {costSortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frequency</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Annual Equivalent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No subscriptions found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-[var(--color-text)]">
                      <HighlightedText text={sub.name} query={searchQuery} />
                      {(() => {
                        const savings = savingsPotential(sub, new Date())
                        return savings !== null ? (
                          <span className="ml-2 text-xs text-red-600 font-medium">
                            Cancel & Save {formatCurrency(savings, sub.currency)}/yr
                          </span>
                        ) : null
                      })()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${categoryBadgeClass[sub.category]}`}>
                        {sub.category.charAt(0).toUpperCase() + sub.category.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-[var(--color-text)]">
                      {formatCurrency(sub.cost, sub.currency)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 capitalize">{sub.frequency}</td>
                    <td className="px-4 py-3 text-sm text-right text-[var(--color-text)]">
                      {formatCurrency(annualEquivalent(sub.cost, sub.frequency), sub.currency)}
                    </td>
                    <td className="px-4 py-3">
                      {sub.status === 'active' ? (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Active</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Cancelled</span>
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
                              className="text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 transition-colors"
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
