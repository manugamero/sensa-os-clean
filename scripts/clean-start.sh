#!/bin/bash

echo "🧹 Limpieza completa y reinicio sin conflictos..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "🛑 Deteniendo todos los procesos..."
echo "=================================="

# Matar todos los procesos relacionados
echo "Matando procesos de Node.js y Vite..."
pkill -f "node.*index.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true
pkill -f "npm.*start" 2>/dev/null || true

# Esperar un momento
sleep 2

echo ""
echo "🧹 Limpiando cache..."
echo "===================="

# Limpiar cache de Vite
echo "Limpiando cache de Vite..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf .vite 2>/dev/null || true

# Limpiar cache de npm
echo "Limpiando cache de npm..."
npm cache clean --force 2>/dev/null || true

# Limpiar archivos temporales
echo "Limpiando archivos temporales..."
rm -rf dist 2>/dev/null || true
rm -rf build 2>/dev/null || true

echo ""
echo "🔍 Verificando puertos..."
echo "========================"

# Verificar puertos
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ Puerto $port ocupado${NC}"
        echo "Matando proceso en puerto $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    else
        echo -e "${GREEN}✅ Puerto $port libre${NC}"
    fi
}

check_port 3000
check_port 3001

echo ""
echo "🚀 Iniciando servidores..."
echo "========================="

# Iniciar backend en background
echo "Iniciando backend (puerto 3001)..."
cd server
npm start > ../server.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar que el backend se inicie
sleep 3

# Verificar que el backend esté funcionando
if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend funcionando en puerto 3001${NC}"
else
    echo -e "${RED}❌ Backend no responde${NC}"
    echo "Revisa server.log para errores"
fi

# Iniciar frontend en background
echo "Iniciando frontend (puerto 3000)..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Esperar que el frontend se inicie
sleep 5

# Verificar que el frontend esté funcionando
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend funcionando en puerto 3000${NC}"
else
    echo -e "${RED}❌ Frontend no responde${NC}"
    echo "Revisa frontend.log para errores"
fi

echo ""
echo "📊 Estado final:"
echo "==============="
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "🌐 URLs:"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo ""
echo "📝 Logs:"
echo "Backend:  tail -f server.log"
echo "Frontend: tail -f frontend.log"
echo ""
echo -e "${GREEN}✅ Aplicación iniciada sin conflictos de cache${NC}"
echo ""
echo -e "${YELLOW}💡 Para detener:${NC}"
echo "kill $BACKEND_PID $FRONTEND_PID"
