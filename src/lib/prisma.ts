/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client';

// ประกาศตัวแปร prisma บน global สำหรับ caching
declare global {
  var prisma: PrismaClient | undefined;
}

// ใช้ global.prisma เพื่อหลีกเลี่ยงการสร้างใหม่ซ้ำใน dev mode
const prismaClient =
  global.prisma ??
  new PrismaClient({
    log: ['query'],
  });

// ใน dev ให้เก็บ instance ไว้บน global
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export default prismaClient;