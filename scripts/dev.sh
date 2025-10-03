#!/bin/bash

echo "🚀 Iniciando desarrollo sin conflictos de cache..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Función para verificar puerto
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ Puerto $port ocupado${NC}"
        echo "Matando proceso en puerto $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 2
    else
        echo -e "${GREEN}✅ Puerto $port libre${NC}"
    fi
}

echo ""
echo "🧹 Limpieza previa..."
echo "===================="

# Limpiar cache
echo "Limpiando cache de Vite..."
rm -rf node_modules/.vite 2>/dev/null || true

# Verificar puertos
echo ""
echo "🔍 Verificando puertos..."
echo "========================"
check_port 3000
check_port 3001

echo ""
echo "🚀 Iniciando servidores..."
echo "========================="

# Iniciar backend
echo "Iniciando backend..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Esperar que el backend se inicie
sleep 3

# Verificar backend
if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend funcionando${NC}"
else
    echo -e "${RED}❌ Backend no responde${NC}"
    echo "Matando backend y reintentando..."
    kill $BACKEND_PID 2>/dev/null || true
    sleep 2
    cd server
    npm start &
    BACKEND_PID=$!
    cd ..
    sleep 3
fi

# Iniciar frontend
echo "Iniciando frontend..."
npm run dev &
FRONTEND_PID=$!

# Esperar que el frontend se inicie
sleep 5

# Verificar frontend
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend funcionando${NC}"
else
    echo -e "${RED}❌ Frontend no responde${NC}"
    echo "Matando frontend y reintentando..."
    kill $FRONTEND_PID 2>/dev/null || true
    sleep 2
    npm run dev &
    FRONTEND_PID=$!
    sleep 5
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
echo -e "${GREEN}✅ Desarrollo iniciado sin conflictos${NC}"
echo ""
echo -e "${YELLOW}💡 Para detener: Ctrl+C o ./scripts/stop-all.sh${NC}"
echo -e "${YELLOW}💡 Para reiniciar: ./scripts/clean-start.sh${NC}"

# Mantener el script corriendo
wait
