#!/bin/bash

echo "🔍 Debugging JavaScript errors..."

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "🔍 Verificando si el JavaScript se está cargando..."
echo "================================================="

# Verificar si el main.tsx se está sirviendo
echo "Probando main.tsx..."
if curl -s http://localhost:3000/src/main.tsx | grep -q "ReactDOM"; then
    echo -e "${GREEN}✅ main.tsx se está sirviendo${NC}"
else
    echo -e "${RED}❌ main.tsx no se está sirviendo${NC}"
fi

echo ""
echo "🔍 Verificando si hay errores de compilación..."
echo "=============================================="

# Verificar si hay errores en el build
echo "Verificando logs de Vite..."
if tail -10 frontend.log | grep -i "error\|failed\|cannot" >/dev/null; then
    echo -e "${RED}❌ Hay errores en los logs de Vite:${NC}"
    tail -10 frontend.log | grep -i "error\|failed\|cannot"
else
    echo -e "${GREEN}✅ No hay errores obvios en los logs${NC}"
fi

echo ""
echo "🔍 Verificando dependencias..."
echo "============================="

# Verificar si las dependencias están instaladas
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules existe${NC}"
    
    # Verificar dependencias críticas
    deps=("firebase" "lucide-react" "socket.io-client")
    for dep in "${deps[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            echo -e "${GREEN}✅ $dep instalado${NC}"
        else
            echo -e "${RED}❌ $dep NO instalado${NC}"
        fi
    done
else
    echo -e "${RED}❌ node_modules NO existe${NC}"
    echo "Ejecutando npm install..."
    npm install
fi

echo ""
echo "🔍 Verificando CSS..."
echo "===================="

# Verificar si el CSS se está cargando
if curl -s http://localhost:3000/src/index.css | grep -q "tailwind"; then
    echo -e "${GREEN}✅ CSS se está cargando${NC}"
else
    echo -e "${RED}❌ CSS no se está cargando correctamente${NC}"
fi

echo ""
echo "🔧 Soluciones:"
echo "=============="
echo "1. Abre http://localhost:3000 en modo incógnito"
echo "2. Presiona F12 → Console"
echo "3. Busca errores en rojo"
echo "4. Si hay errores de módulos, ejecuta: npm install"
echo "5. Si hay errores de Firebase, verifica .env"
echo ""
echo -e "${YELLOW}💡 Errores comunes:${NC}"
echo "- 'Cannot resolve module' → npm install"
echo "- 'Firebase not initialized' → verificar .env"
echo "- 'Component is not defined' → verificar imports"
