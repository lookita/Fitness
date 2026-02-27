const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  console.log('Conectado a la DB');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "maestria_ejercicios" (
      "id_usuario" INTEGER NOT NULL,
      "id_ejercicio" INTEGER NOT NULL,
      "mejor_record" INTEGER NOT NULL,
      "maestreado" BOOLEAN NOT NULL DEFAULT false,
      "fecha_maestria" TIMESTAMP(3),

      CONSTRAINT "maestria_ejercicios_pkey" PRIMARY KEY ("id_usuario","id_ejercicio"),
      CONSTRAINT "maestria_ejercicios_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "maestria_ejercicios_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "ejercicios"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE
    );
  `;

  try {
    await client.query(createTableQuery);
    console.log('Tabla maestria_ejercicios creada/verificada con éxito');
  } catch (err) {
    console.error('Error creando tabla:', err);
  } finally {
    await client.end();
  }
}

run();
