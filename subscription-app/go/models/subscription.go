package models

import (
	"database/sql"
	"fmt"
	"math"
	"time"
)

type Subscription struct {
	ID                string    `db:"id" json:"id"`
	Name              string    `db:"name" json:"name"`
	Cost              float64   `db:"cost" json:"cost"`
	Currency          string    `db:"currency" json:"currency"`
	Frequency         string    `db:"frequency" json:"frequency"`
	Category          string    `db:"category" json:"category"`
	Status            string    `db:"status" json:"status"`
	StartDate         time.Time `db:"start_date" json:"start_date"`
	NextBillingDate   time.Time `db:"next_billing_date" json:"next_billing_date"`
}

type DashboardStats struct {
	TotalMonthlyCost float64 `json:"total_monthly_cost"`
	TotalAnnualCost  float64 `json:"total_annual_cost"`
	ActiveCount      int     `json:"active_count"`
}

type CategoryBreakdown struct {
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
}

func GetAll(db *sql.DB) ([]Subscription, error) {
	rows, err := db.Query("SELECT id, name, cost, currency, frequency, category, status, start_date, next_billing_date FROM subscriptions ORDER BY name")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subscriptions []Subscription
	for rows.Next() {
		var s Subscription
		if err := rows.Scan(&s.ID, &s.Name, &s.Cost, &s.Currency, &s.Frequency, &s.Category, &s.Status, &s.StartDate, &s.NextBillingDate); err != nil {
			return nil, err
		}
		subscriptions = append(subscriptions, s)
	}
	return subscriptions, rows.Err()
}

func CalculateAnnualEquivalent(cost float64, frequency string) float64 {
	switch frequency {
	case "daily":
		return cost * 365
	case "weekly":
		return cost * 52
	case "monthly":
		return cost * 12
	case "yearly":
		return cost
	default:
		return 0
	}
}

func CalculateMonthlyEquivalent(cost float64, frequency string) float64 {
	annual := CalculateAnnualEquivalent(cost, frequency)
	return math.Round(annual/12*100) / 100
}

func CalculateStats(subscriptions []Subscription) DashboardStats {
	var stats DashboardStats
	for _, s := range subscriptions {
		if s.Status == "active" {
			stats.ActiveCount++
			stats.TotalMonthlyCost += CalculateMonthlyEquivalent(s.Cost, s.Frequency)
			stats.TotalAnnualCost += CalculateAnnualEquivalent(s.Cost, s.Frequency)
		}
	}
	stats.TotalMonthlyCost = math.Round(stats.TotalMonthlyCost*100) / 100
	stats.TotalAnnualCost = math.Round(stats.TotalAnnualCost*100) / 100
	return stats
}

func GetUpcomingRenewals(db *sql.DB, days int) ([]Subscription, error) {
	query := fmt.Sprintf(
		"SELECT id, name, cost, currency, frequency, category, status, start_date, next_billing_date FROM subscriptions WHERE status = 'active' AND next_billing_date <= date('now', '+%d days') ORDER BY next_billing_date ASC",
		days,
	)
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var renewals []Subscription
	for rows.Next() {
		var s Subscription
		if err := rows.Scan(&s.ID, &s.Name, &s.Cost, &s.Currency, &s.Frequency, &s.Category, &s.Status, &s.StartDate, &s.NextBillingDate); err != nil {
			return nil, err
		}
		renewals = append(renewals, s)
	}
	return renewals, rows.Err()
}

func GetCategoryBreakdown(subscriptions []Subscription) []CategoryBreakdown {
	breakdown := make(map[string]float64)
	for _, s := range subscriptions {
		if s.Status == "active" {
			breakdown[s.Category] += CalculateMonthlyEquivalent(s.Cost, s.Frequency)
		}
	}

	var result []CategoryBreakdown
	for cat, amount := range breakdown {
		result = append(result, CategoryBreakdown{
			Category: cat,
			Amount:   math.Round(amount*100) / 100,
		})
	}
	return result
}
