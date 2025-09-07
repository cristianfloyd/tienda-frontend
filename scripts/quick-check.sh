#!/bin/bash

# Quick Check Script - No logs interactivos
# Usage: ./scripts/quick-check.sh

echo "⚡ Quick Check - tienda-frontend"
echo "================================"

# System info
echo "🖥️  Sistema:"
echo "  Node: $(node --version)"
echo "  npm: $(npm --version)"
echo "  PM2: $(pm2 --version 2>/dev/null || echo 'no instalado')"

# PM2 Status
echo "📊 PM2 Status:"
pm2 list | grep tienda-frontend || echo "❌ tienda-frontend no encontrado en PM2"

# Port check
echo ""
echo "🔍 Puertos activos:"
for port in 3000 3001 3002 3003; do
    if lsof -i :$port > /dev/null 2>&1; then
        process=$(lsof -i :$port | tail -1 | awk '{print $1}')
        echo "  ✅ Puerto $port: $process"
    fi
done

# Config check
echo ""
echo "🔧 Configuración:"
if [ -f "ecosystem.config.js" ]; then
    echo "  ✅ ecosystem.config.js existe"
    port_config=$(grep -A 1 -B 1 "PORT" ecosystem.config.js | grep -o "[0-9]\{4\}" || echo "unknown")
    echo "  📍 Puerto configurado: $port_config"
else
    echo "  ❌ ecosystem.config.js NO existe"
fi

# Log file check (sin ejecutar pm2 logs)
echo ""
echo "📄 Último arranque (archivo log):"
if [ -f ~/.pm2/logs/tienda-frontend-out.log ]; then
    echo "  📅 Archivo de log existe"
    last_ready=$(tail -20 ~/.pm2/logs/tienda-frontend-out.log | grep -E "(Local:|Ready)" | tail -1 || echo "No encontrado")
    echo "  🚀 Último Ready: $last_ready"
else
    echo "  ❌ No se encontró archivo de log"
fi

echo ""
echo "✅ Check completado"