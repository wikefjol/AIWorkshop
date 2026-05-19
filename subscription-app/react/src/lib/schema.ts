import { z } from 'zod'

export const FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'] as const
export const CATEGORIES = ['streaming', 'software', 'utilities', 'health', 'other'] as const
export const STATUSES = ['active', 'cancelled'] as const

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => !isNaN(Date.parse(s)), { message: 'Invalid date' })

export const SubscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required').transform(s => s.trim()).refine(s => s.length > 0, 'Name is required'),
  cost: z.number().positive('Cost must be greater than 0'),
  currency: z.string().min(1, 'Currency is required').default('USD'),
  frequency: z.enum(FREQUENCIES).default('monthly'),
  category: z.enum(CATEGORIES).default('other'),
  status: z.enum(STATUSES).default('active'),
  startDate: isoDate,
  nextBillingDate: isoDate,
})

export const UpdateSubscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required').transform(s => s.trim()).refine(s => s.length > 0, 'Name is required').optional(),
  cost: z.number().positive('Cost must be greater than 0').optional(),
  currency: z.string().min(1, 'Currency is required').optional(),
  frequency: z.enum(FREQUENCIES).optional(),
  category: z.enum(CATEGORIES).optional(),
  status: z.enum(STATUSES).optional(),
  startDate: isoDate.optional(),
  nextBillingDate: isoDate.optional(),
}).refine(
  data => Object.keys(data).length > 0,
  { message: 'No valid fields to update' }
)

export type SubscriptionInput = z.infer<typeof SubscriptionSchema>
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>
