package reviews

import (
	"net/http"

	"onix.fun/m/v2/core"
)

type Component struct {
	cfg *core.Config
}

func (c *Component) Name() string {
	return "reviews"
}

func (c *Component) Init(cfg *core.Config, mux *http.ServeMux) error {
	c.cfg = cfg
	mux.HandleFunc("/content/reviews", c.handle)
	return nil
}

func (c *Component) handle(w http.ResponseWriter, r *http.Request) {
	svc := core.NewContentService(c.cfg.DB)
	data, err := svc.Get("reviews")
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
