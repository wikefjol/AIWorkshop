# Go Implementation Guide

Build the **Subscription Audit Dashboard** using Go. Match the SvelteKit reference implementation's UI/UX exactly.

**Read first:** `subscription-app/AGENTS.md` for the shared data model, UI/UX spec, and business logic.

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

## Implementation Steps

### Phase 1: Setup & Database
1. Initialize Go module with Chi router.
2. Set up SQLite database connection in `internal/db/database.go`.
3. Create migrations for the `subscriptions` table matching the shared schema.
4. Seed 5 sample subscriptions via migration or on first connection.
5. Configure Chi router with routes for all pages and API endpoints.

### Phase 2: HTTP Handlers & API
1. Create `internal/handler/page.go` for page rendering:
   - `GET /` → Dashboard
   - `GET /subscriptions` → Subscription list
   - `GET /settings` → Settings
2. Create `internal/handler/subscription.go` for API:
   - `GET /api/subscriptions` → List all
   - `GET /api/subscriptions/:id` → Get one
   - `POST /api/subscriptions` → Create
   - `PUT /api/subscriptions/:id` → Update
   - `DELETE /api/subscriptions/:id` → Delete
3. Use `encoding/json` for API responses: `{ "success": true, "data": {...} }`.
4. Implement input validation in handlers (check required fields, cost > 0).

### Phase 3: Dashboard Template
1. Build `templates/base.html` with sidebar navigation (Dashboard, Subscriptions, Settings).
2. Build `templates/dashboard.html`:
   - 3 stat cards using `partials/stat-card.html`.
   - Chart.js donut chart in left column (render canvas element).
   - Upcoming renewals list in right column using `partials/renewal-list.html`.
3. Pass computed stats from handler to template.

### Phase 4: Subscription List Template
1. Build `templates/subscriptions.html` with HTML table.
2. Add filter dropdowns (category, status) — use query parameters.
3. Add sortable column headers (sort by clicking, use `?sort=cost&order=desc`).
4. Add Edit/Delete buttons per row.
5. Build `templates/modal/subscription-form.html` for add/edit modal.
6. Use JavaScript (vanilla or minimal) for modal open/close and form submission via fetch API.

### Phase 5: Settings & Polish
1. Build `templates/settings.html` with "Reset Data" button.
2. Wire up Tailwind CSS (use CDN for simplicity in workshop, or build with postcss).
3. Add Chart.js configuration for donut chart with category colors.
4. Implement client-side form validation in JavaScript.
5. Ensure responsive layout (mobile-friendly sidebar).

---

## Key Implementation Notes

- **Templates:** Use Go's `html/template` package. Define template sets per page.
- **Database queries:** Use raw SQL with `database/sql` — keep it simple for the workshop.
- **Calculations:** Put `AnnualEquivalent()`, `MonthlyEquivalent()`, `TotalMonthly()` in `internal/util/calc.go`.
- **Chart.js:** Load via CDN (`<script src="https://cdn.jsdelivr.net/npm/chart.js">`). Configure donut chart in `static/js/main.js`.
- **Lucide icons:** Copy SVG paths from lucide.dev and inline them in templates.
- **Static files:** Serve `static/` directory with Chi's `fs.Handler`.
- **Error handling:** Return JSON `{ "success": false, "error": "message" }` for API errors.
- **Date handling:** Use `time.Parse("2006-01-02", ...)` for date strings from forms.

---

## Tailwind CSS Setup (Simple)

For the workshop, use Tailwind via CDN in `base.html`:
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

---

## Reference

Match the SvelteKit implementation's look and feel. When in doubt about styling, layout, or behavior, refer to the SvelteKit code in `subscription-app/sveltekit/`.
