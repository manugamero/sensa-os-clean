#!/bin/bash

echo "🔧 Configuración de Google Cloud Console"
echo "========================================"
echo ""

echo "📋 PASO 1: Habilitar APIs en Google Cloud Console"
echo "1. Ve a https://console.cloud.google.com"
echo "2. Selecciona tu proyecto: sensa-os-ac840"
echo "3. Ve a 'APIs & Services' → 'Library'"
echo "4. Busca y habilita estas APIs:"
echo "   ✅ Google Calendar API"
echo "   ✅ Gmail API"
echo "   ✅ Google Identity API (para autenticación)"
echo ""
read -p "Presiona Enter cuando hayas habilitado las APIs..."

echo ""
echo "📋 PASO 2: Crear credenciales OAuth 2.0"
echo "1. Ve a 'APIs & Services' → 'Credentials'"
echo "2. Haz clic en 'Create Credentials' → 'OAuth 2.0 Client IDs'"
echo "3. Tipo: 'Web application'"
echo "4. Nombre: 'Sensa OS Web Client'"
echo "5. Authorized JavaScript origins:"
echo "   - http://localhost:3000"
echo "   - https://tu-dominio.railway.app (para producción)"
echo "6. Authorized redirect URIs:"
echo "   - http://localhost:3000"
echo "   - https://tu-dominio.railway.app (para producción)"
echo ""
read -p "Presiona Enter cuando hayas creado las credenciales OAuth..."

echo ""
echo "📋 PASO 3: Obtener credenciales de Firebase Admin"
echo "1. Ve a https://console.firebase.google.com"
echo "2. Selecciona tu proyecto: sensa-os-ac840"
echo "3. Ve a 'Project Settings' → 'Service accounts'"
echo "4. Haz clic en 'Generate new private key'"
echo "5. Descarga el archivo JSON"
echo "6. Renómbralo a 'firebase-service-account.json'"
echo "7. Muévelo a la carpeta 'server/'"
echo ""
read -p "Presiona Enter cuando hayas descargado el archivo..."

echo ""
echo "🔑 Ahora necesitamos configurar las credenciales OAuth:"
echo ""

read -p "Google Client ID: " GOOGLE_CLIENT_ID
read -p "Google Client Secret: " GOOGLE_CLIENT_SECRET

echo ""
echo "📝 Actualizando archivo .env..."

# Actualizar .env con las credenciales OAuth
sed -i.bak "s/GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com/GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID/" .env
sed -i.bak "s/GOOGLE_CLIENT_SECRET=your-google-client-secret/GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET/" .env

echo "✅ Archivo .env actualizado!"
echo ""
echo "🚀 Ahora puedes ejecutar la aplicación:"
echo "1. Frontend: npm run dev"
echo "2. Backend: cd server && npm run dev"
echo ""
echo "🌐 La aplicación estará disponible en http://localhost:3000"
