# 🎯 Fitness Calistenia - Hoja de Ruta y Lógica del Sistema

Este documento combina el calendario de entrega con la filosofía y reglas técnicas que rigen el funcionamiento de la aplicación.

---

## 🧠 1. Estructura General del Sistema

La aplicación se basa en un camino de **10 niveles** de progresión. Ningún nivel puede saltarse ni completarse a medias.

### División de Niveles

Cada nivel se divide en dos fases críticas:

- **Fase 1 (50%)**: Semanas 1 y 2. Enfoque en adaptación y técnica.
- **Fase 2 (50%)**: Semanas 3 y 4. Enfoque en fuerza real.

> [!IMPORTANT]
> **Requisito de Avance**: Para completar un nivel al 100%, se debe completar el 100% de la XP de la Fase 1 Y el 100% de la Fase 2. No existe el avance parcial (90%); el dominio debe ser total.

---

## 🟢 2. Filosofía del Sistema: Consolidación, no Castigo

El sistema no penaliza el fallo, sino que asegura la adaptación:

- **Ritmo Propio**: El usuario puede tardar el tiempo que necesite.
- **Acceso Bloqueado**: Si no se completa la Fase 1 al 100%, la Fase 2 permanece bloqueada.
- **Repetición**: "Cuando empieza a aburrirse, empieza a mejorar". La repetición genera técnica sólida, adaptación neuromuscular y confianza.

---

## 🔵 3. Niveles y Fases (Ejemplo: Nivel 1)

### Nivel 1 - Fase 1 (Semanas 1 y 2)

- **Objetivo**: Aprender movimientos básicos.
- **Método**: Movimientos lentos, técnica estricta, sin fallo muscular.
- **Días**:
  - **A**: Empuje + Core
  - **B**: Piernas
  - **C**: Tirón + Core
- **Semana 2**: Aumenta levemente (+2 reps o +5s isométricos) para consolidar.

### Nivel 1 - Fase 2 (Semanas 3 y 4)

- **Objetivo**: Transformar la base en fuerza real. Se mantiene la estructura A/B/C pero con ejercicios más exigentes y de mayor carga corporal.

---

## 🎮 5. Sistema de Experiencia (Núcleo del Progreso)

La XP no es una recompensa por terminar una sesión, sino un medidor de **progreso acumulado**.

### Lógica de Cálculo

1.  **Objetivo Ideal**: Si un ejercicio marca 3 x 6, el total ideal es **18 repeticiones** (100% XP).
2.  **Registro Real**: El usuario anota lo que realmente hizo.
3.  **Acumulación**: La XP se construye con el tiempo. No se pierde ni se reinicia.

### Ejemplo Práctico:

- **Objetivo**: 3 x 12 = 36 repeticiones (100%).
- **Semana 1**: Hace 3 x 5 = 15 reps (Equivale al 50% de la meta acumulada).
- **Semana 2**: Hace 3 x 8 = 24 reps (+20% de mejora).
- **Estado Total**: **70% Acumulado**.
- **Resultado**: El usuario debe seguir entrenando hasta que la suma total de sus esfuerzos alcance el 100% del dominio técnico requerido para ese ejercicio y para la fase completa.

---

## 🚀 HOJA DE RUTA (Cronograma Final 20 Feb)

### FASE 1: Sesión y Estructura (Finalizada)

- Integración Redis, Sesión y Perfil Físico básico.

### FASE 2: Biblioteca y Lógica de Maestría (11 - 12 Feb)

- [ ] **XP y Niveles**: Implementar la tabla de 10 niveles y la lógica de dominio (Día 11).
- [ ] **Catálogo**: Carga de ejercicios vinculados a fases y niveles (Día 12).

### FASE 3: Planificación (13 - 14 Feb)

- [ ] **CRUD Rutinas**: Sistema para generar los planes A/B/C.
- [ ] **Parámetros Técnicos**: Tempo y Descanso.

### FASE 4: Ejecución (15 - 17 Feb)

- [ ] **Logger**: Pantalla de "Entrenar Hoy" con registro de repeticiones reales.
- [ ] **Validación**: Sincronización de logros y bloqueo de fases.

### FASE 5: Entrega (18 - 20 Feb)

- [ ] **Pulido y Defensa**: Testeo final y README.
- [ ] **EXAMEN FINAL 🎓**: 20 de Febrero.
