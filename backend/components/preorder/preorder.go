package preorder

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"onix.fun/m/v2/core"
)

type Component struct {
	cfg *core.Config
}

func (c *Component) Name() string {
	return "preorder"
}

func (c *Component) Init(cfg *core.Config, mux *http.ServeMux) error {
	c.cfg = cfg
	mux.HandleFunc("POST /preorders", c.handleCreate)
	mux.HandleFunc("GET /preorders/{id}", c.handleGet)
	return nil
}

func (c *Component) handleCreate(w http.ResponseWriter, r *http.Request) {
	var req core.PreorderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.Name) == "" || strings.TrimSpace(req.Phone) == "" {
		http.Error(w, "name and phone are required", http.StatusBadRequest)
		return
	}

	svc := core.NewPreorderService(c.cfg.DB)
	id, err := svc.CreateOrder(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int64{"id": id})
}

func (c *Component) handleGet(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	svc := core.NewPreorderService(c.cfg.DB)
	order, err := svc.GetOrder(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}
