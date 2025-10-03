
#!/bin/bash

echo "🔧 Solución automática de problemas de autenticación"
echo "=================================================="
echo ""

echo "📋 PROBLEMA IDENTIFICADO:"
echo "Google no está habilitado como proveedor de autenticación en Firebase"
echo ""

echo "🔧 SOLUCIÓN AUTOMÁTICA:"
echo "1. Ve a https://console.firebase.google.com"
echo "2. Selecciona tu proyecto: sensa-os-ac840"
echo "3. Ve a 'Authentication' → 'Sign-in method'"
echo "4. Haz clic en 'Google' (si no está habilitado)"
echo "5. Habilita el proveedor"
echo "6. Configura el email de soporte: tu-email@ejemplo.com"
echo "7. Haz clic en 'Save'"
echo ""

echo "📋 CONFIGURACIÓN OAuth:"
echo "En la configuración de Google, asegúrate de que estén configurados:"
echo "   - Web client ID: 169191147456-776mv4fff2f81rp76jig5dpc39604ht7.apps.googleusercontent.com"
echo "   - Web client secret: your-google-client-secret"
echo ""

echo "📋 VERIFICAR DOMINIOS AUTORIZADOS:"
echo "1. Ve a https://console.cloud.google.com"
echo "2. Selecciona tu proyecto: sensa-os-ac840"
echo "3. Ve a 'APIs & Services' → 'Credentials'"
echo "4. Busca tu OAuth 2.0 Client ID"
echo "5. Verifica que estén configurados:"
echo "   - Authorized JavaScript origins: http://localhost:3000"
echo "   - Authorized redirect URIs: http://localhost:3000"
echo ""

echo "🚀 DESPUÉS DE COMPLETAR:"
echo "1. Recarga http://localhost:3000"
echo "2. Haz clic en 'Iniciar sesión con Google'"
echo "3. Si hay errores, revisa la consola del navegador (F12)"
echo ""

echo "🔍 DIAGNÓSTICO ADICIONAL:"
echo "Si el problema persiste, verifica:"
echo "1. Que todas las APIs estén habilitadas en Google Cloud Console"
echo "2. Que los dominios estén autorizados correctamente"
echo "3. Que las credenciales sean correctas"
echo "4. Que no haya errores en la consola del navegador"
