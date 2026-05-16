# SvelteKit Implementation Guide

Build the **Subscription Audit Dashboard** using SvelteKit. This is the **reference implementation** — all other framework variants will match its UI/UX.

**Read first:** 
- `subscription-app/AGENTS.md` for the shared data model, UI/UX spec, and business logic
- `plans/PLAN.md` for the staged implementation phases applicable to all frameworks

---

## Tech Stack

| Layer | Choice |
| :--- | :--- |
| Framework | SvelteKit 2.x |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | `shadcn-svelte` |
| Icons | `lucide-svelte` |
| Charts | `svelte-recharts` |
| Database | SQLite via `better-sqlite3` |
| ORM | Drizzle ORM |
| Form Validation | `superforms` + `valibot` |
| HTTP Client | SvelteKit server actions |

---

## Setup Commands

```bash
# 1. Create SvelteKit project
npm create svelte@latest subscription-app
# Select: Skeleton project, TypeScript, Add ESLint, Add Prettier

# 2. Install dependencies
cd subscription-app
npm install tailwindcss @tailwindcss/vite
npx tailwindcss init

# 3. Install shadcn-svelte
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button card input label select textarea date-picker

# 4. Install other dependencies
npm install better-sqlite3 drizzle-orm svelte-recharts lucide-svelte
npm install -D drizzle-kit
npm install @huggingface/inference # if needed
npm install superforms@2 valibot

# 5. Initialize Drizzle
npx drizzle-kit init --schema ./src/lib/schema.ts
```

---

## Project Structure

```
src/
├── lib/
│   ├── db/
│   │   ├── index.ts          # SQLite connection + Drizzle instance
│   │   └── schema.ts         # Drizzle schema definition
│   ├── components/
│   │   ├── Layout.svelte     # Sidebar + main content wrapper
│   │   ├── StatCard.svelte   # Hero stats card component
│   │   ├── SubscriptionTable.svelte  # Data table
│   │   ├── SubscriptionModal.svelte  # Add/Edit modal
│   │   ├── DonutChart.svelte # Category breakdown chart
│   │   └── RenewalList.svelte # Upcoming renewals
│   ├── utils.ts              # Business logic (calculations)
│   └── index.ts              # Re-exports
├── routes/
│   ├── +page.svelte          # Dashboard (/)
│   ├── +page.ts              # Dashboard load function
│   ├── subscriptions/
│   │   ├── +page.svelte      # Subscription list (/subscriptions)
│   │   └── +page.ts
│   └── settings/
│       ├── +page.svelte      # Settings (/settings)
│       └── +page.ts
└── app.d.ts                  # TypeScript declarations
```

---

## Key Implementation Notes

### Database
- Seed on server startup — check if table is empty, insert seed data if so.
- Use Drizzle ORM: `schema.ts` for definitions, `index.ts` for connection + auto-migration.

### Business Logic
- Put calculations in `src/lib/utils.ts`:
  - `annualEquivalent(cost, frequency)` → returns annual cost
  - `monthlyEquivalent(cost, frequency)` → returns monthly equivalent
  - `totalMonthly(subscriptions)` → sum of all active monthly equivalents

### UI Components
| Component | SvelteKit file | Notes |
|-----------|-------------|-------|
| Layout | `Layout.svelte` | Sidebar + main content wrapper |
| Stat Card | `StatCard.svelte` | Reusable for hero stats |
| Donut Chart | `DonutChart.svelte` | `svelte-recharts` PieChart+Pie+Cell, one Color per category |
| Renewal List | `RenewalList.svelte` | Next 7 days sorted by date |
| Table | `SubscriptionTable.svelte` | Sortable columns, filter state via props |
| Modal | `SubscriptionModal.svelte` | Overlay with form, controlled by parent visibility prop |

### Tech-Specific Patterns
- **Routes:** Use SvelteKit file-based routing in `src/routes/`.
- **API endpoints:** POST via SvelteKit form actions. GET data via `+page.ts` load functions returning JSON. PUT/DELETE via `+server.ts` endpoint.
- **Validation:** Use `superforms` + `valibot`. Define a reusable schema in `src/lib/schemas.ts`.
- **Dates:** Native HTML `<input type="date">` — no date picker library needed.
- **State:** SvelteKit stores (`writable`) for global state like sidebar toggle.

---

## Reference

This is the **reference implementation**. When other frameworks ask "how should this look?", point them to the SvelteKit code.
