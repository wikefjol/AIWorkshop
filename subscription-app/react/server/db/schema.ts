import { sql } from 'drizzle-orm'
import { text, real, sqliteTable } from 'drizzle-orm/sqlite-core'

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  cost: real('cost').notNull(),
  currency: text('currency').default('USD'),
  frequency: text('frequency', {
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  }).notNull().default('monthly'),
  category: text('category', {
    enum: ['streaming', 'software', 'utilities', 'health', 'other']
  }).notNull().default('other'),
  status: text('status', {
    enum: ['active', 'cancelled']
  }).notNull().default('active'),
  startDate: text('start_date').notNull(),
  nextBillingDate: text('next_billing_date').notNull(),
})

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
