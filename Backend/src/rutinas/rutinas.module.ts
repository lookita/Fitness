import { Module } from '@nestjs/common';
import { RutinasService } from './rutinas.service';
import { RutinasController } from './rutinas.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PerfilFisicoModule } from '../perfil-fisico/perfil-fisico.module';

@Module({
  imports: [PrismaModule, PerfilFisicoModule],
  providers: [RutinasService],
  controllers: [RutinasController],
  exports: [RutinasService], // 👈 Exportamos para que UsuariosModule lo use
})
export class RutinasModule {}
