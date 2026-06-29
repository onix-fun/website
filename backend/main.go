package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"onix.fun/m/v2/components/configurator"
	"onix.fun/m/v2/components/content"
	"onix.fun/m/v2/components/health"
	"onix.fun/m/v2/components/preorder"
	"onix.fun/m/v2/components/sections/catalog"
	"onix.fun/m/v2/components/sections/digital_catalog"
	"onix.fun/m/v2/components/test"
	"onix.fun/m/v2/components/upload"
	"onix.fun/m/v2/core"
	"onix.fun/m/v2/migrate"
	"onix.fun/m/v2/seed"
)

func migrateCLI(db *sql.DB, args []string) int {
	if len(args) == 0 {
		fmt.Println("usage: migrate <up|down|status|reset|version|create>")
		return 1
	}

	switch args[0] {
	case "up":
		if err := migrate.Up(db); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			return 1
		}
	case "down":
		if err := migrate.Down(db); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			return 1
		}
	case "status":
		if err := migrate.Status(db); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			return 1
		}
	case "reset":
		if err := migrate.Reset(db); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			return 1
		}
	case "version":
		if err := migrate.Version(db); err != nil {
			fmt.Fprintf(os.Stderr, "error: %v\n", err)
			return 1
		}
	default:
		fmt.Fprintf(os.Stderr, "unknown migrate subcommand: %s\n", args[0])
		fmt.Println("usage: migrate <up|down|status|reset|version|create>")
		return 1
	}
	return 0
}

func isCreateSubcommand() bool {
	return len(os.Args) > 2 && os.Args[1] == "migrate" && os.Args[2] == "create"
}

func runMigrateCreate() int {
	if len(os.Args) < 4 {
		fmt.Fprintln(os.Stderr, "usage: migrate create <name>")
		return 1
	}
	if err := migrate.Create(os.Args[3], "migrate"); err != nil {
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		return 1
	}
	fmt.Printf("created migrate/%s\n", os.Args[3])
	return 0
}

func spaHandler(dist string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(dist, r.URL.Path)

		if _, err := os.Stat(path); err == nil {
			http.ServeFile(w, r, path)
			return
		}

		http.ServeFile(w, r, filepath.Join(dist, "index.html"))
	}
}

func main() {
	if isCreateSubcommand() {
		os.Exit(runMigrateCreate())
	}

	env := core.LoadEnvironment()
	cfg := core.NewConfig(env)
	defer cfg.Close()

	if len(os.Args) > 1 {
		switch os.Args[1] {
		case "migrate":
			os.Exit(migrateCLI(cfg.DB, os.Args[2:]))
		case "seed":
			if err := seed.Apply(cfg.DB); err != nil {
				log.Fatalf("seed: %v", err)
			}
			return
		}
	}

	if err := migrate.RunMigrations(cfg.DB); err != nil {
		log.Fatalf("migrations: %v", err)
	}

	mux := http.NewServeMux()
	apiMux := http.NewServeMux()

	components := []core.Component{
		&health.Component{},
		&test.Component{},
		&catalog.Component{},
		&digital_catalog.Component{},
		&content.Component{},
		&configurator.Component{},
		&preorder.Component{},
		&upload.Component{},
	}

	for _, c := range components {
		if err := c.Init(cfg, apiMux); err != nil {
			log.Fatalf("component %s: %v", c.Name(), err)
		}
	}

	mux.Handle("/api/", http.StripPrefix("/api", apiMux))

	uploadsDir := env.UploadsDir
	os.MkdirAll(uploadsDir, 0755)
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(uploadsDir))))

	mux.Handle("/", spaHandler(env.FrontendDist))

	addr := fmt.Sprintf(":%d", env.ServerPort)
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
