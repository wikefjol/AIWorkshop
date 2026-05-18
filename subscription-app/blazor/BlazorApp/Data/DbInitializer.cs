using BlazorApp.Models;

namespace BlazorApp.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        context.Database.EnsureCreated();

        if (context.Subscriptions.Any())
            return;

        var subscriptions = new List<Subscription>
        {
            new Subscription
            {
                Name = "Netflix",
                Cost = 15.99m,
                Currency = "USD",
                Frequency = "monthly",
                Category = "streaming",
                Status = "active",
                StartDate = new DateTime(2024, 1, 15),
                NextBillingDate = new DateTime(2026, 6, 15)
            },
            new Subscription
            {
                Name = "Spotify",
                Cost = 9.99m,
                Currency = "USD",
                Frequency = "monthly",
                Category = "streaming",
                Status = "active",
                StartDate = new DateTime(2024, 3, 1),
                NextBillingDate = new DateTime(2026, 6, 1)
            },
            new Subscription
            {
                Name = "GitHub Pro",
                Cost = 4.00m,
                Currency = "USD",
                Frequency = "monthly",
                Category = "software",
                Status = "active",
                StartDate = new DateTime(2024, 6, 10),
                NextBillingDate = new DateTime(2026, 6, 10)
            },
            new Subscription
            {
                Name = "Adobe Creative Cloud",
                Cost = 54.99m,
                Currency = "USD",
                Frequency = "yearly",
                Category = "software",
                Status = "active",
                StartDate = new DateTime(2025, 2, 20),
                NextBillingDate = new DateTime(2026, 2, 20)
            },
            new Subscription
            {
                Name = "Gym Membership",
                Cost = 30.00m,
                Currency = "USD",
                Frequency = "monthly",
                Category = "health",
                Status = "active",
                StartDate = new DateTime(2025, 8, 1),
                NextBillingDate = new DateTime(2026, 6, 1)
            }
        };

        context.Subscriptions.AddRange(subscriptions);
        context.SaveChanges();
    }
}
