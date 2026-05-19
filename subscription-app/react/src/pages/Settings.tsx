import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001'

export default function Settings() {
  const navigate = useNavigate()
  const [subCount, setSubCount] = useState<number | null>(null)
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetch(`${API}/api/subscriptions`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setSubCount(data.data.length)
        }
      })
      .catch(() => setSubCount(null))
  }, [])

  async function handleReset() {
    setResetting(true)
    setMessage(null)
    try {
      const res = await fetch(`${API}/api/subscriptions`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Reset failed')
      }
      setMessage({ type: 'success', text: 'Data reset successfully! Refreshing...' })
      setTimeout(() => navigate('/'), 1000)
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message ?? 'An error occurred' })
      setResetting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Card 1 — About */}
      <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">About</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">App name</dt>
            <dd className="font-medium text-gray-900">SubTrack</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Description</dt>
            <dd className="font-medium text-gray-900">Phase 5 — Settings & Polish</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Framework</dt>
            <dd className="font-medium text-gray-900">React 19 + Vite</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Styling</dt>
            <dd className="font-medium text-gray-900">Tailwind CSS 4</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Language</dt>
            <dd className="font-medium text-gray-900">TypeScript</dd>
          </div>
        </dl>
      </div>

      {/* Card 2 — Database Info */}
      <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Database Info</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Backend</dt>
            <dd className="font-medium text-gray-900">SQLite</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Total subscriptions</dt>
            <dd className="font-medium text-gray-900">
              {subCount === null ? '—' : subCount}
            </dd>
          </div>
        </dl>
      </div>

      {/* Card 3 — Danger Zone */}
      <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
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
