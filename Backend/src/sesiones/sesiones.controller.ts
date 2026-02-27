import { Controller, Post, Body, Req } from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { RegistrarSesionDto } from './dto/registrar-sesion.dto';

// 🎮 Este controlador maneja las peticiones HTTP relacionadas con sesiones
@Controller('sesiones')
export class SesionesController {
  constructor(private sesionesService: SesionesService) {}

  // 📝 Endpoint: POST /sesiones/registrar
  // El usuario envía los datos de su entrenamiento
  @Post('registrar')
  async registrarSesion(@Req() req, @Body() dto: RegistrarSesionDto) {
    // Obtener el ID del usuario de la sesión
    const idUsuario = req.session.usuario?.id_usuario;

    if (!idUsuario) {
      return { error: 'No hay sesión activa' };
    }

    // Llamar al servicio para procesar la sesión
    return this.sesionesService.registrarSesion(idUsuario, dto);
  }
}
