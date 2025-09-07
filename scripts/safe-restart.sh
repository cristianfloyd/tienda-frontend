#!/bin/bash

# Safe Restart Script - Preserva webhook-server
# Usage: ./scripts/safe-restart.sh

echo "🔄 Safe Restart - tienda-frontend"
echo "================================="

# Check current state
echo "📊 Estado actual:"
pm2 list | grep -E "(tienda-frontend|webhook-server)" || echo "No hay procesos activos"

# Stop only tienda-frontend
echo ""
echo "🛑 Deteniendo solo tienda-frontend..."
pm2 stop tienda-frontend || echo "tienda-frontend ya estaba detenido"
pm2 delete tienda-frontend || echo "tienda-frontend ya estaba eliminado"

# Check if ecosystem.config.js exists
if [ ! -f "ecosystem.config.js" ]; then
    if [ -f "ecosystem.config.template.js" ]; then
        echo "📋 Creando ecosystem.config.js desde template..."
        cp ecosystem.config.template.js ecosystem.config.js
        echo "✅ ecosystem.config.js creado"
    else
        echo "❌ No se encontró template. Creando configuración básica..."
        cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'tienda-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/tienda-frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3003
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }]
};
EOF
    fi
fi

# Start tienda-frontend
echo ""
echo "🚀 Iniciando tienda-frontend con puerto 3003..."
pm2 start ecosystem.config.js --only tienda-frontend --env production

# Save configuration
pm2 save

# Show final state
echo ""
echo "📊 Estado final:"
pm2 list

# Wait and check port
sleep 3
echo ""
echo "🔍 Verificación de puerto:"
if lsof -i :3003 > /dev/null 2>&1; then
    echo "✅ Aplicación ejecutándose en puerto 3003"
else
    echo "⚠️  No se detectó actividad en puerto 3003"
    echo "📊 Revisar logs: pm2 logs tienda-frontend"
fi

echo ""
echo "✅ Reinicio seguro completado"