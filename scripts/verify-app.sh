#!/bin/bash

echo "🔍 Verificando aplicación Sensa OS..."

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar puerto
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $service en puerto $port - Funcionando${NC}"
        return 0
    else
        echo -e "${RED}❌ $service en puerto $port - No funcionando${NC}"
        return 1
    fi
}

# Función para verificar endpoint
check_endpoint() {
    local url=$1
    local service=$2
    
    if curl -s "$url" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $service endpoint - Respondiendo${NC}"
        return 0
    else
        echo -e "${RED}❌ $service endpoint - No responde${NC}"
        return 1
    fi
}

echo ""
echo "📊 Estado de los Servidores:"
echo "=========================="

# Verificar puertos
check_port 3000 "Frontend (Vite)"
check_port 3001 "Backend (Node.js)"

echo ""
echo "🌐 Verificando Endpoints:"
echo "========================="

# Verificar endpoints
check_endpoint "http://localhost:3000" "Frontend"
check_endpoint "http://localhost:3001/api/health" "Backend API"

echo ""
echo "📁 Verificando Archivos Críticos:"
echo "================================="

# Verificar archivos importantes
files=(
    ".env"
    "src/App.tsx"
    "src/components/Dashboard.tsx"
    "server/index.js"
    "package.json"
    "server/package.json"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file - Existe${NC}"
    else
        echo -e "${RED}❌ $file - No encontrado${NC}"
    fi
done

echo ""
echo "🔧 Verificando Configuración:"
echo "============================="

# Verificar variables de entorno
if [ -f ".env" ]; then
    if grep -q "VITE_FIREBASE_API_KEY" .env; then
        echo -e "${GREEN}✅ Variables de Firebase configuradas${NC}"
    else
        echo -e "${RED}❌ Variables de Firebase faltantes${NC}"
    fi
    
    if grep -q "GOOGLE_CLIENT_ID" .env; then
        echo -e "${GREEN}✅ Google OAuth configurado${NC}"
    else
        echo -e "${RED}❌ Google OAuth no configurado${NC}"
    fi
else
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
fi

echo ""
echo "🎯 Resumen:"
echo "==========="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo ""
echo -e "${YELLOW}💡 Si todo está en verde, la aplicación está lista para usar!${NC}"
echo -e "${YELLOW}   Abre http://localhost:3000 en tu navegador${NC}"
