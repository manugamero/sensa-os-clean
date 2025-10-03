# 🚀 Guía de Desarrollo - Sensa OS

## 🛠️ Comandos para Evitar Conflictos de Cache

### **Opción 1: Scripts Automáticos (Recomendado)**

```bash
# Iniciar desarrollo sin conflictos
./scripts/dev.sh

# Limpieza completa y reinicio
./scripts/clean-start.sh

# Detener todos los servidores
./scripts/stop-all.sh
```

### **Opción 2: Comandos Manuales**

```bash
# 1. Detener todos los procesos
pkill -f "node|vite|npm"

# 2. Limpiar cache
rm -rf node_modules/.vite
npm cache clean --force

# 3. Verificar puertos
lsof -ti:3000,3001 | xargs kill -9

# 4. Iniciar backend
cd server && npm start &

# 5. Iniciar frontend
npm run dev
```

## 🔧 Configuración Anti-Conflictos

### **Vite Configurado:**
- ✅ Puerto fijo: 3000
- ✅ `strictPort: true` - Falla si puerto ocupado
- ✅ Cache optimizado
- ✅ Proxy configurado para API

### **Backend Configurado:**
- ✅ Puerto fijo: 3001
- ✅ Health check endpoint
- ✅ CORS configurado

## 🐛 Solución de Problemas

### **Problema: Puerto ocupado**
```bash
# Ver qué usa el puerto
lsof -i :3000
lsof -i :3001

# Matar proceso específico
kill -9 <PID>
```

### **Problema: Cache corrupto**
```bash
# Limpieza completa
rm -rf node_modules/.vite
rm -rf .vite
npm cache clean --force
```

### **Problema: Variables de entorno**
```bash
# Verificar .env existe
ls -la .env

# Reiniciar servidores después de cambios
./scripts/stop-all.sh
./scripts/clean-start.sh
```

## 📊 Verificación de Estado

```bash
# Verificar que todo funciona
./scripts/verify-app.sh

# Ver logs en tiempo real
tail -f server.log
tail -f frontend.log
```

## 🌐 URLs de Desarrollo

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

## 💡 Tips

1. **Siempre usar scripts** para evitar conflictos
2. **Verificar puertos** antes de iniciar
3. **Limpiar cache** si hay problemas
4. **Revisar logs** si algo no funciona
5. **Usar Ctrl+C** para detener scripts

## 🚨 Problemas Comunes

### **"Port 3000 is in use"**
```bash
./scripts/stop-all.sh
./scripts/clean-start.sh
```

### **"EADDRINUSE: address already in use"**
```bash
lsof -ti:3000,3001 | xargs kill -9
```

### **Página en blanco**
```bash
# Verificar .env
cat .env

# Verificar backend
curl http://localhost:3001/api/health

# Limpiar cache del navegador
# Ctrl+Shift+R (recarga dura)
```

### **"Module not found"**
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

## 🎯 Flujo de Desarrollo Recomendado

1. **Iniciar:** `./scripts/dev.sh`
2. **Desarrollar:** Hacer cambios en código
3. **Verificar:** `./scripts/verify-app.sh`
4. **Detener:** `Ctrl+C` o `./scripts/stop-all.sh`
5. **Reiniciar:** `./scripts/clean-start.sh`

¡Desarrollo sin conflictos! 🎉
