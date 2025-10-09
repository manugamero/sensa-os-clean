#!/bin/bash

echo "🚀 Deploy final de Sensa OS a producción"
echo ""

# URL corta configurada
VERCEL_URL="https://sos001.vercel.app"

echo "🌐 URL de la aplicación: $VERCEL_URL"
echo ""

echo "📋 Estado actual de la configuración:"
echo "✅ Repositorio GitHub: https://github.com/manugamero/sensa-os-clean"
echo "✅ URL corta configurada: $VERCEL_URL"
echo "✅ Build exitoso (TypeScript corregido)"
echo "✅ Scripts de configuración creados"
echo ""

echo "🔧 Configuración pendiente:"
echo ""
echo "1. 📝 Variables de entorno en Vercel:"
echo "   🔗 https://vercel.com/manugameros-projects/sensa-os/settings/environment-variables"
echo ""
echo "   Agrega estas variables:"
echo "   - FIREBASE_API_KEY = AIzaSyD99fYsZaNO5ystn7bOdy20dTWpErQVoz8"
echo "   - FIREBASE_AUTH_DOMAIN = sensa-os-ac840.firebaseapp.com"
echo "   - FIREBASE_PROJECT_ID = sensa-os-ac840"
echo "   - FIREBASE_STORAGE_BUCKET = sensa-os-ac840.firebasestorage.app"
echo "   - FIREBASE_MESSAGING_SENDER_ID = 242388655453"
echo "   - FIREBASE_APP_ID = 1:242388655453:web:2b115f20a44c131b2fdcb4"
echo "   - GOOGLE_CLIENT_ID = [CONFIGURED]"
echo "   - GOOGLE_CLIENT_SECRET = [CONFIGURED]"
echo ""

echo "2. 🔗 URLs en Google Cloud Console:"
echo "   🔗 https://console.cloud.google.com/apis/credentials"
echo ""
echo "   Configura tu OAuth 2.0 Client ID:"
echo "   - JavaScript origins: $VERCEL_URL"
echo "   - Redirect URIs: $VERCEL_URL"
echo ""

echo "3. 🚀 Deploy final:"
echo "   vercel --prod"
echo ""

echo "4. 🧪 Prueba la aplicación:"
echo "   $VERCEL_URL"
echo ""

echo "✅ Checklist de configuración:"
echo "   [ ] Variables de entorno en Vercel"
echo "   [ ] URLs autorizadas en Google Cloud"
echo "   [ ] APIs habilitadas (Calendar, Gmail)"
echo "   [ ] Firebase Authentication configurado"
echo "   [ ] Deploy final realizado"
echo "   [ ] Aplicación funcionando en producción"
echo ""

echo "🎉 ¡Sensa OS estará listo para producción!"
