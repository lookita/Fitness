import 'dotenv/config';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await client.connect();
    console.log('✅ Conexión establecida.');

    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tablas:', tables.rows.map(r => r.table_name));

    for (const table of ['ejercicios', 'rutina_ejercicios', 'rutinas']) {
      const columns = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table}'
      `);
      console.log(`Columnas de ${table}:`, columns.rows.map(r => `${r.column_name} (${r.data_type})`));
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.end();
  }
}

main();
