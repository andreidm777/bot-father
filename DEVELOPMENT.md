# Development Guide

## Prerequisites

- Go 1.21.3
- Node.js 16+
- Docker and Docker Compose (recommended)
- MongoDB (if not using Docker)

## Quick Setup

Run the setup script:
```bash
./setup.sh
```

## Manual Setup

### Backend

1. Install Go dependencies:
   ```bash
   go mod tidy
   ```

2. Build services:
   ```bash
   make build
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend/chatbot-editor-v2
   npm install
   ```

## Running Services

### With Docker (Recommended)

1. Start MongoDB:
   ```bash
   docker-compose up -d mongodb
   ```

2. Start backend services:
   ```bash
   docker-compose up -d bot-auth bot-settings
   ```

3. Start frontend:
   ```bash
   cd frontend/chatbot-editor-v2
   npm start
   ```

### Without Docker

1. Start MongoDB (ensure it's installed and running)

2. Start auth service:
   ```bash
   ./bin/bot-auth
   ```

3. Start settings service:
   ```bash
   ./bin/bot-settings
   ```

4. Start frontend:
   ```bash
   cd frontend/chatbot-editor-v2
   npm start
   ```

## Project Structure

### Backend Services

- `bot-auth`: Handles user authentication
- `bot-settings`: Manages bot configurations and templates

### Frontend

The frontend is a React application with:
- Visual chatbot editor using React Flow
- MobX for state management
- Ant Design for UI components

## API Documentation

See README.md for detailed API endpoints.

## Development Workflow

1. Make changes to the code
2. Run tests:
   ```bash
   # Backend tests
   go test ./...
   
   # Frontend tests
   cd frontend/chatbot-editor-v2
   npm test
   ```
3. Build and run services to test changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request