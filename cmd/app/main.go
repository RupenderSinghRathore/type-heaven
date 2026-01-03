package main

import (
	"RupenderSinghRathore/type-heaven/web/view"
	"RupenderSinghRathore/type-heaven/web/view/pages"
	"context"
	"fmt"
	"net/http"
)

var wordCount int = 100

func main() {
	fs := http.FileServer(http.Dir("./web/assets/"))
	http.Handle("GET /static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("GET /{$}", home)
	http.HandleFunc("POST /showResult", result)
	http.HandleFunc("POST /reloadTest", reloadTest)
	http.HandleFunc("POST /loadHome", loadHome)

	fmt.Printf("Starting serve at port :8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	data, err := getCommonWords()
	if err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
	w.Header().Set("Content-Type", "text/html")
	home := pages.Home(data, wordCount)

	base := view.Base(home)
	base.Render(context.Background(), w)
}
func result(w http.ResponseWriter, r *http.Request) {
	if err := pages.ResultPage().Render(context.Background(), w); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}
func reloadTest(w http.ResponseWriter, r *http.Request) {
	data, err := getCommonWords()
	if err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
	if err = pages.TypingArea(data, wordCount).Render(context.Background(), w); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}

func loadHome(w http.ResponseWriter, r *http.Request) {
	data, err := getCommonWords()
	if err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
	w.Header().Set("Content-Type", "text/html")
	if err = pages.Home(data, wordCount).Render(context.Background(), w); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}
