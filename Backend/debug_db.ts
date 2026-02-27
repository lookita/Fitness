import 'dotenv/config';
import { Client } from 'pg';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    console.log('Intentando conectar con pg...');
    await client.connect();
    console.log('✅ Conexión con pg exitosa.');
    const res = await client.query('SELECT NOW()');
    console.log('Resultado query:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('❌ Error conectando con pg:', err);
  }
}

test();
