import type { Subscription } from './types'
import type { SubscriptionInput, UpdateSubscriptionInput } from './schema'

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json()
  if (!response.ok || !json.success) {
    throw new Error(json.error ?? 'Request failed')
  }
  return json.data as T
}

export async function listSubscriptions(params?: { category?: string; status?: string }): Promise<Subscription[]> {
  const url = new URL(`${BASE_URL}/api/subscriptions`)
  if (params?.category) url.searchParams.set('category', params.category)
  if (params?.status) url.searchParams.set('status', params.status)
  const response = await fetch(url.toString())
  return handleResponse<Subscription[]>(response)
}

export async function getSubscription(id: string): Promise<Subscription> {
  const response = await fetch(`${BASE_URL}/api/subscriptions/${id}`)
  return handleResponse<Subscription>(response)
}

export async function createSubscription(data: SubscriptionInput): Promise<Subscription> {
  const response = await fetch(`${BASE_URL}/api/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<Subscription>(response)
}

export async function updateSubscription(id: string, data: UpdateSubscriptionInput): Promise<Subscription> {
  const response = await fetch(`${BASE_URL}/api/subscriptions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<Subscription>(response)
}

export async function deleteSubscription(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/subscriptions/${id}`, {
    method: 'DELETE',
  })
  await handleResponse<void>(response)
}

export async function resetSubscriptions(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/subscriptions`, {
    method: 'DELETE',
  })
  await handleResponse<void>(response)
}
