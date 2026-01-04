package main

import (
	"RupenderSinghRathore/type-heaven/internal/modals"
	"encoding/json"
	"os"
)

func getCommonWords() (*modals.CommonWords, error) {
	content, err := os.ReadFile("./web/static/data/common-words.json")
	if err != nil {
		return nil, err
	}
	commonWords := &modals.CommonWords{}
	if err = json.Unmarshal(content, commonWords); err != nil {
		return nil, err
	}
	return commonWords, nil
}
