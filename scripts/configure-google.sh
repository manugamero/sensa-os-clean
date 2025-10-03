#!/bin/bash

echo "🚀 Configuración de Sensa OS con Google APIs"
echo "=============================================="
echo ""

echo "📋 PASO 1: Configurar Firebase Console"
echo "1. Ve a https://console.firebase.google.com"
echo "2. Crea un nuevo proyecto llamado 'sensa-os'"
echo "3. Habilita Authentication → Google"
echo "4. Ve a Project Settings → Web apps"
echo "5. Registra una nueva app web"
echo "6. Copia la configuración que aparece"
echo ""
read -p "Presiona Enter cuando hayas completado el paso 1..."

echo ""
echo "📋 PASO 2: Configurar Google Cloud Console"
echo "1. Ve a https://console.cloud.google.com"
echo "2. Selecciona tu proyecto de Firebase"
echo "3. Ve a APIs & Services → Library"
echo "4. Habilita estas APIs:"
echo "   - Google Calendar API"
echo "   - Gmail API"
echo "   - Google+ API"
echo "5. Ve a APIs & Services → Credentials"
echo "6. Crea OAuth 2.0 Client ID (Web application)"
echo "7. Configura dominios autorizados:"
echo "   - http://localhost:3000 (desarrollo)"
echo "   - https://tu-dominio.com (producción)"
echo ""
read -p "Presiona Enter cuando hayas completado el paso 2..."

echo ""
echo "📋 PASO 3: Obtener credenciales de Firebase Admin"
echo "1. En Firebase Console → Project Settings → Service accounts"
echo "2. Haz clic en 'Generate new private key'"
echo "3. Descarga el archivo JSON"
echo "4. Renómbralo a 'firebase-service-account.json'"
echo "5. Muévelo a la carpeta 'server/'"
echo ""
read -p "Presiona Enter cuando hayas completado el paso 3..."

echo ""
echo "📋 PASO 4: Configurar variables de entorno"
echo "Ahora necesitamos actualizar el archivo .env con tus credenciales reales:"
echo ""

# Obtener credenciales de Firebase
echo "🔑 FIREBASE CONFIGURATION:"
read -p "API Key: " FIREBASE_API_KEY
read -p "Auth Domain: " FIREBASE_AUTH_DOMAIN
read -p "Project ID: " FIREBASE_PROJECT_ID
read -p "Storage Bucket: " FIREBASE_STORAGE_BUCKET
read -p "Messaging Sender ID: " FIREBASE_MESSAGING_SENDER_ID
read -p "App ID: " FIREBASE_APP_ID

echo ""
echo "🔑 GOOGLE OAUTH CONFIGURATION:"
read -p "Google Client ID: " GOOGLE_CLIENT_ID
read -p "Google Client Secret: " GOOGLE_CLIENT_SECRET

echo ""
echo "📝 Actualizando archivo .env..."

cat > .env << EOF
# Firebase Configuration
VITE_FIREBASE_API_KEY=$FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=$FIREBASE_APP_ID

# Google OAuth Configuration
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Production URLs (configurar cuando despliegues)
# VITE_API_URL=https://tu-dominio.com/api
# VITE_SOCKET_URL=https://tu-dominio.com
EOF

echo "✅ Archivo .env actualizado!"
echo ""
echo "🚀 Ahora puedes ejecutar la aplicación:"
echo "1. Frontend: npm run dev"
echo "2. Backend: cd server && npm run dev"
echo ""
echo "🌐 La aplicación estará disponible en http://localhost:3000"
