import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as db from '$lib/db';
import type { Subscription } from '$lib/types';

export const GET: RequestHandler = async ({ url }) => {
	const filterCategory = url.searchParams.get('category');
	const filterStatus = url.searchParams.get('status');

	let data = db.getAll();
	if (filterCategory) data = data.filter(s => s.category === filterCategory);
	if (filterStatus) data = data.filter(s => s.status === filterStatus);

	return json({ success: true, data });
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json() as Omit<Subscription, 'id'>;
		const { name, cost } = body;

		if (!name || (typeof cost !== 'number') || cost <= 0) {
			return json({ success: false, error: 'Missing required fields: name, cost (>0)' }, { status: 400 });
		}

		const [category, frequency, startDate, nextBillingDate] = [
			body.category as Subscription['category'],
			body.frequency as Subscription['frequency'],
			body.startDate,
			body.nextBillingDate
		];

		if (!category || !frequency || !startDate || !nextBillingDate) {
			return json({ success: false, error: 'Missing required fields: category, frequency, startDate, nextBillingDate' }, { status: 400 });
		}

		const created = db.create(body as Omit<Subscription, 'id'>);
		return json({ success: true, data: created });
	} catch (e) {
		return json({ success: false, error: e instanceof Error ? e.message : 'Failed to create subscription' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, params }) => {
	try {
		const body = await request.json() as Partial<Subscription>;
		const [cost] = [body.cost];

		if (typeof cost === 'number' && cost <= 0) {
			return json({ success: false, error: 'Cost must be greater than 0' }, { status: 400 });
		}

		const updated = db.update(params.id, body);
		if (!updated) {
			return json({ success: false, error: 'Subscription not found' }, { status: 404 });
		}

		return json({ success: true, data: updated });
	} catch (e) {
		return json({ success: false, error: e instanceof Error ? e.message : 'Failed to update subscription' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const deleted = db.remove(params.id);
	if (!deleted) {
		return json({ success: false, error: 'Subscription not found' }, { status: 404 });
	}
	return json({ success: true });
};
