package main

import (
	"RupenderSinghRathore/type-heaven/internal/modals"
	"RupenderSinghRathore/type-heaven/web/view"
	"RupenderSinghRathore/type-heaven/web/view/pages"
	"context"
	"fmt"
	"net/http"
)

var wordCount int = 10

type application struct {
	words *modals.CommonWords
}

func main() {
	data, err := getCommonWords()
	if err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
	app := &application{words: data}
	fs := http.FileServer(http.Dir("./web/assets/"))
	http.Handle("GET /static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("GET /{$}", app.home)
	http.HandleFunc("POST /showResult", app.result)
	http.HandleFunc("POST /reloadTest", app.reloadTest)
	http.HandleFunc("POST /loadHome", app.loadHome)

	fmt.Printf("Starting serve at port :8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}

func (app *application)home(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	home := pages.Home(app.words, wordCount)

	base := view.Base(home)
	base.Render(context.Background(), w)
}
func (app *application)result(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
	resultData := &pages.ResultData{
		Wpm:      r.FormValue("wpm"),
		Accuracy: r.FormValue("accuracy"),
	}
	// fmt.Printf("result: %v\n", resultData)
	if err := pages.ResultPage(resultData).Render(context.Background(), w); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}
func (app *application)reloadTest(w http.ResponseWriter, r *http.Request) {
	if err := pages.TypingArea(app.words, wordCount).Render(context.Background(), w); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}

func (app *application)loadHome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	if err := pages.Home(app.words, wordCount).Render(context.Background(), w); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}
