package seed

import (
	"database/sql"
	"embed"
	"fmt"
	"log"
)

//go:embed data.sql
var seedSQL embed.FS

func Apply(db *sql.DB) error {
	var count int
	if err := db.QueryRow("SELECT COUNT(*) FROM content").Scan(&count); err != nil {
		return fmt.Errorf("check content count: %w", err)
	}
	if count > 0 {
		log.Println("seed: content table is not empty, skipping")
		return nil
	}

	data, err := seedSQL.ReadFile("data.sql")
	if err != nil {
		return fmt.Errorf("read seed data: %w", err)
	}

	if _, err := db.Exec(string(data)); err != nil {
		return fmt.Errorf("apply seed data: %w", err)
	}

	log.Println("seed: applied successfully")
	return nil
}
