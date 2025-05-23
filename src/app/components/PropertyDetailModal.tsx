// src/components/PropertyDetailModal.tsx

import { PropertyDetail } from "@/types/property";
import ImageCarousel from "./ImageCarousel";
import MapEmbed from "./MapEmbed";

type Props = {
  property: PropertyDetail;
  onClose: () => void;
};

export default function PropertyDetailModal({ property, onClose }: Props) {
  const resolvedImages = (property.images || []).map((img) =>
    img.startsWith("/") ? img : `/uploads/${img}`
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-3xl flex items-center justify-center p-6">
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[2rem] bg-white/10 backdrop-blur-3xl shadow-2xl border border-white/10 p-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-full shadow-lg focus:outline-none"
        >
          X
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <h2 className="text-2xl font-bold">{property.id}</h2>
          {property.status && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white text-black text-xs font-semibold shadow-sm">
              {property.status}
            </div>
          )}
          {property.agentName && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold">
              {property.agentName}
            </div>
          )}
        </div>

        {/* จังหวัดใต้รหัสทรัพย์ */}
        {property.province && (
          <p className="text-white/70 text-sm mb-4 ml-1">
            จังหวัด: {property.province}
          </p>
        )}

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Images + Info */}
          <div className="flex flex-col gap-6">
            <ImageCarousel images={resolvedImages} />
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-2 text-sm">
              <p>
                <strong>ชื่อเจ้าของ:</strong> {property.ownerName}
              </p>
              <p>
                <strong>เบอร์โทร:</strong> {property.ownerPhone}
              </p>
              <p>
                <strong>ประเภท:</strong> {property.propertyType}
              </p>
              <p>
                <strong>ราคาประเมิน:</strong>{" "}
                {property.estimatedPrice != null
                  ? property.estimatedPrice.toLocaleString()
                  : "-"}{" "}
                บาท
              </p>
              <p>
                <strong>ราคาอนุมัติ:</strong>{" "}
                {property.approvedPrice != null
                  ? property.approvedPrice.toLocaleString()
                  : "-"}{" "}
                บาท
              </p>
              <p>
                <strong>นายทุน:</strong> {property.investor}
              </p>
            </div>
          </div>

          {/* Right: Map + Actions */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden shadow-md border border-white/10 bg-white/5 h-64 md:h-80 lg:h-96">
              <MapEmbed input={property.locationLink ?? ""} />
            </div>
            <div className="flex justify-center gap-3">
              <button className="px-6 py-2 rounded-full bg-white text-black text-sm font-semibold shadow">
                ACCEPT
              </button>
              <button className="px-6 py-2 rounded-full bg-white/10 border border-white/30 text-white text-sm">
                CANCEL
              </button>
              <button className="px-6 py-2 rounded-full bg-white/10 border border-white/30 text-white text-sm">
                EDIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
