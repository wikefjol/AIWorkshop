# React Implementation Guide

Build the **Subscription Audit Dashboard** using Vite + React. Match the SvelteKit reference implementation's UI/UX exactly.

**Read first:** `subscription-app/AGENTS.md` for the shared data model, UI/UX spec, and business logic.

---

## Tech Stack

| Layer | Choice |
| :--- | :--- |
| Framework | Vite + React 18+ |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | `shadcn/ui` (same visual design as SvelteKit) |
| Icons | `lucide-react` |
| Charts | `recharts` |
| Database | SQLite + Drizzle ORM (via in-process SQLite or API layer) |
| Routing | React Router v6 |
| State | React Context + `useReducer` or Zustand |

---

## Setup Commands

```bash
# 1. Create Vite + React project
npm create vite@latest subscription-app -- --template react-ts
cd subscription-app

# 2. Install Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite
npx tailwindcss init

# 3. Install shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label select textarea dialog table

# 4. Install other dependencies
npm install recharts lucide-react react-router-dom
npm install better-sqlite3 drizzle-orm
npm install -D drizzle-kit

# 5. Initialize Drizzle
npx drizzle-kit init --schema ./src/lib/db/schema.ts
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
│   │   ├── Layout.tsx         # Sidebar + main content wrapper
│   │   ├── StatCard.tsx       # Hero stats card component
│   │   ├── SubscriptionTable.tsx  # Data table component
│   │   ├── SubscriptionModal.tsx  # Add/Edit modal
│   │   ├── DonutChart.tsx     # Category breakdown chart
│   │   └── RenewalList.tsx    # Upcoming renewals list
│   ├── hooks/
│   │   └── useSubscriptions.ts  # Data fetching + mutations
│   ├── utils.ts               # Business logic (calculations)
│   └── index.ts               # Re-exports
├── pages/
│   ├── Dashboard.tsx          # Dashboard (/)
│   ├── Subscriptions.tsx      # Subscription list (/subscriptions)
│   └── Settings.tsx           # Settings (/settings)
├── App.tsx                    # Router setup
└── main.tsx                   # Entry point
```

---

## Implementation Steps

### Phase 1: Setup & Database
1. Initialize Vite + React project with TypeScript and Tailwind CSS.
2. Configure `tailwind.config.js` with the color palette from the shared spec.
3. Set up Drizzle ORM schema (`src/lib/db/schema.ts`) matching the shared data model.
4. Create SQLite database connection (`src/lib/db/index.ts`) with auto-migration on startup.
5. Seed 5 sample subscriptions if the table is empty.

### Phase 2: Data Layer + API
1. Create `src/lib/hooks/useSubscriptions.ts` with React Query or custom hooks:
   - `useSubscriptions()` — fetch all subscriptions
   - `useCreateSubscription()` — create mutation
   - `useUpdateSubscription()` — update mutation
   - `useDeleteSubscription()` — delete mutation
2. Implement CRUD operations using `better-sqlite3` (direct DB access in Vite dev) or a simple Express/FASTIFY API layer.
3. Use `zod` for schema validation.
4. Return typed responses matching the shared data model.

### Phase 3: Dashboard Page
1. Build `Layout.tsx` with sidebar navigation.
2. Build `StatCard.tsx` for hero stats.
3. Create `Dashboard.tsx`:
   - Display 3 stat cards (monthly cost, annual cost, active count).
   - Left column: `DonutChart.tsx` with `recharts` (PieChart + Pie + Cell).
   - Right column: `RenewalList.tsx` showing next 7 days.
4. Fetch data using the custom hooks.

### Phase 4: Subscription List Page
1. Build `SubscriptionTable.tsx` with sortable columns (use `@tanstack/react-table` or custom sorting).
2. Add category and status filter dropdowns (MudBlazor-style or shadcn Select).
3. Create `SubscriptionModal.tsx` for add/edit (use shadcn Dialog).
4. Wire up Edit/Delete actions with confirmation dialogs.
5. Implement URL query params for filters and sort order.

### Phase 5: Settings & Polish
1. Build `Settings.tsx` with "Reset Data" button.
2. Add client-side form validation with `zod` + React Hook Form.
3. Ensure responsive design (mobile sidebar collapse).
4. Add loading states and error boundaries.
5. Test all CRUD operations end-to-end.

---

## Key Implementation Notes

- **Database:** Since this is a client-side framework, use `better-sqlite3` in a Node.js helper or set up a minimal API server (Express/Fastify) for the data layer.
- **Calculations:** Put `annualEquivalent()`, `monthlyEquivalent()`, and `totalMonthly()` in `src/lib/utils.ts`.
- **Charts:** Use `recharts` with `PieChart`, `Pie`, `Cell`, and `Tooltip` for the donut chart. Color each category distinctly.
- **Dates:** Use native `<input type="date">` for date pickers — or use `@radix-ui/react-date-picker` for a polished experience.
- **State management:** Use React Context or Zustand for global state (sidebar toggle, theme).
- **Routing:** React Router v6 with `createBrowserRouter` or `BrowserRouter`.
- **API responses:** Always return typed objects matching `{ success: boolean; data?: Subscription; error?: string }`.

---

## shadcn/ui Component Setup

Install the components used in this project:
```bash
npx shadcn@latest add button card input label select dialog table textarea
```

---

## Tailwind CSS Configuration

In `tailwind.config.js`, configure the shared color palette:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        background: '#F9FAFB',
        text: '#111827',
        success: '#10B981',
        danger: '#EF4444',
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [],
}
```

---

## Reference

Match the SvelteKit implementation's look and feel. When in doubt about styling, layout, or behavior, refer to the SvelteKit code in `subscription-app/sveltekit/`.
