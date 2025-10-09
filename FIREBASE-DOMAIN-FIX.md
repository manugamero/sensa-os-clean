# 🔧 Fix: Firebase Unauthorized Domain Error

## ❌ Error Actual:
```
Firebase: Error (auth/unauthorized-domain)
```

## 🔍 Causa:
El dominio `sos001.vercel.app` no está autorizado en Firebase Authentication.

## ✅ Solución:

### 1. 🌐 Ve a Firebase Console
**URL:** https://console.firebase.google.com/project/sensa-os-ac840/authentication/settings

### 2. 📝 Agrega Dominios Autorizados
En la sección **"Authorized domains"** agrega:
- `sos001.vercel.app`
- `sensa-1iuiwnwgt-manugameros-projects.vercel.app`
- `vercel.app` (opcional, para todos los subdominios de Vercel)

### 3. 💾 Guarda los Cambios
Haz clic en **"Save"**

### 4. 🧪 Prueba la Aplicación
**URL:** https://sos001.vercel.app

## 📋 Dominios que Deben Estar Autorizados:
- ✅ `localhost` (para desarrollo)
- ✅ `sos001.vercel.app` (producción)
- ✅ `sensa-1iuiwnwgt-manugameros-projects.vercel.app` (deploy actual)
- ✅ `vercel.app` (todos los subdominios de Vercel)

## 🎯 Resultado Esperado:
Después de configurar los dominios:
- ✅ Login con Google funcionará
- ✅ Redirección al dashboard
- ✅ Sin errores de dominio no autorizado

## 🔄 Si el Problema Persiste:
1. Verifica que el dominio esté exactamente como aparece en la URL
2. Espera 1-2 minutos para que los cambios se propaguen
3. Limpia el cache del navegador (Ctrl+Shift+R)
4. Prueba en modo incógnito

---
**🎉 Una vez configurado, la aplicación funcionará perfectamente!**
