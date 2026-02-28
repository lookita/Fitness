import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const users = await (prisma as any).usuarios.findMany();
    console.log('USUARIOS EN DB:', JSON.stringify(users, null, 2));
    
    const count = await (prisma as any).usuarios.count();
    console.log('TOTAL:', count);
  } catch (e) {
    console.error('ERROR AL CARGAR USUARIOS:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
