# Documentación Técnica: App Fitness Calistenia

Este documento detalla las especificaciones técnicas y la estructura de la aplicación desarrollada para el examen final de Programación II.

---

## 1. Objetivo de la Aplicación

El objetivo principal de la aplicación es proporcionar una plataforma de gestión de entrenamientos de **Calistenia**, centrada en la progresión por niveles y la "maestría" de los ejercicios. A diferencia de otras apps de fitness, esta premia la calidad técnica: el usuario solo progresa (gana XP) si es capaz de completar el 100% de las repeticiones propuestas, fomentando una base sólida antes de avanzar a movimientos más complejos.

---

## 2. Funcionalidades Principales

### 🔐 Gestión de Usuarios y Sesiones

- Registro e inicio de sesión de usuarios.
- Manejo de sesiones persistentes utilizando **Redis**, garantizando seguridad y rapidez sin depender de tokens locales (JWT).

### 📈 Sistema de Progresión (Gamificación)

- **10 Niveles de Dificultad**: Sistema de niveles que se desbloquean mediante la acumulación de puntos de experiencia (XP).
- **Regla de Maestría**: Lógica que valida el cumplimiento total de las repeticiones para otorgar recompensas.
- **Perfil Físico Dinámico**: Registro de edad, peso y nivel actual del usuario.

### 🤸 Biblioteca de Ejercicios

- Catálogo organizado por **grupos musculares** (Pecho, Espalda, Piernas, etc.).
- Desbloqueo progresivo: los ejercicios más avanzados solo son visibles al alcanzar niveles superiores.

### 📋 Planificación de Entrenamiento

- Asignación de rutinas específicas (ej. "Fuerza Base").
- Detalle técnico por ejercicio: Series, Repeticiones, **Tempo** y tiempo de **Descanso**.

---

## 3. Tecnologías y Lenguajes Utilizados

### 🖥️ Backend (Servidor)

- **Lenguaje**: TypeScript (NestJS).
- **Infraestructura**: PostgreSQL (Data) y Redis (Sessions).
- **Modo Emulación SQL**: Inyector de Prisma con **Proxy Pattern** para ejecución de SQL puro (driver `pg`) como fallback ante problemas de rutas en Windows.

### 🎨 Frontend (Interfaz de Usuario)

- **Lenguaje**: TypeScript / React (Vite).
- **Navegación**: React Router DOM.
- **Estética**: Diseño **Stealth Fitness** (Premium UI con Vanilla CSS).

---

## 4. Estructura General del Proyecto

```text
Fitness/
├── Backend/                 # Lógica de servidor y Base de Datos
│   ├── Docs/               # Reportes técnicos de cada Fase
│   ├── src/                # Código fuente (NestJS)
│   │   ├── usuarios/       # Dashboard y Perfil
│   │   ├── perfil-fisico/  # Gestión de Nivel y XP
│   │   ├── sesiones/       # [NUEVO] Registro de entrenamientos
│   │   └── prisma/         # PrismaService (Modo Emulador)
│
├── Frontend/                # Interfaz de usuario (React)
│   ├── src/
│   │   ├── pages/          # Login, Register, Dashboard, Entrenamiento
│   │   ├── services/       # Conexión con API (Axios)
│   └── package.json
└── walkthrough_fase4.md      # Resumen detallado de la Fase 4
```

---

## 5. Especificaciones de la Fase 4 (Sistema de Maestría)

- **Cálculo de XP por Esfuerzo**: El sistema premia la mejora del récord personal en cada serie, no el volumen total.
- **Dashboard Fullstack**: Endpoint integrado que consolida perfil, rutinas y progreso en una sola petición.
- **Bloqueo de Progresión**: Mecanismo que impide avanzar de fase hasta que todos los ejercicios actuales estén maestreados al 100%.

---

## 6. Próximos pasos (Fase 5)

- Renovación estética total del Frontend (Premium UI).
- Animaciones de progresión de nivel y XP.
