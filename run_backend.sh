#!/bin/bash

# Script to run the backend server with proper configuration

cd "$(dirname "$0")/backend" || exit 1

echo "Starting Tech News Aggregator Backend..."
echo "Server will run on http://localhost:8001"
echo ""

# Activate virtual environment
source venv/bin/activate

# Run the server
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
