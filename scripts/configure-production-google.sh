#!/bin/bash

echo "🔧 Configurando Google Cloud Console para producción..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "📋 Pasos para configurar Google Cloud Console:"
echo "=============================================="

echo ""
echo "1. 🌐 Ir a Google Cloud Console:"
echo "   https://console.cloud.google.com/apis/credentials?project=your-project-id"

echo ""
echo "2. 🔧 Editar OAuth 2.0 Client ID:"
echo "   - Buscar: 'your-google-client-id'"
echo "   - Hacer clic en el ícono de editar (lápiz)"

echo ""
echo "3. 🌍 Configurar URLs autorizadas:"
echo "   - Authorized JavaScript origins:"
echo "     • http://localhost:3000"
echo "     • https://tu-dominio-produccion.com"
echo "   - Authorized redirect URIs:"
echo "     • http://localhost:3000"
echo "     • https://tu-dominio-produccion.com"

echo ""
echo "4. ✅ Guardar cambios"

echo ""
echo "5. 🔑 Verificar que las APIs estén habilitadas:"
echo "   - Google Calendar API: https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=your-project-id"
echo "   - Gmail API: https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=your-project-id"

echo ""
echo -e "${YELLOW}💡 IMPORTANTE:${NC}"
echo "   - Reemplaza 'tu-dominio-produccion.com' con tu dominio real"
echo "   - Si usas Railway, será algo como: https://tu-app.railway.app"
echo "   - Si usas Vercel, será algo como: https://tu-app.vercel.app"

echo ""
echo -e "${GREEN}✅ Una vez configurado, la aplicación funcionará en producción${NC}"
