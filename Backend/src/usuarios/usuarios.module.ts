import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PerfilFisicoModule } from '../perfil-fisico/perfil-fisico.module';
import { RutinasModule } from '../rutinas/rutinas.module';

@Module({
  imports: [PrismaModule, PerfilFisicoModule, RutinasModule],
  controllers: [UsuariosController],
  providers: [UsuariosService],
})
export class UsuariosModule {}
