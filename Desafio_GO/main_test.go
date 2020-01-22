package main

import (
	"net/http"
	"testing"
)

func TestHealthCheckHandler(t *testing.T) {
    // Create a request to pass to our handler. We don't have any query parameters for now, so we'll
    // pass 'nil' as the third parameter.
    _ , err := http.NewRequest("GET", "/", nil)
    if err != nil {
        t.Fatal(err)
	}
}