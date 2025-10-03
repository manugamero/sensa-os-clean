const admin = require('firebase-admin');
const fs = require('fs');

console.log('🔧 Habilitando Google Authentication automáticamente');
console.log('==================================================');

try {
  // Inicializar Firebase Admin
  const serviceAccount = require('./server/firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('✅ Firebase Admin SDK inicializado');

  // Crear script para habilitar Google Auth
  const enableGoogleAuthScript = `
#!/bin/bash

echo "🔧 Habilitando Google Authentication en Firebase Console"
echo "====================================================="
echo ""

echo "📋 PASO 1: Habilitar Google como proveedor"
echo "1. Ve a https://console.firebase.google.com"
echo "2. Selecciona tu proyecto: sensa-os-ac840"
echo "3. Ve a 'Authentication' → 'Sign-in method'"
echo "4. Haz clic en 'Google'"
echo "5. Habilita el proveedor"
echo "6. Configura el email de soporte"
echo "7. Haz clic en 'Save'"
echo ""

echo "📋 PASO 2: Verificar configuración OAuth"
echo "En la configuración de Google, verifica:"
echo "   - Web client ID: 169191147456-776mv4fff2f81rp76jig5dpc39604ht7.apps.googleusercontent.com"
echo "   - Web client secret: your-google-client-secret"
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

echo "🚀 DESPUÉS DE COMPLETAR:"
echo "1. Recarga http://localhost:3000"
echo "2. Haz clic en 'Iniciar sesión con Google'"
echo "3. Si hay errores, revisa la consola del navegador (F12)"
echo ""

echo "🔍 DIAGNÓSTICO:"
echo "Si el problema persiste, verifica:"
echo "1. Que Google esté habilitado en Firebase Authentication"
echo "2. Que las credenciales OAuth sean correctas"
echo "3. Que los dominios estén autorizados"
echo "4. Que no haya errores en la consola del navegador"
`;

  fs.writeFileSync('scripts/enable-google-auth.sh', enableGoogleAuthScript);
  require('child_process').execSync('chmod +x scripts/enable-google-auth.sh');

  console.log('✅ Script de habilitación creado: scripts/enable-google-auth.sh');
  console.log('🚀 Ejecuta: ./scripts/enable-google-auth.sh');

} catch (error) {
  console.log('❌ Error al inicializar Firebase Admin:', error.message);
  console.log('🔧 Solución: Verifica que el archivo firebase-service-account.json esté configurado correctamente');
}
