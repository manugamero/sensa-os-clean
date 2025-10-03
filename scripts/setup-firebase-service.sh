#!/bin/bash

echo " Configuración de Firebase Service Account"
echo "============================================="
echo ""

echo "📋 PASO 1: Descargar Service Account JSON"
echo "1. Ve a https://console.firebase.google.com"
echo "2. Selecciona tu proyecto: sensa-os-ac840"
echo "3. Haz clic en el ícono de configuración (⚙️) → 'Project settings'"
echo "4. Ve a la pestaña 'Service accounts'"
echo "5. Haz clic en 'Generate new private key'"
echo "6. Confirma la acción"
echo "7. Se descargará un archivo JSON"
echo ""
read -p "Presiona Enter cuando hayas descargado el archivo..."

echo ""
echo "📋 PASO 2: Configurar el archivo"
echo "1. Renombra el archivo descargado a 'firebase-service-account.json'"
echo "2. Muévelo a la carpeta 'server/'"
echo "3. Reemplaza el archivo existente"
echo ""
read -p "Presiona Enter cuando hayas configurado el archivo..."

echo ""
echo "📋 PASO 3: Verificar configuración"
echo "Verificando que el archivo esté en la ubicación correcta..."

if [ -f "server/firebase-service-account.json" ]; then
    echo "✅ Archivo firebase-service-account.json encontrado"
    
    # Verificar que no sea el archivo de demo
    if grep -q "REEMPLAZAR_CON_TU" server/firebase-service-account.json; then
        echo "❌ El archivo aún contiene texto de demo"
        echo "   Por favor, reemplaza con el archivo real descargado"
    else
        echo "✅ Archivo configurado correctamente"
    fi
else
    echo "❌ Archivo firebase-service-account.json no encontrado"
    echo "   Por favor, mueve el archivo a server/firebase-service-account.json"
fi

echo ""
echo "🚀 Una vez configurado, puedes iniciar el backend:"
echo "cd server && npm run dev"
