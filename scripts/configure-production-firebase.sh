#!/bin/bash

echo "🔥 Configurando Firebase Console para producción..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "📋 Pasos para configurar Firebase Console:"
echo "=========================================="

echo ""
echo "1. 🔥 Ir a Firebase Console:"
echo "   https://console.firebase.google.com/project/sensa-os-ac840/authentication/providers"

echo ""
echo "2. 🔧 Configurar Google como proveedor:"
echo "   - Hacer clic en 'Google'"
echo "   - Verificar que esté habilitado"

echo ""
echo "3. 🌍 Configurar dominios autorizados:"
echo "   - Ir a: Authentication > Settings > Authorized domains"
echo "   - Agregar dominios:"
echo "     • localhost (ya debería estar)"
echo "     • tu-dominio-produccion.com"

echo ""
echo "4. 🔑 Verificar configuración OAuth:"
echo "   - Web SDK configuration debe mostrar:"
echo "     • API Key: AIzaSyD99fYsZaNO5ystn7bOdy20dTWpErQVoz8"
echo "     • Auth Domain: sensa-os-ac840.firebaseapp.com"

echo ""
echo "5. 📱 Configurar URLs de redirección:"
echo "   - En Google OAuth provider settings"
echo "   - Agregar URLs de redirección:"
echo "     • http://localhost:3000"
echo "     • https://tu-dominio-produccion.com"

echo ""
echo -e "${YELLOW}💡 IMPORTANTE:${NC}"
echo "   - Reemplaza 'tu-dominio-produccion.com' con tu dominio real"
echo "   - Asegúrate de que Google esté habilitado como proveedor"
echo "   - Verifica que los dominios estén en la lista autorizada"

echo ""
echo -e "${GREEN}✅ Una vez configurado, la autenticación funcionará en producción${NC}"
