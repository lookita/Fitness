import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { EjerciciosService } from './ejercicios.service';

@Controller('ejercicios')
export class EjerciciosController {
  constructor(private readonly ejerciciosService: EjerciciosService) {}

  // GET /ejercicios?nivel=1&fase=1
  @Get()
  async getEjercicios(
    @Query('nivel', ParseIntPipe) nivel: number,
    @Query('fase', ParseIntPipe) fase: number,
  ) {
    return this.ejerciciosService.listarPorNivelYFase(nivel, fase);
  }

  // GET /ejercicios/:id/progreso?usuario=1
  @Get(':id/progreso')
  async getProgreso(
    @Param('id', ParseIntPipe) idEjercicio: number,
    @Query('usuario', ParseIntPipe) idUsuario: number,
  ) {
    return this.ejerciciosService.obtenerProgresoEjercicio(idUsuario, idEjercicio);
  }

  // GET /ejercicios/verificar-fase?usuario=1&nivel=1&fase=2
  @Get('verificar-fase')
  async checkFase(
    @Query('usuario', ParseIntPipe) idUsuario: number,
    @Query('nivel', ParseIntPipe) nivel: number,
    @Query('fase', ParseIntPipe) fase: number,
  ) {
    const desbloqueado = await this.ejerciciosService.verificarDesbloqueoFase(idUsuario, nivel, fase);
    return { desbloqueado };
  }
  
  // GET /ejercicios/todos
  @Get('todos')
  async getTodos() {
    return this.ejerciciosService.listarTodos();
  }

}
