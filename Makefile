PORT_FE = 5173
PORT_BE = 8085

GOARCH ?= $(shell go env GOARCH)

.PHONY: dev build run docker

dev:
	@echo "cleaning ports..."
	@lsof -ti:$(PORT_BE) 2>/dev/null | xargs kill -9 2>/dev/null || true
	@lsof -ti:$(PORT_FE) 2>/dev/null | xargs kill -9 2>/dev/null || true
	mkdir -p backend/tmp
	cp example.env backend/tmp/.env
	docker compose up -d
	cd frontend && npm run dev &
	cd backend && air

build:
	mkdir -p bin
	cd frontend && npm run build
	cp -r frontend/dist bin/dist
	cd backend && GOARCH=amd64 CGO_ENABLED=0 go build -o ../bin/sparrow-amd64 .
	cd backend && GOARCH=arm64 CGO_ENABLED=0 go build -o ../bin/sparrow-arm64 .

run: build
	cp example.env bin/.env
	./bin/sparrow-$(GOARCH)

docker:
	docker compose up -d
	docker rm -f sparrow 2>/dev/null || true
	docker run -d \
		--network sparrow-net \
		--name sparrow \
		-p $(PORT_BE):$(PORT_BE) \
		-e DB_HOST=sparrow-db \
		-e DB_PORT=5432 \
		-e DB_USER=postgres \
		-e DB_PASSWORD=postgres \
		-e DB_NAME=sparrow \
		-e SERVER_PORT=$(PORT_BE) \
		-e FRONTEND_DIST=/app/dist \
		ghcr.io/onix-fun/website:latest
