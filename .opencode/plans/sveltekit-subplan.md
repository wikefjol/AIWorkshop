# SvelteKit Implementation Plan: Subscription Audit Dashboard

Follow these 7 steps in order. Wait for testing between each step.

## Step 1.1: Project Setup
> Initialize SvelteKit with TypeScript, Tailwind CSS, and `shadcn-svelte`. Verify the dev server runs.

**Commands:**
```bash
npm create svelte@latest .
npm install
npx svelte-add@latest tailwindcss
npm exec shadcn-svelte@latest init
npm exec shadcn-svelte@latest add button card dialog dropdown-table input label select separator table tooltip
npm install svelte-recharts lucide-svelte drizzle-orm better-sqlite3
npm install superforms @geoffcox/svelte-recharts
```

**Deliverable:** `npm run dev` starts a working SvelteKit app on localhost:5173.

---

## Step 1.2: Database Schema
> Set up SQLite with Drizzle ORM. Create the `subscriptions` table.

**Files to create:**
- `src/lib/db.ts` — SQLite connection
- `src/lib/schema.ts` — Drizzle schema for `subscriptions`
- `src/lib/db/seed.ts` — Seed script with sample data

**Schema fields:** `id`, `name`, `cost`, `currency`, `frequency`, `category`, `status`, `startDate`, `nextBillingDate`

**Deliverable:** Database file created, seed script runs, sample data inserted.

---

## Step 1.3: CRUD Operations
> Create SvelteKit Form Actions for Create, Update, Delete.

**Files to create/modify:**
- `src/routes/subscriptions/+page.server.ts` — Server actions (create, update, delete)
- `src/routes/subscriptions/+page.server.ts` — Load function (read all)

**Deliverable:** Can create, read, update, and delete subscriptions via server actions.

---

## Step 1.4: Layout & Sidebar
> Build the responsive sidebar navigation + main content area.

**Files to create/modify:**
- `src/routes/+layout.svelte` — Sidebar + main content structure
- `src/routes/+layout.ts` — Load function for layout

**Deliverable:** Sidebar with Dashboard, Subscriptions, Settings links. Clicking links navigates correctly.

---

## Step 1.5: Dashboard View
> Build the Dashboard with hero stats, donut chart, and upcoming renewals.

**Files to create/modify:**
- `src/routes/+page.svelte` — Dashboard page
- `src/routes/+page.server.ts` — Load function with calculations
- `src/lib/components/DonutChart.svelte` — Category breakdown chart

**Calculations:**
- Monthly cost: normalize all frequencies to monthly
- Annual cost: `monthly * 12`
- Active count: filter by `status === 'active'`

**Deliverable:** Dashboard shows stats cards, donut chart, and upcoming renewals list.

---

## Step 1.6: Subscription List
> Build the data table with sorting, filters, and edit/delete actions.

**Files to create/modify:**
- `src/routes/subscriptions/+page.svelte` — Table with shadcn components
- `src/routes/subscriptions/+page.server.ts` — Query with filters and sorting

**Features:**
- Columns: Name, Category, Cost, Frequency, Annual Equivalent, Status, Actions
- Filters: by `category` and `status` (URL query params)
- Sort: by `cost` (high to low)
- Actions: Edit opens modal, Delete with confirmation

**Deliverable:** Full CRUD from the list view with sorting and filtering.

---

## Step 1.7: Polish
> Add Add/Edit modal, form validation, responsive design, and bonus features.

**Files to create/modify:**
- `src/lib/components/SubscriptionModal.svelte` — Add/Edit form in a dialog
- `src/routes/+page.svelte` — "Savings Potential" for subscriptions active > 1 year
- `src/routes/+layout.svelte` — Responsive mobile sidebar (hamburger menu)

**Validation:** Cost > 0, Name required (server-side via superforms).

**Deliverable:** Complete, polished app matching the shared UI/UX spec.

---

## Reference
- Shared spec: `subscription-app/AGENTS.md`
- UI/UX must match the design reference in the shared spec
