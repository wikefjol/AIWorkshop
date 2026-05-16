# 📋 Master Plan: Subscription Audit Dashboard (Multi-Framework Workshop)

## 1. Project Overview
**Goal:** Build the same subscription tracking web application using multiple frameworks/languages to compare development experience, performance, and code patterns.

**Target User:** Individuals looking to reduce "subscription creep" and understand their monthly burn rate.

**Reference Implementation:** SvelteKit — all other frameworks will match its UI/UX.

## 2. Folder Structure
```
AIWorkshop/
├── subscription-app/
│   ├── PLAN.md                        ← Master plan (this file)
│   ├── AGENTS.md                      ← Shared spec (data model, UI/UX, business logic)
│   ├── sveltekit/                     ← SvelteKit reference implementation (build first)
│   │   └── AGENTS.md                  ← SvelteKit-specific instructions
│   ├── go/                            ← Go-lang version (build later)
│   │   └── AGENTS.md                  ← Go-specific instructions
│   ├── blazor/                        ← .NET/Blazor version (build later)
│   │   └── AGENTS.md                  ← Blazor-specific instructions
│   └── react/                         ← React version (build later)
│       └── AGENTS.md                  ← React-specific instructions
```

Each framework folder is **fully self-contained** with its own dependencies, build system, and project structure.

### 2.1 AI Instruction Files

| File | Location | Contents |
| :--- | :--- | :--- |
| `AGENTS.md` | `subscription-app/` (root) | Shared spec: data model, UI/UX, business logic |
| `AGENTS.md` | Per-framework folder | Framework-specific: tech stack, setup, implementation steps |

When building a framework, AI tools will read both the shared root `AGENTS.md` and the framework-specific `AGENTS.md` to get the complete picture.

## 3. Frameworks & Tech Stack

### 3.1 SvelteKit (Reference)
| Aspect | Choice |
| :--- | :--- |
| Framework | SvelteKit v2.x |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | `shadcn-svelte` |
| Icons | `lucide-svelte` |
| Charts | `svelte-recharts` |
| Database | SQLite + Drizzle ORM |

### 3.2 Go
| Aspect | Choice |
| :--- | :--- |
| Framework | Chi router + Go templates |
| Language | Go |
| Styling | Tailwind CSS (same as reference) |
| UI Components | Custom components matching shadcn-svelte visually |
| Icons | Lucide icons (SVG) |
| Charts | Chart.js via inline JS or go-chart |
| Database | SQLite + golang-migrate + sqlc |

### 3.3 .NET/Blazor
| Aspect | Choice |
| :--- | :--- |
| Framework | Blazor Server (.NET 8+) |
| Language | C# |
| Styling | Tailwind CSS (via Tailwind.NET or postcss) |
| UI Components | MudBlazor or custom matching shadcn-svelte |
| Icons | Lucide icons |
| Charts | Chart.js for Blazor |
| Database | SQLite + Entity Framework Core |

### 3.4 React
| Aspect | Choice |
| :--- | :--- |
| Framework | Vite + React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | `shadcn/ui` (same visual design as SvelteKit) |
| Icons | `lucide-react` |
| Charts | Recharts (same visual style as svelte-recharts) |
| Database | SQLite + Drizzle ORM (via SvelteKit-like API layer) |

## 4. Shared Data Model (All Frameworks)

All frameworks use the **exact same schema**:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (UUID) | Unique identifier |
| `name` | String | Name of service (e.g., "Netflix") |
| `cost` | Float | Cost per billing cycle |
| `currency` | String | Default to "SEK" |
| `frequency` | Enum | `daily`, `weekly`, `monthly`, `yearly` |
| `category` | Enum | `streaming`, `software`, `utilities`, `health`, `other` |
| `status` | Enum | `active`, `cancelled` |
| `startDate` | Date | When the subscription started |
| `nextBillingDate` | Date | When the next payment is due |

## 5. Shared UI/UX Specification

All frameworks must produce the **same visual output**. Here is the design reference:

### A. Layout
- **Sidebar Navigation:** Links to "Dashboard", "Subscriptions", "Settings".
- **Main Content Area:** Clean, white background with subtle gray borders for cards.
- **Structure:** Responsive grid layout.

### B. Dashboard View
1. **Hero Stats Cards (Top Row):**
   - **Total Monthly Cost:** Sum of all active monthly equivalents.
   - **Total Annual Cost:** Projected yearly spend.
   - **Active Count:** Number of active subscriptions.
2. **Spending Breakdown (Left Column):**
   - A **Donut Chart** showing spending distribution by `category`.
3. **Upcoming Renewals (Right Column):**
   - A list of subscriptions billing in the next 7 days, sorted by date.

### C. Subscription List View
- A **Data Table** displaying all subscriptions.
- **Columns:** Name, Category, Cost, Frequency, Annual Equivalent, Status, Actions (Edit/Delete).
- **Filters:** Filter by `category` or `status`.
- **Sort:** Sortable by `cost` (high to low).

### D. Add/Edit Modal
- A form overlay to add or edit a subscription.
- **Fields:** Name, Cost, Frequency (Dropdown), Category (Dropdown), Start Date.
- **Validation:** Cost must be > 0. Name is required.

## 6. Shared Business Logic (All Frameworks)

