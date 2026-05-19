import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import type { Subscription } from '../types'
import { monthlyEquivalent } from '../utils'

interface DonutChartProps {
  subscriptions: Subscription[]
}

const COLORS: Record<string, string> = {
  streaming: '#6366f1',
  software: '#8b5cf6',
  utilities: '#f59e0b',
  health: '#10b981',
  other: '#6b7280',
}

export function DonutChart({ subscriptions }: DonutChartProps) {
  const active = subscriptions.filter((s) => s.status === 'active')

  const categoryTotals = active.reduce<Record<string, number>>((acc, sub) => {
    const monthly = monthlyEquivalent(sub.cost, sub.frequency)
    acc[sub.category] = (acc[sub.category] ?? 0) + monthly
    return acc
  }, {})

  const data = Object.entries(categoryTotals).map(([category, value]) => ({
    category,
    value,
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No spending data available
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex flex-col items-center">
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          cx={100}
          cy={100}
          innerRadius={60}
          outerRadius={90}
          dataKey="value"
          nameKey="category"
        >
          {data.map((entry) => (
            <Cell key={entry.category} fill={COLORS[entry.category] ?? '#6b7280'} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => {
            const num = typeof value === 'number' ? value : Number(value)
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num)
          }}
        />
      </PieChart>

      {/* Legend */}
      <div className="mt-4 w-full space-y-2">
        {data.map((entry) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0.0'
          return (
            <div key={entry.category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[entry.category] ?? '#6b7280' }}
                />
                <span className="capitalize text-gray-700">{entry.category}</span>
              </div>
              <span className="text-gray-500">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
