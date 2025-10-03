# 🚀 Guía de Despliegue - Sensa OS

## Opciones de Despliegue

### 1. **Vercel (Recomendado para Frontend)**
- **Frontend**: Despliegue automático desde GitHub
- **Backend**: Vercel Functions o servidor separado

### 2. **Railway (Recomendado para Full-Stack)**
- Despliegue completo de frontend + backend
- Base de datos incluida
- Dominio personalizado

### 3. **Heroku**
- Despliegue tradicional
- Variables de entorno fáciles
- Escalado automático

### 4. **DigitalOcean/AWS**
- Control total del servidor
- Mayor flexibilidad
- Más configuración requerida

## 🚀 Despliegue en Railway (Recomendado)

### Paso 1: Preparar el proyecto

```bash
# Crear archivo de configuración para Railway
cat > railway.json << 'EOF'
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "healthcheckPath": "/api/health"
  }
}
EOF

# Crear script de inicio
cat > start.sh << 'EOF'
#!/bin/bash
# Instalar dependencias del frontend
npm install
npm run build

# Instalar dependencias del backend
cd server
npm install

# Iniciar servidor
npm start
EOF

chmod +x start.sh
```

### Paso 2: Configurar Railway

1. **Ve a [Railway](https://railway.app)**
2. **Conecta tu repositorio de GitHub**
3. **Configura variables de entorno**:
   ```
   NODE_ENV=production
   PORT=3001
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   GOOGLE_CLIENT_ID=tu_client_id
   GOOGLE_CLIENT_SECRET=tu_client_secret
   GOOGLE_REDIRECT_URI=https://tu-dominio.railway.app
   ```

### Paso 3: Configurar dominios autorizados

En Google Cloud Console:
- **Authorized JavaScript origins**: `https://tu-dominio.railway.app`
- **Authorized redirect URIs**: `https://tu-dominio.railway.app`

## 🌐 Despliegue en Vercel

### Frontend en Vercel

1. **Conecta tu repositorio** en [Vercel](https://vercel.com)
2. **Configura variables de entorno**:
   ```
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=tu_bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   VITE_API_URL=https://tu-backend.railway.app/api
   VITE_SOCKET_URL=https://tu-backend.railway.app
   ```

### Backend en Railway

1. **Despliega el backend** en Railway
2. **Configura las mismas variables** que el frontend
3. **Agrega el archivo** `firebase-service-account.json`

## 🔧 Configuración de Producción

### Variables de Entorno Requeridas

```bash
# Firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123
GOOGLE_REDIRECT_URI=https://tu-dominio.com

# Producción
NODE_ENV=production
PORT=3001
```

### Dominios Autorizados en Google Cloud

```
Authorized JavaScript origins:
- http://localhost:3000 (desarrollo)
- https://tu-dominio.vercel.app (producción)
- https://tu-dominio.railway.app (producción)

Authorized redirect URIs:
- http://localhost:3000 (desarrollo)
- https://tu-dominio.vercel.app (producción)
- https://tu-dominio.railway.app (producción)
```

## 📱 Configuración de la App

### 1. **Actualizar URLs en el código**

```typescript
// src/lib/firebase.ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}
```

### 2. **Configurar CORS en el backend**

```javascript
// server/index.js
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://tu-dominio.vercel.app",
      "https://tu-dominio.railway.app"
    ],
    methods: ["GET", "POST"]
  }
})
```

## 🚀 Comandos de Despliegue

### Desarrollo Local
```bash
# Frontend
npm run dev

# Backend
cd server && npm run dev
```

### Producción
```bash
# Construir frontend
npm run build

# Iniciar backend
cd server && npm start
```

## 🔍 Verificación Post-Despliegue

1. **Verificar autenticación**: Login con Google funciona
2. **Verificar APIs**: Calendar y Gmail cargan datos reales
3. **Verificar chat**: Socket.IO funciona en tiempo real
4. **Verificar todos**: CRUD operations funcionan
5. **Verificar archivos**: Subida de archivos funciona

## 🆘 Solución de Problemas

### Error de CORS
- Verificar dominios autorizados en Google Cloud
- Verificar configuración de CORS en el backend

### Error de Firebase
- Verificar credenciales en variables de entorno
- Verificar archivo `firebase-service-account.json`

### Error de Socket.IO
- Verificar URLs en variables de entorno
- Verificar configuración de CORS

### Error de APIs de Google
- Verificar APIs habilitadas en Google Cloud
- Verificar permisos de OAuth
- Verificar dominios autorizados
