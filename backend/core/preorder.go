package core

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"
)

type PreorderService struct {
	db *sql.DB
}

func NewPreorderService(db *sql.DB) *PreorderService {
	return &PreorderService{db: db}
}

type PreorderRequest struct {
	Name      string          `json:"name"`
	Phone     string          `json:"phone"`
	Email     string          `json:"email"`
	Address   string          `json:"address"`
	Comment   string          `json:"comment"`
	OrderData json.RawMessage `json:"order_data"`
	Origin    string          `json:"origin"`
}

type Preorder struct {
	ID        int64           `json:"id"`
	Name      string          `json:"name"`
	Phone     string          `json:"phone"`
	Email     string          `json:"email"`
	Address   string          `json:"address"`
	Comment   string          `json:"comment"`
	OrderData json.RawMessage `json:"order_data"`
	Origin    string          `json:"origin"`
	Status    string          `json:"status"`
	CreatedAt time.Time       `json:"created_at"`
}

func (s *PreorderService) CreateOrder(req PreorderRequest) (int64, error) {
	var id int64
	err := s.db.QueryRow(`
		INSERT INTO preorders (name, phone, email, address, comment, order_data, origin)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id`,
		req.Name, req.Phone, req.Email, req.Address, req.Comment, req.OrderData, req.Origin,
	).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("create preorder: %w", err)
	}
	return id, nil
}

func (s *PreorderService) GetOrder(id int64) (*Preorder, error) {
	o := &Preorder{}
	err := s.db.QueryRow(`
		SELECT id, name, phone, email, address, comment, order_data, origin, status, created_at
		FROM preorders WHERE id = $1`, id,
	).Scan(&o.ID, &o.Name, &o.Phone, &o.Email, &o.Address, &o.Comment, &o.OrderData, &o.Origin, &o.Status, &o.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("preorder not found")
		}
		return nil, fmt.Errorf("get preorder: %w", err)
	}
	return o, nil
}
