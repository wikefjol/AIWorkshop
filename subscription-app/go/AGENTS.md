# Go Implementation Guide

Build the **Subscription Audit Dashboard** using Go. Match the SvelteKit reference implementation's UI/UX exactly.

**Read first:** 
- `subscription-app/AGENTS.md` for the shared data model, UI/UX spec, and business logic
- `plans/PLAN.md` for the staged implementation phases applicable to all frameworks

---

## Tech Stack

| Layer | Choice |
| :--- | :--- |
| Framework | Chi router + Go templates |
| Language | Go 1.22+ |
| Styling | Tailwind CSS (via CDN or postcss build) |
| UI Components | Custom HTML components matching shadcn-svelte |
| Icons | Lucide icons (inline SVG) |
| Charts | Chart.js (loaded via CDN in templates) |
| Database | SQLite via `mattn/go-sqlite3` |
| Migrations | `golang-migrate/migrate` |
| ORM | Raw SQL or `jackc/pgx`-style query builder |

---

## Setup Commands

```bash
# 1. Initialize Go module
mkdir subscription-app && cd subscription-app
go mod init subscription-app

# 2. Install dependencies
go get -u github.com/go-chi/chi/v5
go get -u github.com/mattn/go-sqlite3
go get -u github.com/golang-migrate/migrate/v4
go get -u github.com/golang-migrate/migrate/v4/database/sqlite3
go get -u github.com/lib/pq # for migrate source driver

# 3. Create project structure
mkdir -p {cmd,internal/{db,handler,template,util},migrations,static,templates}
```

---

## Project Structure

```
cmd/
└── server/
    └── main.go              # Entry point, router setup
internal/
├── db/
│   ├── database.go          # SQLite connection + init
│   └── migrations.go        # Run migrations on startup
├── handler/
│   ├── subscription.go      # HTTP handlers for subscriptions
│   └── page.go              # Page render handlers
├── template/
│   ├── layout.go            # Base template with sidebar
│   └── helpers.go           # Template helper functions
└── util/
    └── calc.go              # Business logic (calculations)
migrations/
├── 000001_create_subscriptions.up.sql
├── 000001_create_subscriptions.down.sql
├── 000002_seed_data.up.sql
└── 000002_seed_data.down.sql
static/
├── css/
│   └── styles.css           # Tailwind output or custom CSS
└── js/
    └── main.js              # Chart.js + interactivity
templates/
├── base.html                # Layout with sidebar
├── dashboard.html           # Dashboard view
├── subscriptions.html       # Subscription list view
├── settings.html            # Settings view
├── partials/
│   ├── stat-card.html       # Hero stat card
│   ├── renewal-list.html    # Upcoming renewals
│   └── subscription-row.html # Table row
└── modal/
    └── subscription-form.html # Add/Edit modal
```

---

## Key Implementation Notes

### Router & Handlers
- Use **Chi router** (`github.com/go-chi/chi/v5`) for routing.
- Split handlers into two files:
  - `internal/handler/page.go` — page rendering (`GET /`, `/subscriptions`, `/settings`)
  - `internal/handler/subscription.go` — API CRUD endpoints

### Database & Migrations
- **SQLite driver:** `github.com/mattn/go-sqlite3` (CGO required) or `modernc.org/sqlite` (pure Go).
- **Migrations:** `github.com/golang-migrate/migrate/v4` with SQL migration files in `migrations/`.
- Run migrations on startup — ensure tables exist before the server starts serving.

### Templates & Static Files
- Use Go's `html/template` package for rendering pages.
- Define a base template set per page layout; use `template.ParseGlob` for bulk loading.
- Load Chart.js via CDN in `base.html`: `<script src="https://cdn.jsdelivr.net/npm/chart.js">`.
- Serve static files (`css/`, `js/`) with Chi's `fs.Handler`.

### UI Patterns (Go Templates)
| Component | Template file | Notes |
|-----------|-------------|-------|
| Layout / Sidebar | `templates/base.html` | Wrap all pages; set `active` class on nav links based on URL |
| Stat Card | `templates/partials/stat-card.html` | Reusable partial, passed title/value/icon via template params |
| Donut Chart | Inline in `templates/dashboard.html` | Canvas element + `<script>` block with Chart.js config in `static/js/main.js` |
| Renewal List | `templates/partials/renewal-list.html` | Range over upcoming renewals slice |
| Table | `templates/subscriptions.html` | HTML table, sort headers use query params (`?sort=cost&order=desc`) |
| Modal Form | `templates/modal/subscription-form.html` | Hidden by default; toggle via vanilla JS fetch + onclick handlers |

### API Responses
- Return consistent JSON: `{ "success": boolean, "data"?: any, "error"?: string }`.
- Use `encoding/json` — wrap all responses with a helper to avoid repetition.
- Validation in handlers: check required fields (name non-empty, cost > 0).

### Business Logic
- Put calculations in `internal/util/calc.go`:
  - `AnnualEquivalent(cost float64, freq string) float64`
  - `MonthlyEquivalent(cost float64, freq string) float64`
  - `TotalMonthly(subscriptions []Subscription) float64`

### Icons & Styling
- **Lucide icons:** Copy SVG paths from lucide.dev and inline them in templates.
- **Tailwind CSS:** Use CDN for workshop simplicity; see Tailwind setup below.

## Tailwind CSS Setup (Simple)

For the workshop, use via CDN in `base.html`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

For production, set up a build step:
```bash
npx @tailwindcss/cli -i ./static/css/input.css -o ./static/css/styles.css --watch
```

With `static/css/input.css`:
```css
@import "tailwindcss";
```

## Reference

Match the SvelteKit implementation's look and feel. When in doubt about styling, layout, or behavior, refer to the SvelteKit code in `subscription-app/sveltekit/`.
