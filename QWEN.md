# Bot Father - Project Context

## Project Overview

Bot Father is a chatbot management platform with a React-based visual editor and Go backend services. The platform allows users to create, configure, and manage chatbots through a visual interface.

### Architecture

The project follows a microservices architecture with two main backend services:
1. **bot-auth**: Authentication service handling user registration and login
2. **bot-settings**: Settings service managing bot configurations, templates, and steps

The frontend is a React application that provides a visual editor for creating and managing chatbots.

### Technology Stack

**Backend:**
- Go 1.23+
- Gin web framework
- MongoDB for data storage
- Viper for configuration management

**Frontend:**
- React 19
- TypeScript
- MobX for state management
- React Flow for visual diagram editing
- Ant Design for UI components

## Project Structure

```
bot-father/
├── cmd/
│   ├── bot-auth/          # Authentication service entry point
│   └── bot-settings/      # Bot settings management service entry point
├── config/                # Configuration files
├── frontend/
│   └── chatbot-editor-v2/ # React-based chatbot visual editor
├── internal/
│   ├── auth/              # Authentication logic
│   ├── cookie/            # Cookie management
│   ├── database/          # Database models and adapters
│   └── settings/          # Settings management logic
└── pkg/                   # Shared packages
    ├── app/               # Application interface
    ├── graphite/          # Graphite metrics
    ├── router/            # HTTP router setup
    ├── runner/            # Service runner
    └── util/              # Utility functions
```

### Database Collections

- `users`: User accounts
- `sessions`: User sessions
- `products`: Products/Bot categories
- `bots`: Bot configurations
- `templates`: Chatbot templates
- `steps`: Individual steps in chatbot flows

## Development Setup

### Prerequisites

- Go 1.23+
- Node.js 16+
- Docker and Docker Compose (recommended)
- MongoDB (if not using Docker)

### Quick Setup

Run the setup script:
```bash
./setup.sh
```

### Manual Setup

1. Install Go dependencies:
   ```bash
   go mod tidy
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend/chatbot-editor-v2
   npm install
   ```

## Building and Running

### Using Makefile

Build all services:
```bash
make build
```

Run all services:
```bash
make run
```

Other useful commands:
```bash
make deps     # Install dependencies
make test     # Run tests
make clean    # Clean build artifacts
make setup    # Setup development environment
```

### Using Docker (Recommended)

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

## API Endpoints

### Authentication Service
- `PUT /register` - Register new user
- `POST /login` - User login
- `POST /auth` - Authenticate session

### Settings Service
- `GET /product/:product_id/bots` - List bots for a product
- `PUT /product/:product_id/bot` - Create new bot
- `POST /product/:product_id/bot/:bot_id` - Update bot
- `DELETE /product/:product_id/bot/:bot_id` - Delete bot

- `GET /product/:product_id/templates` - List templates
- `GET /product/:product_id/template/:template_id` - Get template
- `PUT /product/:product_id/template` - Create template
- `POST /product/:product_id/template/:template_id` - Update template
- `DELETE /product/:product_id/template/:template_id` - Delete template

- `PUT /product/:product_id/template/:template_id/step` - Create steps
- `POST /product/:product_id/template/:template_id/step/:step_id` - Update step
- `DELETE /product/:product_id/template/:template_id/step/:step_id` - Delete step

- `GET /product/:product_id` - Get product
- `PUT /product` - Create product
- `POST /product/:product_id` - Update product
- `GET /products` - List products

## Service Configuration

Services are configured using YAML configuration files in the `config/` directory:

### bot-auth.conf
```yaml
listen: ":8082"
mongo_db:
  dsn: "mongodb://admin:password@localhost:27017"
log_level: "info"
max_procs: 1
http_rw_timeout: 30
http_idle_timeout: 90
```

### bot-settings.conf
```yaml
listen: ":8081"
mongo_db:
  dsn: "mongodb://admin:password@localhost:27017"
log_level: "info"
max_procs: 1
http_rw_timeout: 30
http_idle_timeout: 90
```

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

## Useful Commands

Start all services with Docker Compose:
```bash
docker-compose up -d
```

Stop all services with Docker Compose:
```bash
docker-compose down
```

Show Docker Compose logs:
```bash
docker-compose logs -f
```

Test service availability:
```bash
./test.sh
```