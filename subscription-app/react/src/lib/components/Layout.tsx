import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Settings } from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/subscriptions', label: 'Subscriptions', icon: <CreditCard size={18} /> },
  { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
]

export default function Layout() {
  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-[220px] bg-white border-r border-gray-200 flex flex-col z-10">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-bold text-lg text-[var(--color-text)]">SubTrack</h1>
          <p className="text-xs text-gray-500 mt-1">Subscription Audit Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-[var(--color-primary)]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[var(--color-text)]'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-[220px] min-h-screen p-8 bg-[var(--color-background)]">
        <Outlet />
      </main>
    </div>
  )
}
