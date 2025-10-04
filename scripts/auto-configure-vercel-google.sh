#!/bin/bash

echo "🔧 Configurando Google Cloud para Vercel automáticamente..."
echo ""

# URL de Vercel obtenida del deploy anterior
VERCEL_URL="https://sensa-ev5k837hr-manugameros-projects.vercel.app"

echo "🌐 URL de Vercel: $VERCEL_URL"
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
cat > vercel-production-config.md << EOF
# Configuración de Producción - Sensa OS

## 🌐 URLs de la aplicación
- **URL de Vercel:** $VERCEL_URL
- **URL de GitHub:** https://github.com/manugamero/sensa-os-clean

## 🔧 Variables de entorno en Vercel
Configura estas variables en https://vercel.com/dashboard:

\`\`\`bash
# Firebase Configuration
vercel env add FIREBASE_API_KEY
vercel env add FIREBASE_AUTH_DOMAIN  
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_STORAGE_BUCKET
vercel env add FIREBASE_MESSAGING_SENDER_ID
vercel env add FIREBASE_APP_ID

# Google OAuth Configuration
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
\`\`\`

## 🔗 URLs autorizadas en Google Cloud Console
- **JavaScript origins:** $VERCEL_URL
- **Redirect URIs:** $VERCEL_URL

## 🚀 Comandos útiles
\`\`\`bash
# Deploy manual
vercel --prod

# Ver logs
vercel logs

# Configurar variables de entorno
vercel env add VARIABLE_NAME
\`\`\`

## ✅ Checklist de configuración
- [ ] Variables de entorno configuradas en Vercel
- [ ] URLs autorizadas en Google Cloud Console
- [ ] APIs habilitadas en Google Cloud Console
- [ ] Firebase Authentication configurado
- [ ] Aplicación funcionando en producción
EOF

echo "📄 Configuración guardada en vercel-production-config.md"
echo ""
echo "✅ Próximos pasos:"
echo "1. 🔧 Configura las variables de entorno en Vercel Dashboard"
echo "2. 🔗 Actualiza las URLs en Google Cloud Console"
echo "3. 🚀 Haz un nuevo deploy: vercel --prod"
echo "4. 🧪 Prueba la aplicación en: $VERCEL_URL"
echo ""
echo "📋 Para configurar variables de entorno:"
echo "   ./scripts/configure-vercel-env.sh"

