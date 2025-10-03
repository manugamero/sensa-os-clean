#!/bin/bash

echo "🔍 Diagnóstico profundo de página en blanco..."

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "🛑 Paso 1: Detener todo completamente"
echo "====================================="
./scripts/stop-all.sh

echo ""
echo "🧹 Paso 2: Limpieza extrema"
echo "==========================="
echo "Limpiando cache de Vite..."
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist

echo "Limpiando cache de npm..."
npm cache clean --force

echo "Limpiando archivos temporales..."
rm -rf /tmp/vite-*
rm -rf /tmp/node-*

echo ""
echo "🔍 Paso 3: Verificar archivos críticos"
echo "======================================"

# Verificar que App.tsx existe y tiene contenido
if [ -f "src/App.tsx" ]; then
    echo -e "${GREEN}✅ App.tsx existe${NC}"
    echo "Primeras líneas de App.tsx:"
    head -5 src/App.tsx
else
    echo -e "${RED}❌ App.tsx NO existe${NC}"
fi

# Verificar main.tsx
if [ -f "src/main.tsx" ]; then
    echo -e "${GREEN}✅ main.tsx existe${NC}"
    echo "Contenido de main.tsx:"
    cat src/main.tsx
else
    echo -e "${RED}❌ main.tsx NO existe${NC}"
fi

echo ""
echo "🔧 Paso 4: Verificar .env"
echo "========================="
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env existe${NC}"
    echo "Variables VITE:"
    grep VITE .env
else
    echo -e "${RED}❌ .env NO existe${NC}"
    echo "Creando .env básico..."
    cat > .env << 'EOF'
VITE_FIREBASE_API_KEY=AIzaSyD99fYsZaNO5ystn7bOdy20dTWpErQVoz8
VITE_FIREBASE_AUTH_DOMAIN=sensa-os-ac840.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sensa-os-ac840
VITE_FIREBASE_STORAGE_BUCKET=sensa-os-ac840.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-project-id
VITE_FIREBASE_APP_ID=1:your-project-id:web:2b115f20a44c131b2fdcb4
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF
    echo -e "${GREEN}✅ .env creado${NC}"
fi

echo ""
echo "🚀 Paso 5: Iniciar con logs detallados"
echo "====================================="

echo "Iniciando backend..."
cd server && npm start > ../server.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Esperando 3 segundos..."
sleep 3

echo "Iniciando frontend con logs..."
cd .. && npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo "Esperando 5 segundos para que inicie..."
sleep 5

echo ""
echo "📊 Paso 6: Verificar estado"
echo "==========================="

# Verificar puertos
if lsof -i :3000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Puerto 3000 ocupado${NC}"
else
    echo -e "${RED}❌ Puerto 3000 libre${NC}"
fi

if lsof -i :3001 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Puerto 3001 ocupado${NC}"
else
    echo -e "${RED}❌ Puerto 3001 libre${NC}"
fi

echo ""
echo "🔍 Paso 7: Probar endpoints"
echo "=========================="

echo "Probando frontend..."
if curl -s http://localhost:3000 | grep -q "html"; then
    echo -e "${GREEN}✅ Frontend sirve HTML${NC}"
else
    echo -e "${RED}❌ Frontend no sirve HTML${NC}"
fi

echo "Probando backend..."
if curl -s http://localhost:3001/api/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend responde${NC}"
else
    echo -e "${RED}❌ Backend no responde${NC}"
fi

echo ""
echo "📋 Logs de errores:"
echo "==================="
echo "Backend logs (últimas 10 líneas):"
tail -10 server.log

echo ""
echo "Frontend logs (últimas 10 líneas):"
tail -10 frontend.log

echo ""
echo "🌐 URLs para probar:"
echo "==================="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001/api/health"

echo ""
echo "🔧 Si sigue en blanco:"
echo "====================="
echo "1. Abre http://localhost:3000 en modo incógnito"
echo "2. Presiona F12 → Console para ver errores JavaScript"
echo "3. Presiona Ctrl+Shift+R para recarga dura"
echo "4. Verifica que no hay bloqueadores de JavaScript"

echo ""
echo -e "${YELLOW}💡 Para detener todo: kill $BACKEND_PID $FRONTEND_PID${NC}"
