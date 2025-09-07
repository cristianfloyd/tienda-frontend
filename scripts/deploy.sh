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

# Install dependencies (optimized for npm 10)
echo "📦 Installing dependencies..."
# We need devDependencies for build (like babel-plugin-react-compiler)
npm ci --ignore-scripts --silent --no-audit --no-fund --prefer-offline 2>/dev/null || npm ci --ignore-scripts

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

# Stop existing PM2 processes (but NOT webhook-server)
echo "🛑 Stopping existing processes..."
echo "⚠️  Preserving webhook-server to avoid killing deployment process"
pm2 stop tienda-frontend || true
pm2 delete tienda-frontend || true

# Check if ecosystem.config.js exists
echo "🔍 Checking PM2 configuration..."
if [ -f "ecosystem.config.js" ]; then
    echo "✅ ecosystem.config.js found, using PM2 configuration"
    echo "🔧 Configuration preview:"
    head -15 ecosystem.config.js
    echo "🚀 Starting tienda-frontend from ecosystem.config.js..."
    pm2 start ecosystem.config.js --only tienda-frontend --env production
else
    echo "⚠️  ecosystem.config.js not found in $(pwd)"
    if [ -f "ecosystem.config.template.js" ]; then
        echo "📋 Creating ecosystem.config.js from template..."
        cp ecosystem.config.template.js ecosystem.config.js
        echo "✅ Created ecosystem.config.js"
        echo "🚀 Starting tienda-frontend from ecosystem.config.js..."
        pm2 start ecosystem.config.js --only tienda-frontend --env production
    else
        echo "❌ No template found, falling back to npm start..."
        echo "⚠️  WARNING: This will NOT use port $PORT configuration!"
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
echo "🔍 Port verification (expecting port $PORT):"

# Check multiple common ports
for port in 3000 3001 3002 3003; do
    if lsof -i :$port > /dev/null 2>&1; then
        if [ "$port" = "$PORT" ]; then
            echo "✅ Application is running on CORRECT port $port"
        else
            echo "⚠️  Application is running on port $port (expected $PORT)"
        fi
        echo "🌐 URL: http://localhost:$port"
    fi
done

# Show Next.js specific info from logs (no interactive)
echo ""
echo "📊 Next.js startup info:"
if [ -f ~/.pm2/logs/tienda-frontend-out.log ]; then
    tail -5 ~/.pm2/logs/tienda-frontend-out.log | grep -E "(Local:|Network:|Ready)" || echo "No Next.js startup info found"
else
    echo "Log file not found, check manually with: pm2 logs tienda-frontend"
fi

echo ""
echo "✅ Deployment completed!"
echo "📋 Useful commands:"
echo "   🔍 Check status: pm2 status"
echo "   📊 View logs: pm2 logs $PROJECT_NAME"
echo "   🔄 Restart: pm2 restart ecosystem.config.js"
echo "   🛑 Stop: pm2 stop all"