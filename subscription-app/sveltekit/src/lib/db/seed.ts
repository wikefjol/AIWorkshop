import * as db from '$lib/db';
import type { Subscription } from '$lib/types';

export const subscriptions: Subscription[] = [
	{
		id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		name: 'Netflix',
		cost: 15.99,
		currency: 'USD',
		frequency: 'monthly',
		category: 'streaming',
		status: 'active',
		startDate: '2024-01-15',
		nextBillingDate: '2026-06-15'
	},
	{
		id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
		name: 'Spotify',
		cost: 9.99,
		currency: 'USD',
		frequency: 'monthly',
		category: 'streaming',
		status: 'active',
		startDate: '2024-03-01',
		nextBillingDate: '2026-06-01'
	},
	{
		id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
		name: 'GitHub Pro',
		cost: 4.0,
		currency: 'USD',
		frequency: 'monthly',
		category: 'software',
		status: 'active',
		startDate: '2024-06-10',
		nextBillingDate: '2026-06-10'
	},
	{
		id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
		name: 'Adobe Creative Cloud',
		cost: 54.99,
		currency: 'USD',
		frequency: 'yearly',
		category: 'software',
		status: 'active',
		startDate: '2025-02-20',
		nextBillingDate: '2026-02-20'
	},
	{
		id: 'e5f6a7b8-c9d0-1234-efab-345678901234',
		name: 'Gym Membership',
		cost: 30.0,
		currency: 'USD',
		frequency: 'monthly',
		category: 'health',
		status: 'active',
		startDate: '2025-08-01',
		nextBillingDate: '2026-06-01'
	}
];

const insertStmt = db.getSqlite().prepare(`
  INSERT OR IGNORE INTO subscriptions (id, name, cost, currency, frequency, category, status, start_date, next_billing_date)
  VALUES (@id, @name, @cost, @currency, @frequency, @category, @status, @startDate, @nextBillingDate)
`);

export function seed() {
	const count = db.getSqlite().prepare('SELECT COUNT(*) as c FROM subscriptions').get() as { c: number };
	if (count.c === 0) {
		subscriptions.forEach(s => insertStmt.run(s));
		console.log('Database seeded with sample data.');
	}
}
