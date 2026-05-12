# Blazor (.NET) Implementation Guide

Build the **Subscription Audit Dashboard** using Blazor Server. Match the SvelteKit reference implementation's UI/UX exactly.

**Read first:** `subscription-app/AGENTS.md` for the shared data model, UI/UX spec, and business logic.

---

## Tech Stack

| Layer | Choice |
| :--- | :--- |
| Framework | Blazor Server (.NET 8+) |
| Language | C# |
| Styling | Tailwind CSS (via `TailwindCSS.Blazor` or postcss) |
| UI Components | MudBlazor (or custom matching shadcn-svelte) |
| Icons | Lucide icons (via `Lucide.Blazor` or SVG) |
| Charts | `ChartJs.Blazor.Fork` |
| Database | SQLite + Entity Framework Core |
| ORM | EF Core with `Microsoft.Data.Sqlite` |

---

## Setup Commands

```bash
# 1. Create Blazor Server project
dotnet new blazorserver -n SubscriptionApp
cd SubscriptionApp

# 2. Install NuGet packages
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package MudBlazor
dotnet add package ChartJs.Blazor.Fork
dotnet add package Lucide.Blazor

# 3. Apply EF Core migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## Project Structure

```
SubscriptionApp/
├── Models/
│   └── Subscription.cs          # Entity model
├── Data/
│   ├── AppDbContext.cs          # EF Core DbContext
│   └── DbSeeder.cs              # Seed data logic
├── Services/
│   └── SubscriptionService.cs   # CRUD operations + business logic
├── Shared/
│   ├── MainLayout.razor         # Layout with sidebar
│   ├── NavMenu.razor            # Navigation menu
│   ├── StatCard.razor           # Hero stats card component
│   ├── SubscriptionTable.razor  # Data table component
│   ├── SubscriptionForm.razor   # Add/Edit form component
│   ├── DonutChart.razor         # Category breakdown chart
│   └── RenewalList.razor        # Upcoming renewals list
├── Pages/
│   ├── Index.razor              # Dashboard (/)
│   ├── Subscriptions.razor      # Subscription list (/subscriptions)
│   └── Settings.razor           # Settings (/settings)
├── Program.cs                   # App entry + DI setup
└── appsettings.json
```

---

## Implementation Steps

### Phase 1: Setup & Database
1. Create Blazor Server project with .NET 8.
2. Define `Subscription` entity in `Models/Subscription.cs` matching the shared schema.
3. Create `AppDbContext` in `Data/AppDbContext.cs` with `DbSet<Subscription>`.
4. Configure SQLite connection in `appsettings.json`.
5. Create `DbSeeder` — seed 5 sample subscriptions on first run if table is empty.
6. Register services in `Program.cs`.

### Phase 2: Service Layer (API + Business Logic)
1. Create `SubscriptionService` in `Services/SubscriptionService.cs`:
   - `Task<List<Subscription>> GetAllAsync()`
   - `Task<Subscription?> GetByIdAsync(string id)`
   - `Task<Subscription> CreateAsync(Subscription subscription)`
   - `Task<Subscription> UpdateAsync(Subscription subscription)`
   - `Task DeleteAsync(string id)`
2. Implement business logic in the service:
   - `double AnnualEquivalent(double cost, string frequency)`
   - `double TotalMonthlyCost(List<Subscription> subscriptions)`
   - `List<Subscription> GetUpcomingRenewals(int daysAhead)`
3. Register service as scoped in `Program.cs`.

### Phase 3: Dashboard Page
1. Build `MainLayout.razor` with sidebar navigation (Dashboard, Subscriptions, Settings).
2. Build `Index.razor` (Dashboard):
   - Display 3 `StatCard` components (monthly cost, annual cost, active count).
   - Left column: `DonutChart.razor` using ChartJs.Blazor.
   - Right column: `RenewalList.razor` showing next 7 days.
3. Use `@inject SubscriptionService` to fetch data in `OnInitializedAsync`.

### Phase 4: Subscription List Page
1. Build `Subscriptions.razor` with `SubscriptionTable` component.
2. Add MudBlazor dropdowns for category and status filters.
3. Implement sorting by clicking column headers (use `@onclick` handlers).
4. Add Edit/Delete buttons per row.
5. Build `SubscriptionForm.razor` as a modal (use MudDialog or custom overlay).
6. Wire up form validation with MudBlazor validation components.

### Phase 5: Settings & Polish
1. Build `Settings.razor` with "Reset Data" button (calls `DbSeeder.ResetAsync()`).
2. Style with Tailwind CSS or MudBlazor theme matching the shared spec colors.
3. Add loading states (`<MudProgressLinear>`).
4. Ensure responsive design (MudBlazor handles most of this).
5. Test all CRUD operations end-to-end.

---

## Key Implementation Notes

- **Entity Model:** Map C# properties to DB columns with `[Column]` attributes if needed.
- **Validation:** Use DataAnnotations (`[Required]`, `[Range]`) on the model + MudBlazor `Validation` component.
- **Calculations:** Put `AnnualEquivalent()`, `MonthlyEquivalent()`, `TotalMonthly()` in `SubscriptionService` or a separate `CalculationHelper` class.
- **Chart.js:** Use `ChartJs.Blazor.Fork` — configure `PieChart` with category colors.
- **MudBlazor components:** Use `MudCard`, `MudTable`, `MudSelect`, `MudTextField`, `MudDatePicker`, `MudDialog`.
- **Lucide icons:** Use `Lucide.Blazor` package or inline SVGs.
- **State management:** Blazor Server handles signalr connection automatically. Use cascading parameters or service injection for cross-component state.
- **API responses:** For Blazor Server, call the service directly — no REST API layer needed.

---

## MudBlazor Theme Configuration

Match the shared spec colors in `Program.cs`:
```csharp
builder.Services.AddMudServices(config =>
{
    config.Theme = new MudTheme
    {
        Palette = new Palette
        {
            Primary = "#4F46E5",      // Indigo
            Dark = "#111827",         // Dark text
            Success = "#10B981",      // Green
            Error = "#EF4444",        // Red
            AppbarBackground = "rgba(255,255,255,0.8)",
            AppbarText = "#111827",
        },
        LayoutProperties = new LayoutProperties
        {
            DefaultBorderRadius = "8px",
        }
    };
});
```

---

## Reference

Match the SvelteKit implementation's look and feel. When in doubt about styling, layout, or behavior, refer to the SvelteKit code in `subscription-app/sveltekit/`.
