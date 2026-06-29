package core

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type Config struct {
	DB     *sql.DB
	Logger *log.Logger
	Env    *Environment
}

func NewConfig(env *Environment) *Config {
	connStr := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		env.DBHost, env.DBPort, env.DBUser, env.DBPassword, env.DBName,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

	return &Config{
		DB:     db,
		Logger: log.New(os.Stdout, "", log.LstdFlags),
		Env:    env,
	}
}

func (c *Config) Close() {
	if c.DB != nil {
		c.DB.Close()
	}
}
