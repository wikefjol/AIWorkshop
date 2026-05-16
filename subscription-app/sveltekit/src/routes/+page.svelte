<script lang="ts">
	import { onMount } from 'svelte';
	import { totalMonthly, totalAnnual, formatCurrency } from '$lib/utils';
	import type { Subscription } from '$lib/types';
	
	let subscriptions: Subscription[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const res = await fetch('/api/subscriptions');
			if (!res.ok) throw new Error('Failed to load subscriptions');
			subscriptions = await res.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'An error occurred';
		} finally {
			loading = false;
		}
	});

	const activeCount = subscriptions.filter(s => s.status === 'active').length;
	
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const next7 = new Date();
	next7.setDate(next7.getDate() + 7);

	const renewals: Subscription[] = subscriptions
		.filter(s => {
			if (s.status !== 'active') return false;
			const billingDate = new Date(s.nextBillingDate);
			return billingDate >= now && billingDate <= next7;
		})
		.sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
</script>

{#if loading}
	<div class="flex items-center justify-center h-64">
		<p class="text-gray-500">Loading...</p>
	</div>
{:else if error}
	<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
		{error}
	</div>
{/if}

<!-- Hero Stats -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<p class="text-sm font-medium text-gray-500">Total Monthly Cost</p>
		<p class="text-2xl font-bold mt-2 text-foreground">{formatCurrency(totalMonthly(subscriptions))}</p>
	</div>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<p class="text-sm font-medium text-gray-500">Total Annual Cost</p>
		<p class="text-2xl font-bold mt-2 text-foreground">{formatCurrency(totalAnnual(subscriptions))}</p>
	</div>
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<p class="text-sm font-medium text-gray-500">Active Count</p>
		<p class="text-2xl font-bold mt-2 text-foreground">{activeCount} active</p>
	</div>
</div>

<!-- Main Content Grid -->
<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
	<!-- Spending Breakdown -->
	<div class="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<h2 class="text-lg font-semibold mb-4 text-foreground">Spending by Category</h2>
		<p class="text-sm text-gray-500">Donut chart coming in Phase 3.</p>
		
		<!-- Category breakdown summary -->
		<div class="mt-6 space-y-2">
			{#each Object.entries(
				subscriptions.reduce<any>((acc, sub) => {
					if (sub.status !== 'active') return acc;
					const monthly = ((cost: number, freq: string) => {
						switch (freq) {
							case 'daily': return cost * 365 / 12;
							case 'weekly': return cost * 52 / 12;
							case 'monthly': return cost;
							case 'yearly': return cost / 12;
							default: return 0;
						};
					})(sub.cost, sub.frequency);
					acc[sub.category] = (acc[sub.category] || 0) + monthly;
					return acc;
				}, {})
			) as [category, amount]}
				<div class="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
					<span class="text-sm capitalize text-gray-700">{category}</span>
					<span class="text-sm font-medium text-foreground">{formatCurrency(amount)}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Upcoming Renewals -->
	<div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<h2 class="text-lg font-semibold mb-4 text-foreground">Upcoming Renewals</h2>
		{#if renewals.length === 0}
			<p class="text-sm text-gray-500">No subscriptions renewing in the next 7 days.</p>
		{:else}
			<ul class="space-y-3">
				{#each renewals as renewal}
					<li class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
						<div>
							<p class="font-medium text-sm text-foreground">{renewal.name}</p>
							<p class="text-xs text-gray-500">{formatCurrency(renewal.cost, renewal.currency)} · {renewal.frequency}</p>
						</div>
						<span class="text-xs font-medium text-primary">
							{new Date(renewal.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
