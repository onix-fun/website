PORT_FE = 5173
PORT_BE = 8085

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
	cd backend && go build -o ../bin/sparrow .

run: build
	cp example.env bin/.env
	./bin/sparrow

docker: build
	docker build -t sparrow:latest .
