import express from 'express'
import cors from 'cors'
import { db } from './db/index.js'
import { subscriptions } from './db/schema.js'
import { seed } from './db/seed.js'
import { eq, and, type SQL } from 'drizzle-orm'
import type { Subscription } from './db/schema.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.get('/api/subscriptions', async (req, res) => {
  const { category, status } = req.query

  const validCategories: Subscription['category'][] = ['streaming', 'software', 'utilities', 'health', 'other']
  const validStatuses: Subscription['status'][] = ['active', 'cancelled']

  if (category && category !== 'all' && !validCategories.includes(category as Subscription['category'])) {
    res.status(400).json({ success: false, error: `Invalid category: ${category}` })
    return
  }
  if (status && status !== 'all' && !validStatuses.includes(status as Subscription['status'])) {
    res.status(400).json({ success: false, error: `Invalid status: ${status}` })
    return
  }

  const conditions: SQL[] = []
  if (category && category !== 'all') conditions.push(eq(subscriptions.category, category as Subscription['category']))
  if (status && status !== 'all') conditions.push(eq(subscriptions.status, status as Subscription['status']))

  const query = conditions.length > 0
    ? db.select().from(subscriptions).where(and(...conditions))
    : db.select().from(subscriptions)

  try {
    const result = await query
    res.json({ success: true, data: result })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/subscriptions/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id))
    if (result.length === 0) {
      res.status(404).json({ success: false, error: 'Subscription not found' })
    } else {
      res.json({ success: true, data: result[0] })
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/subscriptions', async (req, res) => {
  const { name, cost, startDate, nextBillingDate, ...rest } = req.body
  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ success: false, error: 'Name is required' })
    return
  }
  if (typeof cost !== 'number' || cost <= 0) {
    res.status(400).json({ success: false, error: 'Cost must be greater than 0' })
    return
  }
  if (!startDate || typeof startDate !== 'string') {
    res.status(400).json({ success: false, error: 'startDate is required' })
    return
  }
  if (!nextBillingDate || typeof nextBillingDate !== 'string') {
    res.status(400).json({ success: false, error: 'nextBillingDate is required' })
    return
  }

  try {
    const [created] = await db.insert(subscriptions).values({ name: name.trim(), cost, startDate, nextBillingDate, ...rest }).returning()
    res.status(201).json({ success: true, data: created })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.put('/api/subscriptions/:id', async (req, res) => {
  const { id } = req.params
  const { name, cost, currency, frequency, category, status, startDate, nextBillingDate } = req.body
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    res.status(400).json({ success: false, error: 'Name cannot be empty' })
    return
  }
  if (cost !== undefined && (typeof cost !== 'number' || cost <= 0)) {
    res.status(400).json({ success: false, error: 'Cost must be greater than 0' })
    return
  }

  try {
    const existing = await db.select().from(subscriptions).where(eq(subscriptions.id, id))
    if (existing.length === 0) {
      res.status(404).json({ success: false, error: 'Subscription not found' })
      return
    }

    const updateData: Partial<Subscription> = {}
    if (name !== undefined) updateData.name = name.trim()
    if (cost !== undefined) updateData.cost = cost
    if (currency !== undefined) updateData.currency = currency
    if (frequency !== undefined) updateData.frequency = frequency
    if (category !== undefined) updateData.category = category
    if (status !== undefined) updateData.status = status
    if (startDate !== undefined) updateData.startDate = startDate
    if (nextBillingDate !== undefined) updateData.nextBillingDate = nextBillingDate

    const result = await db.update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id))
      .returning()
    res.json({ success: true, data: result[0] })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/subscriptions/:id', async (req, res) => {
  const { id } = req.params

  try {
    const existing = await db.select().from(subscriptions).where(eq(subscriptions.id, id))
    if (existing.length === 0) {
      res.status(404).json({ success: false, error: 'Subscription not found' })
      return
    }

    await db.delete(subscriptions).where(eq(subscriptions.id, id))
    res.json({ success: true, data: { id } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/subscriptions', async (_req, res) => {
  try {
    await db.delete(subscriptions)
    await seed()
    res.json({ success: true, data: { message: 'Data reset and re-seeded' } })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

try {
  const count = await db.$count(subscriptions)
  if (count === 0) {
    await seed()
  }
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`)
  })
} catch (err) {
  console.error('Failed to initialize database:', err)
  process.exit(1)
}
