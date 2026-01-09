package main

import (
	"RupenderSinghRathore/type-heaven/web/view"
	"RupenderSinghRathore/type-heaven/web/view/pages"
	"context"
	"fmt"
	"net/http"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	home := pages.Home(app.wordsMap[default_words], wordCount)

	base := view.Base(home)
	base.Render(context.Background(), w)
}
func (app *application) result(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	if err := r.ParseForm(); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
	resultData := &pages.ResultData{
		Wpm:      r.FormValue("wpm"),
		Accuracy: r.FormValue("accuracy"),
	}
	if err := pages.ResultPage(resultData).Render(context.Background(), w); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}
func (app *application) reloadTest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	if err := pages.TypingArea(app.wordsMap[default_words], wordCount).Render(context.Background(), w); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}

func (app *application) reloadHome(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	if err := pages.Home(app.wordsMap[default_words], wordCount).Render(context.Background(), w); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}
