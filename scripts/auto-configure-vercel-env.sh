#!/bin/bash

echo "🔧 Configurando variables de entorno en Vercel automáticamente..."
echo ""

# Leer variables del archivo .env
if [ -f ".env" ]; then
    echo "📋 Configurando variables desde .env..."
    
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
    
    echo "✅ Variables leídas desde .env"
    echo ""
    
    # Configurar variables en Vercel
    echo "🚀 Configurando variables en Vercel..."
    
    # Firebase variables
    echo "FIREBASE_API_KEY=$FIREBASE_API_KEY" | vercel env add FIREBASE_API_KEY
    echo "FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN" | vercel env add FIREBASE_AUTH_DOMAIN
    echo "FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID" | vercel env add FIREBASE_PROJECT_ID
    echo "FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET" | vercel env add FIREBASE_STORAGE_BUCKET
    echo "FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID" | vercel env add FIREBASE_MESSAGING_SENDER_ID
    echo "FIREBASE_APP_ID=$FIREBASE_APP_ID" | vercel env add FIREBASE_APP_ID
    
    # Google OAuth variables
    echo "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" | vercel env add GOOGLE_CLIENT_ID
    echo "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" | vercel env add GOOGLE_CLIENT_SECRET
    
    echo ""
    echo "✅ Todas las variables configuradas en Vercel"
    echo ""
    echo "🔄 Haciendo deploy con las nuevas variables..."
    vercel --prod --yes
    
else
    echo "❌ Archivo .env no encontrado"
    echo "💡 Crea el archivo .env con las variables necesarias"
    exit 1
fi
