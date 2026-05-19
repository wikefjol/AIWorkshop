import type { Subscription } from './types'
import { annualEquivalent } from './utils'

function escapeField(value: string): string {
  return value.includes(',') ? `"${value}"` : value
}

export function exportToCsv(rows: Subscription[], filename: string): void {
  const header = 'Name,Category,Cost,Frequency,Annual Equivalent,Status'
  const dataRows = rows.map((s) => {
    const annual = annualEquivalent(s.cost, s.frequency)
    return [
      escapeField(s.name),
      escapeField(s.category),
      String(s.cost),
      escapeField(s.frequency),
      String(parseFloat(annual.toFixed(2))),
      escapeField(s.status),
    ].join(',')
  })

  const csv = [header, ...dataRows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
