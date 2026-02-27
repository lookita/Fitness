# 🏗️ Reporte de Estructura Inicial - "Fase 0"

Antes de comenzar con la **Fase 1 (Sesiones y Usuarios)**, el proyecto ya contaba con una base tecnológica sólida (scaffolding). Estos son los cimientos sobre los que se construyó todo:

---

## 📂 1. Organización del Monorepositorio

El proyecto se estructuró desde el inicio como un monorepositorio dividido en dos grandes bloques:

- **`Backend/`**: Todo el motor de la aplicación (NestJS).
- **`Frontend/`**: Toda la interfaz de usuario (React + Vite).

---

## 💻 2. Estado Pre-Fase 1: Backend (NestJS + Prisma)

Antes de programar la lógica de sesiones, ya estaban creadas estas carpetas y archivos base:

- **`prisma/`**:
  - Se inicializó Prisma.
  - Se creó el archivo `schema.prisma` con los primeros modelos de tablas.
- **`src/` (Arquitectura NestJS)**:
  - `usuarios/`: Carpeta base para la gestión de usuarios (existente como estructura).
  - `perfil-fisico/`: Carpeta base para el perfil del usuario (existente como estructura).
  - `prisma/`: Módulo de conexión a la base de datos.
  - `app.module.ts`: Core del servidor.
  - `main.ts`: Configuración básica inicial.

---

## 🎨 3. Estado Pre-Fase 1: Frontend (React + Vite)

El frontend ya tenía su estructura de carpetas lista para recibir el código:

- **`src/pages/`**: Carpetas vacías para Login, Registro y Dashboard.
- **`src/components/`**: Carpeta para elementos reutilizables (Botones, Inputs, Header).
- **`src/services/`**: Carpeta para la configuración de Axios (comunicación con el servidor).
- **Tooling**: Se configuró Vite, TypeScript y el `package.json` con las dependencias necesarias.

---

## ☁️ 4. Servicios Externos

- **PostgreSQL**: Se configuró la base de datos local `Fitness_BD`.
- **Node.js/npm**: Se configuró el entorno de ejecución y los scripts de inicio (`npm run start:dev`).

> [!NOTE]
> La **Fase 1** no creó estas carpetas desde cero, sino que "llenó de vida" esa estructura añadiendo la lógica de **Redis**, la **Autenticación real** y los **Endpoints de Usuario**.
