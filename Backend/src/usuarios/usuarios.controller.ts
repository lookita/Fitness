//Este archivo usuarios.controller.ts es el controlador de los usuarios
//es decir, aqui se maneja la logica de los usuarios
//es decir, aqui se maneja todo lo que tiene que ver con los usuarios
//que viene desde el frontend, del archivo login.tsx
//todo viene desde login.tsx y se envia al backend

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Session } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  //POST QUIERE DECIR QUE VAMOS A RECIBIR DATOS DEL FRONTEND
  // POST /usuarios
  @Post()
  crear(@Body() body: any) {
    console.log('BODY RECIBIDO 👉', body);
    return this.usuariosService.crearUsuario(body);
  }

  //GET QUIERE DECIR QUE VAMOS A CONSEGUIR DATOS DEL FRONTEND
  // GET /usuarios
  @Get()
  listarUsuarios() {
    return this.usuariosService.listarUsuarios();
  }

  //GET /USUARIOS ID: QUIERE DECIR QUE VAMOS A CONSEGUIR DATOS DEL FRONTEND PERO CON UN ID
  // GET /usuarios/:id
  @Get(':id')
  obtenerUsuario(@Param('id') id: string) {
    return this.usuariosService.obtenerUsuarioPorId(Number(id));
  }

  //   @Post('login') QUIERE DECIR QUE RECIBIMOS DATOS DEL LOGIN DESDE EL FORMULARIO
  @Post('login')
  async login(
    @Body() body: { email: string; contrasena: string },
    @Session() session: Record<string, any>,
  ) {
    // aca se ejecuta la logica de login
    const result = await this.usuariosService.login(body);

    // 👈 Guardamos los datos del usuario en la sesión de Redis
    session.usuario = {
      id: result.usuario.id_usuario,
      nombre: result.usuario.nombre,
      email: result.usuario.email,
    };

    return result;
  }

  // Endpoint para ver mi propio perfil (basado en la sesión)
  @Get('perfil/yo')
  obtenerPerfil(@Session() session: Record<string, any>) {
    if (!session.usuario) {
      return { mensaje: 'No hay sesión activa' };
    }
    return session.usuario;
  }

  // Endpoint para cerrar sesión
  @Post('logout')
  logout(@Session() session: Record<string, any>) {
    session.destroy((err) => {
      if (err) console.error('Error al cerrar sesión:', err);
    });
    return { mensaje: 'Sesión cerrada correctamente' };
  }

  // 🎯 Endpoint para obtener TODO el dashboard del usuario
  // Devuelve: perfil (nivel, XP), rutinas activas y progreso de ejercicios
  @Get('dashboard')
  obtenerDashboard(@Session() session: Record<string, any>) {
    if (!session.usuario) {
      return { error: 'No hay sesión activa' };
    }

    const idUsuario = session.usuario.id;
    return this.usuariosService.obtenerDashboard(idUsuario);
  }
}
