import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerfilFisicoService {
  constructor(private prisma: PrismaService) {}

  // 📌 Obtener el perfil físico por id de usuario
  async obtenerPorUsuario(id_usuario: number) {
    // @ts-ignore
    return (this.prisma as any).perfil_fisico.findUnique({
      where: { id_usuario },
    });
  }

  // 🎯 Función para sumar XP al usuario
  async sumarXP(idUsuario: number, xp: number) {
    // PASO 1: Buscar el perfil actual del usuario
    // @ts-ignore
    const perfil = await (this.prisma as any).perfil_fisico.findUnique({
      where: { id_usuario: idUsuario },
    });

    // Si no existe el perfil, no podemos continuar
    if (!perfil) {
      throw new Error('Perfil no encontrado');
    }

    // PASO 2: Calcular el nuevo XP
    const nuevoXP = perfil.xp_actual + xp;

    // PASO 3: Verificar si sube de nivel
    // Buscamos si hay un nivel siguiente que ya pueda alcanzar
    // @ts-ignore
    const nivelSiguiente = await (this.prisma as any).niveles.findFirst({
      where: {
        numero_nivel: perfil.nivel_actual + 1,
        xp_requerido: { lte: nuevoXP }, // lte = "menor o igual que"
      },
    });

    // Si encontró un nivel siguiente, lo asignamos. Si no, mantiene el actual
    const nuevoNivel = nivelSiguiente
      ? nivelSiguiente.numero_nivel
      : perfil.nivel_actual;

    // PASO 4: Actualizar el perfil en la base de datos
    // @ts-ignore
    await (this.prisma as any).perfil_fisico.update({
      where: { id_usuario: idUsuario },
      data: {
        xp_actual: nuevoXP,
        nivel_actual: nuevoNivel,
      },
    });

    // PASO 5: Devolver el resultado
    return { nuevoXP, nuevoNivel };
  }

  // 🎯 Avanzar en el ciclo de entrenamiento (Semana -> Fase -> Nivel) con Validación de XP
  async avanzarCiclo(idUsuario: number) {
    const perfil = await this.obtenerPorUsuario(idUsuario);
    if (!perfil) throw new Error('Perfil no encontrado');

    const nivelActual = perfil.nivel_actual;
    const faseActual = perfil.fase_actual;
    const semanaActual = perfil.semana_actual;

    // 1. Determinar el rango de XP del nivel actual
    // @ts-ignore
    const nivelActualData = await (this.prisma as any).niveles.findFirst({
      where: { numero_nivel: nivelActual }
    });
    // @ts-ignore
    const nivelSiguienteData = await (this.prisma as any).niveles.findFirst({
      where: { numero_nivel: nivelActual + 1 }
    });

    const xpBase = nivelActualData?.xp_requerido || 0;
    const xpMeta = nivelSiguienteData?.xp_requerido || (xpBase + 1000); // Default si no hay nivel sig
    const xpNecesariaEnNivel = xpMeta - xpBase;
    const xpGanadaEnNivel = perfil.xp_actual - xpBase;

    // 2. Definir umbral según la posición en el mes (4 semanas en total)
    // Posición global: (Fase-1)*2 + Semana
    // Semana 1 (Global 1) -> 25%
    // Semana 2 (Global 2) -> 50% (Fin Fase 1)
    // Semana 3 (Global 3) -> 75%
    // Semana 4 (Global 4) -> 100% (Fin Nivel)
    const posicionGlobal = (faseActual - 1) * 2 + semanaActual;
    const porcentajeRequerido = posicionGlobal * 0.25;
    const xpMinimaRequerida = xpBase + (xpNecesariaEnNivel * porcentajeRequerido);

    if (perfil.xp_actual < xpMinimaRequerida) {
      const faltante = Math.ceil(xpMinimaRequerida - perfil.xp_actual);
      const semanaDestino = posicionGlobal + 1;
      const faseDestino = semanaDestino > 2 ? 2 : 1;
      throw new Error(`Progreso insuficiente. Necesitas alcanzar el ${posicionGlobal * 25}% de XP del nivel (te faltan ${faltante} XP) para pasar a la Semana ${semanaDestino} (${faseDestino === 2 && semanaDestino === 3 ? 'Inicio de Fase 2' : 'Fase ' + faseDestino}).`);
    }

    // 3. Calcular nueva posición
    let nuevaSemana = semanaActual + 1;
    let nuevaFase = faseActual;
    let nuevoNivel = nivelActual;

    if (nuevaSemana > 2) {
      nuevaSemana = 1;
      nuevaFase += 1;
    }

    if (nuevaFase > 2) {
      nuevaFase = 1;
      nuevoNivel += 1;
    }

    // 4. Actualizar el perfil
    // @ts-ignore
    await (this.prisma as any).perfil_fisico.update({
      where: { id_usuario: idUsuario },
      data: {
        semana_actual: nuevaSemana,
        fase_actual: nuevaFase,
        nivel_actual: nuevoNivel
      }
    });

    // 5. Reseteo de maestría si cambia la Fase o el Nivel
    if (nuevaSemana === 1) {
      // @ts-ignore
      await (this.prisma as any).maestria_ejercicios.deleteMany({
        where: { id_usuario: idUsuario }
      });
    }

    return { 
      mensaje: `¡Progreso validado! Has avanzado a ${nuevoNivel !== nivelActual ? 'Nivel ' + nuevoNivel : 'Fase ' + nuevaFase + ' - Semana ' + nuevaSemana}`,
      nuevaSemana, 
      nuevaFase, 
      nuevoNivel 
    };
  }

  // 🎯 Función para verificar si todos los ejercicios de una fase están maestreados
  async verificarMaestriaFase(
    idUsuario: number,
    nivel: number,
    fase: number,
  ): Promise<boolean> {
    // PASO 1: Buscar las rutinas activas del usuario
    // @ts-ignore
    const rutinasActivas = await (this.prisma as any).rutinas_usuario.findMany({
      where: {
        id_usuario: idUsuario,
        activa: true,
      },
      include: {
        rutina: {
          include: {
            rutina_ejercicios: true,
          },
        },
      },
    });

    // PASO 2: Sacar todos los IDs de ejercicios de esas rutinas
    const ejerciciosIds: number[] = [];
    for (const ru of (rutinasActivas || [])) {
      for (const re of (ru.rutina?.rutina_ejercicios || [])) {
        ejerciciosIds.push(re.id_ejercicio);
      }
    }

    // Si no hay ejercicios, no hay nada que maestrear
    if (ejerciciosIds.length === 0) {
      return true;
    }

    // PASO 3: Buscar el estado de maestría de esos ejercicios
    // @ts-ignore
    const maestrias = await (this.prisma as any).maestria_ejercicios.findMany({
      where: {
        id_usuario: idUsuario,
        id_ejercicio: { in: ejerciciosIds },
      },
    });

    // PASO 4: Verificar que TODOS estén maestreados
    // Si alguno no está maestreado, devuelve false
    for (const m of (maestrias || [])) {
      if (!m.maestreado) {
        return false;
      }
    }

    // Si todos están maestreados, devuelve true
    return true;
  }
}
