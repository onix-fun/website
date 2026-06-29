package migrate

import (
	"database/sql"
	"embed"
	"fmt"

	"github.com/pressly/goose/v3"
)

//go:embed *.sql
var migrations embed.FS

func RunMigrations(db *sql.DB) error {
	return Up(db)
}

func Up(db *sql.DB) error {
	goose.SetBaseFS(migrations)
	if err := goose.Up(db, "."); err != nil {
		return fmt.Errorf("migrate up: %w", err)
	}
	return nil
}

func UpByOne(db *sql.DB) error {
	goose.SetBaseFS(migrations)
	if err := goose.UpByOne(db, "."); err != nil {
		return fmt.Errorf("migrate up-by-one: %w", err)
	}
	return nil
}

func Down(db *sql.DB) error {
	goose.SetBaseFS(migrations)
	if err := goose.Down(db, "."); err != nil {
		return fmt.Errorf("migrate down: %w", err)
	}
	return nil
}

func DownTo(db *sql.DB, version int64) error {
	goose.SetBaseFS(migrations)
	if err := goose.DownTo(db, ".", version); err != nil {
		return fmt.Errorf("migrate down-to %d: %w", version, err)
	}
	return nil
}

func Reset(db *sql.DB) error {
	goose.SetBaseFS(migrations)
	if err := goose.Reset(db, "."); err != nil {
		return fmt.Errorf("migrate reset: %w", err)
	}
	return nil
}

func Status(db *sql.DB) error {
	goose.SetBaseFS(migrations)
	if err := goose.Status(db, "."); err != nil {
		return fmt.Errorf("migrate status: %w", err)
	}
	return nil
}

func Version(db *sql.DB) error {
	goose.SetBaseFS(migrations)
	if err := goose.Version(db, "."); err != nil {
		return fmt.Errorf("migrate version: %w", err)
	}
	return nil
}

func Create(name, dir string) error {
	if err := goose.Create(nil, dir, name, "sql"); err != nil {
		return fmt.Errorf("migrate create %s: %w", name, err)
	}
	return nil
}
