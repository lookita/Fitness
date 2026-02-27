import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PerfilFisicoService } from '../perfil-fisico/perfil-fisico.service';

@Injectable()
export class RutinasService {
  constructor(
    private prisma: PrismaService,
    private perfilService: PerfilFisicoService,
  ) {}

  // Obtener rutinas activas del usuario (A, B, C)
  async obtenerRutinasUsuario(idUsuario: number) {
    // @ts-ignore
    const rutinasUsuario = await (this.prisma as any).rutinas_usuario.findMany({
      where: {
        id_usuario: idUsuario,
        activa: true,
      },
      include: {
        rutina: {
          include: {
            rutina_ejercicios: {
              include: {
                ejercicio: {
                  include: {
                    grupo: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    return (rutinasUsuario || []).map((ru: any) => ru.rutina);
  }

  // Asignar rutinas automáticas según nivel y fase
  async asignarRutinasPorNivelYFase(
    idUsuario: number,
    nivel: number,
    fase: number,
  ) {
    if (fase > 1) {
      const faseAnteriorMaestrada =
        await this.perfilService.verificarMaestriaFase(
          idUsuario,
          nivel,
          fase - 1,
        );

      if (!faseAnteriorMaestrada) {
        throw new BadRequestException(
          `No puedes avanzar a Fase ${fase}. Debes completar todos los ejercicios de Fase ${fase - 1} primero.`,
        );
      }
    }

    // Buscar rutinas del nivel/fase ANTES de desactivar las actuales
    const nombreFiltro = `Nivel ${nivel} - Fase ${fase}`;

    // @ts-ignore
    const rutinasNivel = await (this.prisma as any).rutinas.findMany({
      where: {
        nombre: {
          contains: nombreFiltro,
        },
        nivel_minimo: nivel,
      },
    });

    if (rutinasNivel.length === 0) {
      throw new NotFoundException(`No se encontraron rutinas para Nivel ${nivel} Fase ${fase}`);
    }

    // Solo desactivamos las viejas SI encontramos las nuevas (evita dejar al usuario sin rutinas)
    // @ts-ignore
    await (this.prisma as any).rutinas_usuario.updateMany({
      where: { id_usuario: idUsuario, activa: true },
      data: { activa: false },
    });

    for (const rutina of rutinasNivel) {
      // @ts-ignore
      await (this.prisma as any).rutinas_usuario.upsert({
        where: {
          id_usuario_id_rutina: {
            id_usuario: idUsuario,
            id_rutina: rutina.id_rutina,
          }
        },
        update: { activa: true },
        create: {
          id_usuario: idUsuario,
          id_rutina: rutina.id_rutina,
          activa: true,
        }
      });
    }

    return { mensaje: `Se han asignado ${rutinasNivel.length} rutinas (A/B/C) correspondientes a la etapa actual.` };

  }

  // Obtener detalle de una rutina específica para el usuario
  async obtenerDetalleRutina(idRutina: number) {
    // @ts-ignore
    const rutina = await (this.prisma as any).rutinas.findUnique({
      where: { id_rutina: idRutina },
      include: {
        rutina_ejercicios: {
          include: {
            ejercicio: {
              include: {
                grupo: true
              }
            }
          }
        }
      }
    });

    if (!rutina) throw new NotFoundException('Rutina no encontrada');
    return rutina;
  }
}
