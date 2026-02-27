import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
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

  /// Crear un usuario nuevo + perfil físico automático
  async crearUsuario(data: {
    nombre: string;
    email: string;
    contrasena: string;
  }) {
    // 1️⃣ Crear el usuario
    let usuario;
    try {
      // @ts-ignore
      usuario = await (this.prisma as any).usuarios.create({
        data: {
          nombre: data.nombre,
          email: data.email,
          contrasena: data.contrasena,
          estado: 'activo',
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }

    // 2️⃣ Crear automáticamente el perfil físico
    // @ts-ignore
    await (this.prisma as any).perfil_fisico.create({
      data: {
        id_usuario: usuario.id_usuario,
        edad: 18,
        peso: null,
        nivel_actual: 1,
        xp_actual: 0,
      },
    });

    // 3️⃣ Devolver el usuario creado
    return usuario;
  }

  // Obtener todos los usuarios
  async listarUsuarios() {
    // @ts-ignore
    return (this.prisma as any).usuarios.findMany();
  }

  // Obtener un usuario por ID
  async obtenerUsuarioPorId(id: number) {
    // @ts-ignore
    return (this.prisma as any).usuarios.findUnique({
      where: { id_usuario: id },
    });
  }

  async login(data: { email: string; contrasena: string }) {
    // 1️⃣ Buscar usuario por email
    // @ts-ignore
    const usuario = await (this.prisma as any).usuarios.findUnique({
      where: { email: data.email },
    });

    // 2️⃣ Si no existe
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 3️⃣ Comparar contraseña
    if (usuario.contrasena !== data.contrasena) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // 4️⃣ Login correcto
    return {
      mensaje: 'Login exitoso',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    };
  }

  // 🎯 Obtener dashboard completo del usuario
  async obtenerDashboard(idUsuario: number) {
    // 1. Obtener perfil físico (nivel, XP)
    const perfil = await this.perfilService.obtenerPorUsuario(idUsuario);

    // 2. Obtener rutinas activas
    const rutinas = await this.rutinasService.obtenerRutinasUsuario(idUsuario);

    // 3. Obtener progreso de ejercicios (maestría)
    // @ts-ignore
    const progreso = await (this.prisma as any).maestria_ejercicios.findMany({
      where: { id_usuario: idUsuario },
      include: {
        ejercicio: true, // Incluir datos del ejercicio
      },
    });

    // 4. Devolver todo junto
    return {
      perfil: {
        nivel: perfil?.nivel_actual || 1,
        xp: perfil?.xp_actual || 0,
        edad: perfil?.edad,
        peso: perfil?.peso,
      },
      rutinas: rutinas,
      progreso: (progreso || []).map((p: any) => ({
        ejercicio: p.ejercicio?.nombre || 'Ejercicio',
        mejor_record: p.mejor_record,
        maestreado: p.maestreado,
        fecha_maestria: p.fecha_maestria,
      })),
    };
  }
}
