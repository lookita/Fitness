import { Module } from '@nestjs/common';
import { PerfilFisicoController } from './perfil-fisico.controller';
import { PerfilFisicoService } from './perfil-fisico.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PerfilFisicoController],
  providers: [PerfilFisicoService],
  exports: [PerfilFisicoService], // 👈 Exportamos para que otros módulos lo usen
})
export class PerfilFisicoModule {}
