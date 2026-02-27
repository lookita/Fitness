import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private client: any;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    try {
      // Intentamos cargar el cliente real
      const { PrismaClient } = require('@prisma/client');
      this.client = new PrismaClient();
    } catch (e) {
      console.warn('PrismaService: Usando modo emulación SQL por fallo de PrismaClient.');
      this.client = {
        $queryRaw: async (sql: string, ...args: any[]) => (await this.pool.query(sql, args)).rows,
      };
    }

    // Proxy para emular modelos si no existen
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) return (target as any)[prop];
        if (this.client && this.client[prop]) return this.client[prop];
        return this.createMockModel(String(prop));
      },
    });
  }

  private validateParams(params: any[], context: string) {
    if (!params) return;
    for (const p of params) {
      if (p === undefined || Number.isNaN(p)) {
        throw new Error(`Prisma MOCK: parámetro inválido (${p}) en ${context}`);
      }
    }
  }

  private createMockModel(modelName: string) {
    return {
      findMany: async (args: any = {}) => {
        console.log(`Prisma MOCK: ${modelName}.findMany`, args);
        let sql = `SELECT * FROM "${modelName}"`;
        const params: any[] = [];

        if (args.where) {
          const keys = Object.keys(args.where);
          if (keys.length > 0) {
            sql +=
              ' WHERE ' +
              keys.map((k, i) => `"${k}" = $${i + 1}`).join(' AND ');
            params.push(...keys.map((k) => args.where[k]));
          }
        }

        this.validateParams(params, `${modelName}.findMany`);
        const res = await this.pool.query(sql, params);
        return res.rows;
      },

      findUnique: async (args: any) => {
        console.log(`Prisma MOCK: ${modelName}.findUnique`, args);
        const where = args.where;
        const keys = Object.keys(where);
        let sql = `SELECT * FROM "${modelName}"`;
        const params: any[] = [];

        if (keys.length === 1 && typeof where[keys[0]] === 'object') {
          const compoundKeys = Object.keys(where[keys[0]]);
          sql +=
            ' WHERE ' +
            compoundKeys.map((k, i) => `"${k}" = $${i + 1}`).join(' AND ');
          params.push(...compoundKeys.map((k) => where[keys[0]][k]));
        } else {
          sql +=
            ' WHERE ' +
            keys.map((k, i) => `"${k}" = $${i + 1}`).join(' AND ');
          params.push(...keys.map((k) => where[k]));
        }

        this.validateParams(params, `${modelName}.findUnique`);
        const res = await this.pool.query(sql, params);
        return res.rows[0] || null;
      },

      findFirst: async (args: any) => {
        const rows = await this.createMockModel(modelName).findMany(args);
        return rows[0] || null;
      },

      create: async (args: any) => {
        console.log(`Prisma MOCK: ${modelName}.create`, args);
        const keys = Object.keys(args.data);
        const sql = `INSERT INTO "${modelName}" (${keys
          .map((k) => `"${k}"`)
          .join(', ')}) VALUES (${keys
          .map((_, i) => `$${i + 1}`)
          .join(', ')}) RETURNING *`;
        const params = keys.map((k) => args.data[k]);

        this.validateParams(params, `${modelName}.create`);
        const res = await this.pool.query(sql, params);
        return res.rows[0];
      },

      update: async (args: any) => {
        console.log(`Prisma MOCK: ${modelName}.update`, args);
        const dataKeys = Object.keys(args.data);
        const whereKeys = Object.keys(args.where);
        let sql =
          `UPDATE "${modelName}" SET ` +
          dataKeys.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
        sql +=
          ' WHERE ' +
          whereKeys
            .map((k, i) => `"${k}" = $${i + 1 + dataKeys.length}`)
            .join(' AND ');
        const params = [
          ...dataKeys.map((k) => args.data[k]),
          ...whereKeys.map((k) => args.where[k]),
        ];

        this.validateParams(params, `${modelName}.update`);
        const res = await this.pool.query(sql, params);
        return res.rows[0];
      },

      upsert: async (args: any) => {
        const existing = await this.createMockModel(modelName).findUnique({
          where: args.where,
        });
        if (existing) {
          return this.createMockModel(modelName).update({
            where: args.where,
            data: args.update,
          });
        } else {
          return this.createMockModel(modelName).create({ data: args.create });
        }
      },

      aggregate: async (args: any) => {
        if (args._sum) {
          const field = Object.keys(args._sum)[0];
          const res = await this.pool.query(
            `SELECT SUM("${field}") as total FROM "${modelName}"`,
          );
          return { _sum: { [field]: parseInt(res.rows[0].total) || 0 } };
        }
        return { _sum: {} };
      },
    };
  }

  async onModuleInit() {
    console.log('PrismaService (MOCK MODE): Iniciado.');
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async $connect() {}
  async $disconnect() {}
}
