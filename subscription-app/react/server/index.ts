import express from 'express'
import cors from 'cors'
import { db } from './db/index.js'
import { subscriptions } from './db/schema.js'
import { seed } from './db/seed.js'
import { eq, and, like } from 'drizzle-orm'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/subscriptions', (req, res) => {
  const { category, status } = req.query

  let query = db.select().from(subscriptions)

  if (category && category !== 'all') {
    query = db.select().from(subscriptions).where(eq(subscriptions.category, category as string))
  }
  if (status && status !== 'all') {
    if (category && category !== 'all') {
      query = db.select().from(subscriptions).where(
        and(
          eq(subscriptions.category, category as string),
          eq(subscriptions.status, status as string)
        )
      )
    } else {
      query = db.select().from(subscriptions).where(eq(subscriptions.status, status as string))
    }
  }

  query.then((result) => {
    res.json(result)
  }).catch((err) => {
    res.status(500).json({ error: err.message })
  })
})

app.get('/api/subscriptions/:id', (req, res) => {
  const { id } = req.params

  db.select().from(subscriptions).where(eq(subscriptions.id, id)).then((result) => {
    if (result.length === 0) {
      res.status(404).json({ error: 'Subscription not found' })
    } else {
      res.json(result[0])
    }
  }).catch((err) => {
    res.status(500).json({ error: err.message })
  })
})

app.post('/api/subscriptions', (req, res) => {
  const data = req.body
  const { name, cost } = req.body
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' })
  }
  if (typeof cost !== 'number' || cost <= 0) {
    return res.status(400).json({ error: 'Cost must be greater than 0' })
  }

  db.insert(subscriptions).values(data).then((result) => {
    res.status(201).json(result)
  }).catch((err) => {
    res.status(500).json({ error: err.message })
  })
})

app.put('/api/subscriptions/:id', (req, res) => {
  const { id } = req.params
  const data = req.body
  const { name, cost } = req.body
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'Name cannot be empty' })
  }
  if (cost !== undefined && (typeof cost !== 'number' || cost <= 0)) {
    return res.status(400).json({ error: 'Cost must be greater than 0' })
  }

  db.update(subscriptions).set(data).where(eq(subscriptions.id, id)).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.status(500).json({ error: err.message })
  })
})

app.delete('/api/subscriptions/:id', (req, res) => {
  const { id } = req.params

  db.delete(subscriptions).where(eq(subscriptions.id, id)).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.status(500).json({ error: err.message })
  })
})

app.delete('/api/subscriptions', (_req, res) => {
  db.delete(subscriptions).then(() => {
    seed().then(() => {
      res.json({ message: 'Data reset and re-seeded' })
    })
  }).catch((err) => {
    res.status(500).json({ error: err.message })
  })
})

db.$count(subscriptions).then((count) => {
  if (count === 0) {
    seed()
  }
}).then(() => {
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`)
  })
}).catch((err) => {
  console.error('Failed to initialize database:', err)
  process.exit(1)
})
