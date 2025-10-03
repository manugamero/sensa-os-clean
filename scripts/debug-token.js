const https = require('https');

console.log('🔍 Debug del token de Google');
console.log('============================');

// Simular verificación del token
const testToken = 'test-token';

console.log('📋 Pasos para debuggear:');
console.log('1. Abre http://localhost:3000');
console.log('2. Abre la consola del navegador (F12)');
console.log('3. Haz login con Google');
console.log('4. Verifica que aparezca: "Token de Google almacenado: [token]"');
console.log('5. Ve a la pestaña Calendario');
console.log('6. Verifica que aparezca: "Token de acceso encontrado: Sí"');
console.log('7. Verifica que aparezca: "Eventos cargados: [array]"');
console.log('');

console.log('🔧 Si no funciona:');
console.log('1. Verifica que Google esté habilitado en Firebase Console');
console.log('2. Verifica que los dominios estén autorizados en Google Cloud Console');
console.log('3. Verifica que las APIs estén habilitadas');
console.log('4. Revisa los errores en la consola del navegador');
console.log('');

console.log('📱 URLs importantes:');
console.log('- Frontend: http://localhost:3000');
console.log('- Backend: http://localhost:3001');
console.log('- Firebase Console: https://console.firebase.google.com');
console.log('- Google Cloud Console: https://console.cloud.google.com');
console.log('');

console.log('🎯 Estado esperado:');
console.log('✅ Login con Google funciona');
console.log('✅ Token se almacena en localStorage');
console.log('✅ Calendario muestra eventos reales');
console.log('✅ Email muestra emails reales');
