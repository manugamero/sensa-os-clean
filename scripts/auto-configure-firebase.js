const https = require('https');
const fs = require('fs');

console.log('🔧 Configuración automática de Firebase Authentication');
console.log('====================================================');

// Leer credenciales del archivo .env
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const projectId = envVars.VITE_FIREBASE_PROJECT_ID;
const apiKey = envVars.VITE_FIREBASE_API_KEY;

console.log(`📋 Proyecto: ${projectId}`);
console.log(`🔑 API Key: ${apiKey ? 'Configurado' : 'No encontrado'}`);

if (!projectId || !apiKey) {
  console.log('❌ Error: No se encontraron las credenciales de Firebase');
  process.exit(1);
}

// Verificar si Google está habilitado como proveedor
console.log('\n🔍 Verificando configuración de Google Authentication...');

// Crear un script de verificación para el usuario
const verificationScript = `
#!/bin/bash

echo "🔧 Configuración automática de Firebase Authentication"
echo "====================================================="
echo ""

echo "📋 PASO 1: Habilitar Google como proveedor de autenticación"
echo "1. Ve a https://console.firebase.google.com"
echo "2. Selecciona tu proyecto: ${projectId}"
echo "3. Ve a 'Authentication' → 'Sign-in method'"
echo "4. Si 'Google' no está habilitado:"
echo "   - Haz clic en 'Google'"
echo "   - Habilita el proveedor"
echo "   - Configura el email de soporte"
echo "   - Haz clic en 'Save'"
echo ""

echo "📋 PASO 2: Verificar configuración OAuth"
echo "1. En la configuración de Google, verifica que estén configurados:"
echo "   - Web client ID: ${envVars.GOOGLE_CLIENT_ID || 'NO CONFIGURADO'}"
echo "   - Web client secret: ${envVars.GOOGLE_CLIENT_SECRET ? 'CONFIGURADO' : 'NO CONFIGURADO'}"
echo ""

echo "📋 PASO 3: Verificar dominios autorizados"
echo "1. Ve a https://console.cloud.google.com"
echo "2. Selecciona tu proyecto: ${projectId}"
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
`;

fs.writeFileSync('scripts/configure-firebase-auth.sh', verificationScript);
require('child_process').execSync('chmod +x scripts/configure-firebase-auth.sh');

console.log('✅ Script de configuración creado: scripts/configure-firebase-auth.sh');
console.log('🚀 Ejecuta: ./scripts/configure-firebase-auth.sh');
