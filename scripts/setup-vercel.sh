#!/bin/bash

echo "🚀 Configurando Vercel para Sensa OS..."
echo ""

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado"
    echo "💡 Instalando Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 Iniciando sesión en Vercel..."
vercel login

echo ""
echo "📦 Configurando proyecto en Vercel..."

# Configurar el proyecto
vercel --prod

echo ""
echo "✅ Configuración completada!"
echo ""
echo "🔧 Próximos pasos:"
echo "1. 🌐 Obtén la URL de Vercel (se mostrará después del deploy)"
echo "2. 🔧 Configura las variables de entorno en Vercel Dashboard:"
echo "   - FIREBASE_API_KEY"
echo "   - FIREBASE_AUTH_DOMAIN"
echo "   - FIREBASE_PROJECT_ID"
echo "   - FIREBASE_STORAGE_BUCKET"
echo "   - FIREBASE_MESSAGING_SENDER_ID"
echo "   - FIREBASE_APP_ID"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "3. 🔗 Actualiza las URLs autorizadas en Google Cloud Console"
echo "4. 🔄 Haz push de los cambios para deploy automático"
echo ""
echo "📋 Para configurar Google Cloud con la nueva URL:"
echo "   ./scripts/configure-production-google.sh"
