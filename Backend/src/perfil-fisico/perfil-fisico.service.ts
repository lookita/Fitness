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
