package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func (app *application) router() *chi.Mux {
	r := chi.NewRouter()
	fs := http.FileServer(http.Dir("./web/assets/"))
	r.Handle("/static/*", http.StripPrefix("/static/", fs))

	r.Get("/", app.home)
	r.Post("/showResult", app.result)
	r.Post("/reloadTest", app.reloadTest)
	r.Post("/loadHome", app.loadHome)
	return r
}
