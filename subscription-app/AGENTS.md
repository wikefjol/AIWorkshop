# Subscription Audit Dashboard — Shared Specification

This file defines the **shared contract** that all framework implementations must follow. When building any framework variant, read this file plus the framework-specific `AGENTS.md` in that folder.

---

## App Overview

Build a **Subscription Audit Dashboard** — a web app that helps users track their recurring subscriptions, visualize spending, and plan cancellations. The app is being built in multiple frameworks as a comparison workshop for developers.

---

## Data Model (All Frameworks)

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

### Database
- Use **SQLite** as the database for all implementations.
- Store data in a local file (e.g., `subscriptions.db`).
- Run migrations on startup — the app must create tables if they don't exist.
- Seed the database with **5 sample subscriptions** if the table is empty (on first run).

### API / Data Access
Each framework must expose the following operations:

| Operation | Method | Description |
| :--- | :--- | :--- |
| List all subscriptions | `GET /api/subscriptions` | Returns all subscriptions |
| Get single subscription | `GET /api/subscriptions/:id` | Returns one subscription |
| Create subscription | `POST /api/subscriptions` | Creates a new subscription |
| Update subscription | `PUT /api/subscriptions/:id` | Updates an existing subscription |
| Delete subscription | `DELETE /api/subscriptions/:id` | Deletes a subscription |

---

## UI/UX Specification

All frameworks must produce the **same visual output**. Design reference:

### A. Layout
- **Sidebar Navigation** (left side, fixed width ~220px):
  - Links: "Dashboard", "Subscriptions", "Settings"
  - Active page highlighted
  - Collapsible on small screens
- **Main Content Area:** Clean, white background with subtle gray borders for cards.
- **Structure:** Responsive grid layout — works on desktop and mobile.

### B. Dashboard View (`/`)
1. **Hero Stats Cards (Top Row — 3 cards):**
   - **Total Monthly Cost:** Sum of all active subscriptions converted to monthly equivalent. Format: `$XX.XX`.
   - **Total Annual Cost:** Projected yearly spend. Format: `$X,XXX.XX`.
   - **Active Count:** Number of active subscriptions. Format: `X active`.
2. **Spending Breakdown (Left Column — ~60% width):**
   - A **Donut Chart** showing spending distribution by `category`.
   - Legend below chart with category names and percentages.
3. **Upcoming Renewals (Right Column — ~40% width):**
   - A list of subscriptions billing in the next 7 days, sorted by `nextBillingDate` ascending.
   - Show: Name, cost, billing date, frequency.

### C. Subscription List View (`/subscriptions`)
- A **Data Table** displaying all subscriptions.
- **Columns:** Name, Category, Cost, Frequency, Annual Equivalent, Status, Actions (Edit/Delete).
- **Filters:** Dropdowns for `category` and `status` (both default to "All").
- **Sort:** Click column headers to sort — default sort by `cost` descending.
- **Actions:** Edit (opens modal) and Delete (with confirmation).

### D. Add/Edit Modal
- A form overlay (modal/drawer) to add or edit a subscription.
- **Fields:**
  - Name (text input, required)
  - Cost (number input, required, must be > 0)
  - Frequency (dropdown: daily, weekly, monthly, yearly)
  - Category (dropdown: streaming, software, utilities, health, other)
  - Start Date (date picker)
  - Next Billing Date (date picker)
  - Status (dropdown: active, cancelled)
  - Currency (text input, default "USD")
- **Validation:** Client-side + server-side. Show inline error messages.
- **Buttons:** "Save" (primary), "Cancel" (secondary).

### E. Settings View (`/settings`)
- Simple page with app information and a "Reset Data" button (clears all subscriptions and re-seeds).

---

## Styling Rules
- Use **Tailwind CSS** for all implementations.
- Color palette:
  - Primary: Indigo (`#4F46E5`)
  - Background: White / Light Gray (`#F9FAFB`)
  - Text: Dark Gray (`#111827`)
  - Success: Green (`#10B981`)
  - Danger: Red (`#EF4444`)
- Use consistent card styling: white background, rounded corners (radius 8px), subtle shadow.
- Font: System font stack (Inter for headings, system-ui for body).

---

## Business Logic (All Frameworks)

### Annual Equivalent Calculation
Convert any frequency to annual cost:
- **Daily:** `cost * 365`
- **Weekly:** `cost * 52`
- **Monthly:** `cost * 12`
- **Yearly:** `cost * 1`

Display annual equivalent in the subscription table and in the dashboard hero stats.

### Total Monthly Cost Calculation
Convert all active subscriptions to monthly equivalent and sum:
- **Daily:** `cost * 365 / 12`
- **Weekly:** `cost * 52 / 12`
- **Monthly:** `cost * 1`
- **Yearly:** `cost / 12`

### "Savings Potential" Feature (Bonus)
- If a subscription's `startDate` is more than 1 year ago and status is `active`, show a "Cancel & Save" badge next to it displaying the annual cost in red (e.g., "Cancel & Save $234/yr").

---

## Sample Seed Data

Insert these 5 subscriptions on first run:

| Name | Cost | Currency | Frequency | Category | Status | Start Date | Next Billing |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Netflix | 15.99 | USD | monthly | streaming | active | 2024-01-15 | 2026-06-15 |
| Spotify | 9.99 | USD | monthly | streaming | active | 2024-03-01 | 2026-06-01 |
| GitHub Pro | 4.00 | USD | monthly | software | active | 2024-06-10 | 2026-06-10 |
| Adobe Creative Cloud | 54.99 | USD | yearly | software | active | 2025-02-20 | 2026-02-20 |
| Gym Membership | 30.00 | USD | monthly | health | active | 2025-08-01 | 2026-06-01 |

---

## Reference Implementation

The **SvelteKit** version is the reference implementation. All other frameworks should match its UI/UX exactly. When in doubt about styling, layout, or behavior, refer to the SvelteKit code.
