<script lang="ts">
	import { onMount } from 'svelte';
	import { annualEquivalent, formatCurrency } from '$lib/utils';
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

	function getCategoryColor(category: string): string {
		const colors: Record<string, string> = {
			streaming: 'bg-blue-50 text-blue-700',
			software: 'bg-purple-50 text-purple-700',
			utilities: 'bg-yellow-50 text-yellow-700',
			health: 'bg-green-50 text-green-700',
			other: 'bg-gray-50 text-gray-700'
		};
		return colors[category] || 'bg-gray-50 text-gray-700';
	}
</script>

<div class="max-w-6xl">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold text-foreground">Subscriptions</h1>
		<p class="text-sm text-gray-500">{subscriptions.length} total</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center h-64">
			<p class="text-gray-500">Loading...</p>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
			{error}
		</div>
	{/if}

	<!-- Data Table -->
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
		<table class="w-full">
			<thead>
				<tr class="border-b border-gray-100 bg-gray-50">
					<th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
					<th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
					<th class="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
					<th class="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Eqv.</th>
					<th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
					<th class="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
				</tr>
			</thead>
			<tbody>
				{#each subscriptions as subscription}
					<tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
						<td class="px-4 py-3 text-sm font-medium text-foreground">{subscription.name}</td>
						<td class="px-4 py-3">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getCategoryColor(subscription.category)} capitalize">
								{subscription.category}
							</span>
						</td>
						<td class="px-4 py-3 text-sm text-gray-700 text-right">
							{formatCurrency(subscription.cost, subscription.currency)}
						</td>
						<td class="px-4 py-3 text-sm text-gray-700 text-right">
							{formatCurrency(annualEquivalent(subscription.cost, subscription.frequency))}
						</td>
						<td class="px-4 py-3 capitalize text-sm text-gray-700">{subscription.frequency}</td>
						<td class="px-4 py-3 text-center">
							{#if subscription.status === 'active'}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-success">Active</span>
							{:else}
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Cancelled</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		
		{#if subscriptions.length === 0}
			<div class="px-4 py-8 text-center">
				<p class="text-sm text-gray-500">No subscriptions found.</p>
			</div>
		{/if}
	</div>
</div>
