import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '..', '..', 'subscriptions.db')

const sqlite = new Database(dbPath)

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(2))) || '-' || lower(hex(randomblob(6)))),
    name TEXT NOT NULL,
    cost REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    frequency TEXT NOT NULL DEFAULT 'monthly' CHECK(frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    category TEXT NOT NULL DEFAULT 'other' CHECK(category IN ('streaming', 'software', 'utilities', 'health', 'other')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'cancelled')),
    start_date TEXT NOT NULL,
    next_billing_date TEXT NOT NULL
  )
`)

const db = drizzle(sqlite, { schema })

export { db, sqlite }
