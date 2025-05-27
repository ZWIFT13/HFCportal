// src/components/PropertyCard.tsx

import { Property } from "src/app/types/property";

type Props = {
  property: Property;
  onClick: () => void;
};

export default function PropertyCard({ property, onClick }: Props) {
  // ตั้ง default เป็น mock image
  let imgSrc = `/mock/house${Math.floor(Math.random() * 4 + 1)}.jpg`;

  if (property.images?.length) {
    const first = property.images[0];
    // ถ้าเก็บมาเป็น full path ของ API route แล้ว ก็ใช้เลย
    imgSrc = first.startsWith("/api/upload")
      ? first
      : `/api/upload/${first}`;
  }

  return (
    <div
      onClick={onClick}
      className="relative rounded-xl overflow-hidden shadow-lg group transition-all hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
    >
      {/* Background Image */}
      <img
        src={imgSrc}
        alt={`ภาพปกของ ${property.id}`}
        className="object-cover w-full h-56"
      />

      {/* Status & NEW Badge */}
      <div className="absolute top-4 right-4 flex gap-2">
        {property.status && (
          <span className="inline-flex items-center px-3 py-1 bg-white/80 text-black text-xs font-semibold rounded-full">
            {property.status}
          </span>
        )}
        {property.isNew && (
          <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
            NEW
          </span>
        )}
      </div>

      {/* Gradient Overlay + Province/ID */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 flex flex-col justify-end">
        {property.province && (
          <span className="text-sm text-white/80 font-medium">
            {property.province}
          </span>
        )}
        <h3 className="text-lg font-bold text-white">{property.id}</h3>
      </div>
    </div>
  );
}
