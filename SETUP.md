# 🔧 Configuración Completa - Sensa OS

## 🚀 Configuración Rápida

### 1. **Ejecutar script de configuración**
```bash
./scripts/configure-google.sh
```

### 2. **Verificar configuración**
```bash
./scripts/verify-setup.sh
```

### 3. **Iniciar aplicación**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server && npm run dev
```

## 📋 Configuración Manual Paso a Paso

### **Paso 1: Firebase Console**

1. **Crear proyecto**:
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Crea nuevo proyecto: `sensa-os`
   - Habilita Google Analytics (opcional)

2. **Configurar Authentication**:
   - Ve a "Authentication" → "Sign-in method"
   - Habilita "Google" como proveedor
   - Configura email de soporte

3. **Obtener credenciales**:
   - Ve a "Project settings" (⚙️)
   - En "Your apps", haz clic en "Web app" (</>)
   - Registra app: "Sensa OS Web"
   - **Copia la configuración** que aparece

4. **Obtener credenciales de servicio**:
   - Ve a "Project settings" → "Service accounts"
   - Haz clic en "Generate new private key"
   - **Descarga el archivo JSON**
   - Renómbralo a `firebase-service-account.json`
   - Muévelo a la carpeta `server/`

### **Paso 2: Google Cloud Console**

1. **Seleccionar proyecto**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Selecciona el mismo proyecto de Firebase

2. **Habilitar APIs**:
   - Ve a "APIs & Services" → "Library"
   - Busca y habilita:
     - **Google Calendar API**
     - **Gmail API**
     - **Google Identity API** (para autenticación)

3. **Crear credenciales OAuth 2.0**:
   - Ve a "APIs & Services" → "Credentials"
   - Haz clic en "Create Credentials" → "OAuth 2.0 Client IDs"
   - Tipo: "Web application"
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.railway.app` (producción)
   - **Authorized redirect URIs**:
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.railway.app` (producción)

### **Paso 3: Configurar Variables de Entorno**

Actualiza el archivo `.env` con tus credenciales reales:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...tu_api_key_real
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### **Paso 4: Verificar Configuración**

```bash
# Verificar que todo esté configurado
./scripts/verify-setup.sh

# Si hay errores, revisa la configuración
```

## 🌐 Despliegue en Producción

### **Opción 1: Railway (Recomendado)**

1. **Preparar repositorio**:
   ```bash
   git add .
   git commit -m "Configuración para producción"
   git push origin main
   ```

2. **Desplegar en Railway**:
   - Ve a [Railway](https://railway.app)
   - Conecta tu repositorio de GitHub
   - Configura variables de entorno
   - Despliega

3. **Configurar dominios autorizados**:
   - En Google Cloud Console
   - Agrega tu dominio de Railway a dominios autorizados

### **Opción 2: Vercel + Railway**

1. **Frontend en Vercel**:
   - Conecta repositorio en [Vercel](https://vercel.com)
   - Configura variables de entorno
   - Despliega

2. **Backend en Railway**:
   - Despliega backend en Railway
   - Configura variables de entorno
   - Agrega archivo `firebase-service-account.json`

## 🔍 Verificación Post-Configuración

### **Desarrollo Local**
```bash
# Verificar frontend
curl http://localhost:3000

# Verificar backend
curl http://localhost:3001/api/health

# Verificar APIs
curl http://localhost:3001/api/calendar/events
```

### **Producción**
```bash
# Verificar salud del servidor
curl https://tu-dominio.railway.app/api/health

# Verificar frontend
curl https://tu-dominio.vercel.app
```

## 🆘 Solución de Problemas

### **Error de Firebase**
- Verificar credenciales en `.env`
- Verificar archivo `firebase-service-account.json`
- Verificar configuración en Firebase Console

### **Error de Google APIs**
- Verificar APIs habilitadas en Google Cloud
- Verificar dominios autorizados
- Verificar credenciales OAuth

### **Error de CORS**
- Verificar configuración de CORS en el backend
- Verificar dominios autorizados en Google Cloud

### **Error de Socket.IO**
- Verificar URLs en variables de entorno
- Verificar configuración de CORS
- Verificar conexión entre frontend y backend

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica la configuración con `./scripts/verify-setup.sh`
3. Consulta la documentación en `DEPLOYMENT.md`
4. Verifica que todas las APIs estén habilitadas
