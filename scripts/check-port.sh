#!/bin/bash

# Port Check Script
# Usage: ./scripts/check-port.sh

echo "🔍 Puerto Check - Aplicación tienda-frontend"
echo "============================================="

# Check PM2 processes
echo "📊 PM2 Process Status:"
pm2 list | grep -E "(tienda-frontend|webhook-server|id|name)" || echo "No PM2 processes found"

echo ""
echo "🔍 Puertos en uso (300x):"
netstat -tulpn | grep ":300" | while read line; do
    port=$(echo "$line" | awk '{print $4}' | cut -d':' -f2)
    echo "  📍 Puerto $port activo"
done

# Check what's running on specific ports
echo ""
echo "🔍 Verificación de puertos específicos:"
for port in 3000 3001 3002 3003; do
    if lsof -i :$port > /dev/null 2>&1; then
        process=$(lsof -i :$port | tail -1 | awk '{print $1}')
        echo "  ✅ Puerto $port: $process"
    else
        echo "  ❌ Puerto $port: libre"
    fi
done

# Check ecosystem config
echo ""
echo "🔧 Configuración ecosystem.config.js:"
if [ -f "ecosystem.config.js" ]; then
    echo "  ✅ Archivo encontrado"
    echo "  📄 Puerto configurado:"
    grep -A 2 -B 2 "PORT" ecosystem.config.js || echo "    No se encontró configuración de puerto"
else
    echo "  ❌ ecosystem.config.js NO encontrado"
    if [ -f "ecosystem.config.template.js" ]; then
        echo "  📋 Template disponible"
    fi
fi

# Check Next.js logs (usando archivo de log directamente)
echo ""
echo "📊 Logs recientes de Next.js:"
if [ -f ~/.pm2/logs/tienda-frontend-out.log ]; then
    tail -10 ~/.pm2/logs/tienda-frontend-out.log | grep -E "(Local:|Network:|Ready|Starting|PORT)" || echo "No se encontraron logs específicos en los últimos 10 líneas"
else
    echo "Archivo de log no encontrado, usando pm2 logs..."
    pm2 logs tienda-frontend --lines 3 --nostream 2>/dev/null || echo "No se pudieron obtener logs"
fi

echo ""
echo "🎯 Comandos útiles:"
echo "  📊 Ver estado: pm2 status"
echo "  📝 Ver logs: pm2 logs tienda-frontend"
echo "  🔄 Reiniciar con config: pm2 restart ecosystem.config.js"