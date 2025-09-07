#!/bin/bash

# Deployment script for tienda-frontend
# Usage: ./scripts/deploy.sh

set -e

# Configuration
PROJECT_NAME="tienda-frontend"
DEPLOY_PATH="/var/www/$PROJECT_NAME"
REPO_URL="https://github.com/cristianfloyd/tienda-frontend.git"  # Cambiar por tu repo real
NODE_ENV="production"
PORT=3003

echo "🚀 Starting deployment for $PROJECT_NAME..."

# Create deployment directory if it doesn't exist
if [ ! -d "$DEPLOY_PATH" ]; then
    echo "📁 Creating deployment directory..."
    sudo mkdir -p $DEPLOY_PATH
    sudo chown -R $USER:$USER $DEPLOY_PATH
fi

# Navigate to deployment directory
cd $DEPLOY_PATH

# Clone or pull latest code
if [ ! -d ".git" ]; then
    echo "📥 Cloning repository..."
    git clone $REPO_URL .
else
    echo "🔄 Pulling latest changes..."
    git fetch origin
    git reset --hard origin/main
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --omit=dev --ignore-scripts

# Install express for webhook server
echo "📦 Installing webhook dependencies..."
npm install express

# Build the application
echo "🔨 Building application..."
npm run build

# Copy environment file if it exists
if [ -f ".env.production" ]; then
    echo "🔧 Using production environment file..."
    cp .env.production .env.local
elif [ -f "/etc/$PROJECT_NAME/.env" ]; then
    echo "🔧 Using system environment file..."
    cp /etc/$PROJECT_NAME/.env .env.local
else
    echo "⚠️  No environment file found. Make sure to configure environment variables."
fi

# Stop existing PM2 processes
echo "🛑 Stopping existing processes..."
pm2 stop all || true
pm2 delete all || true

# Check if ecosystem.config.js exists
if [ -f "ecosystem.config.js" ]; then
    echo "🚀 Starting application with ecosystem.config.js..."
    pm2 start ecosystem.config.js
else
    echo "⚠️  ecosystem.config.js not found, creating from template..."
    if [ -f "ecosystem.config.template.js" ]; then
        cp ecosystem.config.template.js ecosystem.config.js
        echo "🚀 Starting application with ecosystem.config.js..."
        pm2 start ecosystem.config.js
    else
        echo "🚀 Starting application with npm..."
        pm2 start npm --name $PROJECT_NAME -- start
    fi
fi

pm2 save

# Show status
echo "📊 PM2 Process Status:"
pm2 status

# Wait a moment for processes to fully start
sleep 3

# Check if application is actually running on the correct port
echo ""
echo "🔍 Port verification:"
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "✅ Application is running on port $PORT"
    echo "🌐 URL: http://localhost:$PORT"
else
    echo "⚠️  Warning: No process found on port $PORT"
    echo "📊 Check PM2 logs for issues:"
    pm2 logs --lines 10
fi

echo ""
echo "✅ Deployment completed!"
echo "📋 Useful commands:"
echo "   🔍 Check status: pm2 status"
echo "   📊 View logs: pm2 logs $PROJECT_NAME"
echo "   🔄 Restart: pm2 restart ecosystem.config.js"
echo "   🛑 Stop: pm2 stop all"