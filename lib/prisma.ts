// Ruta: c:\Users\carlo\Documents\Universidad\Proyecto Integrador\CultAndUndergroundMovies\lib\prisma.ts
import { PrismaClient } from '@prisma/client';

// Declarar una variable global para PrismaClient
let prisma: PrismaClient;

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    // En desarrollo, usar una variable global para evitar múltiples instancias
    const globalForPrisma = global as unknown as { prisma?: PrismaClient };

    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }

    prisma = globalForPrisma.prisma;
  }

  // Verificar conexión
  prisma.$connect();
} catch (error) {
  console.error('Error al inicializar Prisma:', error);
  throw new Error(
    'Error al inicializar el cliente Prisma. Asegúrate de que la conexión a la base de datos esté configurada correctamente.'
  );
}

export { prisma };
