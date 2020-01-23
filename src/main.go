package main

import (
	"fmt"
	"math"
	"net/http"
)
func main() {

	greeting("Code.education Rocks!")

	fmt.Println(http.ListenAndServe(":8000", nil))
	
}

func greeting(s string){
	x := 0.0001
	for i := 0; i <= 10000; i++ {
		x += math.Sqrt(x)
	}
	http.HandleFunc("/", func( w http.ResponseWriter, r *http.Request ){
		fmt.Fprintf(w, "<b>%s</b>", s)
	})
}