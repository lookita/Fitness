import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { PerfilFisicoModule } from './perfil-fisico/perfil-fisico.module';
import { EjerciciosModule } from './ejercicios/ejercicios.module';
import { RutinasModule } from './rutinas/rutinas.module';
import { SesionesModule } from './sesiones/sesiones.module';

@Module({
  imports: [UsuariosModule, PrismaModule, PerfilFisicoModule, EjerciciosModule, RutinasModule, SesionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
