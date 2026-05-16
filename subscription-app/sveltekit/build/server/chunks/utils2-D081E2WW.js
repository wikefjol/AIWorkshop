function annualEquivalent(cost, frequency) {
  switch (frequency) {
    case "daily":
      return cost * 365;
    case "weekly":
      return cost * 52;
    case "monthly":
      return cost * 12;
    case "yearly":
      return cost * 1;
    default:
      return cost;
  }
}
function monthlyEquivalent(cost, frequency) {
  switch (frequency) {
    case "daily":
      return cost * 365 / 12;
    case "weekly":
      return cost * 52 / 12;
    case "monthly":
      return cost * 1;
    case "yearly":
      return cost / 12;
    default:
      return cost;
  }
}
function totalMonthly(subscriptions) {
  return subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + monthlyEquivalent(s.cost, s.frequency), 0);
}
function totalAnnual(subscriptions) {
  return subscriptions.filter((s) => s.status === "active").reduce((sum, s) => sum + annualEquivalent(s.cost, s.frequency), 0);
}
function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export { annualEquivalent as a, totalMonthly as b, formatCurrency as f, totalAnnual as t };
//# sourceMappingURL=utils2-D081E2WW.js.map
