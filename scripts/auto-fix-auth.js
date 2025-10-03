const fs = require('fs');

console.log('🔧 Solución automática de problemas de autenticación');
console.log('==================================================');

// Leer configuración actual
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

console.log('📋 Configuración actual:');
console.log(`   Proyecto: ${envVars.VITE_FIREBASE_PROJECT_ID}`);
console.log(`   API Key: ${envVars.VITE_FIREBASE_API_KEY ? '✅' : '❌'}`);
console.log(`   Client ID: ${envVars.GOOGLE_CLIENT_ID ? '✅' : '❌'}`);
console.log(`   Client Secret: ${envVars.GOOGLE_CLIENT_SECRET ? '✅' : '❌'}`);

// Crear script de solución automática
const autoFixScript = `
#!/bin/bash

echo "🔧 Solución automática de problemas de autenticación"
echo "=================================================="
echo ""

echo "📋 PROBLEMA IDENTIFICADO:"
echo "Google no está habilitado como proveedor de autenticación en Firebase"
echo ""

echo "🔧 SOLUCIÓN AUTOMÁTICA:"
echo "1. Ve a https://console.firebase.google.com"
echo "2. Selecciona tu proyecto: ${envVars.VITE_FIREBASE_PROJECT_ID}"
echo "3. Ve a 'Authentication' → 'Sign-in method'"
echo "4. Haz clic en 'Google' (si no está habilitado)"
echo "5. Habilita el proveedor"
echo "6. Configura el email de soporte: tu-email@ejemplo.com"
echo "7. Haz clic en 'Save'"
echo ""

echo "📋 CONFIGURACIÓN OAuth:"
echo "En la configuración de Google, asegúrate de que estén configurados:"
echo "   - Web client ID: ${envVars.GOOGLE_CLIENT_ID}"
echo "   - Web client secret: ${envVars.GOOGLE_CLIENT_SECRET}"
echo ""

echo "📋 VERIFICAR DOMINIOS AUTORIZADOS:"
echo "1. Ve a https://console.cloud.google.com"
echo "2. Selecciona tu proyecto: ${envVars.VITE_FIREBASE_PROJECT_ID}"
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
`;

fs.writeFileSync('scripts/auto-fix-auth.sh', autoFixScript);
require('child_process').execSync('chmod +x scripts/auto-fix-auth.sh');

console.log('✅ Script de solución automática creado: scripts/auto-fix-auth.sh');
console.log('🚀 Ejecuta: ./scripts/auto-fix-auth.sh');

// Crear también un script de verificación rápida
const quickCheckScript = `
#!/bin/bash

echo "🔍 Verificación rápida de configuración"
echo "====================================="
echo ""

echo "📋 Verificando archivos necesarios..."
if [ -f ".env" ]; then
    echo "✅ Archivo .env encontrado"
else
    echo "❌ Archivo .env no encontrado"
fi

if [ -f "server/firebase-service-account.json" ]; then
    echo "✅ Firebase service account encontrado"
else
    echo "❌ Firebase service account no encontrado"
fi

echo ""
echo "📋 Verificando servidores..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ Frontend ejecutándose en puerto 3000"
else
    echo "❌ Frontend no ejecutándose"
fi

if lsof -i :3001 > /dev/null 2>&1; then
    echo "✅ Backend ejecutándose en puerto 3001"
else
    echo "❌ Backend no ejecutándose"
fi

echo ""
echo "🌐 URLs disponibles:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo "   Health check: http://localhost:3001/api/health"
echo ""

echo "🔧 Si hay problemas:"
echo "1. Ejecuta: ./scripts/auto-fix-auth.sh"
echo "2. Verifica la consola del navegador (F12)"
echo "3. Revisa los logs del servidor"
`;

fs.writeFileSync('scripts/quick-check.sh', quickCheckScript);
require('child_process').execSync('chmod +x scripts/quick-check.sh');

console.log('✅ Script de verificación rápida creado: scripts/quick-check.sh');
console.log('🚀 Ejecuta: ./scripts/quick-check.sh');
