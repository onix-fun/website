package digital_catalog

import (
	"encoding/json"
	"net/http"

	"onix.fun/m/v2/core"
)

type Component struct {
	cfg *core.Config
}

func (c *Component) Name() string {
	return "digital_catalog"
}

func (c *Component) Init(cfg *core.Config, mux *http.ServeMux) error {
	c.cfg = cfg
	mux.HandleFunc("GET /digital-catalog", c.handleList)
	mux.HandleFunc("GET /digital-catalog/{slug}", c.handleDetail)
	return nil
}

type DigitalProduct struct {
	ID          int64  `json:"id"`
	Slug        string `json:"slug"`
	Number      int    `json:"number"`
	Title       string `json:"title"`
	Subtitle    string `json:"subtitle"`
	Description string `json:"description"`
}

type DigitalProductDetail struct {
	ID          int64           `json:"id"`
	Slug        string          `json:"slug"`
	Number      int             `json:"number"`
	Title       string          `json:"title"`
	Subtitle    string          `json:"subtitle"`
	Description string          `json:"description"`
	Content     json.RawMessage `json:"content"`
}

func (c *Component) handleList(w http.ResponseWriter, r *http.Request) {
	rows, err := c.cfg.DB.Query("SELECT id, slug, number, title, COALESCE(subtitle,''), COALESCE(description,'') FROM digital_products ORDER BY number")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	products := []DigitalProduct{}
	for rows.Next() {
		var p DigitalProduct
		if err := rows.Scan(&p.ID, &p.Slug, &p.Number, &p.Title, &p.Subtitle, &p.Description); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func (c *Component) handleDetail(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")

	var p DigitalProductDetail
	var contentRaw []byte
	err := c.cfg.DB.QueryRow(
		"SELECT id, slug, number, title, COALESCE(subtitle,''), COALESCE(description,''), content FROM digital_products WHERE slug = $1",
		slug,
	).Scan(&p.ID, &p.Slug, &p.Number, &p.Title, &p.Subtitle, &p.Description, &contentRaw)
	if err != nil {
		http.Error(w, "digital product not found", http.StatusNotFound)
		return
	}

	if len(contentRaw) > 0 {
		p.Content = contentRaw
	} else {
		p.Content = json.RawMessage("{}")
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}
