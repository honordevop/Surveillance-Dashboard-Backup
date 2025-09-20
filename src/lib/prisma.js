// // lib/prisma.js
// import { PrismaClient } from "@prisma/client";

// let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   // Prevent multiple instances in development
//   if (!global.__prisma) {
//     global.__prisma = new PrismaClient();
//   }
//   prisma = global.__prisma;
// }

// export default prisma;

// lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.__prisma__ || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma__ = prisma;
}

export default prisma;
