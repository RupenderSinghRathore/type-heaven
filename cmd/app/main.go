package main

import (
	"RupenderSinghRathore/type-heaven/internal/modals"
	"fmt"
	"net/http"
)

const wordCount int = 100
const default_words string = "english_1k"

type application struct {
	wordsMap modals.WordsMap
}

func main() {
	data, err := modals.GetWordData()
	if err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
	app := &application{wordsMap: data}
	mux := app.router()

	fmt.Printf("Starting serve at port :8080\n")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		fmt.Printf("err: %s\n", err.Error())
	}
}
