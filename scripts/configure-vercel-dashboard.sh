#!/bin/bash

echo "🔧 Configuración automática de Vercel Dashboard"
echo ""

# URL corta configurada
VERCEL_URL="https://sos01.vercel.app"

echo "🌐 URL de la aplicación: $VERCEL_URL"
echo ""

# Leer variables del .env
if [ -f ".env" ]; then
    echo "📋 Variables a configurar en Vercel Dashboard:"
    echo ""
    echo "🔗 Ve a: https://vercel.com/manugameros-projects/sensa-os/settings/environment-variables"
    echo ""
    echo "➕ Agrega estas variables:"
    echo ""
    
    # Firebase variables
    FIREBASE_API_KEY=$(grep "VITE_FIREBASE_API_KEY" .env | cut -d'=' -f2)
    FIREBASE_AUTH_DOMAIN=$(grep "VITE_FIREBASE_AUTH_DOMAIN" .env | cut -d'=' -f2)
    FIREBASE_PROJECT_ID=$(grep "VITE_FIREBASE_PROJECT_ID" .env | cut -d'=' -f2)
    FIREBASE_STORAGE_BUCKET=$(grep "VITE_FIREBASE_STORAGE_BUCKET" .env | cut -d'=' -f2)
    FIREBASE_MESSAGING_SENDER_ID=$(grep "VITE_FIREBASE_MESSAGING_SENDER_ID" .env | cut -d'=' -f2)
    FIREBASE_APP_ID=$(grep "VITE_FIREBASE_APP_ID" .env | cut -d'=' -f2)
    
    # Google OAuth variables
    GOOGLE_CLIENT_ID=$(grep "GOOGLE_CLIENT_ID" .env | cut -d'=' -f2)
    GOOGLE_CLIENT_SECRET=$(grep "GOOGLE_CLIENT_SECRET" .env | cut -d'=' -f2)
    
    echo "FIREBASE_API_KEY = $FIREBASE_API_KEY"
    echo "FIREBASE_AUTH_DOMAIN = $FIREBASE_AUTH_DOMAIN"
    echo "FIREBASE_PROJECT_ID = $FIREBASE_PROJECT_ID"
    echo "FIREBASE_STORAGE_BUCKET = $FIREBASE_STORAGE_BUCKET"
    echo "FIREBASE_MESSAGING_SENDER_ID = $FIREBASE_MESSAGING_SENDER_ID"
    echo "FIREBASE_APP_ID = $FIREBASE_APP_ID"
    echo "GOOGLE_CLIENT_ID = $GOOGLE_CLIENT_ID"
    echo "GOOGLE_CLIENT_SECRET = $GOOGLE_CLIENT_SECRET"
    echo ""
    
    # Crear archivo de configuración para Google Cloud
    cat > google-cloud-config.md << EOF
# Configuración de Google Cloud Console

## 🔗 URLs autorizadas para OAuth 2.0
- **JavaScript origins:** $VERCEL_URL
- **Redirect URIs:** $VERCEL_URL

## 📋 Pasos para configurar:
1. Ve a https://console.cloud.google.com/apis/credentials
2. Selecciona tu OAuth 2.0 Client ID
3. Edita la configuración
4. Agrega las URLs autorizadas arriba
5. Guarda los cambios

## ✅ Verificación:
- [ ] Variables de entorno configuradas en Vercel
- [ ] URLs autorizadas en Google Cloud Console
- [ ] APIs habilitadas (Calendar, Gmail)
- [ ] Firebase Authentication configurado
EOF

    echo "📄 Configuración de Google Cloud guardada en google-cloud-config.md"
    echo ""
    echo "✅ Después de configurar las variables:"
    echo "   vercel --prod"
    echo ""
    echo "🧪 Prueba la aplicación en: $VERCEL_URL"
    
else
    echo "❌ Archivo .env no encontrado"
fi
