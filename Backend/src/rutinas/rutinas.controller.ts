import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { RutinasService } from './rutinas.service';

@Controller('rutinas')
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) {}

  // Listar mis rutinas activas (A, B, C)
  // GET /rutinas/mis-rutinas?usuario=1
  @Get('mis-rutinas')
  async getMisRutinas(@Query('usuario', ParseIntPipe) idUsuario: number) {
    return this.rutinasService.obtenerRutinasUsuario(idUsuario);
  }

  // Asignar rutinas según nivel y fase
  // POST /rutinas/asignar
  // Body: { idUsuario: 1, nivel: 1, fase: 1 }
  @Post('asignar')
  async asignarRutinas(
    @Body('idUsuario', ParseIntPipe) idUsuario: number,
    @Body('nivel', ParseIntPipe) nivel: number,
    @Body('fase', ParseIntPipe) fase: number,
  ) {
    return this.rutinasService.asignarRutinasPorNivelYFase(idUsuario, nivel, fase);
  }

  // Detalle de una rutina
  // GET /rutinas/:id
  @Get(':id')
  async getDetalle(@Query('id', ParseIntPipe) idRutina: number) {
    return this.rutinasService.obtenerDetalleRutina(idRutina);
  }
}