### Annual Equivalent Calculation
- **Daily:** `Cost * 365`
- **Weekly:** `Cost * 52`
- **Monthly:** `Cost * 12`
- **Yearly:** `Cost * 1`

### "Savings Potential" Feature (Bonus)
- If a subscription has been active for > 1 year, display a "Cancel & Save" button showing the annual cost in red.

## 7. Implementation Phases (Framework-Agnostic Blueprint)

All frameworks progress through the same five phases in order. Each phase must produce a working, runnable result before moving to the next.

### Phase 1: Foundation & Scaffold
> Set up the project structure, install dependencies, configure Tailwind CSS, define the SQLite schema, and seed data. Verify the app runs successfully.

**Key checks:**
- Project scaffolds with correct package/module setup
- `tailwind.config.js` uses the shared color palette (primary `#4F46E5`, background `#F9FAFB`, text `#111827`)
- SQLite database file created with `subscriptions` table matching the shared schema
- 5 sample subscriptions seeded on first run
- App launches without errors (`npm run dev` / `go run` / `dotnet run`)

### Phase 2: API Layer (CRUD Endpoints)
> Implement full Create, Read, Update, Delete endpoints with input validation and consistent JSON responses.

**Endpoints:**
| Method | Path | Operation |
|--------|------|-----------|
| GET | `/api/subscriptions` | List all (with category/status query params for filtering) |
| GET | `/api/subscriptions/:id` | Get single subscription |
| POST | `/api/subscriptions` | Create new subscription |
| PUT | `/api/subscriptions/:id` | Update existing subscription |
| DELETE | `/api/subscriptions/:id` | Delete subscription |

**Response shape (all endpoints):** `{ "success": boolean, "data"?: any, "error"?: string }`

### Phase 3: Dashboard View
> Build the homepage with navigation layout, hero stats cards, category breakdown chart, and upcoming renewals list.

**Deliverables:**
- Sidebar navigation (Dashboard, Subscriptions, Settings)
- 3 stat cards: Total Monthly Cost, Total Annual Cost, Active Count
- Donut chart showing spending by category (left column, ~60% width)
- Upcoming renewals list for next 7 days (right column, ~40% width)

### Phase 4: Subscription List View
> Build the full subscription management UI with data table, filters, sorting, and modals.

**Deliverables:**
- Data table with columns: Name, Category, Cost, Frequency, Annual Equivalent, Status, Actions
- Filter dropdowns for category and status (default to "All")
- Sortable column headers (default: cost descending)
- Edit/Delete buttons per row
- Add/Edit modal form overlay with validation

### Phase 5: Settings & Polish
> Complete the app with settings page, responsive layout, loading states, error handling, and visual parity.

**Deliverables:**
- Settings page with "Reset Data" button (clears and re-seeds)
- Responsive design — collapsible sidebar on mobile
- Loading states and error handling throughout
- Validation: cost > 0, name required, inline error messages

---

## 8. Optional Workshop Challenges (Bonus)

These are optional challenges participants can attempt after completing Phases 1–5. They are designed to be implemented across all frameworks so teams can compare approaches. Difficulty ranges from easy to hard.

### Challenge 1: Dark Mode Toggle *(Easy)*
Add a theme switcher in the sidebar that toggles between light and dark mode. Persist the preference in `localStorage` (or cookies for server-rendered frameworks). All frameworks must use the same dark color palette.

**Teaches:** CSS variables, framework theming, client vs server state, localStorage vs cookie patterns.

### Challenge 2: Toast Notifications *(Easy-Medium)*
Add non-blocking toast notifications for every CRUD operation (e.g., "Subscription created", "Subscription deleted", "Error: cost must be > 0"). Toasts should auto-dismiss after 3 seconds with a slide-in animation.

**Teaches:** Ephemeral UI state, animation patterns, cross-framework notification systems, error UX.

### Challenge 3: Export Subscriptions to CSV *(Medium)*
Add an "Export CSV" button on the subscriptions list page. The exported file should include all columns, respect current filters, and be downloadable as `subscriptions-YYYY-MM-DD.csv`.

**Teaches:** File generation, Blob/Stream API differences, server-side vs client-side file creation, encoding.

### Challenge 4: Debounced Search *(Medium-Hard)*
Add a search input on the subscriptions list that filters by name in real-time with a 300ms debounce. The search should highlight matching text and show result count.

**Teaches:** Debouncing/throttling patterns, text highlighting, server-side vs client-side search tradeoffs, framework-specific event handling.

### Challenge 5: Real-time Dashboard Updates via WebSockets *(Hard)*
When one instance updates a subscription, all other open browser tabs should see the dashboard stats and table update instantly without page refresh. Use WebSockets (or Server-Sent Events) to push changes.

**Teaches:** Real-time communication, WebSocket vs SSE tradeoffs, framework-specific real-time patterns (SvelteKit hooks, Go goroutines, Blazor Circuit, React state), concurrency handling.

---

## 💡 Workshop Flow
1. Build the **SvelteKit reference implementation** first — it serves as the visual/functional reference for all others.
2. Progress through Phases 1–5 in order; each phase produces a working result.
3. Team members then replicate the same phases in Go, Blazor, or React, using SvelteKit's output as the UI design reference.
4. New frameworks can be added at any time by creating a new folder under `subscription-app/`.
5. After completing core phases, teams can tackle **optional challenges** from section 8 to compare framework approaches.
