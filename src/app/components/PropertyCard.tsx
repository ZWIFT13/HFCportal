import Image from "next/image";
import { Property } from "@/types/property";

type Props = {
  property: Property & { isNew?: boolean; images?: string[] };
  onClick: () => void;
};

/**
 * PropertyCard: แสดงการ์ดทรัพย์ใน Dashboard
 * - Overlay รูปภาพ
 * - Gradient ด้านล่างแสดง จังหวัด และ รหัสทรัพย์
 * - Bubble ด้านบนแสดงสถานะ และ NEW ถ้าเป็นทรัพย์ใหม่
 */
export default function PropertyCard({ property, onClick }: Props) {
  // กำหนด src ให้แน่ใจว่าเป็นเส้นทางเริ่มต้นด้วย '/'
  const imgSrc =
    property.images && property.images.length > 0
      ? `/mock/${property.images[0]}`
      : `/mock/house${Math.floor(Math.random() * 4 + 1)}.jpg`;

  return (
    <div
      onClick={onClick}
      className="relative rounded-xl overflow-hidden shadow-lg group transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
    >
      {/* Background Image */}
      <Image
        src={imgSrc}
        alt={`ภาพปกของ ${property.id}`}
        width={400}
        height={250}
        className="object-cover w-full h-56"
      />

      {/* Status & New Bubbles */}
      <div className="absolute top-4 right-4 flex gap-2">
        <span className="inline-flex items-center px-3 py-1 bg-white/80 text-black text-xs font-semibold rounded-full">
          {property.status}
        </span>
        {property.isNew && (
          <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
            NEW
          </span>
        )}
      </div>

      {/* Gradient Overlay with Text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 flex flex-col justify-end">
        <span className="text-sm text-white/80 font-medium">{property.province}</span>
        <h3 className="text-lg font-bold text-white">{property.id}</h3>
      </div>
    </div>
  );
}
