package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "modernc.org/sqlite"
)

type Subscription struct {
	ID              string  `json:"id"`
	Name            string  `json:"name"`
	Cost            float64 `json:"cost"`
	Currency        string  `json:"currency"`
	Frequency       string  `json:"frequency"`
	Category        string  `json:"category"`
	Status          string  `json:"status"`
	StartDate       string  `json:"startDate"`
	NextBillingDate string  `json:"nextBillingDate"`
	CreatedAt       string  `json:"createdAt"`
	UpdatedAt       string  `json:"updatedAt"`
}

func InitDatabase(dbPath string) (*sql.DB, error) {
	if dbPath == "" {
		dbPath = "subscriptions.db"
	}

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	_, err = db.Exec("PRAGMA journal_mode=WAL")
	if err != nil {
		log.Printf("warning: could not enable WAL mode: %v", err)
	}

	_, err = db.Exec("PRAGMA foreign_keys=ON")
	if err != nil {
		log.Printf("warning: could not enable foreign keys: %v", err)
	}

	if err := ensureSchema(db); err != nil {
		return nil, fmt.Errorf("failed to ensure schema: %w", err)
	}

	if err := seedIfEmpty(db); err != nil {
		return nil, fmt.Errorf("failed to seed database: %w", err)
	}

	return db, nil
}

func ensureSchema(db *sql.DB) error {
	if tableExists(db, "subscriptions") {
		return nil
	}

	schema := `
	CREATE TABLE IF NOT EXISTS subscriptions (
		id                TEXT PRIMARY KEY,
		name              TEXT NOT NULL,
		cost              REAL NOT NULL,
		currency          TEXT NOT NULL DEFAULT 'USD',
		frequency         TEXT NOT NULL CHECK(frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
		category          TEXT NOT NULL CHECK(category IN ('streaming', 'software', 'utilities', 'health', 'other')),
		status            TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'cancelled')),
		startDate         DATE NOT NULL,
		nextBillingDate   DATE NOT NULL,
		createdAt         DATETIME DEFAULT (datetime('now')),
		updatedAt         DATETIME DEFAULT (datetime('now'))
	);`

	if _, err := db.Exec(schema); err != nil {
		return fmt.Errorf("failed to create subscriptions table: %w", err)
	}

	log.Println("Created subscriptions table")
	return nil
}

func seedIfEmpty(db *sql.DB) error {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM subscriptions").Scan(&count)
	if err != nil {
		return fmt.Errorf("failed to count subscriptions: %w", err)
	}

	if count > 0 {
		return nil
	}

	seedData := []struct {
		ID              string
		Name            string
		Cost            float64
		Currency        string
		Frequency       string
		Category        string
		Status          string
		StartDate       string
		NextBillingDate string
	}{
		{"550e8400-e29b-41d4-a716-446655440001", "Netflix", 15.99, "USD", "monthly", "streaming", "active", "2024-01-15", "2026-06-15"},
		{"550e8400-e29b-41d4-a716-446655440002", "Spotify", 9.99, "USD", "monthly", "streaming", "active", "2024-03-01", "2026-06-01"},
		{"550e8400-e29b-41d4-a716-446655440003", "GitHub Pro", 4.00, "USD", "monthly", "software", "active", "2024-06-10", "2026-06-10"},
		{"550e8400-e29b-41d4-a716-446655440004", "Adobe Creative Cloud", 54.99, "USD", "yearly", "software", "active", "2025-02-20", "2026-02-20"},
		{"550e8400-e29b-41d4-a716-446655440005", "Gym Membership", 30.00, "USD", "monthly", "health", "active", "2025-08-01", "2026-06-01"},
	}

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
		INSERT INTO subscriptions (id, name, cost, currency, frequency, category, status, startDate, nextBillingDate)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		return fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	for _, s := range seedData {
		if _, err := stmt.Exec(s.ID, s.Name, s.Cost, s.Currency, s.Frequency, s.Category, s.Status, s.StartDate, s.NextBillingDate); err != nil {
			return fmt.Errorf("failed to insert seed data for %s: %w", s.Name, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit seed data: %w", err)
	}

	log.Printf("Seeded %d subscriptions", len(seedData))
	return nil
}

func tableExists(db *sql.DB, tableName string) bool {
	var count int
	err := db.QueryRow(`
		SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?
	`, tableName).Scan(&count)
	return err == nil && count > 0
}
