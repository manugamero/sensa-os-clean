#!/bin/bash

echo "🔧 Configurando Google Cloud Console automáticamente..."
echo ""

# URL de la aplicación
VERCEL_URL="https://sos001.vercel.app"

echo "🌐 URL de la aplicación: $VERCEL_URL"
echo ""

echo "📋 Configuración necesaria en Google Cloud Console:"
echo ""
echo "🔗 Ve a: https://console.cloud.google.com/apis/credentials"
echo ""
echo "📝 Pasos para configurar:"
echo "1. Selecciona tu OAuth 2.0 Client ID"
echo "2. Haz clic en 'Edit' (lápiz)"
echo "3. En 'Authorized JavaScript origins' agrega:"
echo "   - $VERCEL_URL"
echo "4. En 'Authorized redirect URIs' agrega:"
echo "   - $VERCEL_URL"
echo "5. Haz clic en 'Save'"
echo ""

echo "🔍 Verificar APIs habilitadas:"
echo "🔗 Ve a: https://console.cloud.google.com/apis/library"
echo ""
echo "✅ Asegúrate de que estén habilitadas:"
echo "   - Google Calendar API"
echo "   - Gmail API"
echo "   - Google Identity API (opcional)"
echo ""

echo "🔐 Verificar Firebase Authentication:"
echo "🔗 Ve a: https://console.firebase.google.com/project/sensa-os-ac840/authentication/providers"
echo ""
echo "✅ Asegúrate de que Google esté habilitado como proveedor"
echo ""

echo "🧪 Prueba la aplicación:"
echo "   $VERCEL_URL"
echo ""

echo "✅ Checklist de configuración:"
echo "   [x] Variables de entorno en Vercel"
echo "   [x] Deploy realizado"
echo "   [ ] URLs autorizadas en Google Cloud"
echo "   [ ] APIs habilitadas"
echo "   [ ] Firebase Authentication configurado"
echo "   [ ] Aplicación funcionando"
echo ""

echo "🎉 ¡Solo faltan los pasos manuales en Google Cloud!"
