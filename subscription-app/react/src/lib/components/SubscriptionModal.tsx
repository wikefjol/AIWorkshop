import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Subscription } from '../types'

interface SubscriptionModalProps {
  open: boolean
  onClose: () => void
  subscription?: Subscription | null
  onSaved: () => void
}

interface FormData {
  name: string
  cost: string
  currency: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  category: 'streaming' | 'software' | 'utilities' | 'health' | 'other'
  status: 'active' | 'cancelled'
  startDate: string
  nextBillingDate: string
}

interface FormErrors {
  name?: string
  cost?: string
}

const defaultForm: FormData = {
  name: '',
  cost: '',
  currency: 'USD',
  frequency: 'monthly',
  category: 'other',
  status: 'active',
  startDate: '',
  nextBillingDate: '',
}

export default function SubscriptionModal({
  open,
  onClose,
  subscription,
  onSaved,
}: SubscriptionModalProps) {
  const [form, setForm] = useState<FormData>(defaultForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const isEdit = Boolean(subscription)

  useEffect(() => {
    if (open) {
      if (subscription) {
        setForm({
          name: subscription.name,
          cost: String(subscription.cost),
          currency: subscription.currency,
          frequency: subscription.frequency,
          category: subscription.category,
          status: subscription.status,
          startDate: subscription.startDate,
          nextBillingDate: subscription.nextBillingDate,
        })
      } else {
        setForm(defaultForm)
      }
      setErrors({})
      setSaveError(null)
    }
  }, [open, subscription])

  if (!open) return null

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }
    const costNum = parseFloat(form.cost)
    if (!form.cost || isNaN(costNum) || costNum <= 0) {
      newErrors.cost = 'Cost must be greater than 0'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSaveError(null)
    try {
      const payload = {
        name: form.name.trim(),
        cost: parseFloat(form.cost),
        currency: form.currency,
        frequency: form.frequency,
        category: form.category,
        status: form.status,
        startDate: form.startDate,
        nextBillingDate: form.nextBillingDate,
      }

      const url = isEdit
        ? `http://localhost:3001/api/subscriptions/${subscription!.id}`
        : 'http://localhost:3001/api/subscriptions'

      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body: { success: boolean; error?: string } = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to save subscription')
      }

      onSaved()
      onClose()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save subscription')
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            {isEdit ? 'Edit Subscription' : 'Add Subscription'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="e.g. Netflix"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Cost + Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                  errors.cost ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.cost && (
                <p className="text-xs text-red-500 mt-1">{errors.cost}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="USD"
                maxLength={3}
              />
            </div>
          </div>

          {/* Frequency + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="streaming">Streaming</option>
                <option value="software">Software</option>
                <option value="utilities">Utilities</option>
                <option value="health">Health</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Start Date + Next Billing Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Billing Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="nextBillingDate"
                value={form.nextBillingDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>
          </div>

          {/* Save error */}
          {saveError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {saveError}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
