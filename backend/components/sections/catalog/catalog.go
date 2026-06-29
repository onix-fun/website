package catalog

import (
	"encoding/json"
	"net/http"

	"onix.fun/m/v2/core"
)

type Component struct {
	cfg *core.Config
}

func (c *Component) Name() string {
	return "catalog"
}

func (c *Component) Init(cfg *core.Config, mux *http.ServeMux) error {
	c.cfg = cfg
	mux.HandleFunc("GET /catalog", c.handleList)
	mux.HandleFunc("GET /catalog/{slug}", c.handleDetail)
	return nil
}

type Category struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type Product struct {
	ID         int64    `json:"id"`
	Name       string   `json:"name"`
	NameRU     string   `json:"name_ru"`
	Slug       string   `json:"slug"`
	Price      int      `json:"price"`
	ImageURL   string   `json:"image_url"`
	Badge      string   `json:"badge"`
	Colors     []string `json:"colors"`
	BgColor    string   `json:"bg_color"`
	CategoryID int64    `json:"category_id"`
	InStock    bool     `json:"in_stock"`
}

type ProductDetail struct {
	ID         int64                 `json:"id"`
	Name       string                `json:"name"`
	NameRU     string                `json:"name_ru"`
	Slug       string                `json:"slug"`
	Price      int                   `json:"price"`
	ImageURL   string                `json:"image_url"`
	Badge      string                `json:"badge"`
	Colors     []string              `json:"colors"`
	BgColor    string                `json:"bg_color"`
	CategoryID int64                 `json:"category_id"`
	InStock    bool                  `json:"in_stock"`
	Details    json.RawMessage       `json:"details"`
	Category   string                `json:"category"`
	CategorySlug string              `json:"category_slug"`
}

type CatalogResponse struct {
	Categories []Category `json:"categories"`
	Products   []Product  `json:"products"`
}

func (c *Component) handleList(w http.ResponseWriter, r *http.Request) {
	rows, err := c.cfg.DB.Query("SELECT id, name, slug FROM categories WHERE EXISTS (SELECT 1 FROM products p WHERE p.category_id = categories.id) ORDER BY id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	categories := []Category{}
	for rows.Next() {
		var cat Category
		if err := rows.Scan(&cat.ID, &cat.Name, &cat.Slug); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		categories = append(categories, cat)
	}

	categorySlug := r.URL.Query().Get("category")

	var productRows *[]Product
	if categorySlug != "" && categorySlug != "all" {
		productRows, err = c.queryProducts("WHERE p.category_id = (SELECT id FROM categories WHERE slug = $1)", categorySlug)
	} else {
		productRows, err = c.queryProducts("")
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := CatalogResponse{
		Categories: categories,
		Products:   *productRows,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (c *Component) handleDetail(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")

	var p ProductDetail
	var colorsRaw []byte
	var detailsRaw []byte
	err := c.cfg.DB.QueryRow(`
		SELECT p.id, p.name, p.name_ru, p.slug, p.price, COALESCE(p.image_url,''),
		       COALESCE(p.badge,''), p.colors, COALESCE(p.bg_color,''),
		       p.category_id, p.in_stock, p.details,
		       COALESCE(c.name,''), COALESCE(c.slug,'')
		FROM products p
		LEFT JOIN categories c ON c.id = p.category_id
		WHERE p.slug = $1
		LIMIT 1`, slug).Scan(
		&p.ID, &p.Name, &p.NameRU, &p.Slug, &p.Price, &p.ImageURL,
		&p.Badge, &colorsRaw, &p.BgColor,
		&p.CategoryID, &p.InStock, &detailsRaw,
		&p.Category, &p.CategorySlug,
	)
	if err != nil {
		http.Error(w, "product not found", http.StatusNotFound)
		return
	}

	if len(colorsRaw) > 0 {
		json.Unmarshal(colorsRaw, &p.Colors)
	}
	if p.Colors == nil {
		p.Colors = []string{}
	}
	if len(detailsRaw) > 0 {
		p.Details = detailsRaw
	} else {
		p.Details = json.RawMessage("{}")
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func (c *Component) queryProducts(where string, args ...interface{}) (*[]Product, error) {
	query := "SELECT p.id, p.name, p.name_ru, p.slug, p.price, COALESCE(p.image_url,''), COALESCE(p.badge,''), p.colors, COALESCE(p.bg_color,''), p.category_id, p.in_stock FROM products p " + where + " ORDER BY p.id"

	rows, err := c.cfg.DB.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	products := []Product{}
	for rows.Next() {
		var p Product
		var colorsRaw []byte
		if err := rows.Scan(&p.ID, &p.Name, &p.NameRU, &p.Slug, &p.Price, &p.ImageURL, &p.Badge, &colorsRaw, &p.BgColor, &p.CategoryID, &p.InStock); err != nil {
			return nil, err
		}
		if len(colorsRaw) > 0 {
			json.Unmarshal(colorsRaw, &p.Colors)
		}
		if p.Colors == nil {
			p.Colors = []string{}
		}
		products = append(products, p)
	}

	return &products, nil
}
