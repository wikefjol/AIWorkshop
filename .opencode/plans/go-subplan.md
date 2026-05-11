# 🇮🇹 Go Subplan: Subscription Audit Dashboard

## Tech Stack
| Aspect | Choice |
| :--- | :--- |
| Framework | [Echo](https://echo.labstack.com) v5 |
| Language | Go 1.22+ |
| Templates | `html/template` (stdlib) |
| Frontend Enhancement | [HTMX](https://htmx.org) via CDN |
| Styling | Tailwind CSS via CDN |
| Icons | Lucide Icons via CDN |
| Charts | [Chart.js](https://chartjs.org) via CDN |
| Database | SQLite via `modernc.org/sqlite` (pure Go, no CGO) |

## Folder Structure
```
subscription-app/go/
├── AGENTS.md                       ← Framework-specific instructions
├── .github/copilot-instructions.md
├── .cursorrules
├── go.mod
├── go.sum
├── main.go                         ← App entry point
├── handlers/
│   ├── dashboard.go                ← Dashboard page handler
│   ├── subscriptions.go            ← CRUD handlers for subscriptions
│   └── shared.go                   ← Shared helper handlers (404, etc.)
├── templates/
│   ├── layout.html                 ← Base template (sidebar + content shell)
│   ├── dashboard.html              ← Dashboard view
│   ├── subscriptions.html          ← Subscription list view
│   └── partials/
│       ├── hero-stats.html         ← Hero stats cards
│       ├── category-chart.html     ← Donut chart section
│       ├── renewals.html           ← Upcoming renewals list
│       ├── subscription-table.html ← Subscriptions data table
│       └── modal.html              ← Add/Edit modal
├── static/
│   └── css/
│       └── app.css                 ← Custom CSS overrides (if needed)
├── db/
│   ├── database.go                 ← DB connection & schema migration
│   └── queries.go                  ← Raw SQL queries / query helpers
└── models/
    └── subscription.go             ← Go struct + validation
```

## Incremental Implementation Steps

### Step 1: Project Setup & Configuration
- Initialize Go module (`go mod init`)
- Add dependencies: `github.com/labstack/echo/v5`, `modernc.org/sqlite`, `github.com/tahtay/htmx` (or CDN)
- Create `main.go` with Echo server bootstrapping
- Configure template loading and static file serving
- Set up Tailwind CSS via CDN in base template
- Verify: `go run main.go` starts server on `:8080`

### Step 2: Database Schema & Migration
- Create `db/database.go` — SQLite connection using `modernc.org/sqlite`
- Define `subscriptions` table migration (matches shared schema from PLAN.md)
- Create `models/subscription.go` — Go struct with JSON/template binding tags
- Add validation logic (cost > 0, required name)
- Seed with sample data for development
- Verify: App starts and creates/migrates DB automatically

### Step 3: Base Layout & Navigation
- Create `templates/layout.html` — Base template with:
  - Sidebar navigation (Dashboard, Subscriptions, Settings links)
  - HTMX and Tailwind CSS CDN scripts
  - Lucide Icons CDN
  - `<slot>`-like content block via `{{template}}`
- Create `templates/dashboard.html` — Placeholder dashboard page
- Wire up routes in `main.go`:
  - `GET /` → Dashboard
  - `GET /subscriptions` → Subscription list
- Verify: Layout renders with sidebar, navigation links work

### Step 4: Dashboard — Hero Stats Cards
- Create `templates/partials/hero-stats.html` with 3 cards:
  - **Total Monthly Cost** — sum of active subscriptions' monthly equivalents
  - **Total Annual Cost** — projected yearly spend
  - **Active Count** — number of active subscriptions
- Add `handlers/dashboard.go` with query logic:
  - Calculate monthly equivalent: daily\*365/12, weekly\*52/12, yearly\*12/12
  - Calculate annual equivalent: daily\*365, weekly\*52, monthly\*12, yearly\*1
- Verify: Dashboard shows correct stats from seeded data

### Step 5: Dashboard — Category Donut Chart
- Create `templates/partials/category-chart.html`:
  - Container for Chart.js canvas
  - Pass category data from handler to template
- Add SQL query to aggregate spending by category
- Render Chart.js donut chart with consistent colors per category
- Verify: Donut chart displays on dashboard, matches SvelteKit visual style

### Step 6: Dashboard — Upcoming Renewals
- Create `templates/partials/renewals.html`:
  - List of subscriptions billing within next 7 days
  - Sorted by `nextBillingDate` ascending
  - Show name, cost, billing date
- Add filter query: `nextBillingDate BETWEEN NOW AND DATE('now', '+7 days')`
- Verify: Only upcoming renewals appear, sorted correctly

### Step 7: Subscription List — Data Table
- Create `templates/subscriptions.html` with full page layout
- Create `templates/partials/subscription-table.html`:
  - Columns: Name, Category, Cost, Frequency, Annual Equivalent, Status, Actions
  - Format annual equivalent using the business logic from Step 4
  - Status badges (active = green, cancelled = red/gray)
  - Category badges with consistent colors
- Wire up `GET /subscriptions` handler with full list query
- Verify: Table renders all subscriptions with correct data

### Step 8: Subscription List — Filters & Sort
- Add filter UI (dropdowns for category and status) using URL query params
- Implement filtering in query: `WHERE category = ? AND status = ?`
- Add sort toggle for cost (high to low / low to high)
- HTMX swap for filter changes (no full page reload)
- Verify: Filters and sort work, URL params persist state

### Step 9: Add Subscription — Modal & Form
- Create `templates/partials/modal.html`:
  - Overlay modal with form fields: Name, Cost, Frequency (dropdown), Category (dropdown), Start Date, Next Billing Date
  - Validation: cost > 0, name required
  - HTMX-triggered open/close
- Add `POST /subscriptions` handler:
  - Parse and validate form data
  - Insert into database
  - Redirect or HTMX swap to show updated list
- Verify: Can add new subscriptions via modal

### Step 10: Edit & Delete Subscriptions
- Add Edit link in table actions column:
  - `GET /subscriptions/:id` → Modal pre-filled with subscription data
  - `PUT /subscriptions/:id` → Update handler
- Add Delete link in table actions column:
  - HTMX delete with confirmation prompt
  - `DELETE /subscriptions/:id` → Delete handler
- Verify: Can edit and delete subscriptions, changes reflect immediately

### Step 11: Savings Potential (Bonus Feature)
- Logic: If `startDate` is > 1 year ago and status is `active`, show "Cancel & Save" button
- Display annual cost in red next to the button
- Add "Cancel" action that sets `status = 'cancelled'`
- Verify: Long-standing subscriptions show savings tip

### Step 12: Polish & Responsive Design
- Ensure responsive layout (sidebar collapses on mobile, table scrolls horizontally)
- Verify all visual elements match SvelteKit reference:
  - Card styling (white bg, subtle gray borders)
  - Button styles and hover states
  - Table styling and sorting indicators
  - Modal/dialog styling
  - Color palette consistency
- Add loading indicators via HTMX (`hx-indicator`)
- Verify: App looks and feels consistent across all views

## Key Design Decisions

1. **Server-rendered with HTMX**: Keeps Go idiomatic — serve HTML from templates, use HTMX for dynamic interactions without a frontend build step.

2. **Pure Go SQLite (`modernc.org/sqlite`)**: No CGO dependency means easier cross-compilation and deployment. No need for a C compiler.

3. **Tailwind + Chart.js + Lucide via CDN**: Avoids npm/node tooling in the Go project. Keeps it a pure Go project. The shared spec says "match SvelteKit visually" — CDN approach achieves this.

4. **Raw SQL in `db/queries.go`**: No ORM. Write explicit SQL for full control and transparency. Use Go structs for mapping results.

5. **HTMX for interactivity**: Modal open/close, form submissions, filter changes, and delete confirmations all handled via HTMX attributes in templates. Minimal custom JavaScript needed.
