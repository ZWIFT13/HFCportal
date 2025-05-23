import { Property as PrismaProperty } from "@prisma/client";

/**
 * Property: ใช้สำหรับฝั่ง Frontend (React)
 * - images: แปลงจาก JSON string เป็น string[] (จาก Prisma เก็บเป็น string)
 * - isNew: ใช้ใน UI เพื่อแสดง badge
 * - status: ดึงมาจาก Prisma (string)
 */
export type Property = Omit<PrismaProperty, "images"> & {
  images: string[];    // ✅ array ที่ใช้ใน React
  isNew?: boolean;     // ✅ ใช้เฉพาะ UI
  status?: string;     // ✅ เพิ่มให้รองรับ explicitly
};

/**
 * PropertyDetail: สำหรับแสดงใน Modal รายละเอียด
 * (ขยายเพิ่ม mapEmbedLink และใช้ field ของ Property)
 */
export type PropertyDetail = Property & {
  mapEmbedLink: string;
};
