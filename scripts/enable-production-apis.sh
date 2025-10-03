#!/bin/bash

echo "🚀 Habilitando APIs de Google para producción..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "📋 APIs necesarias para la aplicación:"
echo "======================================"

echo ""
echo "1. 📅 Google Calendar API:"
echo "   https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=your-project-id"
echo "   - Estado: Debe estar habilitada"
echo "   - Permisos: Leer y escribir eventos"

echo ""
echo "2. 📧 Gmail API:"
echo "   https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=your-project-id"
echo "   - Estado: Debe estar habilitada"
echo "   - Permisos: Leer emails, marcar como leído"

echo ""
echo "3. 🔐 Google Identity API (opcional):"
echo "   https://console.cloud.google.com/apis/library/identity.googleapis.com?project=your-project-id"
echo "   - Estado: Opcional, pero recomendado"
echo "   - Permisos: Información del perfil"

echo ""
echo "🔍 Verificar estado de las APIs:"
echo "==============================="

# Función para verificar API
check_api() {
    local api_name=$1
    local api_url=$2
    
    echo -e "${YELLOW}Verificando $api_name...${NC}"
    echo "URL: $api_url"
    echo ""
}

check_api "Google Calendar API" "https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=your-project-id"
check_api "Gmail API" "https://console.cloud.google.com/apis/library/gmail.googleapis.com?project=your-project-id"

echo ""
echo "📊 Verificar cuotas y límites:"
echo "=============================="
echo "1. Ir a: https://console.cloud.google.com/apis/api/calendar-json.googleapis.com/quotas?project=your-project-id"
echo "2. Verificar que no haya límites excedidos"
echo "3. Revisar cuotas diarias y por minuto"

echo ""
echo "🔧 Configuración de OAuth:"
echo "=========================="
echo "1. Ir a: https://console.cloud.google.com/apis/credentials?project=your-project-id"
echo "2. Verificar que el Client ID esté configurado correctamente"
echo "3. Revisar que los dominios autorizados incluyan tu dominio de producción"

echo ""
echo -e "${GREEN}✅ Una vez habilitadas todas las APIs, la aplicación funcionará completamente en producción${NC}"

echo ""
echo -e "${YELLOW}💡 TIP:${NC}"
echo "   - Las APIs pueden tardar unos minutos en activarse"
echo "   - Si hay errores de cuota, revisa los límites en la consola"
echo "   - Asegúrate de que el proyecto tenga facturación habilitada si es necesario"
