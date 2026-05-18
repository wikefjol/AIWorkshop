using Microsoft.EntityFrameworkCore;
using BlazorApp.Models;

namespace BlazorApp.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Subscription> Subscriptions => Set<Subscription>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Cost).IsRequired();
            entity.Property(e => e.Currency).IsRequired().HasMaxLength(10).HasDefaultValue("USD");
            entity.Property(e => e.Frequency).IsRequired().HasMaxLength(20).HasDefaultValue("monthly");
            entity.Property(e => e.Category).IsRequired().HasMaxLength(20).HasDefaultValue("other");
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20).HasDefaultValue("active");
            entity.Property(e => e.StartDate).IsRequired();
            entity.Property(e => e.NextBillingDate).IsRequired();
        });
    }
}
