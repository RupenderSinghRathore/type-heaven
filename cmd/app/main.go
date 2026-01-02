package main

import (
	"RupenderSinghRathore/type-heaven/web/view/pages"
	"context"
	"fmt"
	"net/http"
)

var wordCount int = 100

func main() {
	fs := http.FileServer(http.Dir("./web/assets/"))
	http.Handle("GET /static/", http.StripPrefix("/static/",fs))
	http.HandleFunc("GET /{$}", home)
	fmt.Printf("Starting serve at port :8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	data, err := getCommonWords()
	if err != nil {
		fmt.Printf("err: %v\n", err.Error())
	}
	w.Header().Set("Content-Type", "text/html")
	component := pages.Home(data, wordCount)
	component.Render(context.Background(), w)
	// templ.Handler(component)
}
