const { google } = require('googleapis');

console.log('🔧 Configurando URLs reales en Google Cloud Console');
console.log('==================================================');

// Configuración del proyecto
const PROJECT_ID = 'sensa-os-ac840';
const CLIENT_ID = '169191147456-776mv4fff2f81rp76jig5dpc39604ht7.apps.googleusercontent.com';

console.log('📋 PASO 1: Obtener URL de Railway');
console.log('=================================');
console.log('Ejecuta: railway domain');
console.log('Copia la URL que aparece');
console.log('');

console.log('📋 PASO 2: Configurar Google Cloud Console');
console.log('==========================================');
console.log('1. Ve a https://console.cloud.google.com');
console.log('2. Proyecto: sensa-os-ac840');
console.log('3. APIs & Services → Credentials');
console.log('4. Busca el OAuth 2.0 Client ID: 169191147456-776mv4fff2f81rp76jig5dpc39604ht7.apps.googleusercontent.com');
console.log('5. Haz clic en el icono de editar (lápiz)');
console.log('6. En "Authorized JavaScript origins" agrega:');
console.log('   - https://tu-dominio.railway.app');
console.log('7. En "Authorized redirect URIs" agrega:');
console.log('   - https://tu-dominio.railway.app');
console.log('8. Haz clic en "SAVE"');
console.log('');

console.log('📋 PASO 3: Configurar Firebase Console');
console.log('=====================================');
console.log('1. Ve a https://console.firebase.google.com');
console.log('2. Proyecto: sensa-os-ac840');
console.log('3. Authentication → Settings → Authorized domains');
console.log('4. Agrega: tu-dominio.railway.app');
console.log('5. Haz clic en "ADD"');
console.log('');

console.log('📋 PASO 4: Habilitar APIs');
console.log('==========================');
console.log('1. Ve a https://console.cloud.google.com/apis/library');
console.log('2. Busca y habilita:');
console.log('   - Google Calendar API');
console.log('   - Gmail API');
console.log('   - Google Identity API');
console.log('');

console.log('🎯 Resultado esperado:');
console.log('======================');
console.log('✅ Aplicación funcionando en https://tu-dominio.railway.app');
console.log('✅ Login con Google funcionando');
console.log('✅ Calendario con datos reales');
console.log('✅ Email con datos reales');
console.log('');

console.log('🚀 Para obtener tu URL de Railway:');
console.log('==================================');
console.log('1. Ejecuta: railway login');
console.log('2. Ejecuta: railway init');
console.log('3. Ejecuta: railway domain');
console.log('4. Copia la URL que aparece');
console.log('5. Úsala en los pasos de arriba');
