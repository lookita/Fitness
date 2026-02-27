// Punto de entrada del servidor NestJS
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';

//async es una funcion asincrona
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configurar CORS (IMPORTANTE: credentials: true es necesario para las cookies)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8888'],
    credentials: true,
  });

  // 2. Configuración de Redis (usa variables de entorno, con fallback a localhost)
  const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  });

  redisClient.on('error', (err) => {
    console.error('❌ Error de conexión a Redis:', err);
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'fitness_app_session:',
  });

  // 3. Configuración de la Sesión (DEBE IR ANTES DE app.listen)
  app.use(
    session({
      name: 'fitness_sid', // Nombre personalizado para la cookie
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'fallback_inseguro_cambiar',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false, // Forzar false en local para compatibilidad total HTTP
        sameSite: 'lax', // Permite que la cookie se envíe en navegación local
        maxAge: 1000 * 60 * 60 * 24, // 24 horas
      },
    }),
  );

  // Middleware de LOG para ver qué peticiones traen sesión
  app.use((req, res, next) => {
    const sesionInfo = (req.session as any)?.usuario ? `Usuario: ${(req.session as any).usuario.email}` : 'SIN SESIÓN';
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} - ${sesionInfo}`);
    next();
  });

  // 4. Iniciar el servidor (SIEMPRE AL FINAL)
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 BACKEND FITNESS v2.0 - LISTO EN PUERTO 3000');
}

bootstrap();
