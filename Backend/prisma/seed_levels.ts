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
  await (prisma as any).detalle_sesion.deleteMany();
  await (prisma as any).sesiones_entrenamiento.deleteMany();
  await (prisma as any).maestria_ejercicios.deleteMany();
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
    { numero_nivel: 2, xp_requerido: 1000 },
    { numero_nivel: 3, xp_requerido: 2000 },
    { numero_nivel: 4, xp_requerido: 3000 },
    { numero_nivel: 5, xp_requerido: 4000 },
    { numero_nivel: 6, xp_requerido: 5000 },
    { numero_nivel: 7, xp_requerido: 6000 },
    { numero_nivel: 8, xp_requerido: 7000 },
    { numero_nivel: 9, xp_requerido: 8000 },
    { numero_nivel: 10, xp_requerido: 9000 },
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
    { nombre: 'Plancha 20s', id_grupo_muscular: gruposCreados['Core'], nivel_requerido: 1, fase: 1, dificultad: 'facil', descripcion: 'Mantén el cuerpo recto durante 20 segundos.', es_tiempo: true },
    // NIVEL 1 - FASE 2
    { nombre: 'Flexiones completas', id_grupo_muscular: gruposCreados['Empuje'], nivel_requerido: 1, fase: 2, dificultad: 'medio', descripcion: 'Flexiones con el cuerpo completamente extendido, pecho al suelo.' },
    { nombre: 'Sentadilla profunda', id_grupo_muscular: gruposCreados['Piernas'], nivel_requerido: 1, fase: 2, dificultad: 'medio', descripcion: 'Sentadilla con mayor rango de movimiento.' },
    { nombre: 'Remo invertido', id_grupo_muscular: gruposCreados['Tirón'], nivel_requerido: 1, fase: 2, dificultad: 'medio', descripcion: 'Tirón horizontal bajo una mesa, cuerpo recto.' },
    { nombre: 'Plancha 40s', id_grupo_muscular: gruposCreados['Core'], nivel_requerido: 1, fase: 2, dificultad: 'medio', descripcion: 'Mantén el cuerpo recto durante 40 segundos.', es_tiempo: true },
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

  // ─── 5. CREAR RUTINAS SEMANALES (Nivel 1 y 2, Fases 1 y 2) ───
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  const nivelesAFomentar = [1, 2];
  const fasesAFomentar = [1, 2];

  for (const n of nivelesAFomentar) {
    for (const f of fasesAFomentar) {
      for (const dia of diasSemana) {
        const r = await (prisma as any).rutinas.create({
          data: { 
            nombre: `Nivel ${n} - Fase ${f} - ${dia}`, 
            tipo: 'fija', 
            nivel_minimo: n 
          },
        });

        // ─── 6. ASIGNAR EJERCICIOS A LAS RUTINAS SEGÚN NIVEL Y FASE ───
        // Seleccionamos ejercicios que coincidan con nivel y fase
        const ejerciciosCompatibles = ejercicios.filter(e => e.nivel_requerido === n && e.fase === f);
        
        // Si no hay específicos de nivel 2 fase 2, usamos de nivel 1 fase 2 como fallback para el seed
        const ejerciciosAFijar = ejerciciosCompatibles.length > 0 
          ? ejerciciosCompatibles 
          : ejercicios.filter(e => e.nivel_requerido === 1 && e.fase === f);

        for (const ej of ejerciciosAFijar) {
          // Buscamos el id del ejercicio recién creado
          const dbEj = await (prisma as any).ejercicios.findFirst({ where: { nombre: ej.nombre } });
          if (dbEj) {
            await (prisma as any).rutina_ejercicios.upsert({
              where: {
                id_rutina_id_ejercicio: {
                  id_rutina: r.id_rutina,
                  id_ejercicio: dbEj.id_ejercicio
                }
              },
              update: {},
              create: {
                id_rutina: r.id_rutina,
                id_ejercicio: dbEj.id_ejercicio,
                series: 3,
                repeticiones: 10,
                tempo: '2-1-2'
              }
            });
          }
        }
      }
    }
  }

  console.log('✅ Rutinas Lunes-Viernes para Nivel 1 y 2 (Fase 1 y 2) creadas');
  console.log('🎉 Seeding completado exitosamente!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
