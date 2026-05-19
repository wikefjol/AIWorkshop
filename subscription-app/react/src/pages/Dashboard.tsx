import { DollarSign, TrendingUp, Activity } from 'lucide-react'
import { useSubscriptions } from '../lib/hooks/useSubscriptions'
import { StatCard } from '../lib/components/StatCard'
import { DonutChart } from '../lib/components/DonutChart'
import { RenewalList } from '../lib/components/RenewalList'
import { totalMonthly, totalAnnual, formatCurrency } from '../lib/utils'

export default function Dashboard() {
  const { data, loading, error } = useSubscriptions()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--color-danger)]">
        Error: {error}
      </div>
    )
  }

  const activeCount = data.filter((s) => s.status === 'active').length
  const monthly = totalMonthly(data)
  const annual = totalAnnual(data)

  return (
    <div>
      <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">Dashboard</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Monthly Cost"
          value={formatCurrency(monthly)}
          icon={<DollarSign size={20} />}
        />
        <StatCard
          title="Total Annual Cost"
          value={formatCurrency(annual)}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Active Subscriptions"
          value={`${activeCount} active`}
          icon={<Activity size={20} />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-[8px] shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Spending by Category</h3>
          <DonutChart subscriptions={data} />
        </div>

        <div className="col-span-2 bg-white rounded-[8px] shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Renewals</h3>
          <RenewalList subscriptions={data} />
        </div>
      </div>
    </div>
  )
}
