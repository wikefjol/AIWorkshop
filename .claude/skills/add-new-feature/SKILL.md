# Skill: Add a New Feature

This skill guides you through adding a new feature to any framework implementation of the Subscription Audit Dashboard. It is framework-agnostic — it delegates tech-specific decisions to the framework's `AGENTS.md`.

---

## Read First (Always)

1. **`subscription-app/AGENTS.md`** — Shared spec: data model, UI/UX, business logic, styling rules
2. **Framework-specific `AGENTS.md`** — Tech stack, patterns, and project structure for your target framework

### Frameworks

| Framework | Location | AGENTS.md |
|-----------|----------|-----------|
| SvelteKit (Reference) | `subscription-app/sveltekit/` | `subscription-app/sveltekit/AGENTS.md` |
| Go | `subscription-app/go/` | `subscription-app/go/AGENTS.md` |
| Blazor (.NET) | `subscription-app/blazor/` | `subscription-app/blazor/AGENTS.md` |
| React | `subscription-app/react/` | `subscription-app/react/AGENTS.md` |

---

## Workflow

Follow these steps in order. Adapt each step to your framework using the patterns documented in the framework's `AGENTS.md`.

### 1. Understand

- Read `subscription-app/AGENTS.md` for the shared contract (schema, API endpoints, UI spec, calculations).
- Read your framework's `AGENTS.md` for tech stack, project structure, and implementation patterns.
- Identify which existing files will be touched and what new files are needed.

### 2. Data Layer

If the feature requires new or changed data:

- **Schema:** Update the SQLite schema following the shared spec's data model rules. All frameworks use the same `subscriptions` table structure — extend it consistently.
- **Migrations:**
  - SvelteKit / React: Add to Drizzle schema (`schema.ts`), run `drizzle-kit generate/migrate`.
  - Go: Add a new SQL migration file in `migrations/`.
  - Blazor: Run `dotnet ef migrations add <Name>` and `dotnet ef database update`.
- **Service/Repository:** Update the data access layer (service, handler, or hook) to support the new operations.

### 3. API Layer

If the feature exposes or modifies API behavior:

- Follow the shared API contract from `subscription-app/AGENTS.md`:
  - `GET /api/subscriptions`, `GET /api/subscriptions/:id`
  - `POST /api/subscriptions`, `PUT /api/subscriptions/:id`, `DELETE /api/subscriptions/:id`
- Add new endpoints following the same JSON response format: `{ "success": boolean, "data"?: any, "error"?: string }`.
- Implement server-side validation matching the shared spec rules.

### 4. UI Layer

If the feature changes the interface:

- **Components:** Follow the existing component structure from your framework's `AGENTS.md`. Name new components consistently with existing ones (PascalCase, descriptive names).
- **Styling:** Use Tailwind CSS with the shared color palette:
  - Primary: `#4F46E5` | Background: `#F9FAFB` | Text: `#111827` | Success: `#10B981` | Danger: `#EF4444`
  - Cards: white background, `rounded-lg` (8px radius), subtle shadow.
- **Layout:** Match the existing sidebar + main content structure. New pages go under the same routing conventions.
- **Modals/Forms:** Follow the Add/Edit Modal spec from the shared spec — same fields, validation, and button patterns.

### 5. Business Logic

If the feature introduces new calculations or rules:

- Extend the calculation utilities in your framework's designated file:
  - SvelteKit / React: `src/lib/utils.ts`
  - Go: `internal/util/calc.go`
  - Blazor: `Services/SubscriptionService.cs` or dedicated helper
- Follow the existing formulas for annual/monthly equivalents. Keep calculations pure (no side effects).

### 6. Verify

After implementing:

- **Visual parity:** Compare your implementation against the SvelteKit reference. The layout, colors, spacing, and component behavior must match.
- **Data consistency:** Ensure the feature works with the seed data and produces correct calculations.
- **Cross-framework check:** If the feature is meant for all frameworks, verify it fits the shared spec so other implementations can adopt it.

---

## Quick Reference: Shared Constants

### Color Palette
```
Primary:   #4F46E5
Background:#F9FAFB
Text:      #111827
Success:   #10B981
Danger:    #EF4444
```

### Frequency Multipliers (Annual)
```
daily   → cost × 365
weekly  → cost × 52
monthly → cost × 12
yearly  → cost × 1
```

### Categories
`streaming`, `software`, `utilities`, `health`, `other`

### Statuses
`active`, `cancelled`

---

## Tips

- When adding a new page, follow the routing pattern from your framework's AGENTS.md and add a sidebar nav link.
- When adding chart visualizations, use your framework's chart library (`svelte-recharts`, `recharts`, Chart.js, or `ChartJs.Blazor.Fork`) with the same category color mapping.
- Always reference the SvelteKit implementation when unsure about UI behavior — it is the source of truth for visual output.
