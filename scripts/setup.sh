#!/bin/bash

echo "🚀 Configurando Sensa OS..."

# Crear directorio de uploads
mkdir -p server/uploads

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
npm install

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd server
npm install
cd ..

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    echo "⚠️  Por favor, configura las variables de entorno en .env"
fi

# Crear archivo de credenciales Firebase si no existe
if [ ! -f server/firebase-service-account.json ]; then
    echo "📝 Creando archivo de credenciales Firebase..."
    cp server/firebase-service-account.json.example server/firebase-service-account.json
    echo "⚠️  Por favor, configura las credenciales de Firebase en server/firebase-service-account.json"
fi

echo "✅ Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar variables de entorno en .env"
echo "2. Configurar credenciales de Firebase en server/firebase-service-account.json"
echo "3. Ejecutar 'npm run dev' para iniciar el servidor de desarrollo"
echo "4. Ejecutar 'cd server && npm run dev' para iniciar el backend"
