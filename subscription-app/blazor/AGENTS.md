# Blazor (.NET) Implementation Guide

Build the **Subscription Audit Dashboard** using Blazor Server. Match the SvelteKit reference implementation's UI/UX exactly.

**Read first:** 
- `subscription-app/AGENTS.md` for the shared data model, UI/UX spec, and business logic
- `plans/PLAN.md` for the staged implementation phases applicable to all frameworks

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

## Key Implementation Notes

### Architecture
- Blazor Server calls the service directly — no separate REST API layer needed (SignalR handles UI updates).
- If you need a REST API for cross-framework parity, expose it via minimal endpoints in `Program.cs`.

### Entity & Persistence
- Define `Subscription` entity in `Models/Subscription.cs`. Map properties to columns with `[Column]` attributes if naming differs from C# conventions.
- `AppDbContext` in `Data/AppDbContext.cs` with `DbSet<Subscription>`. Configure SQLite connection string in `appsettings.json`.
- Migrations: `dotnet ef migrations add InitialCreate && dotnet ef database update`.

### Service Layer
- `SubscriptionService` (scoped) exposes repository-style async methods:
  - `Task<List<Subscription>> GetAllAsync(IEnumerable<string>? categories = null, IEnumerable<string>? statuses = null)`
  - `Task<Subscription?> GetByIdAsync(string id)`
  - `Task<Subscription> CreateAsync(Subscription sub)`
  - `Task<Subscription> UpdateAsync(Subscription sub)`
  - `Task DeleteAsync(string id)`
- Validation: DataAnnotations on the model (`[Required]`, `[Range(0.01, double.MaxValue)]`) + server-side checks in service methods.

### UI Components (Razor)
| Component | Razor file | Notes |
|-----------|-----------|-------|
| Layout | `MainLayout.razor` | Renders sidebar + `@Body`. Use conditional CSS class for active nav link (`@page == "/" ? "active" : ""`). |
| Nav Menu | `NavMenu.razor` | MudBlazor `MudNavigationLink` items for Dashboard, Subscriptions, Settings. Collapsible on small screens via `MudDrawer`. |
| Stat Card | `StatCard.razor` | Reusable: receives `Title`, `Value`, `IconName`. Use `MudCard` wrapper. |
| Donut Chart | `DonutChart.razor` | `ChartJs.Blazor.Fork` — configure as `PieChart`. Map categories to colors in the chart config. |
| Renewal List | `RenewalList.razor` | Range over service result filtered for next 7 days. Display with `MudList`. |
| Table | `SubscriptionTable.razor` | `MudTable` with `MudTh` for sortable headers (`@onclick` updates state, triggers `StateHasChanged`). |
| Form Modal | `SubscriptionForm.razor` | Wrap in `MudDialog`. Use `MudForm` + `Validation` component for field validation. |

### Business Logic
- Put calculations in a shared helper: `internal/CostCalculator.cs` or inside the service:
  - `double AnnualEquivalent(double cost, string frequency)`
  - `double MonthlyEquivalent(double cost, string frequency)`
  - `double TotalMonthly(List<Subscription> subscriptions)`

### Styling
- Primary styling via MudBlazor theme (see Theme Config below).
- Supplement with Tailwind CSS where MudBlazor doesn't have a matching component. Use `TailwindCSS.Blazor.Interop` for inline Tailwind classes, or apply Tailwind directly to `.razor` file markup.

## MudBlazor Theme Configuration

Match the shared spec colors in `Program.cs`:
```csharp
builder.Services.AddMudServices(config =>
{
    config.Theme = new MudTheme
    {
        Palette = new Palette
        {
            Primary = "#4F46E5",           // Indigo
            Dark = "#111827",              // Dark text
            Success = "#10B981",           // Green
            Error = "#EF4444",             // Red
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

## Reference

Match the SvelteKit implementation's look and feel. When in doubt about styling, layout, or behavior, refer to the SvelteKit code in `subscription-app/sveltekit/`.
