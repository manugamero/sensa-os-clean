#!/bin/bash

echo "🔍 Verificación de Configuración - Sensa OS"
echo "=========================================="
echo ""

# Verificar archivos necesarios
echo "📁 Verificando archivos necesarios..."

if [ -f ".env" ]; then
    echo "✅ Archivo .env encontrado"
else
    echo "❌ Archivo .env no encontrado"
    echo "   Ejecuta: ./scripts/configure-google.sh"
    exit 1
fi

if [ -f "server/firebase-service-account.json" ]; then
    echo "✅ Firebase service account encontrado"
else
    echo "⚠️  Firebase service account no encontrado"
    echo "   Descarga desde Firebase Console → Project Settings → Service accounts"
fi

# Verificar variables de entorno
echo ""
echo "🔑 Verificando variables de entorno..."

source .env

if [ -n "$VITE_FIREBASE_API_KEY" ] && [ "$VITE_FIREBASE_API_KEY" != "AIzaSyDemo123456789" ]; then
    echo "✅ Firebase API Key configurado"
else
    echo "❌ Firebase API Key no configurado o es demo"
fi

if [ -n "$VITE_FIREBASE_PROJECT_ID" ] && [ "$VITE_FIREBASE_PROJECT_ID" != "sensa-os-demo" ]; then
    echo "✅ Firebase Project ID configurado"
else
    echo "❌ Firebase Project ID no configurado o es demo"
fi

if [ -n "$GOOGLE_CLIENT_ID" ] && [ "$GOOGLE_CLIENT_ID" != "demo-client-id.googleusercontent.com" ]; then
    echo "✅ Google Client ID configurado"
else
    echo "❌ Google Client ID no configurado o es demo"
fi

# Verificar dependencias
echo ""
echo "📦 Verificando dependencias..."

if [ -d "node_modules" ]; then
    echo "✅ Dependencias del frontend instaladas"
else
    echo "❌ Dependencias del frontend no instaladas"
    echo "   Ejecuta: npm install"
fi

if [ -d "server/node_modules" ]; then
    echo "✅ Dependencias del backend instaladas"
else
    echo "❌ Dependencias del backend no instaladas"
    echo "   Ejecuta: cd server && npm install"
fi

# Verificar puertos
echo ""
echo "🌐 Verificando puertos..."

if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Puerto 3000 (frontend) en uso"
else
    echo "⚠️  Puerto 3000 (frontend) libre"
fi

if lsof -i :3001 > /dev/null 2>&1; then
    echo "✅ Puerto 3001 (backend) en uso"
else
    echo "⚠️  Puerto 3001 (backend) libre"
fi

echo ""
echo "🚀 Comandos para iniciar la aplicación:"
echo "1. Frontend: npm run dev"
echo "2. Backend: cd server && npm run dev"
echo ""
echo "🌐 La aplicación estará disponible en http://localhost:3000"
