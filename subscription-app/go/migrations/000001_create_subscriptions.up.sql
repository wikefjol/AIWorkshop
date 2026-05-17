CREATE TABLE IF NOT EXISTS subscriptions (
    id                TEXT PRIMARY KEY,
    name              TEXT NOT NULL,
    cost              REAL NOT NULL,
    currency          TEXT NOT NULL DEFAULT 'USD',
    frequency         TEXT NOT NULL CHECK(frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    category          TEXT NOT NULL CHECK(category IN ('streaming', 'software', 'utilities', 'health', 'other')),
    status            TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'cancelled')),
    startDate         DATE NOT NULL,
    nextBillingDate   DATE NOT NULL,
    createdAt         DATETIME DEFAULT (datetime('now')),
    updatedAt         DATETIME DEFAULT (datetime('now'))
);
