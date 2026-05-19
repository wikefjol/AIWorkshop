import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const subscriptions = sqliteTable('subscriptions', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	cost: integer('cost').notNull(),
	currency: text('currency').notNull().default('SEK'),
	frequency: text('frequency', {
		enum: ['daily', 'weekly', 'monthly', 'yearly']
	}).notNull(),
	category: text('category', {
		enum: ['streaming', 'software', 'utilities', 'health', 'other']
	}).notNull(),
	status: text('status', {
		enum: ['active', 'cancelled']
	}).notNull().default('active'),
	startDate: text('start_date').notNull(),
	nextBillingDate: text('next_billing_date').notNull(),
});
