#!/bin/bash

echo "🔧 Solucionando problema de autenticación..."
echo ""

echo "1. 🧹 Limpiando cache y tokens..."
# Limpiar cache de Vite
rm -rf node_modules/.vite
echo "✅ Cache de Vite limpiado"

# Limpiar cache del navegador (instrucciones)
echo ""
echo "2. 🌐 Limpia el cache del navegador:"
echo "   - Abre http://localhost:3000"
echo "   - Presiona Ctrl+Shift+R (recarga dura)"
echo "   - O abre las herramientas de desarrollador (F12)"
echo "   - Ve a Application/Storage > Local Storage"
echo "   - Haz clic en 'Clear All'"
echo ""

echo "3. 🔐 Reinicia la sesión:"
echo "   - Cierra sesión si estás logueado"
echo "   - Inicia sesión nuevamente con Google"
echo "   - Verifica que aparezca tu nombre en la esquina superior"
echo ""

echo "4. 🛠️ Si el problema persiste, ejecuta en la consola del navegador:"
echo "   localStorage.clear()"
echo "   location.reload()"
echo ""

echo "5. 🚀 Recarga la página y prueba cargar los eventos/emails"
echo ""

echo "💡 El problema suele ser:"
echo "   - Tokens expirados en localStorage"
echo "   - Cache del navegador"
echo "   - Sesión de Firebase no sincronizada"
echo ""
echo "✅ Después de seguir estos pasos, los eventos y emails deberían cargar correctamente"
