import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listSubscriptions, resetSubscriptions } from '../lib/api'

export default function Settings() {
  const navigate = useNavigate()
  const [subCount, setSubCount] = useState<number | null>(null)
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    listSubscriptions()
      .then((data) => setSubCount(data.length))
      .catch(() => setSubCount(null))
  }, [])

  async function handleReset() {
    setResetting(true)
    setMessage(null)
    try {
      await resetSubscriptions()
      setMessage({ type: 'success', text: 'Data reset successfully! Refreshing...' })
      setTimeout(() => navigate('/'), 1000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message ?? 'An error occurred' })
      setResetting(false)
    }
  }

  const cardClass = 'bg-white dark:bg-gray-800 rounded-[8px] shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6'
  const headingClass = 'text-base font-semibold text-gray-900 dark:text-gray-100 mb-4'
  const dtClass = 'text-gray-500 dark:text-gray-400'
  const ddClass = 'font-medium text-gray-900 dark:text-gray-100'

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>

      {/* Card 1 — About */}
      <div className={cardClass}>
        <h2 className={headingClass}>About</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className={dtClass}>App name</dt>
            <dd className={ddClass}>SubTrack</dd>
          </div>
          <div className="flex justify-between">
            <dt className={dtClass}>Description</dt>
            <dd className={ddClass}>Phase 5 — Settings & Polish</dd>
          </div>
          <div className="flex justify-between">
            <dt className={dtClass}>Framework</dt>
            <dd className={ddClass}>React 19 + Vite</dd>
          </div>
          <div className="flex justify-between">
            <dt className={dtClass}>Styling</dt>
            <dd className={ddClass}>Tailwind CSS 4</dd>
          </div>
          <div className="flex justify-between">
            <dt className={dtClass}>Language</dt>
            <dd className={ddClass}>TypeScript</dd>
          </div>
        </dl>
      </div>

      {/* Card 2 — Database Info */}
      <div className={cardClass}>
        <h2 className={headingClass}>Database Info</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className={dtClass}>Backend</dt>
            <dd className={ddClass}>SQLite</dd>
          </div>
          <div className="flex justify-between">
            <dt className={dtClass}>Total subscriptions</dt>
            <dd className={ddClass}>{subCount === null ? '—' : subCount}</dd>
          </div>
        </dl>
      </div>

      {/* Card 3 — Danger Zone */}
      <div className={cardClass}>
        <h2 className="text-base font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          This will delete all subscriptions and re-seed with default data.
        </p>

        {message && (
          <div
            className={[
              'mb-4 px-4 py-3 rounded-md text-sm font-medium',
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200',
            ].join(' ')}
          >
            {message.text}
          </div>
        )}

        <button
          onClick={handleReset}
          disabled={resetting}
          className="bg-[var(--color-danger)] text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {resetting ? 'Resetting...' : 'Reset Data'}
        </button>
      </div>
    </div>
  )
}
