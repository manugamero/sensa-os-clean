#!/bin/bash

echo "🔍 Diagnosticando página en blanco..."

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "📊 Verificando servidores..."
echo "============================"

# Verificar frontend
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend respondiendo${NC}"
else
    echo -e "${RED}❌ Frontend no responde${NC}"
fi

# Verificar backend
if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend respondiendo${NC}"
else
    echo -e "${RED}❌ Backend no responde${NC}"
fi

echo ""
echo "🔍 Verificando archivos críticos..."
echo "=================================="

# Verificar archivos
files=(
    ".env"
    "src/main.tsx"
    "src/App.tsx"
    "src/lib/firebase.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file existe${NC}"
    else
        echo -e "${RED}❌ $file NO existe${NC}"
    fi
done

echo ""
echo "🔧 Verificando variables de entorno..."
echo "======================================"

if [ -f ".env" ]; then
    echo "Variables en .env:"
    grep -E "VITE_|GOOGLE_" .env | head -5
else
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
fi

echo ""
echo "📱 Verificando JavaScript..."
echo "============================"

# Verificar si el JavaScript se carga
echo "Verificando main.tsx..."
if curl -s http://localhost:3000/src/main.tsx >/dev/null 2>&1; then
    echo -e "${GREEN}✅ main.tsx accesible${NC}"
else
    echo -e "${RED}❌ main.tsx no accesible${NC}"
fi

echo ""
echo "🌐 URLs para probar:"
echo "==================="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001/api/health"
echo ""
echo "🔧 Soluciones:"
echo "=============="
echo "1. Abre http://localhost:3000 en modo incógnito"
echo "2. Presiona F12 y ve a Console para ver errores"
echo "3. Presiona Ctrl+Shift+R para recarga dura"
echo "4. Verifica que JavaScript esté habilitado"
echo ""
echo -e "${YELLOW}💡 Si sigue en blanco, ejecuta:${NC}"
echo "./scripts/stop-all.sh && ./scripts/clean-start.sh"
