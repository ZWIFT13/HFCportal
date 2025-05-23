// src/app/manage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/types/property';

export default function ManagePage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then((data: Property[]) => {
        setProperties(data);
        setFiltered(data);
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase();
    setFiltered(
      properties.filter(p =>
        p.ownerName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.province?.toLowerCase().includes(q)
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">จัดการทรัพย์</h1>
      <input
        type="text"
        placeholder="ค้นหา..."
        onChange={handleSearch}
        className="mb-4 px-4 py-2 border rounded"
      />

      <div className="overflow-auto shadow rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-gray-700 text-left text-sm font-semibold">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">ชื่อเจ้าของ</th>
              <th className="px-4 py-2">เบอร์โทร</th>
              <th className="px-4 py-2">ประเภท</th>
              <th className="px-4 py-2">สถานะ</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-black text-sm">
            {filtered.map(property => (
              <tr
                key={property.id}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-2 font-mono text-blue-600">
                  {property.id}
                </td>
                <td className="px-4 py-2">{property.ownerName}</td>
                <td className="px-4 py-2">{property.ownerPhone}</td>
                <td className="px-4 py-2">{property.propertyType}</td>
                <td className="px-4 py-2">
                  {property.status}
                </td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => router.push(`/property/${property.id}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    ดู
                  </button>
                  <button
                    onClick={() => router.push(`/property/edit/${property.id}`)}
                    className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                  >
                    แก้ไข
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
