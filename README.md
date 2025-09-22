# Bot Father

A chatbot management platform with a React-based visual editor and Go backend services.

## Project Structure

```
bot-father/
├── cmd/
│   ├── bot-auth/          # Authentication service
│   └── bot-settings/      # Bot settings management service
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

## Services

### 1. Authentication Service (bot-auth)
- Handles user registration and login
- Manages session cookies
- Runs on port 8080 by default

### 2. Settings Service (bot-settings)
- Manages bot configurations, templates, and steps
- Provides API for the frontend editor
- Runs on port 8080 by default

## Frontend

The frontend is a React application built with:
- React 19
- TypeScript
- MobX for state management
- React Flow for visual diagram editing
- Ant Design for UI components

## Database

The application uses MongoDB for data storage with the following collections:
- users: User accounts
- sessions: User sessions
- products: Products/Bot categories
- bots: Bot configurations
- templates: Chatbot templates
- steps: Individual steps in chatbot flows

## Setup

### Prerequisites
- Go 1.21.3
- Node.js 16+
- MongoDB

### Backend Setup

1. Install Go dependencies:
   ```bash
   go mod tidy
   ```

2. Configure MongoDB connection in config files:
   - `config/bot-auth.conf`
   - `config/bot-settings.conf`

3. Build services:
   ```bash
   make build
   ```

4. Run services:
   ```bash
   ./bin/bot-auth
   ./bin/bot-settings
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/chatbot-editor-v2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
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

## Development

### Building
```bash
make build
```

### Testing
```bash
# Backend tests
go test ./...

# Frontend tests
cd frontend/chatbot-editor-v2 && npm test
```