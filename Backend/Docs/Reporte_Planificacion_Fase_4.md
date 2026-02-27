# 📋 Planificación Técnica - Fase 4: Registro de Entrenamiento (Logger)

Este documento sirve como guía y recordatorio para la implementación de la Fase 4.

---

## 🎯 Objetivo de la Fase

Desarrollar la funcionalidad que permita al usuario registrar sus repeticiones reales y traducir ese esfuerzo en **Puntos de Experiencia (XP)** mediante la lógica de **Maestría Acumulada**.

---

## 🧠 Lógica de XP: "Mejora de Récord"

Para evitar el avance artificial, el sistema solo otorgará XP cuando el usuario se supere a sí mismo en un ejercicio específico.

### Regla de Oro:

`XP Ganada = (Nuevas Repeticiones Máximas - Récord Anterior)`

**Ejemplo Práctico:**

1. **Día 1**: Objetivo 18 reps. El usuario hace **9 reps**. Gana **9 XP** (50% de la meta).
2. **Día 2**: El usuario hace **12 reps**. Gana **3 XP** (12 actuales - 9 anteriores).
3. **Día 3**: El usuario hace **10 reps**. Gana **0 XP** (no superó su récord de 12).
4. **Día 4**: El usuario hace **18 reps**. Gana **6 XP** (18 actuales - 12 anteriores). **¡Maestría Alcanzada!**

---

## 🛠️ Estructura de Archivos a Crear/Modificar

### Backend (NestJS)

- `src/sesiones/`: Módulo para manejar el guardado de entrenamientos.
  - `sesiones.service.ts`: Deberá contener la lógica de comparación contra el histórico de `detalle_sesion`.
  - `sesiones.controller.ts`: Endpoint `POST /sesiones/registrar`.
- `src/perfil-fisico/perfil-fisico.service.ts`: Método `sumarXP` y lógica de **subida de nivel** automática una vez alcanzado el requisito del siguiente nivel.

### Frontend (React)

- `src/pages/Logger/`: Interfaz para que el usuario ingrese sus datos al terminar cada serie.

---

## ✅ Requisitos para Iniciar

1. Tener un usuario con una rutina asignada (Fase 3).
2. Los ejercicios deben tener un `id_ejercicio` válido para vincular el progreso.
3. Actualizar el estado de `task.md` al comenzar.

> [!IMPORTANT]
> **Recuerda**: El sistema debe validar que el usuario no gane más XP de la permitida por la meta del ejercicio (ej. si la meta es 36, el acumulado nunca debe pasar de 36).
