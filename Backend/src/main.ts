//Este archivo main.ts sirve para iniciar el servidor
//es decir, es el punto de entrada de la aplicacion
//es decir, cuando se ejecuta el comando npm run start, se ejecuta este archivo
//es decir, es el primer archivo que se ejecuta cuando se inicia el servidor

//este archivo contiene la configuracion del servidor
//es decir, aqui se configura el puerto de la aplicacion, las sesiones, etc
//es decir, aqui se configura todo lo que necesita el servidor para funcionar

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//usamos * para importar todo el paquete de express-session
//el paque express-session contiene la logica para manejar las sesiones
//las sesiones son mecanismos que permiten mantener el estado de un usuario entre diferentes peticiones
//es decir, cuando un usuario se loguea, se crea una sesion y se almacena en el servidor
//cuando el usuario hace otra peticion, se envia el id de la sesion y se recupera la informacion del usuario
//en este caso, usaremos redis para almacenar las sesiones
//redis es una base de datos en memoria que se utiliza para almacenar datos en memoria
//es decir, los datos se almacenan en la memoria ram del servidor
//esto hace que sea muy rapido acceder a los datos
//sin embargo, los datos se pierden cuando el servidor se reinicia
//por lo tanto, no es recomendable usar redis para almacenar datos importantes
//pero es muy util para almacenar datos temporales como las sesiones
import session from 'express-session';

// importo redis para usarlo como base de datos para almacenar las sesiones
import Redis from 'ioredis';

// importo redisStore para usarlo como store para las sesiones
//store es un objeto que se encarga de almacenar las sesiones
//en este caso, usaremos redis como store para las sesiones
//connect-redis es un paquete que permite usar redis como store para las sesiones
//un paquete es una coleccion de codigo que se puede usar en diferentes programas
//es decir, un paquete es como un bloque de codigo que se puede reutilizar
//en este caso, el paquete connect-redis se encarga de almacenar las sesiones en redis
import { RedisStore } from 'connect-redis';

//async es una funcion asincrona
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configurar CORS (IMPORTANTE: credentials: true es necesario para las cookies)
  app.enableCors({
    origin: 'http://localhost:5173', // la url de mi frontend
    credentials: true,
  });

  // 2. Configuración de Redis
  const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'fitness_session:',
  });

  // 3. Configuración de la Sesión (DEBE IR ANTES DE app.listen)
  app.use(

    //session contiene la logica para manejar las sesiones
    //es decir, cuando un usuario se loguea, se crea una sesion y se almacena en el servidor
    //cuando el usuario hace otra peticion, se envia el id de la sesion y se recupera la informacion del usuario
    session({
      store: redisStore,
      secret: 'unpactoparavivir', 
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // Seguridad: el JS del navegador no puede leer la cookie
        secure: false, // Ponlo en true solo si usas HTTPS (en local es false)
        maxAge: 1000 * 60 * 60 * 24, // La sesión dura 24 horas
      },
    }),
  );

  // 4. Iniciar el servidor (SIEMPRE AL FINAL)
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
