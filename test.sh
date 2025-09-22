#!/bin/bash

# Test script for Bot Father services

echo "Testing Bot Father services..."

# Test auth service
echo "Testing auth service..."
curl -X GET http://localhost:8080/ping/ 2>/dev/null || echo "Auth service not responding"

# Test settings service
echo "Testing settings service..."
curl -X GET http://localhost:8081/ping/ 2>/dev/null || echo "Settings service not responding"

echo "Test complete."