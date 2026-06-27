package core

import (
	"database/sql"
	"encoding/json"
)

type ContentService struct {
	db *sql.DB
}

func NewContentService(db *sql.DB) *ContentService {
	return &ContentService{db: db}
}

func (s *ContentService) Get(component string) (json.RawMessage, error) {
	var data json.RawMessage
	err := s.db.QueryRow(
		"SELECT data FROM content WHERE component = $1", component,
	).Scan(&data)
	if err != nil {
		return nil, err
	}
	return data, nil
}
