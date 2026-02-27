import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EjerciciosService {
  constructor(private prisma: PrismaService) {}

  // Listar ejercicios por nivel y fase
  async listarPorNivelYFase(nivel: number, fase: number) {
    // @ts-ignore
    return (this.prisma as any).ejercicios.findMany({
      where: {
        nivel_requerido: nivel,
        fase: fase,
      },
      include: {
        grupo: true,
      },
    });
  }

  // Obtener el progreso acumulado de un usuario en un ejercicio específico
  async obtenerProgresoEjercicio(idUsuario: number, idEjercicio: number) {
    const META_REPS = 36;

    // @ts-ignore
    const sesiones = await (this.prisma as any).detalle_sesion.aggregate({
      where: {
        id_ejercicio: idEjercicio,
        sesion: {
          id_usuario: idUsuario,
          completada: true,
        },
      },
      _sum: {
        repeticiones_realizadas: true,
      },
    });

    const realizados = (sesiones as any)._sum.repeticiones_realizadas || 0;
    const porcentaje = Math.min(Math.round((realizados / META_REPS) * 100), 100);

    return {
      id_ejercicio: idEjercicio,
      realizados,
      objetivo: META_REPS,
      porcentaje,
    };
  }

  // Verificar si la fase 1 de un nivel está al 100% para habilitar la fase 2
  async verificarDesbloqueoFase(idUsuario: number, nivel: number, fase: number) {
    if (fase === 1) return true;

    // @ts-ignore
    const ejerciciosFase1 = await (this.prisma as any).ejercicios.findMany({
      where: { nivel_requerido: nivel, fase: 1 },
      select: { id_ejercicio: true },
    });

    for (const ej of (ejerciciosFase1 || [])) {
      const progreso = await this.obtenerProgresoEjercicio(idUsuario, ej.id_ejercicio);
      if (progreso.porcentaje < 100) return false;
    }

    return true;
  }
  
  // Listar todos los ejercicios (para el catálogo)
  async listarTodos() {
    // @ts-ignore
    return (this.prisma as any).ejercicios.findMany({
      include: { grupo: true }, // opcional: trae también el grupo muscular
    });
  }

}
