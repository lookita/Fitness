import { Controller, Get, Post, Body, Param, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Session } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  crear(@Body() body: any) {
    if (!body.nombre || !body.email || !body.contrasena) {
      throw new BadRequestException('Campos requeridos: nombre, email, contrasena');
    }
    return this.usuariosService.crearUsuario(body);
  }

  @Get()
  listarUsuarios() {
    return this.usuariosService.listarUsuarios();
  }

  @Post('login')
  async login(
    @Body() body: { email: string; contrasena: string },
    @Session() session: Record<string, any>,
  ) {
    console.log('➡️ Intento de login:', body.email);
    const result = await this.usuariosService.login(body);
    
    if (!result.usuario || !result.usuario.id_usuario) {
      console.error('❌ Error: El servicio de login no devolvió un ID de usuario válido');
      throw new BadRequestException('Error interno al procesar el login');
    }

    session.usuario = {
      id_usuario: Number(result.usuario.id_usuario),
      nombre: result.usuario.nombre,
      email: result.usuario.email,
    };
    
    // Forzamos el guardado en Redis antes de responder
    return new Promise((resolve, reject) => {
      session.save((err) => {
        if (err) {
          console.error('❌ Error guardando sesión en Redis:', err);
          return reject(new BadRequestException('Error al persistir la sesión'));
        }
        console.log('✅ Sesión creada y guardada para ID:', session.usuario.id_usuario);
        resolve(result);
      });
    });
  }

  @Get('dashboard')
  obtenerDashboard(@Session() session: Record<string, any>) {
    if (!session.usuario) {
      console.warn('⚠️ DASHBOARD: No se encontró sesión del usuario');
      throw new UnauthorizedException('No hay sesión activa. Por favor, inicie sesión.');
    }

    if (!session.usuario.id_usuario || isNaN(Number(session.usuario.id_usuario))) {
      console.warn('⚠️ DASHBOARD: ID de usuario inválido en sesión:', session.usuario);
      throw new UnauthorizedException('Sus datos de sesión son corruptos. Por favor, reingrese.');
    }

    const idUsuario = Number(session.usuario.id_usuario);
    return this.usuariosService.obtenerDashboard(idUsuario);
  }

  @Get('check-session')
  verificarSesion(@Session() session: Record<string, any>) {
    if (!session.usuario || !session.usuario.id_usuario) {
      return { autenticado: false };
    }
    return { autenticado: true, usuario: session.usuario };
  }

  @Get('perfil/yo')
  obtenerPerfil(@Session() session: Record<string, any>) {
    if (!session.usuario) {
      throw new UnauthorizedException('Debe iniciar sesión para acceder al dashboard');
    }
    return session.usuario;
  }

  @Get(':id')
  obtenerUsuario(@Param('id') id: string) {
    const idNum = Number(id);
    if (isNaN(idNum)) {
      throw new BadRequestException('El ID debe ser numérico');
    }
    return this.usuariosService.obtenerUsuarioPorId(idNum);
  }

  @Post('logout')
  logout(@Session() session: Record<string, any>) {
    session.destroy((err) => {
      if (err) console.error('Error al cerrar sesión:', err);
    });
    return { mensaje: 'Sesión cerrada correctamente' };
  }
}
