import { Y as ensure_array_like, V as attr_class, a8 as stringify } from './renderer-hX47rAYx.js';
import { g as escape_html } from './attributes-CTsHtzcH.js';
import { f as formatCurrency, a as annualEquivalent } from './utils2-D081E2WW.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let subscriptions = [];
    function getCategoryColor(category) {
      const colors = {
        streaming: "bg-blue-50 text-blue-700",
        software: "bg-purple-50 text-purple-700",
        utilities: "bg-yellow-50 text-yellow-700",
        health: "bg-green-50 text-green-700",
        other: "bg-gray-50 text-gray-700"
      };
      return colors[category] || "bg-gray-50 text-gray-700";
    }
    $$renderer2.push(`<div class="max-w-6xl"><div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold text-foreground">Subscriptions</h1> <p class="text-sm text-gray-500">${escape_html(subscriptions.length)} total</p></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-64"><p class="text-gray-500">Loading...</p></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"><table class="w-full"><thead><tr class="border-b border-gray-100 bg-gray-50"><th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th><th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th><th class="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th><th class="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Eqv.</th><th class="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th><th class="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(subscriptions);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let subscription = each_array[$$index];
      $$renderer2.push(`<tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors"><td class="px-4 py-3 text-sm font-medium text-foreground">${escape_html(subscription.name)}</td><td class="px-4 py-3"><span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stringify(getCategoryColor(subscription.category))} capitalize`)}>${escape_html(subscription.category)}</span></td><td class="px-4 py-3 text-sm text-gray-700 text-right">${escape_html(formatCurrency(subscription.cost, subscription.currency))}</td><td class="px-4 py-3 text-sm text-gray-700 text-right">${escape_html(formatCurrency(annualEquivalent(subscription.cost, subscription.frequency)))}</td><td class="px-4 py-3 capitalize text-sm text-gray-700">${escape_html(subscription.frequency)}</td><td class="px-4 py-3 text-center">`);
      if (subscription.status === "active") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-success">Active</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Cancelled</span>`);
      }
      $$renderer2.push(`<!--]--></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table> `);
    if (subscriptions.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="px-4 py-8 text-center"><p class="text-sm text-gray-500">No subscriptions found.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DNZw9IzB.js.map
