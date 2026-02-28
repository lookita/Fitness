import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter } as any);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ PrismaService: Conectado vía ADAPTER-PG.');
    } catch (e) {
      console.error('❌ PrismaService: Error de conexión:', e);
      // No lanzamos para permitir que el servidor inicie si es error temporal
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
