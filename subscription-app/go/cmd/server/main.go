package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"runtime"
	"syscall"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	subdb "subscription-app/internal/db"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbPath := os.Getenv("DB_PATH")

	database, err := subdb.InitDatabase(dbPath)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer database.Close()

	log.Println("Database initialized successfully")

	r := setupRouter(database)

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: r,
	}

	go func() {
		log.Printf("Server starting on http://localhost:%s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")
	server.Close()
}

func setupRouter(db *sql.DB) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.StripSlashes)

	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:*"},
		AllowCredentials: true,
	}).Handler)

	// Resolve paths relative to go.mod location (works regardless of working directory)
	rootDir := findModuleRoot()
	if rootDir == "" {
		log.Fatal("Could not locate module root (go.mod not found)")
	}

	staticPath := filepath.Join(rootDir, "static")
	if _, err := os.Stat(staticPath); err == nil {
		r.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir(staticPath))))
	} else {
		log.Printf("warning: static directory not found at %s", staticPath)
	}

	templatesDir := filepath.Join(rootDir, "templates")
	tmpl := template.New("").Funcs(templateHelpers())
	for _, pattern := range []string{
		filepath.Join(templatesDir, "*.html"),
		filepath.Join(templatesDir, "partials", "*.html"),
		filepath.Join(templatesDir, "modal", "*.html"),
	} {
		if _, err := tmpl.ParseGlob(pattern); err != nil {
			log.Printf("warning: no templates matched %s: %v", pattern, err)
		}
	}

	if tmpl.Lookup("base.html") == nil {
		log.Printf("error: base.html not found. templatesDir=%s, rootDir=%s", templatesDir, rootDir)
		log.Fatal("Template 'base.html' is missing — check that templates/ exists at the module root")
	}

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		renderTemplate(w, tmpl, "base.html", map[string]interface{}{
			"Title":  "Dashboard",
			"Active": "dashboard",
		})
	})

	r.Get("/subscriptions", func(w http.ResponseWriter, r *http.Request) {
		renderTemplate(w, tmpl, "base.html", map[string]interface{}{
			"Title":  "Subscriptions",
			"Active": "subscriptions",
		})
	})

	r.Get("/settings", func(w http.ResponseWriter, r *http.Request) {
		renderTemplate(w, tmpl, "base.html", map[string]interface{}{
			"Title":  "Settings",
			"Active": "settings",
		})
	})

	r.Get("/api/subscriptions", func(w http.ResponseWriter, r *http.Request) {
		jsonResponse(w, map[string]interface{}{
			"success": true,
			"data":    []subdb.Subscription{},
		})
	})

	r.Get("/api/subscriptions/{id}", func(w http.ResponseWriter, r *http.Request) {
		jsonResponse(w, map[string]interface{}{
			"success": true,
			"data":    nil,
		})
	})

	r.Post("/api/subscriptions", func(w http.ResponseWriter, r *http.Request) {
		jsonResponse(w, map[string]interface{}{
			"success": false,
			"error":   "Not implemented yet",
		})
	})

	r.Put("/api/subscriptions/{id}", func(w http.ResponseWriter, r *http.Request) {
		jsonResponse(w, map[string]interface{}{
			"success": false,
			"error":   "Not implemented yet",
		})
	})

	r.Delete("/api/subscriptions/{id}", func(w http.ResponseWriter, r *http.Request) {
		jsonResponse(w, map[string]interface{}{
			"success": false,
			"error":   "Not implemented yet",
		})
	})

	return r
}

func jsonResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func renderTemplate(w http.ResponseWriter, tmpl *template.Template, name string, data map[string]interface{}) {
	w.Header().Set("Content-Type", "text/html")
	if err := tmpl.ExecuteTemplate(w, name, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func templateHelpers() template.FuncMap {
	return template.FuncMap{
		"eq": func(a, b string) bool {
			return a == b
		},
	}
}

// findModuleRoot walks up from the source file location to find go.mod.
func findModuleRoot() string {
	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return ""
}
