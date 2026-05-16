<script lang="ts">
	let resetting = false;
	let statusMessage: { type: 'success' | 'error'; text: string } | null = null;

	import { onMount } from 'svelte';

	onMount(async () => {
		const res = await fetch('/api/subscriptions');
		if (res.ok) {
			const data = await res.json();
			totalSubs = data.data.length;
		}
	});

	let totalSubs = 0;

	async function resetData() {
		// Clear all subscriptions and re-seed by reloading the app
		resetting = true;
		try {
			// Reset by deleting all records
			for (let i = 0; i < 100; i++) { // safety limit
				const res = await fetch('/api/subscriptions', { method: 'DELETE' });
				const data = await res.json();
				if (!data.success) break;
			}
			statusMessage = { type: 'success', text: 'Data reset successfully! Server will re-seed on next request.' };
		} catch (e) {
			statusMessage = { type: 'error', text: e instanceof Error ? e.message : 'Failed to reset data' };
		} finally {
			resetting = false;
		}
	}
</script>

<div class="max-w-2xl">
	<h1 class="text-2xl font-bold text-foreground mb-6">Settings</h1>

	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
		<h2 class="text-lg font-semibold text-foreground mb-4">About</h2>
		<p class="text-sm text-gray-600 mb-2"><strong>Subscription Audit Dashboard</strong></p>
		<p class="text-sm text-gray-500">Phase 1 — Foundation & Scaffold</p>
		<p class="text-xs text-gray-400 mt-4">Built with SvelteKit, Tailwind CSS, Drizzle ORM, and SQLite.</p>
	</div>

	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
		<h2 class="text-lg font-semibold text-foreground mb-4">Database Info</h2>
		<div class="flex items-center justify-between py-2">
			<span class="text-sm text-gray-600">Total subscriptions</span>
			<span class="text-sm font-medium text-foreground">{totalSubs}</span>
		</div>
		<div class="flex items-center justify-between py-2 border-t border-gray-100 mt-2 pt-2">
			<span class="text-sm text-gray-600">Database backend</span>
			<span class="text-sm font-medium text-foreground">SQLite</span>
		</div>
	</div>

	{#if statusMessage}
		<div class="mb-6 p-4 rounded-lg" 
			class:bg-green-50={statusMessage.type === 'success'}
			class:bg-red-50={statusMessage.type === 'error'}
			class:border-green-200={statusMessage.type === 'success'}
			class:border-red-200={statusMessage.type === 'error'}
		>
			<p class="text-sm" 
				class:text-green-700={statusMessage.type === 'success'}
				class:text-red-700={statusMessage.type === 'error'}
			>
				{statusMessage.text}
			</p>
		</div>
	{/if}

	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
		<h2 class="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
		<p class="text-sm text-gray-600 mb-4">This will delete all subscriptions and re-seed with default data.</p>
		<button 
			class="px-4 py-2 bg-danger text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
			onclick={resetData}
			disabled={resetting}
		>
			{resetting ? 'Resetting...' : 'Reset Data'}
		</button>
	</div>
</div>
