# 📝 Reporte Técnico Detallado - Fase 2: Maestría y Catálogo

Este documento detalla todas las intervenciones técnicas, problemas encontrados y soluciones aplicadas durante la Fase 2 del proyecto Fitness.

---

## 🏗️ 1. Infraestructura y Persistencia (Base de Datos)

### Cambios en el Esquema (Prisma)

- **Archivo**: `prisma/schema.prisma`
- **Modificación**: Se añadió el campo `fase` (Int) al modelo `ejercicios`. Esto permite separar los ejercicios de un mismo nivel en **Fase 1 (Adaptación)** y **Fase 2 (Fuerza)**.
- **Corrección Crítica**: Se detectó que el bloque `datasource db` no tenía la URL vinculada satisfactoriamente. Se corrigió a `url = env("DATABASE_URL")`.

### Sincronización

- Se utilizó `npx prisma db push --accept-data-loss` para forzar la actualización del esquema, esquivando bloqueos de migraciones por cambios destructivos iniciales.

---

## 🛠️ 2. Código del Servidor (NestJS)

### Nuevas Carpetas y Archivos

Se creó el módulo completo de ejercicios:

- `src/ejercicios/`
  - `ejercicios.module.ts`: Configura los proveedores y controladores.
  - `ejercicios.service.ts`: Contiene la lógica de negocio y cálculos de maestría.
  - `ejercicios.controller.ts`: Expone los puntos de entrada HTTP.

### Lógica de Maestría Implementada

La maestría se calcula dinámicamente:

- **Fórmula**: `(Repeticiones Realizadas / 36) * 100` (Meta base: 36 reps acumuladas por ejercicio).
- **Desbloqueo de Fase**: El servicio valida que la Fase 1 esté al 100% de maestría antes de habilitar la Fase 2 del mismo nivel.

---

## 🌐 3. Endpoints API Implementados

| Método | Endpoint                                              | Descripción                            |
| :----- | :---------------------------------------------------- | :------------------------------------- |
| `GET`  | `/ejercicios?nivel=1&fase=1`                          | Catálogo filtrado por nivel y fase.    |
| `GET`  | `/ejercicios/:id/progreso?usuario=1`                  | % de maestría de un ejercicio.         |
| `GET`  | `/ejercicios/verificar-fase?usuario=1&nivel=1&fase=2` | Verifica si la fase está desbloqueada. |

---

## ⚠️ 4. Errores Encontrados y Soluciones (Debugging)

### Error 1: Fallo de Conexión de Prisma en Seed

- **Problema**: `localhost` presentaba problemas de resolución en el entorno `ts-node`.
- **Solución**: Cambio a `127.0.0.1` en el archivo `.env`.

### Error 2: Conflictos de Tipos pos-Esquema

- **Problema**: El seed fallaba por falta del campo `fase` en los tipos generados.
- **Solución**: Re-generación del cliente con `prisma generate` y uso de `--transpile-only` en el seed.

### Error 3: Ejecución de Comandos en Windows

- **Problema**: El operador `&&` no es nativo de PowerShell para encadenar.
- **Solución**: Uso de `;` o ejecuciones secuenciales separadas.

---

## 📦 5. Scripts de Soporte Creados

- `seed_pg.ts`: Siembra robusta vía `pg` nativo.
- `debug_db.ts`: Script de diagnóstico de conectividad.
