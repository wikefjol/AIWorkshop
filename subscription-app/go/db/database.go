package db

import (
	"crypto/rand"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "modernc.org/sqlite"
)

var database *sql.DB

func Init() error {
	var err error
	database, err = sql.Open("sqlite", "subscriptions.db?_journal_mode=WAL")
	if err != nil {
		return err
	}

	if err := database.Ping(); err != nil {
		return err
	}

	if err := createTables(); err != nil {
		return err
	}

	if err := seedData(); err != nil {
		return err
	}

	log.Println("Database initialized successfully")
	return nil
}

func GetDB() *sql.DB {
	return database
}

func Close() error {
	if database != nil {
		return database.Close()
	}
	return nil
}

func createTables() error {
	query := `
	CREATE TABLE IF NOT EXISTS subscriptions (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		cost REAL NOT NULL,
		currency TEXT NOT NULL DEFAULT 'SEK',
		frequency TEXT NOT NULL CHECK(frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
		category TEXT NOT NULL CHECK(category IN ('streaming', 'software', 'utilities', 'health', 'other')),
		status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'cancelled')),
		start_date TEXT NOT NULL,
		next_billing_date TEXT NOT NULL
	);`

	_, err := database.Exec(query)
	return err
}

func seedData() error {
	count := 0
	err := database.QueryRow("SELECT COUNT(*) FROM subscriptions").Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		return nil
	}

	now := time.Now()
	subscriptions := []struct {
		name            string
		cost            float64
		frequency       string
		category        string
		startDate       time.Time
		nextBillingDate time.Time
	}{
		{"Netflix", 249, "monthly", "streaming", now.AddDate(0, -2, 0), now.AddDate(0, 0, 15)},
		{"Spotify", 149, "monthly", "streaming", now.AddDate(0, -1, 10), now.AddDate(0, 0, 20)},
		{"Adobe Creative Cloud", 1299, "monthly", "software", now.AddDate(0, -6, 0), now.AddDate(0, 0, 5)},
		{"Microsoft 365", 99, "monthly", "software", now.AddDate(0, -3, 0), now.AddDate(0, 0, 25)},
		{"Electric Bill", 450, "monthly", "utilities", now.AddDate(0, -1, 0), now.AddDate(0, 0, 10)},
		{"Gym Membership", 399, "monthly", "health", now.AddDate(0, -12, 0), now.AddDate(0, 0, 1)},
		{"iCloud+", 29, "monthly", "other", now.AddDate(0, -4, 0), now.AddDate(0, 0, 18)},
		{"New York Times", 149, "weekly", "other", now.AddDate(0, -8, 0), now.AddDate(0, 0, 3)},
		{"GitHub Pro", 99, "yearly", "software", now.AddDate(0, -1, 0), now.AddDate(0, 1, 0)},
	}

	insertQuery := `INSERT INTO subscriptions (id, name, cost, currency, frequency, category, status, start_date, next_billing_date) VALUES (?, ?, ?, 'SEK', ?, ?, 'active', ?, ?)`

	for _, s := range subscriptions {
		id := generateUUID()
		startDate := s.startDate.Format("2006-01-02")
		nextBilling := s.nextBillingDate.Format("2006-01-02")
		_, err := database.Exec(insertQuery, id, s.name, s.cost, s.frequency, s.category, startDate, nextBilling)
		if err != nil {
			return err
		}
	}

	return nil
}

func generateUUID() string {
	b := make([]byte, 16)
	rand.Read(b)
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80
	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:16])
}
