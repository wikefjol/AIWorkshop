package util

func AnnualEquivalent(cost float64, freq string) float64 {
	switch freq {
	case "daily":
		return cost * 365
	case "weekly":
		return cost * 52
	case "monthly":
		return cost * 12
	case "yearly":
		return cost
	default:
		return cost * 12
	}
}

func MonthlyEquivalent(cost float64, freq string) float64 {
	switch freq {
	case "daily":
		return cost * 365 / 12
	case "weekly":
		return cost * 52 / 12
	case "monthly":
		return cost
	case "yearly":
		return cost / 12
	default:
		return cost
	}
}

func TotalMonthly(subscriptions []Subscription) float64 {
	var total float64
	for _, s := range subscriptions {
		if s.Status == "active" {
			total += MonthlyEquivalent(s.Cost, s.Frequency)
		}
	}
	return total
}

type Subscription struct {
	Name      string
	Cost      float64
	Frequency string
	Status    string
}
