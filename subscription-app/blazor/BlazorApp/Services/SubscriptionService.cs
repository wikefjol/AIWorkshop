using BlazorApp.Data;
using BlazorApp.Models;

namespace BlazorApp.Services;

public class SubscriptionService
{
    private readonly AppDbContext _context;

    public SubscriptionService(AppDbContext context)
    {
        _context = context;
    }

    public Task<List<Subscription>> GetAllAsync(string? category = null, string? status = null)
    {
        var query = _context.Subscriptions.AsQueryable();

        if (!string.IsNullOrEmpty(category) && category != "all")
            query = query.Where(s => s.Category == category);

        if (!string.IsNullOrEmpty(status) && status != "all")
            query = query.Where(s => s.Status == status);

        return Task.FromResult(query.OrderByDescending(s => s.Cost).ToList());
    }

    public Task<Subscription?> GetByIdAsync(string id)
    {
        return Task.FromResult(_context.Subscriptions.Find(id));
    }

    public async Task<Subscription> CreateAsync(Subscription subscription)
    {
        subscription.Id = Guid.NewGuid().ToString();
        _context.Subscriptions.Add(subscription);
        await _context.SaveChangesAsync();
        return subscription;
    }

    public async Task<Subscription?> UpdateAsync(Subscription subscription)
    {
        var existing = _context.Subscriptions.Find(subscription.Id);
        if (existing == null)
            return null;

        existing.Name = subscription.Name;
        existing.Cost = subscription.Cost;
        existing.Currency = subscription.Currency;
        existing.Frequency = subscription.Frequency;
        existing.Category = subscription.Category;
        existing.Status = subscription.Status;
        existing.StartDate = subscription.StartDate;
        existing.NextBillingDate = subscription.NextBillingDate;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteAsync(string id)
    {
        var subscription = _context.Subscriptions.Find(id);
        if (subscription != null)
        {
            _context.Subscriptions.Remove(subscription);
            await _context.SaveChangesAsync();
        }
    }

    public decimal AnnualEquivalent(decimal cost, string frequency)
    {
        return frequency switch
        {
            "daily" => cost * 365,
            "weekly" => cost * 52,
            "monthly" => cost * 12,
            "yearly" => cost,
            _ => cost * 12
        };
    }

    public decimal MonthlyEquivalent(decimal cost, string frequency)
    {
        return frequency switch
        {
            "daily" => cost * 365 / 12,
            "weekly" => cost * 52 / 12,
            "monthly" => cost,
            "yearly" => cost / 12,
            _ => cost
        };
    }

    public Task<decimal> TotalMonthlyAsync()
    {
        var active = _context.Subscriptions.Where(s => s.Status == "active").ToList();
        return Task.FromResult(active.Sum(s => MonthlyEquivalent(s.Cost, s.Frequency)));
    }

    public Task<decimal> TotalAnnualAsync()
    {
        var active = _context.Subscriptions.Where(s => s.Status == "active").ToList();
        return Task.FromResult(active.Sum(s => AnnualEquivalent(s.Cost, s.Frequency)));
    }

    public Task<int> ActiveCountAsync()
    {
        return Task.FromResult(_context.Subscriptions.Count(s => s.Status == "active"));
    }

    public Task<List<Subscription>> UpcomingRenewalsAsync(int days = 7)
    {
        var today = DateTime.Today;
        var endDate = today.AddDays(days);
        var result = _context.Subscriptions
            .Where(s => s.Status == "active" && s.NextBillingDate >= today && s.NextBillingDate <= endDate)
            .OrderBy(s => s.NextBillingDate)
            .ToList();
        return Task.FromResult(result);
    }

    public async Task ResetDataAsync()
    {
        _context.Subscriptions.RemoveRange(_context.Subscriptions);
        await _context.SaveChangesAsync();
        DbInitializer.Initialize(_context);
    }
}
