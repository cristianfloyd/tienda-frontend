#!/bin/bash

# Test Build Script - Simula el proceso de despliegue
# Usage: ./scripts/test-build.sh

echo "🧪 Test Build - Simulando despliegue"
echo "===================================="

# Check if babel-plugin-react-compiler is available
echo "🔍 Verificando babel-plugin-react-compiler..."
if npm list babel-plugin-react-compiler > /dev/null 2>&1; then
    echo "✅ babel-plugin-react-compiler disponible"
    version=$(npm list babel-plugin-react-compiler --depth=0 2>/dev/null | grep babel-plugin-react-compiler | cut -d'@' -f2)
    echo "   Versión: $version"
else
    echo "❌ babel-plugin-react-compiler NO disponible"
    echo "   Esto causaría el error en build"
fi

# Check if it's in dependencies or devDependencies
echo ""
echo "🔍 Verificando ubicación en package.json..."
if grep -A 10 '"dependencies"' package.json | grep -q "babel-plugin-react-compiler"; then
    echo "✅ babel-plugin-react-compiler en 'dependencies'"
elif grep -A 20 '"devDependencies"' package.json | grep -q "babel-plugin-react-compiler"; then
    echo "⚠️  babel-plugin-react-compiler en 'devDependencies'"
    echo "   Nota: Podría causar problemas con npm ci --omit=dev"
else
    echo "❌ babel-plugin-react-compiler NO encontrado en package.json"
fi

# Test build
echo ""
echo "🔨 Probando build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build exitoso"
else
    echo "❌ Build falló"
    echo "   Ejecuta 'npm run build' para ver detalles"
fi

echo ""
echo "✅ Test completado"