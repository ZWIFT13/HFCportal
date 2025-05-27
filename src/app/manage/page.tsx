// src/app/manage/page.tsx
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Property } from "@/app/types/property";

interface DBPropertyRow {
  id: string;
  owner_name: string;
  owner_phone: string;
  property_type: string | null;
  agent_name: string | null;
  status: string | null;
  investor: string | null;
  estimated_price: number | null;
  approved_price: number | null;
  location_link: string | null;
  map_embed_link: string | null;
  province: string | null;
  created_at: string;
  images: { url: string }[];
}

export default function ManagePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    // ให้ระบุทั้งสอง generic type: ชื่อตาราง กับรูปทรง row
    const { data, error } = await supabase
      .from<'properties', DBPropertyRow>("properties")
      .select("*, images(url)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ โหลดข้อมูลล้มเหลว:", error.message);
      alert("โหลดข้อมูลไม่สำเร็จ");
    } else if (data) {
      const mapped = data.map((row) => ({
        id: row.id,
        ownerName: row.owner_name,
        ownerPhone: row.owner_phone,
        propertyType: row.property_type ?? undefined,
        agentName: row.agent_name ?? undefined,
        status: row.status ?? undefined,
        investor: row.investor ?? undefined,
        estimatedPrice: row.estimated_price ?? undefined,
        approvedPrice: row.approved_price ?? undefined,
        locationLink: row.location_link ?? undefined,
        mapEmbedLink: row.map_embed_link ?? undefined,
        province: row.province ?? undefined,
        createdAt: row.created_at,
        // ระบุ type ให้ img เพื่อหลีกเลี่ยง any
        images: row.images.map((img: { url: string }) => img.url),
      }));
      setProperties(mapped);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(`ยืนยันลบรายการ ${id} หรือไม่?`)) return;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("❌ ลบไม่สำเร็จ:", error.message);
      alert("ลบไม่สำเร็จ");
    } else {
      fetchProperties();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-black text-white">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
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
            {properties.length > 0 ? (
              properties.map((p) => (
                <tr key={p.id} className="border-t border-white/10 text-sm">
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2">{p.ownerName}</td>
                  <td className="px-4 py-2">{p.ownerPhone}</td>
                  <td className="px-4 py-2">{p.propertyType ?? "-"}</td>
                  <td className="px-4 py-2">{p.status ?? "-"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="px-3 py-1 rounded-full text-xs bg-yellow-500 text-black"
                      onClick={() => alert("ยังไม่เปิดหน้าแก้ไข")}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="px-3 py-1 rounded-full text-xs bg-red-600 text-white"
                      onClick={() => handleDelete(p.id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-white/70">
                  ไม่มีรายการทรัพย์
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
