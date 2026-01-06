package modals

import (
	"encoding/json"
	"os"
	"path/filepath"
)

var dataDir = "./web/static/data"

func GetWordData() (WordsMap, error) {
	// TODO: Implement iterator to load all files in memory
	dir, err := os.Open(dataDir)
	if err != nil {
		return nil, err
	}
	defer dir.Close()
	files, err := dir.Readdirnames(-1)
	wordsMap := WordsMap{}
	var path string
	for _, file := range files {
		// path = dataDir + "/" + file
		path = filepath.Join(dataDir, "/", file)
		content, err := os.ReadFile(path)
		if err != nil {
			return nil, err
		}
		words := &Words{}
		if err = json.Unmarshal(content, words); err != nil {
			return nil, err
		}
		wordsMap[words.Name] = words
	}
	return wordsMap, nil
}
