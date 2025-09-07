# 🚀 Guía de Despliegue

## Problema Resuelto: Puerto Incorrecto en Despliegue

### 🔍 Diagnóstico del Problema

La aplicación se configuraba para ejecutarse en el puerto **3003** mediante `ecosystem.config.js`, pero durante el despliegue automático se iniciaba en otro puerto porque:

- El script `deploy.sh` usaba `pm2 start npm -- start` directamente
- No utilizaba el archivo `ecosystem.config.js` que tiene la configuración del puerto
- Ignoraba las variables de entorno específicas

### ✅ Solución Implementada

1. **Modificado `scripts/deploy.sh`**:
   - Ahora usa `pm2 start ecosystem.config.js --only tienda-frontend` en lugar de `pm2 start npm`
   - **CRÍTICO**: Ya no ejecuta `pm2 stop all` que mataba el webhook-server durante el despliegue
   - Solo detiene `tienda-frontend` específicamente para preservar el webhook
   - Verifica si existe `ecosystem.config.js` y si no, lo crea desde el template
   - Incluye verificación del puerto después del despliegue

2. **Mejorado `ecosystem.config.template.js`**:
   - Cambiado de sintaxis ES6 a CommonJS (`module.exports`)
   - Agregadas configuraciones adicionales de PM2
   - Puerto configurado correctamente en 3003

3. **Agregado script de verificación `scripts/check-pm2.sh`**:
   - Verifica el estado de PM2
   - Muestra configuración actual
   - Chequea puertos en uso

## 📋 Instrucciones de Uso

### En el servidor de producción

1. **Configurar ecosystem.config.js** (primera vez):

   ```bash
   cd /var/www/tienda-frontend
   cp ecosystem.config.template.js ecosystem.config.js
   # Editar ecosystem.config.js con valores reales
   ```

2. **Despliegue manual**:

   ```bash
   ./scripts/deploy.sh
   ```

3. **Verificar estado**:

   ```bash
   ./scripts/check-pm2.sh
   ```

4. **Comandos útiles**:

   ```bash
   pm2 status                          # Ver estado
   pm2 logs tienda-frontend           # Ver logs
   pm2 restart ecosystem.config.js    # Reiniciar
   pm2 stop all                       # Parar todo
   ```

### Despliegue automático via webhook

El webhook server (`webhook-server.js`) se ejecuta en el puerto **3002** y:

- Escucha cambios en la rama `main`
- Ejecuta automáticamente `deploy.sh`
- Ahora respetará la configuración de puerto en `ecosystem.config.js`

## 🔧 Requerimientos del Sistema

### Servidor de producción:
- **Node.js**: v22.x+ 
- **npm**: v10.x+
- **PM2**: Para gestión de procesos

### Variables de Entorno:

```bash
# En ecosystem.config.js:
PORT=3003
NODE_ENV=production
WEBHOOK_PORT=3002
GITHUB_WEBHOOK_SECRET=tu_secret_aqui
DEPLOY_PATH=/var/www/tienda-frontend
```

## ✅ Verificación Post-Despliegue

Después de cada despliegue, el script verificará:

1. ✅ Proceso PM2 ejecutándose
2. ✅ Aplicación respondiendo en puerto 3003
3. ✅ Estado de todos los servicios

## 🚨 Solución de Problemas

### 🛑 CRÍTICO: Despliegue se detiene tras "pm2 stop all"

**Síntomas**: 
```
PM2 | Stopping app:webhook-server id:1
PM2 | App [webhook-server:1] exited with code [0] via signal [SIGINT]
# Y se queda colgado aquí
```

**Problema**: `pm2 stop all` mata el webhook-server que ejecuta el despliegue

**Solución**: ✅ Ya corregido en el script - ahora solo detiene `tienda-frontend`

### Si ves en los logs: "Local: http://localhost:3000" (puerto incorrecto)

**Problema**: La aplicación no está usando `ecosystem.config.js`

**Solución**:
```bash
cd /var/www/tienda-frontend

# 1. Verificar si existe la configuración
./scripts/check-port.sh

# 2. Si no existe ecosystem.config.js, crearlo:
cp ecosystem.config.template.js ecosystem.config.js

# 3. Reiniciar con la configuración correcta:
pm2 delete all
pm2 start ecosystem.config.js

# 4. Verificar:
pm2 logs tienda-frontend
```

### Diagnóstico rápido:

1. **Verificar configuración actual**:
   ```bash
   ./scripts/check-port.sh
   ```

2. **Ver logs específicos**:
   ```bash
   pm2 logs tienda-frontend | grep -E "(Local|Network|PORT)"
   ```

3. **Verificar puertos activos**:
   ```bash
   netstat -tulpn | grep :300
   ```

4. **Reinicio completo**:
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.js --env production
   pm2 save
   ```

## 📝 Notas Importantes

- ⚠️ **NO** modificar `ecosystem.config.template.js` en el servidor
- ✅ **SÍ** mantener `ecosystem.config.js` con configuración real del servidor  
- 🔄 El template se actualiza con cada push, pero `ecosystem.config.js` se mantiene
- 📊 Usar `pm2 save` para persistir configuración entre reinicios del servidor
