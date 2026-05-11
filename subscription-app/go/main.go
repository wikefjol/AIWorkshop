package main

import (
    "html/template"
    "io"
    "log"
    "net/http"
    "path/filepath"

    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"

    "subscription-app/db"
    "subscription-app/handlers"
)

type templateRegistry struct {
	templates map[string]*template.Template
}

func (r *templateRegistry) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	t, ok := r.templates[name]
	if !ok {
		return c.String(http.StatusInternalServerError, "template not found: "+name)
	}
	return t.ExecuteTemplate(w.(http.ResponseWriter), "base", data)
}

func loadTemplates() *templateRegistry {
	templates := make(map[string]*template.Template)

	basePath := "./templates"
	pages := []string{"dashboard", "subscriptions"}

	for _, name := range pages {
		pagePath := filepath.Join(basePath, name+".html")
		layoutPath := filepath.Join(basePath, "layout.html")
		t := template.Must(template.ParseFiles(layoutPath, pagePath))
		templates[name] = t
	}

	return &templateRegistry{templates: templates}
}

func main() {
	// Initialize database (creates file + runs migrations)
	if err := db.Init(); err != nil {
		log.Fatal("failed to initialize database:", err)
	}
	defer db.Close()

	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.Gzip())

	// Static files
	e.Static("/static", "./static")

	// Template setup
	e.Renderer = loadTemplates()

	// Routes
	h := handlers.New()
	e.GET("/", h.Dashboard)
	e.GET("/subscriptions", h.ListSubscriptions)

	log.Println("Server starting on :8080")
	if err := e.Start(":8080"); err != nil {
		log.Fatal("server failed:", err)
	}
}
