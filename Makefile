PORT_FE = 5173
PORT_BE = 8085

GOARCH ?= $(shell go env GOARCH)

.PHONY: dev build run docker migrate/up migrate/down migrate/status migrate/create migrate/reset seed

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
	docker network rm sparrow-net 2>/dev/null || true
	docker compose up -d
	docker rm -f sparrow 2>/dev/null || true
	docker run -d --pull always \
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

MIGRATE = cd backend && go run . migrate

migrate/up:
	$(MIGRATE) up

migrate/down:
	$(MIGRATE) down

migrate/status:
	$(MIGRATE) status

migrate/reset:
	$(MIGRATE) reset

migrate/create:
	@read -p "Migration name: " name; $(MIGRATE) create $$name

seed:
	cd backend && go run . seed
