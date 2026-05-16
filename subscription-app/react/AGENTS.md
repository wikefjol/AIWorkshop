# React Implementation Guide

Build the **Subscription Audit Dashboard** using Vite + React. Match the SvelteKit reference implementation's UI/UX exactly.

**Read first:** 
- `subscription-app/AGENTS.md` for the shared data model, UI/UX spec, and business logic
- `plans/PLAN.md` for the staged implementation phases applicable to all frameworks

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

## Key Implementation Notes

### Architecture Decision: SQLite in a Client-Side Framework
- **Option A (Recommended for workshop):** Use `better-sqlite3` via a thin Node.js API server (Express or Fastify). This keeps the architecture simple and mirrors the shared spec's REST API contract.
- **Option B:** Embed SQLite in the browser using `sql.js` (pure JS WASM build) — possible but adds complexity. Not recommended for workshop unless explicitly desired.

### Database & Schema
- Use Drizzle ORM (`better-sqlite3` driver) for schema definitions + migrations.
- Run migrations on server startup; seed 5 sample subscriptions if table is empty.

### Data Layer
- Custom hooks in `src/lib/hooks/useSubscriptions.ts`:
  - `useSubscriptions()` — fetch with category/status query params
  - `useCreateSubscription()` / `useUpdateSubscription()` / `useDeleteSubscription()` — mutations
- Validation: `zod` schemas for all API payloads, used both client-side (React Hook Form resolver) and server-side.

### UI Components (tsx)
| Component | File | Notes |
|-----------|------|-------|
| Layout | `Layout.tsx` | Sidebar + `<Outlet>` wrapper. Collapse sidebar on mobile via state toggle. |
| Stat Card | `StatCard.tsx` | Receives `title`, `value`, icon. Use shadcn `Card` + `CardContent`. |
| Donut Chart | `DonutChart.tsx` | `recharts` `PieChart` → `Pie` → `Cell[]` + `Tooltip`. Color map from category constants. |
| Renewal List | `RenewalList.tsx` | Map over upcoming renewals slice; display with `div` list or shadcn `Card` list. |
| Table | `SubscriptionTable.tsx` | `@tanstack/react-table` for sorting/filtering/state management. Headless approach gives full Tailwind control. |
| Modal Form | `SubscriptionModal.tsx` | shadcn `Dialog` + `Form` (React Hook Form + zod). Controlled via parent visibility state. |

### Routing
- React Router v6 with `createBrowserRouter` for client-side routing.
- Routes: `/` (Dashboard), `/subscriptions`, `/settings`.

### Business Logic
- Put calculations in `src/lib/utils.ts`:
  - `annualEquivalent(cost: number, frequency: string): number`
  - `monthlyEquivalent(cost: number, frequency: string): number`
  - `totalMonthly(subscriptions: Subscription[]): number`

## shadcn/ui Component Setup

Install the components used in this project:
```bash
npx shadcn@latest add button card input label select dialog table textarea
```

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

## Reference

Match the SvelteKit implementation's look and feel. When in doubt about styling, layout, or behavior, refer to the SvelteKit code in `subscription-app/sveltekit/`.
