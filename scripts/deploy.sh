#!/bin/bash

# Deployment script for tienda-frontend
# Usage: ./scripts/deploy.sh

set -e

# Configuration
PROJECT_NAME="tienda-frontend"
DEPLOY_PATH="/var/www/$PROJECT_NAME"
REPO_URL="https://github.com/cristianfloyd/tienda-frontend.git"  # Cambiar por tu repo real
NODE_ENV="production"
PORT=3001

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
npm ci --only=production

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

# Stop existing PM2 process
echo "🛑 Stopping existing processes..."
pm2 stop $PROJECT_NAME || true
pm2 delete $PROJECT_NAME || true

# Start application with PM2
echo "🚀 Starting application..."
pm2 start npm --name $PROJECT_NAME -- start
pm2 save

# Show status
pm2 status

echo "✅ Deployment completed successfully!"
echo "🌐 Application should be running on port $PORT"
echo "📊 Check logs with: pm2 logs $PROJECT_NAME"