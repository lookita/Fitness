# 📝 Reporte Técnico Detallado - Fase 1: Sesión y Estructura

Este documento resume las bases técnicas establecidas durante la Fase 1 del proyecto Fitness.

---

## 🏗️ 1. Infraestructura de Sesiones (Redis)

### Integración de Almacenamiento en Memoria

- **Tecnología**: [Redis](https://redis.io/)
- **Propósito**: Manejo de sesiones persistentes. A diferencia de JWT, las sesiones en Redis permiten invalidar accesos de forma instantánea y no exponen datos sensibles en el cliente.
- **Configuración**: Se integró en `main.ts` utilizando `connect-redis` y el cliente `ioredis`.

### Seguridad de Cookies

- `httpOnly: true`: Evita que scripts maliciosos (XSS) accedan a la cookie de sesión.
- `maxAge`: Configurado para 24 horas de persistencia.

---

## 🛠️ 2. Gestión de Usuarios

### Módulo de Usuarios y Perfil (`src/usuarios/` y `src/perfil-fisico/`)

- **Desarrollo sobre Estructura Previa**: Estas carpetas ya existían como "scaffolding" inicial, pero en esta fase se implementó su lógica funcional real.
- **Registro**: Implementación de `crearUsuario` en `usuarios.service.ts` con manejo de duplicados (Error P2002 de Prisma).
- **Perfil Físico Automático**: Se configuró para que cada vez que un usuario se registre, el sistema cree automáticamente su entrada en `perfil_fisico`, garantizando la integridad de los datos de progresión desde el día 1.
- **Autenticación**: Lógica de login inicial comparando contraseñas y vinculando el ID de usuario a la sesión de Redis.

---

## 📊 3. Modelo de Datos Inicial

Se definieron las tablas base en `schema.prisma`:

- `usuarios`: Datos de acceso y estado.
- `perfil_fisico`: Edad, peso, nivel y XP (puntos de partida).
- `configuracion_entrenamiento`: Preferencias de días y objetivos.

---

## 🌐 4. Configuración del Entorno

- **CORS**: Habilitado específicamente para `http://localhost:5173` con `credentials: true` para permitir el flujo de cookies entre puertos.
- **Variables de Entorno**: Configuración inicial del `.env` para PostgreSQL y el Secreto de la sesión.
