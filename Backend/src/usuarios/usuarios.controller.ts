import { Controller, Get, Post, Body, Param, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Session } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async crear(@Body() body: any) {
    console.log('📝 Intento de registro:', body.email);
    if (!body.nombre || !body.email || !body.contrasena) {
      console.warn('⚠️ Registro fallido: Faltan campos');
      throw new BadRequestException('Campos requeridos: nombre, email, contrasena');
    }
    const result = await this.usuariosService.crearUsuario(body);
    console.log('✅ Usuario registrado con éxito:', result.email);
    return result;
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
    console.log('➡️ LOGIN: Intento para', body.email);
    const result = await this.usuariosService.login(body);
    
    console.log('🔍 LOGIN: Resultado del servicio:', JSON.stringify(result));

    if (!result.usuario || !result.usuario.id_usuario) {
      console.error('❌ LOGIN ERROR: El servicio no devolvió id_usuario válido. Objeto:', result);
      throw new BadRequestException('Error interno: Datos de usuario incompletos');
    }

    session.usuario = {
      id_usuario: Number(result.usuario.id_usuario),
      nombre: result.usuario.nombre,
      email: result.usuario.email,
    };
    
    console.log('💾 LOGIN: Intentando guardar sesión para ID:', session.usuario.id_usuario);

    return new Promise((resolve, reject) => {
      session.save((err) => {
        if (err) {
          console.error('❌ LOGIN ERROR: Fallo al guardar en Redis:', err);
          return reject(new BadRequestException('Error al persistir la sesión. Intente más tarde.'));
        }
        console.log('✅ LOGIN EXITOSO: Sesión guardada.');
        resolve(result);
      });
    });
  }

  @Get('dashboard')
  async obtenerDashboard(@Session() session: Record<string, any>) {
    if (!session.usuario) {
      throw new UnauthorizedException('No hay sesión activa');
    }
    return this.usuariosService.obtenerDashboard(Number(session.usuario.id_usuario));
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
