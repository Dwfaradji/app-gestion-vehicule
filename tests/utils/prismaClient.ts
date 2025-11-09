import { PrismaClient } from '@prisma/client';

// Reuse Prisma client for tests
let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __e2e_prisma__: PrismaClient | undefined;
}

if (!global.__e2e_prisma__) {
  prisma = new PrismaClient();
  global.__e2e_prisma__ = prisma;
} else {
  prisma = global.__e2e_prisma__;
}

export { prisma };
