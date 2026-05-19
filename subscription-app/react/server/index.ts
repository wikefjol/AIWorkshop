import express from 'express'
import cors from 'cors'
import { db } from './db/index.js'
import { subscriptions } from './db/schema.js'
import { seed } from './db/seed.js'
import { eq, and, type SQL } from 'drizzle-orm'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.get('/api/subscriptions', async (req, res) => {
  const { category, status } = req.query

  const conditions: SQL[] = []
  if (category && category !== 'all') conditions.push(eq(subscriptions.category, category as string))
  if (status && status !== 'all') conditions.push(eq(subscriptions.status, status as string))

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
  const data = req.body

  try {
    const result = await db.insert(subscriptions).values(data)
    res.status(201).json({ success: true, data: result })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.put('/api/subscriptions/:id', async (req, res) => {
  const { id } = req.params
  const data = req.body

  try {
    const result = await db.update(subscriptions).set(data).where(eq(subscriptions.id, id))
    res.json({ success: true, data: result })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/subscriptions/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await db.delete(subscriptions).where(eq(subscriptions.id, id))
    res.json({ success: true, data: result })
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
