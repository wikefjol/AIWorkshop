# SvelteKit Implementation Guide

Build the **Subscription Audit Dashboard** using SvelteKit. This is the **reference implementation** — all other framework variants will match its UI/UX.

**Read first:** `subscription-app/AGENTS.md` for the shared data model, UI/UX spec, and business logic.

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

## Implementation Steps

### Phase 1: Setup & Schema
1. Initialize SvelteKit project with TypeScript and Tailwind CSS.
2. Configure `tailwind.config.js` with the color palette from the shared spec.
3. Set up Drizzle ORM schema (`src/lib/db/schema.ts`) matching the shared data model.
4. Create SQLite database connection (`src/lib/db/index.ts`) with auto-migration on startup.
5. Seed 5 sample subscriptions if the table is empty.

### Phase 2: Server Actions (API Layer)
1. Create `src/routes/+server.ts` or use SvelteKit **form actions** for CRUD:
   - `CREATE` — `POST /api/subscriptions`
   - `UPDATE` — `PUT /api/subscriptions/:id`
   - `DELETE` — `DELETE /api/subscriptions/:id`
   - `READ` — `GET` endpoints via `+page.ts` load functions
2. Use `superforms` with `valibot` schemas for validation.
3. Return JSON responses for API endpoints.

### Phase 3: Dashboard UI
1. Build `Layout.svelte` with sidebar navigation.
2. Build `StatCard.svelte` for hero stats.
3. Create `+page.svelte` (Dashboard):
   - Display 3 stat cards (monthly cost, annual cost, active count).
   - Left column: `DonutChart.svelte` with `svelte-recharts`.
   - Right column: `RenewalList.svelte` showing next 7 days.
4. Implement `+page.ts` load function to fetch data and compute stats.

### Phase 4: Subscription List
1. Build `SubscriptionTable.svelte` with sortable columns.
2. Add category and status filter dropdowns.
3. Create `SubscriptionModal.svelte` for add/edit.
4. Wire up Edit/Delete actions with confirmation dialogs.

### Phase 5: Settings & Polish
1. Build Settings page with "Reset Data" button.
2. Add client-side form validation with `valibot`.
3. Ensure responsive design (mobile sidebar collapse).
4. Add loading states and error handling.
5. Test all CRUD operations end-to-end.

---

## Key Implementation Notes

- **Database seeding:** Run on server startup — check if table is empty, insert seed data if so.
- **Calculations:** Put `annualEquivalent()`, `monthlyEquivalent()`, and `totalMonthly()` in `src/lib/utils.ts`.
- **Charts:** Use `svelte-recharts` with `PieChart` + `Pie` + `Cell` for the donut chart. Color each category distinctly.
- **Dates:** Use native `<input type="date">` for date pickers — no extra library needed.
- **State management:** Use SvelteKit store or `writable` stores for global state (e.g., sidebar toggle).
- **API responses:** Always return `{ success: boolean, data?: any, error?: string }`.

---

## Reference

This is the **reference implementation**. When other frameworks ask "how should this look?", point them to the SvelteKit code.
