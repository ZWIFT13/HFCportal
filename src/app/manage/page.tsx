"use client";

import { useEffect, useState } from "react";
import { Property } from "@/types/property";
import Link from "next/link";

export default function ManagePage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("❌ โหลดข้อมูลล้มเหลว:", err));
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(`ยืนยันลบรายการ ${id} หรือไม่?`);
    if (!confirmDelete) return;

    const res = await fetch(`/api/properties/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert("❌ ลบไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* ✅ กลับหน้าหลัก */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">จัดการรายการทรัพย์</h1>
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm font-semibold shadow transition"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>

        <table className="w-full table-auto bg-white/10 rounded-xl overflow-hidden">
          <thead className="bg-white/20 text-white text-sm">
            <tr>
              <th className="px-4 py-2">รหัส</th>
              <th className="px-4 py-2">เจ้าของ</th>
              <th className="px-4 py-2">เบอร์</th>
              <th className="px-4 py-2">ประเภท</th>
              <th className="px-4 py-2">สถานะ</th>
              <th className="px-4 py-2">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t border-white/10 text-sm">
                <td className="px-4 py-2">{property.id}</td>
                <td className="px-4 py-2">{property.ownerName}</td>
                <td className="px-4 py-2">{property.ownerPhone}</td>
                <td className="px-4 py-2">{property.propertyType}</td>
                <td className="px-4 py-2">{property.progressStatus}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="px-3 py-1 rounded-full text-xs bg-yellow-500 text-black"
                    onClick={() => alert("ยังไม่เปิดหน้าแก้ไข")}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="px-3 py-1 rounded-full text-xs bg-red-600 text-white"
                    onClick={() => handleDelete(property.id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
