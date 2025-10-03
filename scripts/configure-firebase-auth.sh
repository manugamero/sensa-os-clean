
#!/bin/bash

echo "🔧 Configuración automática de Firebase Authentication"
echo "====================================================="
echo ""

echo "📋 PASO 1: Habilitar Google como proveedor de autenticación"
echo "1. Ve a https://console.firebase.google.com"
echo "2. Selecciona tu proyecto: sensa-os-ac840"
echo "3. Ve a 'Authentication' → 'Sign-in method'"
echo "4. Si 'Google' no está habilitado:"
echo "   - Haz clic en 'Google'"
echo "   - Habilita el proveedor"
echo "   - Configura el email de soporte"
echo "   - Haz clic en 'Save'"
echo ""

echo "📋 PASO 2: Verificar configuración OAuth"
echo "1. En la configuración de Google, verifica que estén configurados:"
echo "   - Web client ID: 169191147456-776mv4fff2f81rp76jig5dpc39604ht7.apps.googleusercontent.com"
echo "   - Web client secret: CONFIGURADO"
echo ""

echo "📋 PASO 3: Verificar dominios autorizados"
echo "1. Ve a https://console.cloud.google.com"
echo "2. Selecciona tu proyecto: sensa-os-ac840"
echo "3. Ve a 'APIs & Services' → 'Credentials'"
echo "4. Busca tu OAuth 2.0 Client ID"
echo "5. Verifica que estén configurados:"
echo "   - Authorized JavaScript origins: http://localhost:3000"
echo "   - Authorized redirect URIs: http://localhost:3000"
echo ""

echo "✅ Después de completar estos pasos:"
echo "1. Recarga http://localhost:3000"
echo "2. Haz clic en 'Iniciar sesión con Google'"
echo "3. Si hay errores, revisa la consola del navegador (F12)"
echo ""

echo "🔧 Si necesitas ayuda adicional:"
echo "- Revisa los logs en la consola del navegador"
echo "- Verifica que todas las APIs estén habilitadas en Google Cloud Console"
echo "- Asegúrate de que los dominios estén autorizados"
