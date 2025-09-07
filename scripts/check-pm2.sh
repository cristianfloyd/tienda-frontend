#!/bin/bash

# PM2 Configuration Check Script
# Usage: ./scripts/check-pm2.sh

echo "🔍 PM2 Configuration Check"
echo "=========================="

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 not installed. Install with: npm install -g pm2"
    exit 1
fi

echo "✅ PM2 is installed"
pm2 --version

# Check current processes
echo ""
echo "📊 Current PM2 processes:"
pm2 status

# Check ecosystem config
if [ -f "ecosystem.config.js" ]; then
    echo "✅ ecosystem.config.js found"
    echo ""
    echo "📄 Configuration preview:"
    head -20 ecosystem.config.js
else
    echo "❌ ecosystem.config.js not found"
    if [ -f "ecosystem.config.template.js" ]; then
        echo "🔧 Template available. You can copy it:"
        echo "   cp ecosystem.config.template.js ecosystem.config.js"
    fi
fi

# Check logs
echo ""
echo "📝 Recent logs:"
pm2 logs --lines 5 || echo "No logs available"

# Check if apps are running on correct ports
echo ""
echo "🔍 Port check:"
netstat -tulpn | grep :300 || echo "No applications running on ports 300x"

echo ""
echo "✅ Check completed"