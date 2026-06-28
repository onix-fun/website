package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"onix.fun/m/v2/components/health"
	"onix.fun/m/v2/components/sections/about"
	"onix.fun/m/v2/components/sections/catalog"
	"onix.fun/m/v2/components/sections/digital_catalog"
	"onix.fun/m/v2/components/sections/faq"
	"onix.fun/m/v2/components/sections/footer"
	"onix.fun/m/v2/components/sections/hero"
	"onix.fun/m/v2/components/sections/materials"
	"onix.fun/m/v2/components/sections/reviews"
	"onix.fun/m/v2/components/sections/ticker"
	"onix.fun/m/v2/components/test"
	"onix.fun/m/v2/core"
	"onix.fun/m/v2/migrate"
)

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
	env := core.LoadEnvironment()
	cfg := core.NewConfig(env)
	defer cfg.Close()

	migrate.Up(cfg.DB)

	mux := http.NewServeMux()
	apiMux := http.NewServeMux()

	components := []core.Component{
		&health.Component{},
		&test.Component{},
		&catalog.Component{},
		&digital_catalog.Component{},
		&hero.Component{},
		&about.Component{},
		&ticker.Component{},
		&materials.Component{},
		&reviews.Component{},
		&faq.Component{},
		&footer.Component{},
	}

	for _, c := range components {
		if err := c.Init(cfg, apiMux); err != nil {
			log.Fatalf("component %s: %v", c.Name(), err)
		}
	}

	mux.Handle("/api/", http.StripPrefix("/api", apiMux))
	mux.Handle("/", spaHandler(env.FrontendDist))

	addr := fmt.Sprintf(":%d", env.ServerPort)
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}
