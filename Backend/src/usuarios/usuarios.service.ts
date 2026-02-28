import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PerfilFisicoService } from '../perfil-fisico/perfil-fisico.service';
import { RutinasService } from '../rutinas/rutinas.service';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private perfilService: PerfilFisicoService,
    private rutinasService: RutinasService,
  ) {}

  // Crear un usuario nuevo + perfil físico automático
  async crearUsuario(data: { nombre: string; email: string; contrasena: string }) {
    if (!data.nombre || !data.email || !data.contrasena) {
      throw new BadRequestException('Campos requeridos: nombre, email, contrasena');
    }

    let usuario;
    try {
      usuario = await (this.prisma as any).usuarios.create({
        data: {
          nombre: data.nombre,
          email: data.email,
          contrasena: data.contrasena,
          estado: 'activo',
        },
      });
    } catch (error) {
      // Manejamos tanto errores de Prisma (P2002) como de PostgreSQL (23505)
      if (error.code === 'P2002' || error.code === '23505') {
        throw new ConflictException('El email ya está registrado');
      }
      console.error('Error al crear usuario:', error);
      throw error;
    }

    if (!usuario || !usuario.id_usuario || isNaN(usuario.id_usuario)) {
      throw new BadRequestException('Registro inválido: ID de usuario no numérico');
    }

    try {
      await (this.prisma as any).perfil_fisico.create({
        data: {
          id_usuario: usuario.id_usuario,
          edad: 18,
          peso: null,
          nivel_actual: 1,
          xp_actual: 0,
        },
      });
      
      // Asignar rutinas iniciales automáticamente
      await this.rutinasService.asignarRutinasPorNivelYFase(usuario.id_usuario, 1, 1);
      console.log(`✅ Rutinas iniciales asignadas al usuario ${usuario.id_usuario}`);
    } catch (error) {
      console.error('Error al crear perfil físico:', error);
      // No lanzamos error aquí para que al menos el usuario esté creado, 
      // pero podríamos querer manejarlo de otra forma.
    }

    return usuario;
  }

  async listarUsuarios() {
    return (this.prisma as any).usuarios.findMany();
  }

  async obtenerUsuarioPorId(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('El ID debe ser numérico');
    }
    return (this.prisma as any).usuarios.findUnique({ where: { id_usuario: id } });
  }

  async login(data: { email: string; contrasena: string }) {
    const usuario = await (this.prisma as any).usuarios.findUnique({
      where: { email: data.email },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (usuario.contrasena !== data.contrasena) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return {
      mensaje: 'Login exitoso',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    };
  }

  async obtenerDashboard(idUsuario: number) {
    if (!idUsuario || isNaN(idUsuario)) {
      throw new UnauthorizedException('SERVICIO: ID de usuario inválido para el dashboard.');
    }

    const perfil = await this.perfilService.obtenerPorUsuario(idUsuario);
    let rutinas = await this.rutinasService.obtenerRutinasUsuario(idUsuario);

    // Salvaguarda: Si no tiene rutinas, asignamos las de nivel actual
    if (!rutinas || rutinas.length === 0) {
      try {
        console.log(`⚠️ Usuario ${idUsuario} sin rutinas. Asignando automáticamente para Nivel ${perfil?.nivel_actual || 1}...`);
        await this.rutinasService.asignarRutinasPorNivelYFase(idUsuario, perfil?.nivel_actual || 1, 1);
        rutinas = await this.rutinasService.obtenerRutinasUsuario(idUsuario);
      } catch (e) {
        console.error('❌ Fallo al asignar rutinas automáticas:', e.message);
        rutinas = []; // No rompemos el dashboard si falla la asignación
      }
    }

    // Obtener sesiones de las últimas 24 horas para marcar completados hoy
    const hace24Horas = new Date();
    hace24Horas.setHours(hace24Horas.getHours() - 24);

    const sesionesHoy = await (this.prisma as any).sesiones_entrenamiento.findMany({
      where: {
        id_usuario: idUsuario,
        fecha: { gte: hace24Horas },
        completada: true,
      },
      select: { id_rutina: true },
    });

    return {
      perfil: {
        nivel: perfil?.nivel_actual || 1,
        fase: perfil?.fase_actual || 1,
        semana: perfil?.semana_actual || 1,
        xp: perfil?.xp_actual || 0,
        edad: perfil?.edad,
        peso: perfil?.peso,
      },
      rutinas,
      sesionesHoy: sesionesHoy.map((s: any) => s.id_rutina),
      progreso: (progreso || []).map((p: any) => ({
        ejercicio: p.ejercicio?.nombre || 'Ejercicio',
        mejor_record: p.mejor_record,
        maestreado: p.maestreado,
        fecha_maestria: p.fecha_maestria,
      })),
    };
  }
}
