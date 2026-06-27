package core

import "net/http"

type Component interface {
	Init(cfg *Config, mux *http.ServeMux) error
}
