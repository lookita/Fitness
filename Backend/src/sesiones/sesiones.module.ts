import { Module } from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { SesionesController } from './sesiones.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PerfilFisicoModule } from '../perfil-fisico/perfil-fisico.module';
import { RutinasModule } from '../rutinas/rutinas.module';

@Module({
  imports: [PrismaModule, PerfilFisicoModule, RutinasModule],
  providers: [SesionesService],
  controllers: [SesionesController],
})
export class SesionesModule {}
