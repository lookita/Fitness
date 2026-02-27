import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PerfilFisicoService } from '../perfil-fisico/perfil-fisico.service';
import { RegistrarSesionDto } from './dto/registrar-sesion.dto';
import { RutinasService } from '../rutinas/rutinas.service';

// 🎯 Este servicio maneja todo lo relacionado con las sesiones de entrenamiento
@Injectable()
export class SesionesService {
  // Inyectamos los servicios que necesitamos
  constructor(
    private prisma: PrismaService,
    private perfilService: PerfilFisicoService,
    private rutinasService: RutinasService,
  ) {}

  // 📝 Función principal: Registrar una sesión de entrenamiento
  async registrarSesion(idUsuario: number, dto: RegistrarSesionDto) {
    // PASO 1: Crear la sesión en la base de datos
    // @ts-ignore
    const sesion = await (this.prisma as any).sesiones_entrenamiento.create({
      data: {
        id_usuario: idUsuario,
        id_rutina: dto.id_rutina,
        completada: true,
      },
    });

    // Variable para acumular toda la XP que gane el usuario
    let xpTotal = 0;

    // PASO 2: Procesar cada ejercicio que hizo el usuario
    for (const ejercicio of dto.ejercicios) {
      // 2.1 Buscar cuál es la meta de este ejercicio (cuántas reps debe hacer)
      // @ts-ignore
      const rutEj = await (this.prisma as any).rutina_ejercicios.findUnique({
        where: {
          id_rutina_id_ejercicio: {
            id_rutina: dto.id_rutina,
            id_ejercicio: ejercicio.id_ejercicio,
          },
        },
      });

      // Si no encontramos la meta, saltamos este ejercicio
      if (!rutEj) {
        continue;
      }

      // 2.2 Buscar el récord anterior del usuario en este ejercicio
      // @ts-ignore
      const maestria = await (this.prisma as any).maestria_ejercicios.findUnique({
        where: {
          id_usuario_id_ejercicio: {
            id_usuario: idUsuario,
            id_ejercicio: ejercicio.id_ejercicio,
          },
        },
      });

      // Si no tiene récord anterior, es 0 (primera vez que hace el ejercicio)
      const recordAnterior = maestria?.mejor_record || 0;

      // La meta es cuántas repeticiones debe hacer por serie
      const metaReps = rutEj.repeticiones;

      // PASO 3: Calcular cuánta XP gana
      const repsActuales = ejercicio.reps_realizadas;
      const repsParaXP = Math.min(repsActuales, metaReps); 
      const xpGanada = Math.max(0, repsParaXP - recordAnterior); 

      xpTotal = xpTotal + xpGanada;

      // PASO 4: Actualizar el récord (si mejoró)
      const nuevoRecord = Math.max(recordAnterior, repsActuales);

      // PASO 5: Verificar si alcanzó la maestría
      const maestreado = repsActuales >= metaReps;

      // PASO 6: Guardar el nuevo récord y estado de maestría
      // @ts-ignore
      await (this.prisma as any).maestria_ejercicios.upsert({
        where: {
          id_usuario_id_ejercicio: {
            id_usuario: idUsuario,
            id_ejercicio: ejercicio.id_ejercicio,
          },
        },
        update: {
          mejor_record: nuevoRecord,
          maestreado: maestreado,
          fecha_maestria: maestreado ? new Date() : undefined,
        },
        create: {
          id_usuario: idUsuario,
          id_ejercicio: ejercicio.id_ejercicio,
          mejor_record: nuevoRecord,
          maestreado: maestreado,
          fecha_maestria: maestreado ? new Date() : undefined,
        },
      });

      // PASO 7: Guardar el detalle de lo que hizo en esta sesión
      // @ts-ignore
      await (this.prisma as any).detalle_sesion.create({
        data: {
          id_sesion: sesion.id_sesion,
          id_ejercicio: ejercicio.id_ejercicio,
          series_realizadas: rutEj.series,
          repeticiones_realizadas: repsActuales,
        },
      });
    }

    // PASO 8: Sumar la XP total al perfil del usuario (solo si ganó algo)
    if (xpTotal > 0) {
      await this.perfilService.sumarXP(idUsuario, xpTotal);
    }

    // PASO 9 (NUEVO): Verificar si debe avanzar de fase automáticamente
    const perfilActualizado = await this.perfilService.obtenerPorUsuario(idUsuario);
    const nivelActual = perfilActualizado?.nivel_actual || 1;

    const fase1Completa = await this.perfilService.verificarMaestriaFase(idUsuario, nivelActual, 1);
    if (fase1Completa) {
      try {
        await this.rutinasService.asignarRutinasPorNivelYFase(idUsuario, nivelActual, 2);
        console.log(`Usuario ${idUsuario} avanzó a Nivel ${nivelActual} Fase 2`);
      } catch (e) {
        // Ya está en fase 2, no hay rutinas disponibles para esa fase, o hubo un error inesperado
        console.warn(`[SesionesService] No se pudo avanzar de fase para usuario ${idUsuario}:`, e);
      }
    }

    // PASO 10: Devolver el resultado
    return {
      mensaje: 'Sesión registrada exitosamente',
      xpGanada: xpTotal,
    };
  }
}
