#!/bin/bash

echo "🚀 Iniciando Sensa OS en producción"
echo "==================================="
echo ""

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd /app
npm install

# Construir frontend
echo "🔨 Construyendo frontend..."
npm run build

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd server
npm install

# Iniciar backend
echo "🚀 Iniciando backend..."
npm start