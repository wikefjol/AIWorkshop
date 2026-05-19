import type { Handle } from '@sveltejs/kit';
import { seed } from '$lib/db/seed';

export const handle: Handle = async ({ event, resolve }) => {
	seed();
	return resolve(event);
};
