import express from 'express'
import cors from 'cors'
import { db } from './db/index.js'
import { subscriptions } from './db/schema.js'
import { seed } from './db/seed.js'
import { eq, and, type SQL } from 'drizzle-orm'
import type { Subscription } from './db/schema.js'
import { SubscriptionSchema, UpdateSubscriptionSchema, CATEGORIES, STATUSES } from '../src/lib/schema.js'
import { addClient, broadcast } from './broadcaster.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.write(': connected\n\n')
  addClient(res, req)
})

app.get('/api/subscriptions', async (req, res) => {
  const { category, status } = req.query

  if (category && category !== 'all' && !CATEGORIES.includes(category as Subscription['category'])) {
    res.status(400).json({ success: false, error: `Invalid category: ${category}` })
    return
  }
  if (status && status !== 'all' && !STATUSES.includes(status as Subscription['status'])) {
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
  const result = SubscriptionSchema.safeParse(req.body)
  if (!result.success) {
    const firstError = result.error.issues[0]
    res.status(400).json({ success: false, error: firstError.message })
    return
  }
  const { name, cost, currency, frequency, category, status, startDate, nextBillingDate } = result.data

  try {
    const [created] = await db.insert(subscriptions).values({
      name, cost, currency, frequency, category, status, startDate, nextBillingDate,
    }).returning()
    broadcast('subscription:created', JSON.stringify({ id: created.id }))
    res.status(201).json({ success: true, data: created })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.put('/api/subscriptions/:id', async (req, res) => {
  const { id } = req.params
  const result = UpdateSubscriptionSchema.safeParse(req.body)
  if (!result.success) {
    const firstError = result.error.issues[0]
    res.status(400).json({ success: false, error: firstError.message })
    return
  }
  const updateData = result.data

  try {
    const [updated] = await db.update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id))
      .returning()
    if (!updated) {
      res.status(404).json({ success: false, error: 'Subscription not found' })
      return
    }
    broadcast('subscription:updated', JSON.stringify({ id: updated.id }))
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
    broadcast('subscription:deleted', JSON.stringify({ id: deleted.id }))
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
