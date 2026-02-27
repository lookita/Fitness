// filepath: Backend/prisma/seed_levels.ts
// Este archivo carga los datos base en la base de datos.
// Se ejecuta con: npx prisma db seed

import { PrismaClient } from '@prisma/client';

// Necesitamos usar el adaptador porque el proyecto usa pg directo
const pg = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Iniciando seeding...');

  // ─── 1. LIMPIAR DATOS VIEJOS (en orden para evitar errores de FK) ───
  await (prisma as any).rutina_ejercicios.deleteMany();
  await (prisma as any).rutinas_usuario.deleteMany();
  await (prisma as any).rutinas.deleteMany();
  await (prisma as any).ejercicios_desbloqueados.deleteMany();
  await (prisma as any).ejercicios.deleteMany();
  await (prisma as any).grupos_musculares.deleteMany();
  await (prisma as any).niveles.deleteMany();

  // ─── 2. CREAR LOS 10 NIVELES ───
  // xp_requerido = cuánta XP total necesita el usuario para llegar a ese nivel
  const niveles = [
    { numero_nivel: 1, xp_requerido: 0 },
    { numero_nivel: 2, xp_requerido: 100 },
    { numero_nivel: 3, xp_requerido: 250 },
    { numero_nivel: 4, xp_requerido: 500 },
    { numero_nivel: 5, xp_requerido: 800 },
    { numero_nivel: 6, xp_requerido: 1200 },
    { numero_nivel: 7, xp_requerido: 1700 },
    { numero_nivel: 8, xp_requerido: 2300 },
    { numero_nivel: 9, xp_requerido: 3000 },
    { numero_nivel: 10, xp_requerido: 4000 },
  ];
  for (const nivel of niveles) {
    await (prisma as any).niveles.create({ data: nivel });
  }
  console.log('✅ 10 Niveles creados');

  // ─── 3. CREAR GRUPOS MUSCULARES ───
  const grupos = ['Empuje', 'Tirón', 'Piernas', 'Core'];
  const gruposCreados: Record<string, number> = {};
  for (const nombre of grupos) {
    const g = await (prisma as any).grupos_musculares.create({ data: { nombre } });
    gruposCreados[nombre] = g.id_grupo;
  }
  console.log('✅ Grupos musculares creados');

  // ─── 4. CREAR EJERCICIOS (Nivel 1 y 2 como ejemplo) ───
  // nivel_requerido = nivel mínimo para desbloquear
  // fase = 1 (primeras 2 semanas) o 2 (últimas 2 semanas)
  const ejercicios = [
    // NIVEL 1 - FASE 1
    { nombre: 'Flexiones de rodillas', id_grupo_muscular: gruposCreados['Empuje'], nivel_requerido: 1, fase: 1, dificultad: 'facil', descripcion: 'Flexiones con apoyo en rodillas. Mantén la espalda recta.' },
    { nombre: 'Sentadilla con peso corporal', id_grupo_muscular: gruposCreados['Piernas'], nivel_requerido: 1, fase: 1, dificultad: 'facil', descripcion: 'Sentadilla básica. Baja hasta que los muslos estén paralelos al suelo.' },
    { nombre: 'Remo con silla', id_grupo_muscular: gruposCreados['Tirón'], nivel_requerido: 1, fase: 1, dificultad: 'facil', descripcion: 'Tirón horizontal usando una silla o mesa firme.' },
    { nombre: 'Plancha 20s', id_grupo_muscular: gruposCreados['Core'], nivel_requerido: 1, fase: 1, dificultad: 'facil', descripcion: 'Mantén el cuerpo recto durante 20 segundos.' },
    // NIVEL 1 - FASE 2
    { nombre: 'Flexiones completas', id_grupo_muscular: gruposCreados['Empuje'], nivel_requerido: 1, fase: 2, dificultad: 'medio', descripcion: 'Flexiones con el cuerpo completamente extendido, pecho al suelo.' },
    { nombre: 'Sentadilla profunda', id_grupo_muscular: gruposCreados['Piernas'], nivel_requerido: 1, fase: 2, dificultad: 'medio', descripcion: 'Sentadilla con mayor rango de movimiento.' },
    { nombre: 'Remo invertido', id_grupo_muscular: gruposCreados['Tirón'], nivel_requerido: 1, fase: 2, dificultad: 'medio', descripcion: 'Tirón horizontal bajo una mesa, cuerpo recto.' },
    { nombre: 'Plancha 40s', id_grupo_muscular: gruposCreados['Core'], nivel_requerido: 1, fase: 2, dificultad: 'medio', descripcion: 'Mantén el cuerpo recto durante 40 segundos.' },
    // NIVEL 2 - FASE 1
    { nombre: 'Flexiones diamante', id_grupo_muscular: gruposCreados['Empuje'], nivel_requerido: 2, fase: 1, dificultad: 'medio', descripcion: 'Flexiones con manos en forma de diamante, enfocadas en tríceps.' },
    { nombre: 'Zancadas alternadas', id_grupo_muscular: gruposCreados['Piernas'], nivel_requerido: 2, fase: 1, dificultad: 'medio', descripcion: 'Lunges alternando piernas.' },
  ];
  const ejerciciosCreados: number[] = [];
  for (const ej of ejercicios) {
    const e = await (prisma as any).ejercicios.create({ data: ej });
    ejerciciosCreados.push(e.id_ejercicio);
  }
  console.log('✅ Ejercicios creados');

  // ─── 5. CREAR RUTINAS (A, B, C para Nivel 1 Fase 1) ───
  const rutinaA = await (prisma as any).rutinas.create({
    data: { nombre: 'Nivel 1 - Fase 1 - Rutina A', tipo: 'fija', nivel_minimo: 1 },
  });
  const rutinaB = await (prisma as any).rutinas.create({
    data: { nombre: 'Nivel 1 - Fase 1 - Rutina B', tipo: 'fija', nivel_minimo: 1 },
  });
  const rutinaC = await (prisma as any).rutinas.create({
    data: { nombre: 'Nivel 1 - Fase 1 - Rutina C', tipo: 'fija', nivel_minimo: 1 },
  });

  // ─── 6. ASIGNAR EJERCICIOS A LAS RUTINAS ───
  // Rutina A: Empuje + Core (Flexiones de rodillas + Plancha 20s)
  const [flex_rod, sent_pc, remo_silla, plancha_20] = ejerciciosCreados;
  await (prisma as any).rutina_ejercicios.create({
    data: { id_rutina: rutinaA.id_rutina, id_ejercicio: flex_rod, series: 3, repeticiones: 8, tempo: '3-1-2', comentarios: 'Baja lento 3 seg, pausa 1 seg, sube 2 seg' },
  });
  await (prisma as any).rutina_ejercicios.create({
    data: { id_rutina: rutinaA.id_rutina, id_ejercicio: plancha_20, series: 3, repeticiones: 1, tempo: null, comentarios: '20 segundos por serie, descanso 60s' },
  });
  // Rutina B: Piernas (Sentadilla)
  await (prisma as any).rutina_ejercicios.create({
    data: { id_rutina: rutinaB.id_rutina, id_ejercicio: sent_pc, series: 3, repeticiones: 10, tempo: '3-1-2', comentarios: 'Baja controlado' },
  });
  // Rutina C: Tirón + Core (Remo con silla + Plancha 20s)
  await (prisma as any).rutina_ejercicios.create({
    data: { id_rutina: rutinaC.id_rutina, id_ejercicio: remo_silla, series: 3, repeticiones: 8, tempo: '2-1-2', comentarios: 'Mantén el cuerpo recto' },
  });
  await (prisma as any).rutina_ejercicios.create({
    data: { id_rutina: rutinaC.id_rutina, id_ejercicio: plancha_20, series: 3, repeticiones: 1, tempo: null, comentarios: '20 segundos por serie' },
  });

  console.log('✅ Rutinas A/B/C del Nivel 1 Fase 1 creadas');
  console.log('🎉 Seeding completado exitosamente!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
