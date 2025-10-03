# Sensa OS - Cliente Web Integrado

Un cliente web integrado que combina Google Calendar, Gmail, sistema de notas y chat en una sola interfaz con layout tipo Trello.

## Características

### 📅 Calendario
- Integración con Google Calendar
- Creación de eventos con invitaciones automáticas
- Enlaces de videollamada automáticos
- Vista de eventos próximos
- **Nuevo**: Eventos preseleccionados con fecha/hora actual
- **Nuevo**: Título por defecto "Event" si no se especifica

### 📧 Email
- Integración con Gmail
- Vista de emails recientes
- Marcado como leído
- Soporte para archivos adjuntos

### 📝 Notas (Sistema de Notas)
- Editor WYSIWYG con Markdown
- Menciones de usuarios por email (inline)
- Notas privadas y compartidas
- Formato de texto enriquecido (negrita, cursiva, código)
- **Nuevo**: Sin títulos - hoja en blanco
- **Nuevo**: Menciones inline con @email

### 💬 Chat
- Conversaciones en tiempo real
- Subida de archivos (imágenes, audio, documentos)
- Grabación de audio
- Emojis
- Detección automática de enlaces
- Invitaciones por email

### 🎨 Layout
- **Nuevo**: Layout tipo Trello con 4 columnas
- **Nuevo**: Calendario / Email / Chat / Notas
- **Nuevo**: Sin sidebar - todas las funcionalidades visibles
- **Nuevo**: Una sola columna por panel (sin sub-columnas)
- **Nuevo**: Botones unificados con iconos grises
- **Nuevo**: Dark/Light mode automático según sistema

## Tecnologías

### Frontend
- React 18 con TypeScript
- Vite para desarrollo
- Tailwind CSS para estilos
- Socket.IO para tiempo real
- Firebase Auth para autenticación

### Backend
- Node.js con Express
- Socket.IO para WebSocket
- Google APIs (Calendar, Gmail)
- Firebase Admin SDK
- Multer para subida de archivos

## Instalación

### 1. Configurar Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication con Google
3. Obtener las credenciales de configuración

### 2. Configurar Google APIs

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Habilitar Calendar API y Gmail API
3. Crear credenciales OAuth 2.0
4. Configurar dominios autorizados

### 3. Instalar dependencias

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### 4. Configurar variables de entorno

Copiar `env.example` a `.env` y configurar:

```bash
cp env.example .env
```

### 5. Crear archivo de credenciales Firebase

Crear `server/firebase-service-account.json` con las credenciales del servicio de Firebase.

### 6. Ejecutar la aplicación

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Estructura del proyecto

```
sensa-os/
├── src/
│   ├── components/
│   │   ├── panels/
│   │   │   ├── CalendarPanel.tsx
│   │   │   ├── MailPanel.tsx
│   │   │   ├── TodoPanel.tsx (Sistema de Notas)
│   │   │   └── ChatPanel.tsx
│   │   ├── Dashboard.tsx (Layout tipo Trello)
│   │   └── LoginPage.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── SocketContext.tsx
│   ├── services/
│   │   ├── googleCalendarService.ts
│   │   ├── gmailService.ts
│   │   ├── todoService.ts
│   │   └── chatService.ts
│   └── lib/
│       └── firebase.ts
├── server/
│   ├── index.js
│   └── package.json
├── scripts/
│   ├── setup-production.sh
│   ├── enable-working-apis.sh
│   └── update-client-id.sh
└── public/
```

## Cambios Implementados

### 🎨 Layout Tipo Trello
- **4 columnas**: Calendario / Email / Chat / Notas
- **Sin sidebar**: Todas las funcionalidades visibles
- **Responsive**: Adaptable a diferentes pantallas

### 📅 Calendario Mejorado
- **Eventos preseleccionados**: Fecha/hora actual por defecto
- **Título por defecto**: "Event" si no se especifica
- **Modal mejorado**: Sin bloqueos, cierre con clic fuera
- **Botón de cerrar**: × en esquina superior derecha

### 📝 Sistema de Notas
- **Sin títulos**: Hoja en blanco
- **Menciones inline**: @email para mencionar usuarios
- **Editor WYSIWYG**: Markdown con formato enriquecido
- **UI simplificada**: Solo iconos, sin textos explicativos

### 🔧 Configuración
- **Client ID actualizado**: Con credenciales reales de Google
- **APIs habilitadas**: Calendar y Gmail funcionando
- **Sin datos demo**: Solo datos reales de Google
- **Autenticación mejorada**: Scopes adicionales para mejor funcionamiento
- **Dark/Light mode**: Automático según preferencias del sistema
- **UI minimalista**: Solo iconos grises, sin colores azules
- **Layout simplificado**: Una columna por panel, sin cajas anidadas

## Funcionalidades principales

### Autenticación
- Login con Google OAuth
- Gestión de sesiones
- Permisos para Calendar y Gmail

### Calendario
- Sincronización con Google Calendar
- Creación de eventos con invitaciones
- Enlaces de videollamada automáticos
- Vista de eventos próximos

### Email
- Integración con Gmail
- Vista de emails recientes
- Marcado como leído
- Soporte para archivos adjuntos

### Notas
- Editor WYSIWYG con Markdown
- Menciones de usuarios (inline)
- Notas privadas y compartidas
- Formato de texto enriquecido
- **Nuevo**: Sin títulos - hoja en blanco
- **Nuevo**: Menciones inline con @email

### Chat
- Conversaciones en tiempo real
- Subida de archivos
- Grabación de audio
- Emojis
- Detección de enlaces
- Invitaciones por email

## Desarrollo

### Scripts disponibles

```bash
# Frontend
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de producción

# Backend
npm run dev          # Servidor con nodemon
npm start           # Servidor de producción
```

### Características técnicas

- **Responsive**: Diseño adaptable a diferentes pantallas
- **Tiempo real**: Actualizaciones instantáneas con Socket.IO
- **Seguro**: Autenticación con Firebase y tokens JWT
- **Escalable**: Arquitectura modular y servicios separados
- **Layout Trello**: 4 columnas sin sidebar
- **Datos reales**: Integración completa con Google APIs
- **UI minimalista**: Solo iconos, sin textos explicativos
- **Modal mejorado**: Sin bloqueos, cierre intuitivo
- **Dark/Light mode**: Automático según sistema
- **Layout simplificado**: Una columna por panel
- **Botones unificados**: Solo iconos grises

## Contribución

1. Fork el proyecto
2. Crear una rama para la feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
