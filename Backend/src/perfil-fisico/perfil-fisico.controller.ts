import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PerfilFisicoService } from './perfil-fisico.service';

@Controller('perfil-fisico')
export class PerfilFisicoController {
  constructor(private readonly perfilFisicoService: PerfilFisicoService) {}

  @Get('usuario/:id')
  getPerfil(@Param('id') id: string) {
    return this.perfilFisicoService.obtenerPorUsuario(Number(id));
  }

  // ⏩ Endpoint para avanzar manualmente de semana/fase
  @Post('avanzar-semana')
  async avanzarSemana(@Req() req) {
    const idUsuario = req.session.usuario?.id_usuario;
    if (!idUsuario) {
      return { error: 'No hay sesión activa' };
    }
    
    try {
      return await this.perfilFisicoService.avanzarCiclo(idUsuario);
    } catch (error: any) {
      return { error: error.message };
    }
  }
}
