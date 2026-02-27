-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('activo', 'pausa');

-- CreateEnum
CREATE TYPE "ObjetivoEntrenamiento" AS ENUM ('fuerza', 'resistencia', 'hipertrofia', 'salud');

-- CreateEnum
CREATE TYPE "EstadoFisico" AS ENUM ('cansado', 'normal', 'energia');

-- CreateEnum
CREATE TYPE "TipoRutina" AS ENUM ('fija', 'generada');

-- CreateEnum
CREATE TYPE "DificultadEjercicio" AS ENUM ('facil', 'medio', 'dificil');

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoUsuario" NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "perfil_fisico" (
    "id_perfil" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "edad" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION,
    "nivel_actual" INTEGER NOT NULL,
    "xp_actual" INTEGER NOT NULL,

    CONSTRAINT "perfil_fisico_pkey" PRIMARY KEY ("id_perfil")
);

-- CreateTable
CREATE TABLE "configuracion_entrenamiento" (
    "id_config" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "dias_por_semana" INTEGER NOT NULL,
    "dias_entrenamiento" TEXT NOT NULL,
    "objetivo" "ObjetivoEntrenamiento" NOT NULL,

    CONSTRAINT "configuracion_entrenamiento_pkey" PRIMARY KEY ("id_config")
);

-- CreateTable
CREATE TABLE "niveles" (
    "id_nivel" SERIAL NOT NULL,
    "numero_nivel" INTEGER NOT NULL,
    "xp_requerido" INTEGER NOT NULL,

    CONSTRAINT "niveles_pkey" PRIMARY KEY ("id_nivel")
);

-- CreateTable
CREATE TABLE "xp_movimientos" (
    "id_xp" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_movimientos_pkey" PRIMARY KEY ("id_xp")
);

-- CreateTable
CREATE TABLE "grupos_musculares" (
    "id_grupo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "grupos_musculares_pkey" PRIMARY KEY ("id_grupo")
);

-- CreateTable
CREATE TABLE "ejercicios" (
    "id_ejercicio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_grupo_muscular" INTEGER NOT NULL,
    "nivel_requerido" INTEGER NOT NULL,
    "dificultad" "DificultadEjercicio" NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "ejercicios_pkey" PRIMARY KEY ("id_ejercicio")
);

-- CreateTable
CREATE TABLE "ejercicios_desbloqueados" (
    "id_usuario" INTEGER NOT NULL,
    "id_ejercicio" INTEGER NOT NULL,
    "fecha_desbloqueo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ejercicios_desbloqueados_pkey" PRIMARY KEY ("id_usuario","id_ejercicio")
);

-- CreateTable
CREATE TABLE "rutinas" (
    "id_rutina" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoRutina" NOT NULL,
    "nivel_minimo" INTEGER NOT NULL,

    CONSTRAINT "rutinas_pkey" PRIMARY KEY ("id_rutina")
);

-- CreateTable
CREATE TABLE "rutina_ejercicios" (
    "id_rutina" INTEGER NOT NULL,
    "id_ejercicio" INTEGER NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticiones" INTEGER NOT NULL,

    CONSTRAINT "rutina_ejercicios_pkey" PRIMARY KEY ("id_rutina","id_ejercicio")
);

-- CreateTable
CREATE TABLE "rutinas_usuario" (
    "id_usuario" INTEGER NOT NULL,
    "id_rutina" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activa" BOOLEAN NOT NULL,

    CONSTRAINT "rutinas_usuario_pkey" PRIMARY KEY ("id_usuario","id_rutina")
);

-- CreateTable
CREATE TABLE "estado_fisico_diario" (
    "id_estado" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoFisico" NOT NULL,

    CONSTRAINT "estado_fisico_diario_pkey" PRIMARY KEY ("id_estado")
);

-- CreateTable
CREATE TABLE "preferencia_entrenamiento_diario" (
    "id_preferencia" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grupo_muscular_elegido" TEXT NOT NULL,
    "mantener_rutina" BOOLEAN NOT NULL,

    CONSTRAINT "preferencia_entrenamiento_diario_pkey" PRIMARY KEY ("id_preferencia")
);

-- CreateTable
CREATE TABLE "sesiones_entrenamiento" (
    "id_sesion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_rutina" INTEGER NOT NULL,
    "completada" BOOLEAN NOT NULL,

    CONSTRAINT "sesiones_entrenamiento_pkey" PRIMARY KEY ("id_sesion")
);

-- CreateTable
CREATE TABLE "detalle_sesion" (
    "id_detalle" SERIAL NOT NULL,
    "id_sesion" INTEGER NOT NULL,
    "id_ejercicio" INTEGER NOT NULL,
    "series_realizadas" INTEGER NOT NULL,
    "repeticiones_realizadas" INTEGER NOT NULL,

    CONSTRAINT "detalle_sesion_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_fisico_id_usuario_key" ON "perfil_fisico"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_entrenamiento_id_usuario_key" ON "configuracion_entrenamiento"("id_usuario");

-- AddForeignKey
ALTER TABLE "perfil_fisico" ADD CONSTRAINT "perfil_fisico_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_entrenamiento" ADD CONSTRAINT "configuracion_entrenamiento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_movimientos" ADD CONSTRAINT "xp_movimientos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios" ADD CONSTRAINT "ejercicios_id_grupo_muscular_fkey" FOREIGN KEY ("id_grupo_muscular") REFERENCES "grupos_musculares"("id_grupo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios_desbloqueados" ADD CONSTRAINT "ejercicios_desbloqueados_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios_desbloqueados" ADD CONSTRAINT "ejercicios_desbloqueados_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "ejercicios"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "rutinas"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "ejercicios"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutinas_usuario" ADD CONSTRAINT "rutinas_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutinas_usuario" ADD CONSTRAINT "rutinas_usuario_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "rutinas"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estado_fisico_diario" ADD CONSTRAINT "estado_fisico_diario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferencia_entrenamiento_diario" ADD CONSTRAINT "preferencia_entrenamiento_diario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_entrenamiento" ADD CONSTRAINT "sesiones_entrenamiento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_entrenamiento" ADD CONSTRAINT "sesiones_entrenamiento_id_rutina_fkey" FOREIGN KEY ("id_rutina") REFERENCES "rutinas"("id_rutina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_sesion" ADD CONSTRAINT "detalle_sesion_id_sesion_fkey" FOREIGN KEY ("id_sesion") REFERENCES "sesiones_entrenamiento"("id_sesion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_sesion" ADD CONSTRAINT "detalle_sesion_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "ejercicios"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;
