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
	UploadsDir   string
}

func LoadEnvironment() *Environment {
	envPath := findEnvFile()
	if envPath != "" {
		if err := godotenv.Load(envPath); err != nil {
			panic("failed to load .env: " + err.Error())
		}
	}

	uploadsDir := os.Getenv("UPLOADS_DIR")
	if uploadsDir == "" {
		uploadsDir = "./uploads"
	}

	return &Environment{
		DBHost:       mustEnv("DB_HOST"),
		DBPort:       mustEnvInt("DB_PORT"),
		DBUser:       mustEnv("DB_USER"),
		DBPassword:   mustEnv("DB_PASSWORD"),
		DBName:       mustEnv("DB_NAME"),
		ServerPort:   mustEnvInt("SERVER_PORT"),
		FrontendDist: mustEnv("FRONTEND_DIST"),
		UploadsDir:   uploadsDir,
	}
}

func findEnvFile() string {
	candidates := []string{}

	exe, err := os.Executable()
	if err == nil {
		candidates = append(candidates, filepath.Join(filepath.Dir(exe), ".env"))
	}

	cwd, err := os.Getwd()
	if err == nil {
		candidates = append(candidates, filepath.Join(cwd, ".env"))
		candidates = append(candidates, filepath.Join(cwd, "tmp", ".env"))
	}

	for _, p := range candidates {
		if _, err := os.Stat(p); err == nil {
			return p
		}
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
