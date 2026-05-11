# 📋 Master Plan: Subscription Audit Dashboard (Multi-Framework Workshop)

## 1. Project Overview
**Goal:** Build the same subscription tracking web application using multiple frameworks/languages to compare development experience, performance, and code patterns.

**Target User:** Individuals looking to reduce "subscription creep" and understand their monthly burn rate.

**Reference Implementation:** SvelteKit — all other frameworks will match its UI/UX.

## 2. Folder Structure
```
AIWorkshop/
├── PLAN.md                           ← Original SvelteKit plan (keep as reference)
├── LICENSE
├── subscription-app/
│   ├── AGENTS.md                     ← Shared spec (Claude Code)
│   ├── .github/copilot-instructions.md  ← Copilot shared spec
│   ├── .cursorrules                  ← Cursor shared spec
│   ├── sveltekit/                    ← Reference implementation (build first)
│   │   ├── AGENTS.md                 ← Framework-specific instructions
│   │   ├── .github/copilot-instructions.md
│   │   ├── .cursorrules
│   │   ├── package.json
│   │   ├── src/
│   │   └── ...
│   ├── go/                           ← Go-lang version (build later)
│   │   ├── AGENTS.md
│   │   ├── .github/copilot-instructions.md
│   │   ├── .cursorrules
│   │   └── ...
│   ├── blazor/                       ← .NET/Blazor version (build later)
│   │   ├── AGENTS.md
│   │   ├── .github/copilot-instructions.md
│   │   ├── .cursorrules
│   │   └── ...
│   └── react/                        ← React version (build later)
│       ├── AGENTS.md
│       ├── .github/copilot-instructions.md
│       ├── .cursorrules
│       └── ...
```

Each framework folder is **fully self-contained** with its own dependencies, build system, and project structure.

### 2.1 AI Instruction Files

Each framework folder has its own set of AI instruction files, plus shared files at the `subscription-app/` root level. This ensures compatibility across **Claude Code**, **GitHub Copilot**, and **Cursor**.

| File | AI Tools that Read It | Location | Contents |
| :--- | :--- | :--- | :--- |
| `AGENTS.md` | Claude Code, Copilot | Root + per-framework | Primary instruction file |
| `.github/copilot-instructions.md` | GitHub Copilot | Root + per-framework | Copilot-specific instructions |
| `.cursorrules` | Cursor | Root + per-framework | Cursor-specific rules |

**Root-level files** (`subscription-app/`) — Shared across all frameworks:
- App overview & goal
- Data model (schema)
- UI/UX specification (layout, views, components)
- Business logic (calculations)
- Reference to SvelteKit as the design standard

**Per-framework files** — Specific to each framework:
- Tech stack & dependencies
- Setup commands
- Implementation steps (broken into phases)
- How to match the shared UI/UX

When building a framework, AI tools will read both the shared root files and the framework-specific files to get the complete picture.

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

### 3.2 Go (TBD)
| Aspect | Choice |
| :--- | :--- |
| Framework | [TBD — e.g., Htmx + Go templates, or full web framework] |
| Language | Go |
| Styling | Tailwind CSS (same as reference) |
| UI Components | [Match shadcn-svelte visually] |
| Icons | Same icon set |
| Charts | [TBD — chart library for Go frontend] |
| Database | SQLite + [TBD — Go ORM] |

### 3.3 .NET/Blazor (TBD)
| Aspect | Choice |
| :--- | :--- |
| Framework | Blazor (Server or WebAssembly) |
| Language | C# |
| Styling | Tailwind CSS (same as reference) |
| UI Components | [Match shadcn-svelte visually — e.g., MudBlazor or custom] |
| Icons | Same icon set |
| Charts | [TBD — Blazor chart library] |
| Database | SQLite + Entity Framework Core |

### 3.4 React (TBD)
| Aspect | Choice |
| :--- | :--- |
| Framework | Next.js or Vite + React |
| Language | TypeScript |
| Styling | Tailwind CSS (same as reference) |
| UI Components | `shadcn/ui` (React version — same visual design) |
| Icons | `lucide-react` |
| Charts | [TBD — match svelte-recharts visually] |
| Database | SQLite + Drizzle ORM (same as SvelteKit) |

## 4. Shared Data Model (All Frameworks)

All frameworks use the **exact same schema**:

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | String (UUID) | Unique identifier |
| `name` | String | Name of service (e.g., "Netflix") |
| `cost` | Float | Cost per billing cycle |
| `currency` | String | Default to "USD" |
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

## 7. Implementation Phases

### Phase 1: SvelteKit (Reference Implementation)
Build the complete app. This becomes the visual and functional reference for all other frameworks.

**Step 1.1: Setup & Schema**
> Initialize SvelteKit with TypeScript, Tailwind CSS, `shadcn-svelte`, Drizzle ORM, and SQLite. Create the `subscriptions` schema.

**Step 1.2: CRUD Operations**
> Create SvelteKit Form Actions for Create, Update, Delete. Use `superValidate` for form validation.

**Step 1.3: Dashboard UI**
> Build the Dashboard layout with Hero Stats cards, category breakdown donut chart, and upcoming renewals list.

**Step 1.4: Subscription List**
> Build the Subscription List page with sortable table, filters by category/status, and Edit/Delete actions.

**Step 1.5: Polish**
> Add the Add Subscription modal, validate inputs, ensure responsive design. This completes the reference implementation.

### Phase 2: Go (Future)
> Replicate the SvelteKit app's UI and functionality using Go. Match the same layout, colors, chart styles, and interactions.

### Phase 3: .NET/Blazor (Future)
> Replicate the SvelteKit app's UI and functionality using Blazor. Match the same layout, colors, chart styles, and interactions.

### Phase 4: React (Future)
> Replicate the SvelteKit app's UI and functionality using React/Next.js. Use `shadcn/ui` (React) for visual parity.

---

## 💡 Workshop Flow
1. Start with **Phase 1, Step 1.1** — Build the SvelteKit reference app.
2. Once complete, the SvelteKit app serves as the **design reference**.
3. Team members can then pick any framework for Phase 2+ and replicate the UI.
4. New frameworks can be added at any time by creating a new folder under `subscription-app/`.
