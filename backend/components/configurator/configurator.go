package configurator

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"onix.fun/m/v2/core"
)

type Component struct {
	cfg *core.Config
}

func (c *Component) Name() string {
	return "configurator"
}

func (c *Component) Init(cfg *core.Config, mux *http.ServeMux) error {
	c.cfg = cfg
	mux.HandleFunc("GET /configurator/options", c.handleOptions)
	mux.HandleFunc("POST /configurator/orders", c.handleCreateOrder)
	return nil
}

func (c *Component) handleOptions(w http.ResponseWriter, r *http.Request) {
	svc := core.NewConfiguratorService(c.cfg.DB)
	data, err := svc.GetOptions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func (c *Component) handleCreateOrder(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(32 << 20); err != nil {
		http.Error(w, "failed to parse form", http.StatusBadRequest)
		return
	}

	dataStr := r.FormValue("data")
	if dataStr == "" {
		http.Error(w, "missing data field", http.StatusBadRequest)
		return
	}

	var payload core.OrderPayload
	if err := json.Unmarshal([]byte(dataStr), &payload); err != nil {
		http.Error(w, "invalid data JSON", http.StatusBadRequest)
		return
	}

	if payload.ContactName == "" || payload.ContactPhone == "" {
		http.Error(w, "contact_name and contact_phone are required", http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["files"]
	var fileURLs []string
	uploadDir := filepath.Join(c.cfg.Env.UploadsDir, "pre_orders")

	if len(files) > 0 {
		timestamp := time.Now().UnixMilli()
		dir := filepath.Join(uploadDir, fmt.Sprintf("%d", timestamp))
		if err := os.MkdirAll(dir, 0755); err != nil {
			http.Error(w, "failed to create upload dir", http.StatusInternalServerError)
			return
		}

		for _, fh := range files {
			src, err := fh.Open()
			if err != nil {
				http.Error(w, "failed to open file", http.StatusInternalServerError)
				return
			}
			defer src.Close()

			dst := filepath.Join(dir, fh.Filename)
			out, err := os.Create(dst)
			if err != nil {
				http.Error(w, "failed to save file", http.StatusInternalServerError)
				return
			}
			defer out.Close()

			if _, err := io.Copy(out, src); err != nil {
				http.Error(w, "failed to write file", http.StatusInternalServerError)
				return
			}

			fileURLs = append(fileURLs, dst)
		}
	}

	payload.FileURLs = fileURLs

	svc := core.NewConfiguratorService(c.cfg.DB)
	id, err := svc.CreateOrder(payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int64{"id": id})
}
