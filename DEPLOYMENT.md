# 🚀 Guía de Despliegue

## Problema Resuelto: Puerto Incorrecto en Despliegue

### 🔍 Diagnóstico del Problema

La aplicación se configuraba para ejecutarse en el puerto **3003** mediante `ecosystem.config.js`, pero durante el despliegue automático se iniciaba en otro puerto porque:

- El script `deploy.sh` usaba `pm2 start npm -- start` directamente
- No utilizaba el archivo `ecosystem.config.js` que tiene la configuración del puerto
- Ignoraba las variables de entorno específicas

### ✅ Solución Implementada

1. **Modificado `scripts/deploy.sh`**:
   - Ahora usa `pm2 start ecosystem.config.js` en lugar de `pm2 start npm`
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

## 🔧 Variables de Entorno Requeridas

En el servidor de producción:

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

Si la aplicación no funciona en el puerto correcto:

1. **Verificar configuración**:

   ```bash
   cat ecosystem.config.js | grep PORT
   ```

2. **Revisar logs de PM2**:

   ```bash
   pm2 logs tienda-frontend
   ```

3. **Verificar puerto en uso**:

   ```bash
   netstat -tulpn | grep :3003
   ```

4. **Reiniciar con configuración correcta**:

   ```bash
   pm2 delete all
   pm2 start ecosystem.config.js
   ```

## 📝 Notas Importantes

- ⚠️ **NO** modificar `ecosystem.config.template.js` en el servidor
- ✅ **SÍ** mantener `ecosystem.config.js` con configuración real del servidor  
- 🔄 El template se actualiza con cada push, pero `ecosystem.config.js` se mantiene
- 📊 Usar `pm2 save` para persistir configuración entre reinicios del servidor
