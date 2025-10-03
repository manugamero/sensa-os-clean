
#!/bin/bash

echo "🔍 Verificación rápida de configuración"
echo "====================================="
echo ""

echo "📋 Verificando archivos necesarios..."
if [ -f ".env" ]; then
    echo "✅ Archivo .env encontrado"
else
    echo "❌ Archivo .env no encontrado"
fi

if [ -f "server/firebase-service-account.json" ]; then
    echo "✅ Firebase service account encontrado"
else
    echo "❌ Firebase service account no encontrado"
fi

echo ""
echo "📋 Verificando servidores..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Frontend ejecutándose en puerto 3000"
else
    echo "❌ Frontend no ejecutándose"
fi

if lsof -i :3001 > /dev/null 2>&1; then
    echo "✅ Backend ejecutándose en puerto 3001"
else
    echo "❌ Backend no ejecutándose"
fi

echo ""
echo "🌐 URLs disponibles:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo "   Health check: http://localhost:3001/api/health"
echo ""

echo "🔧 Si hay problemas:"
echo "1. Ejecuta: ./scripts/auto-fix-auth.sh"
echo "2. Verifica la consola del navegador (F12)"
echo "3. Revisa los logs del servidor"
