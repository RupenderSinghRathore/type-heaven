package modals

import (
	"fmt"
	"os"
)

func Temp() {
	fs, err := os.Open("./web/static/data")
	if err != nil {
		fmt.Printf("err: %v\n", err.Error())
	}
	files, err := fs.Readdirnames(-1)
	if err != nil {
		fmt.Printf("err: %v\n", err.Error())
	}
	fmt.Printf("files: %+v\n", files)
}
