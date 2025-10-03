#!/bin/bash

echo "🔧 Configurando Google Cloud para Vercel..."
echo ""

# Solicitar la URL de Vercel
echo "🌐 Ingresa la URL de tu aplicación en Vercel:"
echo "   (ejemplo: https://sensa-os-abc123.vercel.app)"
read -p "URL: " VERCEL_URL

if [ -z "$VERCEL_URL" ]; then
    echo "❌ URL no proporcionada"
    exit 1
fi

echo ""
echo "🔧 Configuración necesaria en Google Cloud Console:"
echo ""
echo "1. 🌐 Ve a https://console.cloud.google.com/apis/credentials"
echo "2. 🔑 Selecciona tu OAuth 2.0 Client ID"
echo "3. ✏️ Edita la configuración:"
echo ""
echo "📝 Authorized JavaScript origins:"
echo "   - $VERCEL_URL"
echo "   - https://sensa-os-clean.vercel.app"
echo ""
echo "📝 Authorized redirect URIs:"
echo "   - $VERCEL_URL"
echo "   - https://sensa-os-clean.vercel.app"
echo ""

# Crear archivo de configuración
cat > vercel-config.md << EOF
# Configuración de Vercel para Sensa OS

## URL de la aplicación
- **URL de Vercel:** $VERCEL_URL
- **URL de GitHub:** https://github.com/manugamero/sensa-os-clean

## Variables de entorno configuradas en Vercel
- FIREBASE_API_KEY
- FIREBASE_AUTH_DOMAIN  
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_APP_ID
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

## URLs autorizadas en Google Cloud Console
- **JavaScript origins:** $VERCEL_URL
- **Redirect URIs:** $VERCEL_URL

## Comandos útiles
\`\`\`bash
# Deploy manual
vercel --prod

# Ver logs
vercel logs

# Configurar variables de entorno
vercel env add VARIABLE_NAME
\`\`\`
EOF

echo "📄 Configuración guardada en vercel-config.md"
echo ""
echo "✅ Próximos pasos:"
echo "1. 🔧 Configura las URLs en Google Cloud Console"
echo "2. 🔄 Haz push de los cambios al repositorio"
echo "3. 🚀 Vercel hará deploy automático"
echo "4. 🧪 Prueba la aplicación en: $VERCEL_URL"
