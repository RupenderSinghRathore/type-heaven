package modals

type UserState struct {
	Mode string  // time or word
	TestType string // english_1k or english_10k
	ModeCount int // 30 secs or 50 words
	Words *Words
}
