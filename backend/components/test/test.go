package test

import (
	"encoding/json"
	"net/http"

	"onix.fun/m/v2/core"
)

type Component struct {
	cfg *core.Config
}

func (c *Component) Name() string {
	return "test"
}

func (c *Component) Init(cfg *core.Config, mux *http.ServeMux) error {
	c.cfg = cfg
	mux.HandleFunc("/test", c.handle)
	return nil
}

func (c *Component) handle(w http.ResponseWriter, r *http.Request) {
	c.cfg.Logger.Println("Is workin!")

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Is workin!",
	})
}
