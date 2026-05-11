package handlers

import (
	"database/sql"
	"net/http"

	"github.com/labstack/echo/v4"

	"subscription-app/db"
	"subscription-app/models"
)

type Handler struct {
	db *sql.DB
}

func New() *Handler {
	return &Handler{db: db.GetDB()}
}

func (h *Handler) Dashboard(c echo.Context) error {
	subscriptions, err := models.GetAll(h.db)
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to load subscriptions")
	}

	stats := models.CalculateStats(subscriptions)
	renewals, err := models.GetUpcomingRenewals(h.db, 7)
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to load renewals")
	}

	categoryBreakdown := models.GetCategoryBreakdown(subscriptions)

	return c.Render(http.StatusOK, "dashboard", echo.Map{
		"Stats":            stats,
		"Subscriptions":    subscriptions,
		"Renewals":         renewals,
		"CategoryBreakdown": categoryBreakdown,
	})
}

func (h *Handler) ListSubscriptions(c echo.Context) error {
	subscriptions, err := models.GetAll(h.db)
	if err != nil {
		return c.String(http.StatusInternalServerError, "failed to load subscriptions")
	}

	return c.Render(http.StatusOK, "subscriptions", echo.Map{
		"Subscriptions": subscriptions,
	})
}
