import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Settings } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/subscriptions', label: 'Subscriptions', icon: CreditCard, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
]

export function Layout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-gray-200 flex flex-col"
        style={{ zIndex: 10 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-lg font-bold text-[var(--color-primary)]">SubTrack</h1>
          <p className="text-xs text-gray-500 mt-1 leading-tight">Subscription Audit Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => {
            const isActive = end
              ? location.pathname === to
              : location.pathname.startsWith(to)

            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={[
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-[var(--color-primary)]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                ].join(' ')}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-[220px] min-h-screen p-8 bg-[var(--color-background)] flex-1">
        <Outlet />
      </main>
    </div>
  )
}
