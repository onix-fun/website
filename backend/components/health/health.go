package health

import (
	"encoding/json"
	"net/http"

	"onix.fun/m/v2/core"
)

type Component struct {
	cfg *core.Config
}

func (c *Component) Name() string {
	return "health"
}

func (c *Component) Init(cfg *core.Config, mux *http.ServeMux) error {
	c.cfg = cfg
	mux.HandleFunc("/health", c.handle)
	return nil
}

func (c *Component) handle(w http.ResponseWriter, r *http.Request) {
	dbStatus := "alive"
	if err := c.cfg.DB.Ping(); err != nil {
		dbStatus = "dead"
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(map[string]string{
		"status":   "ok",
		"database": dbStatus,
	}); err != nil {
		c.cfg.Logger.Printf("health: failed to encode response: %v", err)
	}
}
