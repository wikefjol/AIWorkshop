import { Y as ensure_array_like } from './renderer-hX47rAYx.js';
import { g as escape_html } from './attributes-CTsHtzcH.js';
import { f as formatCurrency, b as totalMonthly, t as totalAnnual } from './utils2-D081E2WW.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let subscriptions = [];
    const activeCount = subscriptions.filter((s) => s.status === "active").length;
    const now = /* @__PURE__ */ new Date();
    now.setHours(0, 0, 0, 0);
    const next7 = /* @__PURE__ */ new Date();
    next7.setDate(next7.getDate() + 7);
    const renewals = subscriptions.filter((s) => {
      if (s.status !== "active") return false;
      const billingDate = new Date(s.nextBillingDate);
      return billingDate >= now && billingDate <= next7;
    }).sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-64"><p class="text-gray-500">Loading...</p></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><p class="text-sm font-medium text-gray-500">Total Monthly Cost</p> <p class="text-2xl font-bold mt-2 text-foreground">${escape_html(formatCurrency(totalMonthly(subscriptions)))}</p></div> <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><p class="text-sm font-medium text-gray-500">Total Annual Cost</p> <p class="text-2xl font-bold mt-2 text-foreground">${escape_html(formatCurrency(totalAnnual(subscriptions)))}</p></div> <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><p class="text-sm font-medium text-gray-500">Active Count</p> <p class="text-2xl font-bold mt-2 text-foreground">${escape_html(activeCount)} active</p></div></div> <div class="grid grid-cols-1 lg:grid-cols-5 gap-6"><div class="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6"><h2 class="text-lg font-semibold mb-4 text-foreground">Spending by Category</h2> <p class="text-sm text-gray-500">Donut chart coming in Phase 3.</p> <div class="mt-6 space-y-2"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(subscriptions.reduce(
      (acc, sub) => {
        if (sub.status !== "active") return acc;
        const monthly = ((cost, freq) => {
          switch (freq) {
            case "daily":
              return cost * 365 / 12;
            case "weekly":
              return cost * 52 / 12;
            case "monthly":
              return cost;
            case "yearly":
              return cost / 12;
            default:
              return 0;
          }
        })(sub.cost, sub.frequency);
        acc[sub.category] = (acc[sub.category] || 0) + monthly;
        return acc;
      },
      {}
    )));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [category, amount] = each_array[$$index];
      $$renderer2.push(`<div class="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"><span class="text-sm capitalize text-gray-700">${escape_html(category)}</span> <span class="text-sm font-medium text-foreground">${escape_html(formatCurrency(amount))}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6"><h2 class="text-lg font-semibold mb-4 text-foreground">Upcoming Renewals</h2> `);
    if (renewals.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-sm text-gray-500">No subscriptions renewing in the next 7 days.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<ul class="space-y-3"><!--[-->`);
      const each_array_1 = ensure_array_like(renewals);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let renewal = each_array_1[$$index_1];
        $$renderer2.push(`<li class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"><div><p class="font-medium text-sm text-foreground">${escape_html(renewal.name)}</p> <p class="text-xs text-gray-500">${escape_html(formatCurrency(renewal.cost, renewal.currency))} · ${escape_html(renewal.frequency)}</p></div> <span class="text-xs font-medium text-primary">${escape_html(new Date(renewal.nextBillingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }))}</span></li>`);
      }
      $$renderer2.push(`<!--]--></ul>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Cb9jjzVn.js.map
