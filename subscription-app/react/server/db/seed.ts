import { db } from './index.js'
import { subscriptions } from './schema.js'
import type { NewSubscription } from './schema.js'

const seedData: NewSubscription[] = [
  {
    name: 'Netflix',
    cost: 15.99,
    currency: 'SEK',
    frequency: 'monthly',
    category: 'streaming',
    status: 'active',
    startDate: '2024-01-15',
    nextBillingDate: '2026-06-15',
  },
  {
    name: 'Spotify',
    cost: 9.99,
    currency: 'SEK',
    frequency: 'monthly',
    category: 'streaming',
    status: 'active',
    startDate: '2024-03-01',
    nextBillingDate: '2026-06-01',
  },
  {
    name: 'GitHub Pro',
    cost: 4.00,
    currency: 'SEK',
    frequency: 'monthly',
    category: 'software',
    status: 'active',
    startDate: '2024-06-10',
    nextBillingDate: '2026-06-10',
  },
  {
    name: 'Adobe Creative Cloud',
    cost: 54.99,
    currency: 'SEK',
    frequency: 'yearly',
    category: 'software',
    status: 'active',
    startDate: '2025-02-20',
    nextBillingDate: '2026-02-20',
  },
  {
    name: 'Gym Membership',
    cost: 30.00,
    currency: 'SEK',
    frequency: 'monthly',
    category: 'health',
    status: 'active',
    startDate: '2025-08-01',
    nextBillingDate: '2026-06-01',
  },
]

export async function seed() {
  const count = await db.$count(subscriptions)
  if (count === 0) {
    await db.insert(subscriptions).values(seedData)
    console.log(`Seeded ${seedData.length} subscriptions`)
  } else {
    console.log(`Database already has ${count} subscriptions, skipping seed`)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().then(() => process.exit(0))
}
