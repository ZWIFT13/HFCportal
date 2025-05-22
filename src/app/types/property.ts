export type TransactionType = "ขายฝาก" | "จำนอง";

export type Property = {
  id: string;
  ownerName: string;
  ownerPhone: string;
  locationLink: string;
  province: string;
  status: string;
  transactionType: TransactionType;
};

export type PropertyDetail = {
  id: string;
  ownerName: string;
  ownerPhone: string;
  propertyType: string;
  agentName: string;
  progressStatus: string;
  investor: string;
  estimatedPrice: number;
  approvedPrice: number;
  images: string[];
  mapEmbedLink: string;
  locationLink: string; // ✅ เพิ่มกลับมาแล้ว
};
