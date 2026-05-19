import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Settings, Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions', end: false },
  { to: '/settings', icon: Settings, label: 'Settings', end: false },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="relative min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed top-0 left-0 h-full w-[220px] bg-white border-r border-gray-200 flex flex-col z-30',
          'transition-transform duration-200',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0',
        ].join(' ')}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="font-bold text-lg text-gray-900">SubTrack</div>
          <div className="text-xs text-gray-500 mt-0.5">Subscription Audit Dashboard</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navLinks.map(({ to, icon: Icon, label, end }) => {
            const isActive = end
              ? location.pathname === to
              : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={[
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                  isActive
                    ? 'bg-indigo-50 text-[var(--color-primary)]'
                    : 'text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400">Phase 5 — Settings & Polish</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:ml-[220px] min-h-screen bg-[var(--color-background)]">
        {/* Mobile hamburger */}
        <button
          className="md:hidden fixed top-4 left-4 z-10 p-2 rounded-md bg-white border border-gray-200 shadow-sm cursor-pointer"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
