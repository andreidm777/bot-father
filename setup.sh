#!/bin/bash

# Setup script for Bot Father development environment

echo "Setting up Bot Father development environment..."

# Create necessary directories
echo "Creating directories..."
mkdir -p bin

# Install Go dependencies
echo "Installing Go dependencies..."
go mod tidy

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend/chatbot-editor-v2
npm install
cd ../..

echo "Setup complete!"
echo ""
echo "To start development:"
echo "1. Start MongoDB: docker-compose up -d mongodb"
echo "2. Start backend services: docker-compose up -d bot-auth bot-settings"
echo "3. Start frontend: cd frontend/chatbot-editor-v2 && npm start"
echo ""
echo "Services will be available at:"
echo "- Auth service: http://localhost:8080"
echo "- Settings service: http://localhost:8081"
echo "- Frontend: http://localhost:3000"