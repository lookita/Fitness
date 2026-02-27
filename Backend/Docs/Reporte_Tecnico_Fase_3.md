# 📝 Reporte Técnico Detallado - Fase 3: Planificación de Rutinas (A/B/C)

Este documento detalla las intervenciones técnicas, problemas de integridad resueltos y la lógica de programación aplicada durante la Fase 3.

---

## 🏗️ 1. Infraestructura y Parámetros Técnicos

### Extensión del Esquema

- **Archivo**: `prisma/schema.prisma` y DB física.
- **Nuevos Campos**: Se añadieron `tempo` (TEXT) y `comentarios` (TEXT) a la tabla `rutina_ejercicios`.
- **Propósito**: Permitir que cada ejercicio dentro de una rutina tenga su propio ritmo de ejecución (ej: "2-0-2-0") y tiempo de descanso o notas específicas (ej: "1 min descanso").

---

## 🛠️ 2. Lógica de Aplicación (NestJS)

### Nuevo Módulo: `rutinas`

Se creó la estructura completa en `src/rutinas/`:

- **`rutinas.service.ts`**:
  - `asignarRutinasPorNivelYFase`: Desactiva rutinas previas y vincula automáticamente las 3 nuevas rutinas (A, B, C) correspondientes a la etapa del usuario.
  - `obtenerRutinasUsuario`: Recupera el plan de entrenamiento activo con todo el detalle de ejercicios y grupos musculares.
- **`rutinas.controller.ts`**:
  - `POST /rutinas/asignar`: Para activar el plan de un nivel/fase.
  - `GET /rutinas/mis-rutinas`: Para que el usuario consulte su entrenamiento actual.

---

## ⚠️ 3. Errores Críticos y Soluciones

### Error 1: Fallo de Sincronización de Esquema (Prisma)

- **Problema**: `prisma db push` no estaba impactando las nuevas columnas en la tabla física de PostgreSQL, lo que hacía que el script de siembra fallara al intentar insertar datos en columnas "inexistentes".
- **Solución**: Se ejecutó un comando SQL directo (`ALTER TABLE rutina_ejercicios ADD COLUMN...`) para forzar la creación de los campos `tempo` y `comentarios`.

### Error 2: Violación de Integridad Referencial en Seed

- **Problema**: Al intentar re-sembrar, las claves foráneas bloqueaban la actualización de datos existentes.
- **Solución**: Se implementó un `TRUNCATE ... CASCADE` en el script `seed_pg.ts`. Esto limpia todas las tablas dependientes en el orden correcto y reinicia los contadores, garantizando una base de datos limpia para cada prueba.

---

## 🌐 4. Endpoints API Fase 3

| Método | Endpoint               | Parámetros                 | Resultado                                              |
| :----- | :--------------------- | :------------------------- | :----------------------------------------------------- |
| `POST` | `/rutinas/asignar`     | `{idUsuario, nivel, fase}` | Activa las 3 rutinas A/B/C del nivel.                  |
| `GET`  | `/rutinas/mis-rutinas` | `?usuario=ID`              | Devuelve el plan completo con ejercicios y parámetros. |
| `GET`  | `/rutinas/:id`         | `ID en URL`                | Detalle técnico de una rutina específica.              |

---

## 📊 5. Datos Sembrados (Nivel 1)

- **Fase 1**: 3 Rutinas (A, B, C) con 10 ejercicios vinculados.
- **Fase 2**: 3 Rutinas (A, B, C) con 9 ejercicios vinculados.
- **Total**: 19 asociaciones ejercicio-rutina con sus respectivos sets, reps y tempos.
