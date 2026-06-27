package migrate

import (
	"database/sql"
	"embed"
	"log"

	"github.com/pressly/goose/v3"
)

//go:embed *.sql
var migrations embed.FS

func Up(db *sql.DB) {
	goose.SetBaseFS(migrations)
	if err := goose.Up(db, "."); err != nil {
		log.Fatalf("migration failed: %v", err)
	}
	log.Println("migrations applied")
}
