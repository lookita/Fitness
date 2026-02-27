# 🏋️ Fitness Calistenia — Sistema de Progresión Premium

Aplicación web para entrenar calistenia con un sistema de 10 niveles, progreso de XP, maestría de ejercicios y rutinas A/B/C automáticas.

## 🧰 Tecnologías Principaless

- **Backend:** NestJS (Node.js + TypeScript)
- **ORM:** Prisma + PostgreSQL
- **Sesiones:** Redis + express-session
- **Frontend:** React + TypeScript + Vite (Estética Neo-Dark / Glassmorphism)
- **Iconos:** Lucide-React

## ⚙️ Requisitos

- Node.js v18+
- PostgreSQL & Redis activos.

## 🚀 Instalación y Ejecución

### 1. Backend

```bash
cd Backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

## 🎮 Lógica de Progresión

- El usuario inicia en **Nivel 1 - Fase 1**.
- Cada entrenamiento otorga **XP** al superar récords personales.
- Al completar la maestría de todos los ejercicios de la Fase 1, se desbloquea automáticamente la **Fase 2**.
- Al finalizar ambas fases, el sistema avanza al **siguiente nivel**.
