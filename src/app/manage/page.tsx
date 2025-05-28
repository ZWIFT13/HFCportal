// src/app/manage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Property, PropertyDetail } from '@/app/types/property';
import EditPropertyModal from '@/app/components/EditPropertyModal';

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
  const [editing, setEditing] = useState<PropertyDetail | null>(null);

  async function fetchProperties() {
    setLoading(true);
    const { data, error } = await supabase
      .from<'properties', DBPropertyRow>('properties')
      .select('*, images(url)')
      .order('created_at', { ascending: false });

    if (error) {
      alert('โหลดข้อมูลไม่สำเร็จ');
      setProperties([]);
    } else if (data) {
      const mapped = data.map((r: DBPropertyRow) => ({
        id: r.id,
        ownerName: r.owner_name,
        ownerPhone: r.owner_phone,
        propertyType: r.property_type ?? undefined,
        agentName: r.agent_name ?? undefined,
        status: r.status ?? undefined,
        investor: r.investor ?? undefined,
        estimatedPrice: r.estimated_price ?? undefined,
        approvedPrice: r.approved_price ?? undefined,
        locationLink: r.location_link ?? undefined,
        mapEmbedLink: r.map_embed_link ?? undefined,
        province: r.province ?? undefined,
        createdAt: r.created_at,
        images: r.images.map((img: { url: string }) => img.url),
      }));
      setProperties(mapped);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm(`ยืนยันลบรายการ ${id} หรือไม่?`)) return;
    const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchProperties();
      return;
    }
    let errorMessage = `${res.status} ${res.statusText}`;
    try {
      const json = await res.json();
      if (json.error) errorMessage = json.error;
    } catch {}
    alert('ลบไม่สำเร็จ: ' + errorMessage);
  }

  return (
    <>
      {editing && (
        <EditPropertyModal
          property={editing}
          onClose={() => {
            setEditing(null);
            fetchProperties();
          }}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">จัดการรายการทรัพย์</h1>
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-inherit hover:bg-white border border-white/30 hover:text-black text-white text-sm font-semibold shadow transition"
            >
              ← กลับหน้าหลัก
            </Link>
          </div>
          {loading ? (
            <div className="py-12 text-center text-lg">กำลังโหลดข้อมูล...</div>
          ) : (
            <div className="rounded-xl overflow-x-auto bg-white/10">
              <table className="min-w-[800px] w-full table-fixed border-separate border-spacing-0">
                <colgroup>
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '19%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '17%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>
                <thead>
                  <tr className="bg-white/20">
                    <th className="px-4 py-3 text-left font-semibold">รหัส</th>
                    <th className="px-4 py-3 text-left font-semibold">เจ้าของ</th>
                    <th className="px-4 py-3 text-left font-semibold">เบอร์</th>
                    <th className="px-4 py-3 text-left font-semibold">ประเภท</th>
                    <th className="px-4 py-3 text-left font-semibold">สถานะ</th>
                    <th className="px-4 py-3 text-center font-semibold">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        ไม่พบรายการ
                      </td>
                    </tr>
                  ) : (
                    properties.map((p) => (
                      <tr
                        key={p.id}
                        className="odd:bg-white/5 even:bg-white/10 hover:bg-white/20 transition"
                      >
                        <td className="px-4 py-3 align-middle">{p.id}</td>
                        <td className="px-4 py-3 align-middle">{p.ownerName}</td>
                        <td className="px-4 py-3 align-middle">{p.ownerPhone}</td>
                        <td className="px-4 py-3 align-middle">{p.propertyType ?? '-'}</td>
                        <td className="px-4 py-3 align-middle">{p.status ?? '-'}</td>
                        <td className="px-4 py-3 align-middle">
                          <div className="flex justify-center gap-2">
                            <button
                              className="px-4 py-1 rounded-full text-xs border-yellow-400 border-1 hover:bg-yellow-300 text-yellow-300 hover:text-white font-semibold transition"
                              onClick={() => setEditing(p as PropertyDetail)}
                            >
                              แก้ไข
                            </button>
                            <button
                              className="px-4 py-1 rounded-full text-xs border-1 border-red-600 hover:bg-red-500 text-red-500 hover:text-white font-semibold transition"
                              onClick={() => handleDelete(p.id)}
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
