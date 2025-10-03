#!/bin/bash

echo "🚀 Despliegue rápido en Railway"
echo "==============================="
echo ""

echo "📋 PASO 1: Instalar Railway CLI"
echo "==============================="
if ! command -v railway &> /dev/null; then
    echo "Instalando Railway CLI..."
    npm install -g @railway/cli
else
    echo "✅ Railway CLI ya está instalado"
fi

echo ""
echo "📋 PASO 2: Login en Railway"
echo "==========================="
echo "Ejecutando: railway login"
railway login

echo ""
echo "📋 PASO 3: Crear proyecto"
echo "========================"
echo "Ejecutando: railway init"
railway init

echo ""
echo "📋 PASO 4: Configurar variables"
echo "==============================="
echo "Configurando variables de entorno..."
railway variables set VITE_FIREBASE_API_KEY=AIzaSyD99fYsZaNO5ystn7bOdy20dTWpErQVoz8
railway variables set VITE_FIREBASE_AUTH_DOMAIN=sensa-os-ac840.firebaseapp.com
railway variables set VITE_FIREBASE_PROJECT_ID=sensa-os-ac840
railway variables set VITE_FIREBASE_STORAGE_BUCKET=sensa-os-ac840.firebasestorage.app
railway variables set VITE_FIREBASE_MESSAGING_SENDER_ID=your-project-id
railway variables set VITE_FIREBASE_APP_ID=1:your-project-id:web:2b115f20a44c131b2fdcb4
railway variables set GOOGLE_CLIENT_ID=169191147456-776mv4fff2f81rp76jig5dpc39604ht7.apps.googleusercontent.com
railway variables set GOOGLE_CLIENT_SECRET=your-google-client-secret

echo ""
echo "📋 PASO 5: Desplegar"
echo "===================="
echo "Ejecutando: railway up"
railway up

echo ""
echo "🎯 ¡Despliegue completado!"
echo "========================="
echo "1. Obtén la URL de producción de Railway"
echo "2. Configura Google Cloud Console con la nueva URL"
echo "3. Configura Firebase Console con la nueva URL"
echo "4. ¡Disfruta de Sensa OS en producción!"
