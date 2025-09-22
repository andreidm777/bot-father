# Makefile for Bot Father

# Build binaries
build:
	go build -o ${PWD}/bin/bot-auth cmd/bot-auth/cmd.go
	go build -o ${PWD}/bin/bot-settings cmd/bot-settings/cmd.go

# Install dependencies
deps:
	go mod tidy
	cd frontend/chatbot-editor-v2 && npm install

# Run tests
test:
	go test ./...
	cd frontend/chatbot-editor-v2 && npm test

# Clean build artifacts
clean:
	rm -rf bin/*
	cd frontend/chatbot-editor-v2 && rm -rf node_modules

# Setup development environment
setup: deps build

# Run auth service
run-auth:
	./bin/bot-auth

# Run settings service
run-settings:
	./bin/bot-settings

# Run all services
run: run-auth run-settings

# Build Docker images
docker-build:
	docker build -t bot-father-auth -f Dockerfile.auth .
	docker build -t bot-father-settings -f Dockerfile.settings .

# Start all services with Docker Compose
docker-up:
	docker-compose up -d

# Stop all services with Docker Compose
docker-down:
	docker-compose down

# Show Docker Compose logs
docker-logs:
	docker-compose logs -f

.PHONY: build deps test clean setup run-auth run-settings run docker-build docker-up docker-down docker-logs