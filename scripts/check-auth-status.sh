#!/bin/bash

echo "🔍 Verificando estado de autenticación..."
echo ""

# Verificar si el servidor está corriendo
echo "📡 Verificando servidor backend..."
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend funcionando en puerto 3001"
else
    echo "❌ Backend no responde en puerto 3001"
    echo "💡 Ejecuta: cd server && npm start"
    exit 1
fi

echo ""

# Verificar si el frontend está corriendo
echo "🌐 Verificando servidor frontend..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend funcionando en puerto 3000"
else
    echo "❌ Frontend no responde en puerto 3000"
    echo "💡 Ejecuta: npm run dev"
    exit 1
fi

echo ""

# Verificar archivos de configuración
echo "⚙️ Verificando configuración..."

if [ -f ".env" ]; then
    echo "✅ Archivo .env encontrado"
    
    # Verificar variables importantes
    if grep -q "GOOGLE_CLIENT_ID" .env && ! grep -q "your-google-client-id" .env; then
        echo "✅ GOOGLE_CLIENT_ID configurado"
    else
        echo "❌ GOOGLE_CLIENT_ID no configurado o es placeholder"
    fi
    
    if grep -q "FIREBASE_API_KEY" .env; then
        echo "✅ FIREBASE_API_KEY configurado"
    else
        echo "❌ FIREBASE_API_KEY no encontrado"
    fi
else
    echo "❌ Archivo .env no encontrado"
fi

if [ -f "server/firebase-service-account.json" ]; then
    echo "✅ Firebase service account configurado"
else
    echo "❌ Firebase service account no encontrado"
fi

echo ""
echo "🔧 Para verificar tokens en el navegador:"
echo "1. Abre http://localhost:3000"
echo "2. Abre las herramientas de desarrollador (F12)"
echo "3. Ve a la consola y ejecuta:"
echo "   console.log('Token:', localStorage.getItem('googleAccessToken'))"
echo "   console.log('Expiry:', localStorage.getItem('googleTokenExpiry'))"
echo "   console.log('User:', firebase.auth().currentUser)"
echo ""
echo "🚀 Si todo está bien, recarga la página (Ctrl+Shift+R)"
