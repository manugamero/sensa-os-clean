# Configuración de Producción - Sensa OS

## 🌐 URLs de la aplicación
- **URL de Vercel:** https://sensa-ev5k837hr-manugameros-projects.vercel.app
- **URL de GitHub:** https://github.com/manugamero/sensa-os-clean

## 🔧 Variables de entorno en Vercel
Configura estas variables en https://vercel.com/dashboard:

```bash
# Firebase Configuration
vercel env add FIREBASE_API_KEY
vercel env add FIREBASE_AUTH_DOMAIN  
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_STORAGE_BUCKET
vercel env add FIREBASE_MESSAGING_SENDER_ID
vercel env add FIREBASE_APP_ID

# Google OAuth Configuration
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
```

## 🔗 URLs autorizadas en Google Cloud Console
- **JavaScript origins:** https://sensa-ev5k837hr-manugameros-projects.vercel.app
- **Redirect URIs:** https://sensa-ev5k837hr-manugameros-projects.vercel.app

## 🚀 Comandos útiles
```bash
# Deploy manual
vercel --prod

# Ver logs
vercel logs

# Configurar variables de entorno
vercel env add VARIABLE_NAME
```

## ✅ Checklist de configuración
- [ ] Variables de entorno configuradas en Vercel
- [ ] URLs autorizadas en Google Cloud Console
- [ ] APIs habilitadas en Google Cloud Console
- [ ] Firebase Authentication configurado
- [ ] Aplicación funcionando en producción
