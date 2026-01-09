package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) router() *chi.Mux {
	r := chi.NewRouter()
	r.Use(middleware.Compress(5))
	r.Use(middleware.Logger)
	fs := http.FileServer(http.Dir("./web/assets/"))
	r.Handle("/static/*", http.StripPrefix("/static/", fs))

	r.Get("/", app.home)
	r.Post("/result", app.result)
	r.Post("/test", app.reloadTest)
	r.Post("/home", app.reloadHome)
	return r
}
