import Database from 'better-sqlite3';
import path from 'path';
import type { Subscription } from '../types';

const DB_PATH = path.join(process.cwd(), 'subscriptions.db');
const sqlite = new Database(DB_PATH);
sqlite.pragma('journal_mode = WAL');

// Create table if not exists
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cost REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'SEK',
    frequency TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    start_date TEXT NOT NULL,
    next_billing_date TEXT NOT NULL
  )
`);

function toSubscription(row: Record<string, unknown>): Subscription {
  return {
    id: String(row.id),
    name: String(row.name),
    cost: Number(row.cost),
    currency: String(row.currency),
    frequency: row.frequency as Subscription['frequency'],
    category: row.category as Subscription['category'],
    status: row.status as Subscription['status'],
    startDate: String(row.start_date),
    nextBillingDate: String(row.next_billing_date),
  };
}

export function getAll(): Subscription[] {
  const rows = sqlite
    .prepare('SELECT * FROM subscriptions')
    .all() as Record<string, unknown>[];
  return rows.map(toSubscription);
}

export function getById(id: string): Subscription | undefined {
  const row = sqlite
    .prepare('SELECT * FROM subscriptions WHERE id = ?')
    .get(id) as Record<string, unknown> | undefined;
  return row ? toSubscription(row) : undefined;
}

export function create(subscription: Omit<Subscription, 'id'>): Subscription {
  const id = crypto.randomUUID();
  sqlite.prepare(`
    INSERT INTO subscriptions (id, name, cost, currency, frequency, category, status, start_date, next_billing_date)
    VALUES (@id, @name, @cost, @currency, @frequency, @category, @status, @startDate, @nextBillingDate)
  `).run({
    id,
    name: subscription.name,
    cost: subscription.cost,
    currency: subscription.currency,
    frequency: subscription.frequency,
    category: subscription.category,
    status: subscription.status,
    startDate: subscription.startDate,
    nextBillingDate: subscription.nextBillingDate,
  });
  return { ...subscription, id };
}

export function update(id: string, updates: Partial<Subscription>): Subscription | null {
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  if (updates.name !== undefined) { fields.push('name = @name'); params.name = updates.name; }
  if (updates.cost !== undefined) { fields.push('cost = @cost'); params.cost = updates.cost; }
  if (updates.currency !== undefined) { fields.push('currency = @currency'); params.currency = updates.currency; }
  if (updates.frequency !== undefined) { fields.push('frequency = @frequency'); params.frequency = updates.frequency; }
  if (updates.category !== undefined) { fields.push('category = @category'); params.category = updates.category; }
  if (updates.status !== undefined) { fields.push('status = @status'); params.status = updates.status; }
  if (updates.startDate !== undefined) { fields.push('start_date = @startDate'); params.startDate = updates.startDate; }
  if (updates.nextBillingDate !== undefined) { fields.push('next_billing_date = @nextBillingDate'); params.nextBillingDate = updates.nextBillingDate; }

  if (fields.length === 0) return null;

  sqlite.prepare(`UPDATE subscriptions SET ${fields.join(', ')} WHERE id = @id`).run(params);
  return getById(id) || null;
}

export function remove(id: string): boolean {
  const result = sqlite.prepare('DELETE FROM subscriptions WHERE id = ?').run(id);
  return result.changes > 0;
}

export function getSqlite() {
  return sqlite;
}
