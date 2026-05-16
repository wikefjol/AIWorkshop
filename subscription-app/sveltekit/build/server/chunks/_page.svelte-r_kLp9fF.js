import { g as escape_html, c as attr } from './attributes-CTsHtzcH.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let resetting = false;
    let totalSubs = 0;
    $$renderer2.push(`<div class="max-w-2xl"><h1 class="text-2xl font-bold text-foreground mb-6">Settings</h1> <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"><h2 class="text-lg font-semibold text-foreground mb-4">About</h2> <p class="text-sm text-gray-600 mb-2"><strong>Subscription Audit Dashboard</strong></p> <p class="text-sm text-gray-500">Phase 1 — Foundation &amp; Scaffold</p> <p class="text-xs text-gray-400 mt-4">Built with SvelteKit, Tailwind CSS, Drizzle ORM, and SQLite.</p></div> <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"><h2 class="text-lg font-semibold text-foreground mb-4">Database Info</h2> <div class="flex items-center justify-between py-2"><span class="text-sm text-gray-600">Total subscriptions</span> <span class="text-sm font-medium text-foreground">${escape_html(totalSubs)}</span></div> <div class="flex items-center justify-between py-2 border-t border-gray-100 mt-2 pt-2"><span class="text-sm text-gray-600">Database backend</span> <span class="text-sm font-medium text-foreground">SQLite</span></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><h2 class="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2> <p class="text-sm text-gray-600 mb-4">This will delete all subscriptions and re-seed with default data.</p> <button class="px-4 py-2 bg-danger text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"${attr("disabled", resetting, true)}>${escape_html("Reset Data")}</button></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-r_kLp9fF.js.map
