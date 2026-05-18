using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BlazorApp.Models;

public class Subscription
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Cost { get; set; }

    [Required]
    [MaxLength(10)]
    public string Currency { get; set; } = "USD";

    [Required]
    [MaxLength(20)]
    public string Frequency { get; set; } = "monthly";

    [Required]
    [MaxLength(20)]
    public string Category { get; set; } = "other";

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "active";

    public DateTime StartDate { get; set; }

    public DateTime NextBillingDate { get; set; }
}
