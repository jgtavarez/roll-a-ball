#!/bin/bash

# Juan Gabriel (ID: 1200221)

echo "🎮 Roll-a-Ball Game Setup (Web Version)"
echo "======================================"
echo "Created by: Juan Gabriel"
echo "University ID: 1200221"
echo ""

echo "🌐 Starting web server..."
echo "Open your browser and go to: http://localhost:8000"
echo ""

if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
elif command -v php &> /dev/null; then
    php -S localhost:8000
elif command -v ruby &> /dev/null; then
    ruby -run -e httpd . -p 8000
else
    echo "❌ Could not find Python, PHP, or Ruby to start a web server."
    echo "If you have Node.js, you can run:"
    echo "npx http-server"
    exit 1
fi 