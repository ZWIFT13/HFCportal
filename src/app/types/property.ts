// src/app/types/property.ts

/**
 * Property: โครงสร้างข้อมูลสำหรับฝั่ง Frontend
 */
export interface Property {
  id: string;
  ownerName: string;
  ownerPhone: string;
  propertyType?: string;
  agentName?: string;
  status?: string;
  investor?: string;
  estimatedPrice?: number;
  approvedPrice?: number;
  locationLink?: string;
  mapEmbedLink?: string;
  province?: string;
  createdAt: string;
  images: string[];    // array ของ public URLs จาก Supabase
  isNew?: boolean;     // badge “NEW” ใน UI
}

/**
 * PropertyDetail: ขยายจาก Property สำหรับ Modal รายละเอียด
 */
export interface PropertyDetail extends Property {
  mapEmbedLink: string;  // ยืนยันว่ามี embed link
}
