package core

import (
	"database/sql"
	"encoding/json"
)

type ConfiguratorService struct {
	db *sql.DB
}

func NewConfiguratorService(db *sql.DB) *ConfiguratorService {
	return &ConfiguratorService{db: db}
}

func (s *ConfiguratorService) GetOptions() (json.RawMessage, error) {
	var data json.RawMessage
	err := s.db.QueryRow(
		"SELECT options FROM configurator_options ORDER BY id LIMIT 1",
	).Scan(&data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (s *ConfiguratorService) CreateOrder(order OrderPayload) (int64, error) {
	var id int64
	err := s.db.QueryRow(`
		INSERT INTO pre_orders (product_type, description, file_urls, width_mm, height_mm, depth_mm, features, material, color_hex, budget_range, comments, contact_name, contact_phone, contact_email)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING id`,
		order.ProductType, order.Description, order.FileURLs,
		order.WidthMM, order.HeightMM, order.DepthMM,
		order.Features, order.Material, order.ColorHex,
		order.BudgetRange, order.Comments,
		order.ContactName, order.ContactPhone, order.ContactEmail,
	).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

type OrderPayload struct {
	ProductType  string   `json:"product_type"`
	Description  string   `json:"description"`
	FileURLs     []string `json:"file_urls"`
	WidthMM      *int     `json:"width_mm"`
	HeightMM     *int     `json:"height_mm"`
	DepthMM      *int     `json:"depth_mm"`
	Features     []string `json:"features"`
	Material     string   `json:"material"`
	ColorHex     string   `json:"color_hex"`
	BudgetRange  string   `json:"budget_range"`
	Comments     string   `json:"comments"`
	ContactName  string   `json:"contact_name"`
	ContactPhone string   `json:"contact_phone"`
	ContactEmail string   `json:"contact_email"`
}
