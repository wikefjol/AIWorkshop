export function generateId(): string {
	return crypto.randomUUID();
}

export function annualEquivalent(cost: number, frequency: string): number {
	switch (frequency) {
		case 'daily': return cost * 365;
		case 'weekly': return cost * 52;
		case 'monthly': return cost * 12;
		case 'yearly': return cost * 1;
		default: return cost;
	}
}

export function monthlyEquivalent(cost: number, frequency: string): number {
	switch (frequency) {
		case 'daily': return cost * 365 / 12;
		case 'weekly': return cost * 52 / 12;
		case 'monthly': return cost * 1;
		case 'yearly': return cost / 12;
		default: return cost;
	}
}

export function totalMonthly(subscriptions: Array<{ cost: number; frequency: string; status: string }>): number {
	return subscriptions
		.filter(s => s.status === 'active')
		.reduce((sum, s) => sum + monthlyEquivalent(s.cost, s.frequency), 0);
}

export function totalAnnual(subscriptions: Array<{ cost: number; frequency: string; status: string }>): number {
	return subscriptions
		.filter(s => s.status === 'active')
		.reduce((sum, s) => sum + annualEquivalent(s.cost, s.frequency), 0);
}

export function formatCurrency(amount: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}
