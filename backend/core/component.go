package core

import "net/http"

type Component interface {
	Name() string
	Init(cfg *Config, mux *http.ServeMux) error
}
