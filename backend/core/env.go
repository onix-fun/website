package core

import (
	"os"
	"path/filepath"
	"strconv"

	"github.com/joho/godotenv"
)

type Environment struct {
	DBHost       string
	DBPort       int
	DBUser       string
	DBPassword   string
	DBName       string
	ServerPort   int
	FrontendDist string
}

func LoadEnvironment() *Environment {
	envPath := findEnvFile()
	if envPath != "" {
		if err := godotenv.Load(envPath); err != nil {
			panic("failed to load .env: " + err.Error())
		}
	}

	return &Environment{
		DBHost:       mustEnv("DB_HOST"),
		DBPort:       mustEnvInt("DB_PORT"),
		DBUser:       mustEnv("DB_USER"),
		DBPassword:   mustEnv("DB_PASSWORD"),
		DBName:       mustEnv("DB_NAME"),
		ServerPort:   mustEnvInt("SERVER_PORT"),
		FrontendDist: mustEnv("FRONTEND_DIST"),
	}
}

func findEnvFile() string {
	exe, err := os.Executable()
	if err != nil {
		return ""
	}
	path := filepath.Join(filepath.Dir(exe), ".env")
	if _, err := os.Stat(path); err == nil {
		return path
	}
	return ""
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		panic("missing required environment variable: " + key)
	}
	return v
}

func mustEnvInt(key string) int {
	v := os.Getenv(key)
	if v == "" {
		panic("missing required environment variable: " + key)
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		panic("invalid value for " + key + ": " + v)
	}
	return n
}
