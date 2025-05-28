import { useState } from "react";
import { PropertyDetail } from "src/app/types/property";
import ImageCarousel from "./ImageCarousel";
import MapEmbed from "./MapEmbed";
import EditPropertyModal from "@/app/components/EditPropertyModal";
import { motion } from "framer-motion";

type Props = {
  property: PropertyDetail;
  onClose: () => void;
};

export default function PropertyDetailModal({ property, onClose }: Props) {
  const [showEdit, setShowEdit] = useState(false);

  const resolvedImages: string[] =
    property.images && property.images.length > 0 ? property.images : [];

  // Map URL: mapEmbedLink หรือ locationLink (fallback)
  const mapUrl =
    property.mapEmbedLink?.startsWith("http")
      ? property.mapEmbedLink
      : property.locationLink?.startsWith("http")
      ? property.locationLink
      : undefined;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-3xl flex items-center justify-center p-6">
      <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[2rem] bg-white/10 backdrop-blur-3xl shadow-2xl border border-white/10 p-8 text-white">

        {/* ปุ่มเปิดแมปในแท็บใหม่ (ขวาบน) */}
        {mapUrl && (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-16 z-50 flex items-center gap-1 px-3 py-2 bg-white/20 hover:bg-white hover:text-black transition-all duration-150 text-blue-200 text-xs font-semibold rounded-full shadow-lg cursor-pointer group"
            title="เปิดแผนที่ใน Google Maps"
            tabIndex={0}
          >
            <span className="text-lg group-hover:scale-125 transition-transform duration-200">🗺️</span>
            เปิดแมป
          </a>
        )}

        {/* ปุ่มปิดใหม่ */}
        <button
          onClick={onClose}
          title="ปิดหน้าต่าง"
          className="
            absolute top-4 right-4 z-50 
            flex items-center justify-center 
            w-11 h-11 rounded-full 
            bg-white/20 text-white 
            hover:bg-white hover:text-black
            transition-all duration-150
            shadow-lg cursor-pointer group
            
            focus:outline-none
          "
          style={{ fontSize: "1.5rem" }}
        >
          <span className="font-bold transition-all duration-200 group-hover:scale-125">×</span>
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
                <strong>ประเภท:</strong> {property.propertyType ?? "-"}
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
                <strong>นายทุน:</strong> {property.investor ?? "-"}
              </p>
            </div>
          </div>

          {/* Right: Map + Actions */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden shadow-md border border-white/10 bg-white/5 h-64 md:h-80 lg:h-96">
              <MapEmbed
                input={property.mapEmbedLink ?? property.locationLink ?? ""}
              />
            </div>
            <div className="flex justify-center gap-3">
              <button className="px-6 py-2 rounded-full bg-white text-black text-sm font-semibold shadow transition-all duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95">
                ACCEPT
              </button>
              <button className="px-6 py-2 rounded-full bg-white/10 border border-white/30 text-white text-sm transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-105 active:scale-95">
                CANCEL
              </button>
              {/* ปุ่ม EDIT มี animation ตอน hover/click */}
              <motion.button
                whileHover={{
                  backgroundColor: "#3B82F6", // blue-500
                  color: "#fff",
                  borderColor: "#2563EB", // blue-700
                  scale: 1.06,
                  transition: { duration: 0.13 },
                }}
                whileTap={{
                  scale: 0.97,
                  backgroundColor: "#1D4ED8", // blue-700
                  color: "#fff",
                  borderColor: "#1E40AF", // blue-900
                  transition: { duration: 0.11 },
                }}
                className="px-6 py-2 rounded-full border border-blue-400 text-blue-300 text-sm font-semibold shadow focus:outline-none transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: "rgba(59,130,246,0.10)",
                  color: "#60A5FA",
                  borderColor: "#60A5FA",
                }}
                onClick={() => setShowEdit(true)}
                tabIndex={0}
              >
                EDIT
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      {/* SHOW MODAL: ไม่มี animation */}
      {showEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md">
          <EditPropertyModal
            property={property}
            onClose={() => setShowEdit(false)}
          />
        </div>
      )}
    </div>
  );
}
