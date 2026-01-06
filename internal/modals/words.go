package modals

type WordsMap map[string]*Words

type Words struct {
	Name string 	`json:"name"`
	Words []string  `json:"words"`
}
