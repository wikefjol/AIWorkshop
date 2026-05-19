import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), "subscriptions.db");
const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
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
function toSubscription(row) {
  return {
    id: String(row.id),
    name: String(row.name),
    cost: Number(row.cost),
    currency: String(row.currency),
    frequency: row.frequency,
    category: row.category,
    status: row.status,
    startDate: String(row.start_date),
    nextBillingDate: String(row.next_billing_date)
  };
}
function getAll() {
  const rows = sqlite.prepare("SELECT * FROM subscriptions").all();
  return rows.map(toSubscription);
}
function getById(id) {
  const row = sqlite.prepare("SELECT * FROM subscriptions WHERE id = ?").get(id);
  return row ? toSubscription(row) : void 0;
}
function create(subscription) {
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
    nextBillingDate: subscription.nextBillingDate
  });
  return { ...subscription, id };
}
function update(id, updates) {
  const fields = [];
  const params = { id };
  if (updates.name !== void 0) {
    fields.push("name = @name");
    params.name = updates.name;
  }
  if (updates.cost !== void 0) {
    fields.push("cost = @cost");
    params.cost = updates.cost;
  }
  if (updates.currency !== void 0) {
    fields.push("currency = @currency");
    params.currency = updates.currency;
  }
  if (updates.frequency !== void 0) {
    fields.push("frequency = @frequency");
    params.frequency = updates.frequency;
  }
  if (updates.category !== void 0) {
    fields.push("category = @category");
    params.category = updates.category;
  }
  if (updates.status !== void 0) {
    fields.push("status = @status");
    params.status = updates.status;
  }
  if (updates.startDate !== void 0) {
    fields.push("start_date = @startDate");
    params.startDate = updates.startDate;
  }
  if (updates.nextBillingDate !== void 0) {
    fields.push("next_billing_date = @nextBillingDate");
    params.nextBillingDate = updates.nextBillingDate;
  }
  if (fields.length === 0) return null;
  sqlite.prepare(`UPDATE subscriptions SET ${fields.join(", ")} WHERE id = @id`).run(params);
  return getById(id) || null;
}
function remove(id) {
  const result = sqlite.prepare("DELETE FROM subscriptions WHERE id = ?").run(id);
  return result.changes > 0;
}
function getSqlite() {
  return sqlite;
}

export { getSqlite as a, create as c, getAll as g, remove as r, update as u };
//# sourceMappingURL=index-_VfsPKlx.js.map
