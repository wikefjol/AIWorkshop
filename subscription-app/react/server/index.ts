import express from 'express'
import cors from 'cors'
import { db } from './db/index.js'
import { subscriptions } from './db/schema.js'
import { seed } from './db/seed.js'
import { eq, and, type SQL } from 'drizzle-orm'
import type { Subscription, NewSubscription } from './db/schema.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const VALID_CATEGORIES: Subscription['category'][] = ['streaming', 'software', 'utilities', 'health', 'other']
const VALID_STATUSES: Subscription['status'][] = ['active', 'cancelled']
const VALID_FREQUENCIES: Subscription['frequency'][] = ['daily', 'weekly', 'monthly', 'yearly']
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isValidDate(s: string) {
  return ISO_DATE.test(s) && !isNaN(Date.parse(s))
}

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.get('/api/subscriptions', async (req, res) => {
  const { category, status } = req.query

  if (category && category !== 'all' && !VALID_CATEGORIES.includes(category as Subscription['category'])) {
    res.status(400).json({ success: false, error: `Invalid category: ${category}` })
    return
  }
  if (status && status !== 'all' && !VALID_STATUSES.includes(status as Subscription['status'])) {
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
  const { name, cost, startDate, nextBillingDate, currency, frequency, category, status } = req.body

  if (!name || typeof name !== 'string' || name.trim() === '') {
    res.status(400).json({ success: false, error: 'Name is required' })
    return
  }
  if (typeof cost !== 'number' || cost <= 0) {
    res.status(400).json({ success: false, error: 'Cost must be greater than 0' })
    return
  }
  if (!startDate || typeof startDate !== 'string' || !isValidDate(startDate)) {
    res.status(400).json({ success: false, error: 'startDate must be a valid date (YYYY-MM-DD)' })
    return
  }
  if (!nextBillingDate || typeof nextBillingDate !== 'string' || !isValidDate(nextBillingDate)) {
    res.status(400).json({ success: false, error: 'nextBillingDate must be a valid date (YYYY-MM-DD)' })
    return
  }
  if (currency !== undefined && (typeof currency !== 'string' || currency.trim() === '')) {
    res.status(400).json({ success: false, error: 'Currency must be a non-empty string' })
    return
  }
  if (frequency !== undefined && !VALID_FREQUENCIES.includes(frequency)) {
    res.status(400).json({ success: false, error: `Invalid frequency: ${frequency}` })
    return
  }
  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    res.status(400).json({ success: false, error: `Invalid category: ${category}` })
    return
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    res.status(400).json({ success: false, error: `Invalid status: ${status}` })
    return
  }

  try {
    const insertData: NewSubscription = {
      name: name.trim(), cost, startDate, nextBillingDate,
      ...(currency !== undefined && { currency }),
      ...(frequency !== undefined && { frequency }),
      ...(category !== undefined && { category }),
      ...(status !== undefined && { status }),
    }
    const [created] = await db.insert(subscriptions).values(insertData).returning()
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
  if (currency !== undefined && (typeof currency !== 'string' || currency.trim() === '')) {
    res.status(400).json({ success: false, error: 'Currency must be a non-empty string' })
    return
  }
  if (frequency !== undefined && !VALID_FREQUENCIES.includes(frequency)) {
    res.status(400).json({ success: false, error: `Invalid frequency: ${frequency}` })
    return
  }
  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    res.status(400).json({ success: false, error: `Invalid category: ${category}` })
    return
  }
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    res.status(400).json({ success: false, error: `Invalid status: ${status}` })
    return
  }
  if (startDate !== undefined && !isValidDate(startDate)) {
    res.status(400).json({ success: false, error: 'startDate must be a valid date (YYYY-MM-DD)' })
    return
  }
  if (nextBillingDate !== undefined && !isValidDate(nextBillingDate)) {
    res.status(400).json({ success: false, error: 'nextBillingDate must be a valid date (YYYY-MM-DD)' })
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

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ success: false, error: 'No valid fields to update' })
    return
  }

  try {
    const [updated] = await db.update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id))
      .returning()
    if (!updated) {
      res.status(404).json({ success: false, error: 'Subscription not found' })
      return
    }
    res.json({ success: true, data: updated })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/subscriptions/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [deleted] = await db.delete(subscriptions).where(eq(subscriptions.id, id)).returning()
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Subscription not found' })
      return
    }
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
