import * as fs from 'fs';
import path from 'path';
import type { Subscription } from '../types';

const DB_PATH = path.join(process.cwd(), 'subscriptions.json');

export function getAll(): Subscription[] {
	if (!fs.existsSync(DB_PATH)) return [];
	const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
	return Array.isArray(data) ? data : [];
}

export function getById(id: string): Subscription | undefined {
	const all = getAll();
	return all.find(s => s.id === id);
}

export function create(subscription: Omit<Subscription, 'id'>): Subscription {
	const all = getAll();
	const newSub = { ...subscription, id: crypto.randomUUID() } as Subscription;
	all.push(newSub);
	save(all);
	return newSub;
}

export function update(id: string, updates: Partial<Subscription>): Subscription | null {
	const all = getAll();
	const idx = all.findIndex(s => s.id === id);
	if (idx === -1) return null;
	all[idx] = { ...all[idx], ...updates } as Subscription;
	save(all);
	return all[idx];
}

export function remove(id: string): boolean {
	const all = getAll();
	const idx = all.findIndex(s => s.id === id);
	if (idx === -1) return false;
	all.splice(idx, 1);
	save(all);
	return true;
}

function save(data: Subscription[]) {
	fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
