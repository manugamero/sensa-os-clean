#!/bin/bash

echo "🛑 Deteniendo todos los servidores..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "🔍 Buscando procesos activos..."
echo "=============================="

# Mostrar procesos antes de matarlos
echo "Procesos de Node.js:"
ps aux | grep -E "(node|vite|npm)" | grep -v grep || echo "No hay procesos activos"

echo ""
echo "🛑 Matando todos los procesos..."
echo "==============================="

# Matar todos los procesos relacionados
echo "Matando procesos de Node.js..."
pkill -f "node.*index.js" 2>/dev/null && echo "✅ Procesos de Node.js detenidos" || echo "ℹ️  No había procesos de Node.js"

echo "Matando procesos de Vite..."
pkill -f "vite" 2>/dev/null && echo "✅ Procesos de Vite detenidos" || echo "ℹ️  No había procesos de Vite"

echo "Matando procesos de npm..."
pkill -f "npm.*dev" 2>/dev/null && echo "✅ Procesos de npm dev detenidos" || echo "ℹ️  No había procesos de npm dev"
pkill -f "npm.*start" 2>/dev/null && echo "✅ Procesos de npm start detenidos" || echo "ℹ️  No había procesos de npm start"

# Matar procesos por puerto específico
echo ""
echo "🔍 Verificando puertos específicos..."
echo "===================================="

# Puerto 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Matando proceso en puerto 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null && echo "✅ Puerto 3000 liberado" || echo "❌ Error liberando puerto 3000"
else
    echo "✅ Puerto 3000 libre"
fi

# Puerto 3001
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Matando proceso en puerto 3001..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null && echo "✅ Puerto 3001 liberado" || echo "❌ Error liberando puerto 3001"
else
    echo "✅ Puerto 3001 libre"
fi

echo ""
echo "🧹 Limpiando archivos temporales..."
echo "==================================="

# Limpiar logs
rm -f server.log frontend.log 2>/dev/null && echo "✅ Logs limpiados" || echo "ℹ️  No había logs"

# Limpiar cache de Vite
rm -rf node_modules/.vite 2>/dev/null && echo "✅ Cache de Vite limpiado" || echo "ℹ️  No había cache de Vite"

echo ""
echo -e "${GREEN}✅ Todos los servidores detenidos y cache limpiado${NC}"
echo ""
echo -e "${YELLOW}💡 Para reiniciar sin conflictos:${NC}"
echo "./scripts/clean-start.sh"
