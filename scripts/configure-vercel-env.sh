#!/bin/bash

echo "🔧 Configurando variables de entorno en Vercel..."
echo ""

# Verificar si el archivo .env existe
if [ ! -f ".env" ]; then
    echo "❌ Archivo .env no encontrado"
    echo "💡 Copiando desde env.example..."
    cp env.example .env
fi

echo "📋 Variables de entorno a configurar en Vercel:"
echo ""

# Leer variables del archivo .env
if [ -f ".env" ]; then
    echo "🔍 Variables encontradas en .env:"
    grep -E "^(FIREBASE_|GOOGLE_)" .env | while read -r line; do
        if [[ $line == *"="* ]]; then
            key=$(echo "$line" | cut -d'=' -f1)
            value=$(echo "$line" | cut -d'=' -f2)
            echo "   $key=$value"
        fi
    done
fi

echo ""
echo "🚀 Para configurar estas variables en Vercel:"
echo ""
echo "1. 🌐 Ve a https://vercel.com/dashboard"
echo "2. 📁 Selecciona tu proyecto 'sensa-os'"
echo "3. ⚙️ Ve a Settings > Environment Variables"
echo "4. ➕ Agrega cada variable:"
echo ""

# Mostrar comandos para configurar variables
if [ -f ".env" ]; then
    grep -E "^(FIREBASE_|GOOGLE_)" .env | while read -r line; do
        if [[ $line == *"="* ]]; then
            key=$(echo "$line" | cut -d'=' -f1)
            value=$(echo "$line" | cut -d'=' -f2)
            echo "   vercel env add $key"
        fi
    done
fi

echo ""
echo "🔄 O usa el comando automático:"
echo "   vercel env add FIREBASE_API_KEY"
echo "   vercel env add FIREBASE_AUTH_DOMAIN"
echo "   vercel env add FIREBASE_PROJECT_ID"
echo "   vercel env add FIREBASE_STORAGE_BUCKET"
echo "   vercel env add FIREBASE_MESSAGING_SENDER_ID"
echo "   vercel env add FIREBASE_APP_ID"
echo "   vercel env add GOOGLE_CLIENT_ID"
echo "   vercel env add GOOGLE_CLIENT_SECRET"
echo ""
echo "✅ Después de configurar las variables, haz un nuevo deploy:"
echo "   vercel --prod"
