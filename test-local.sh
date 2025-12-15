#!/bin/bash

echo "=== PAXAFE Mock Sender - Local Test Script ==="
echo ""

echo "📋 Setup Check:"
if [ -d "node_modules" ]; then
    echo "  ✅ Dependencies installed"
else
    echo "  ❌ Dependencies not installed"
    echo "     Run: npm install"
    exit 1
fi

echo ""
echo "🚀 Starting Mock Sender..."
echo "   App will be available at: http://localhost:3001"
echo "   (Using port 3001 to avoid conflict with Integration API on 3000)"
echo ""
echo "📝 Configuration:"
echo "   - API URL: http://localhost:3000/api/webhook/tive (default)"
echo "   - API Key: Use the same key from Integration API .env file"
echo ""
echo "💡 Tips:"
echo "   - The app will load with default localhost URL"
echo "   - You can change the API URL in the UI"
echo "   - Save configuration to persist it in browser localStorage"
echo ""

PORT=3001 npm run dev

