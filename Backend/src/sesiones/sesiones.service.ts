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

      const recordAnteriorVolumen = maestria ? (maestria.mejor_record_volumen || 0) : 0;
      const metaReps = rutEj.repeticiones;
      const metaSeries = rutEj.series;
      const metaVolumenTotal = metaReps * metaSeries;

      // PASO 3: Calcular XP (Meta: 50 XP por sesión completa)
      // Dividimos 50 XP por la cantidad total de ejercicios en la rutina
      const totalEjercicios = dto.ejercicios.length;
      const XP_POR_EJERCICIO = totalEjercicios > 0 ? 50 / totalEjercicios : 0;
      
      const repsActuales = ejercicio.reps_realizadas;
      const seriesActuales = ejercicio.series_realizadas || 0;
      const volumenActual = repsActuales * seriesActuales;
      
      // XP proporcional a cuánto completó de la meta de este ejercicio hoy
      const metaVolumenTotal = rutEj.repeticiones * rutEj.series;
      
      let xpGanada = 0;
      if (metaVolumenTotal > 0) {
        // Solo sumamos XP por lo hecho HOY, sin depender del récord histórico
        const porcentajeCompletado = Math.min(volumenActual / metaVolumenTotal, 1);
        xpGanada = Math.floor(porcentajeCompletado * XP_POR_EJERCICIO);
      }

      xpGanada = isNaN(xpGanada) || !isFinite(xpGanada) ? 0 : xpGanada;
      xpTotal += xpGanada;

      // PASO 4: Actualizar el récord (mejor volumen histórico)
      let mejorVolumenActualizado = Math.max(recordAnteriorVolumen, volumenActual);
      mejorVolumenActualizado = isNaN(mejorVolumenActualizado) ? recordAnteriorVolumen : mejorVolumenActualizado;

      // PASO 5: Verificar maestría (100% alcanzado)
      const maestreado = metaVolumenTotal > 0 && volumenActual >= metaVolumenTotal;

      // PASO 6: Guardar el nuevo récord...
      // @ts-ignore
      await (this.prisma as any).maestria_ejercicios.upsert({
        where: {
          id_usuario_id_ejercicio: {
            id_usuario: idUsuario,
            id_ejercicio: ejercicio.id_ejercicio,
          },
        },
        update: {
          mejor_record: Math.max(maestria?.mejor_record || 0, repsActuales),
          mejor_record_volumen: mejorVolumenActualizado,
          maestreado: maestreado,
          fecha_maestria: maestreado ? new Date() : undefined,
        },
        create: {
          id_usuario: idUsuario,
          id_ejercicio: ejercicio.id_ejercicio,
          mejor_record: repsActuales,
          mejor_record_volumen: mejorVolumenActualizado,
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
          series_realizadas: seriesActuales,
          repeticiones_realizadas: repsActuales,
        },
      });
    }

    // PASO 8: Sumar la XP total al perfil del usuario (solo si ganó algo)
    if (xpTotal > 0) {
      await this.perfilService.sumarXP(idUsuario, xpTotal);
    }

    // PASO 9 (NUEVO): Verificar si debe avanzar de semana/fase automáticamente
    const perfilActualizado = await this.perfilService.obtenerPorUsuario(idUsuario);
    const nivelActual = perfilActualizado?.nivel_actual || 1;
    const etapaCompleta = await this.perfilService.verificarMaestriaFase(idUsuario, nivelActual, perfilActualizado?.fase_actual || 1);
    
    if (etapaCompleta) {
      try {
        const resultadoAvance = await this.perfilService.avanzarCiclo(idUsuario);
        
        // Si al avanzar cambió la fase o nivel (resultadoAvance.nuevaSemana === 1), asignamos nuevas rutinas
        if (resultadoAvance && resultadoAvance.nuevaSemana === 1) {
          await this.rutinasService.asignarRutinasPorNivelYFase(idUsuario, resultadoAvance.nuevoNivel, resultadoAvance.nuevaFase);
          console.log(`Usuario ${idUsuario} avanzó a Nivel ${resultadoAvance.nuevoNivel} Fase ${resultadoAvance.nuevaFase}`);
        } else {
          console.log(`Usuario ${idUsuario} avanzó a Semana ${resultadoAvance?.nuevaSemana} de la Fase ${resultadoAvance?.nuevaFase}`);
        }
      } catch (e) {
        console.warn(`[SesionesService] No se pudo avanzar de etapa para usuario ${idUsuario}:`, e);
      }
    }

    // PASO 10: Devolver el resultado
    return {
      mensaje: 'Sesión registrada exitosamente',
      xpGanada: xpTotal,
    };
  }
}
