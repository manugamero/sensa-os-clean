#!/bin/bash

echo "🔍 Verificando errores en el navegador..."

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "📊 Verificando archivos críticos..."
echo "=================================="

# Verificar que todos los archivos existen
files=(
    "src/App.tsx"
    "src/components/Dashboard.tsx"
    "src/components/LoginPage.tsx"
    "src/contexts/AuthContext.tsx"
    "src/contexts/ThemeContext.tsx"
    "src/contexts/SocketContext.tsx"
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
echo "🔍 Verificando imports en App.tsx..."
echo "==================================="
echo "Imports en App.tsx:"
grep "^import" src/App.tsx

echo ""
echo "🔍 Verificando componentes..."
echo "============================="

# Verificar que Dashboard existe y tiene contenido
if [ -f "src/components/Dashboard.tsx" ]; then
    echo -e "${GREEN}✅ Dashboard.tsx existe${NC}"
    echo "Primeras líneas de Dashboard:"
    head -5 src/components/Dashboard.tsx
else
    echo -e "${RED}❌ Dashboard.tsx NO existe${NC}"
fi

echo ""
echo "🔍 Verificando contextos..."
echo "==========================="

contexts=(
    "src/contexts/AuthContext.tsx"
    "src/contexts/ThemeContext.tsx"
    "src/contexts/SocketContext.tsx"
)

for context in "${contexts[@]}"; do
    if [ -f "$context" ]; then
        echo -e "${GREEN}✅ $(basename $context) existe${NC}"
    else
        echo -e "${RED}❌ $(basename $context) NO existe${NC}"
    fi
done

echo ""
echo "🔧 Soluciones posibles:"
echo "================"
echo "1. Abre http://localhost:3000 en modo incógnito"
echo "2. Presiona F12 → Console para ver errores JavaScript"
echo "3. Busca errores como:"
echo "   - 'Cannot resolve module'"
echo "   - 'Component is not defined'"
echo "   - 'Firebase not initialized'"
echo "4. Si hay errores, ejecuta: npm install"
echo ""
echo -e "${YELLOW}💡 Para recarga completa:${NC}"
echo "Ctrl+Shift+R en el navegador"
