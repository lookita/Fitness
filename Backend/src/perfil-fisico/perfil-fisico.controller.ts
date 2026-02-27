import { Controller, Get, Param } from '@nestjs/common';
import { PerfilFisicoService } from './perfil-fisico.service';

// Eso significa:

// “El perfil que pertenezca a este usuario”

// 📦 Devuelve:

// edad

// peso

// nivel

// xp

// todo el perfil
@Controller('perfil-fisico')
export class PerfilFisicoController {
  // 1️⃣ Inyectamos el service

  //   Esto es como decir:

  // 🗣️

  // “Oye NestJS, necesito un PerfilFisicoService para trabajar”

  // NestJS responde:

  // “Aquí lo tienes”

  // 📦 Y se lo entrega listo para usar.
  constructor(private readonly perfilFisicoService: PerfilFisicoService) {}

  // 2️⃣ Endpoint: GET /perfil-fisico/usuario/:id
  //   Esto crea una ruta completa:

  // GET /perfil-fisico/usuario/1

  // GET → quiero información

  // 1 → es el número del usuario
  @Get('usuario/:id')
  //   Esto significa:
  // “Agarra el número que viene en la URL”
  // Si la URL es:
  // /perfil-fisico/usuario/5
  // Entonces:
  // id = "5"
  // 🔹 Number(id)
  // La computadora es estricta 🤓
  // Los números deben ser números, no texto.
  // Entonces convertimos "5" → 5
  getPerfil(@Param('id') id: string) {
    // Convertimos el id a número y delegamos la lógica al service
    //     Aquí el recepcionista dice:

    // 🗣️

    // “Ey service, busca el perfil de este usuario”

    // El service va a la base de datos 🗄️
    // Vuelve con el perfil
    // Y el controller lo devuelve al navegador
    return this.perfilFisicoService.obtenerPorUsuario(Number(id));
  }
}
