// src/components/EditPropertyModal.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PropertyDetail } from 'src/app/types/property'

const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร",
  "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา", "ชลบุรี", "ชัยนาท",
  "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง",
  "ตราด", "ตาก", "นครนายก", "นครปฐม", "นครพนม",
  "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส",
  "น่าน", "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์",
  "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา",
  "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์",
  "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน",
  "ยะลา", "ยโสธร", "ร้อยเอ็ด", "ระนอง", "ระยอง",
  "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย",
  "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล",
  "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี",
  "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์",
  "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี",
  "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
];

const STATUS_OPTIONS = [
  "รอประเมิน (IsNew)",
  "รอดูทรัพย์",
  "รอทำธุรกรรม",
  "เสร็จแล้ว",
];

type FormFields = {
  id: string;
  ownerName: string;
  ownerPhone: string;
  propertyType: string;
  agentName: string;
  investor: string;
  estimatedPrice: string;
  approvedPrice: string;
  locationLink: string;
  mapEmbedLink: string;
  province: string;
  status: string;
};

type Props = {
  property: PropertyDetail;
  onClose: () => void;
};

export default function EditPropertyModal({ property, onClose }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormFields>({
    id: property.id,
    ownerName: property.ownerName,
    ownerPhone: property.ownerPhone,
    propertyType: property.propertyType ?? '',
    agentName: property.agentName ?? '',
    investor: property.investor ?? '',
    estimatedPrice: property.estimatedPrice != null ? String(property.estimatedPrice) : '',
    approvedPrice: property.approvedPrice != null ? String(property.approvedPrice) : '',
    locationLink: property.locationLink ?? '',
    mapEmbedLink: property.mapEmbedLink ?? '',
    province: property.province ?? '',
    status: property.status ?? '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewPaths, setPreviewPaths] = useState<string[]>(property.images || []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(Array.from(e.target.files || []));
    setPreviewPaths([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Upload images if new
      const fd = new FormData();
      images.forEach(file => fd.append('images', file));
      let paths = previewPaths;
      if (images.length > 0) {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'อัปโหลดรูปไม่สำเร็จ');
        paths = uploadData.paths;
      }

      // 2. Prepare payload
      const payload = {
        ...form,
        estimatedPrice: form.estimatedPrice ? Number(form.estimatedPrice) : undefined,
        approvedPrice: form.approvedPrice ? Number(form.approvedPrice) : undefined,
        images: paths,
      };

      // 3. PATCH to update
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'บันทึกไม่สำเร็จ');

      // 4. Close and refresh
      onClose();
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
      alert(msg);
    }
  };

  const inputFields: Array<keyof FormFields> = [
    'id','ownerName','ownerPhone','propertyType',
    'agentName','investor','estimatedPrice','approvedPrice',
    'locationLink','mapEmbedLink',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-3xl flex items-center justify-center p-6">
      <div className="relative w-full max-w-3xl overflow-y-auto rounded-2xl bg-white/10 p-8 text-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-4 py-2 bg-white/20 rounded-full text-white"
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-4">แก้ไขทรัพย์ {property.id}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {inputFields.map((key) => (
            <input
              key={key}
              name={key}
              placeholder={key}
              value={form[key]}
              onChange={handleChange}
              required={key === 'id' || key === 'ownerName'}
              className="w-full px-4 py-3 bg-white/20 placeholder-white/60 rounded-xl border border-white/30 text-white"
            />
          ))}

          <input
            name="province"
            list="province-options"
            value={form.province}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 rounded-xl border border-white/30 text-white"
          />
          <datalist id="province-options">
            {THAI_PROVINCES.map((p) => <option key={p} value={p} />)}
          </datalist>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 rounded-xl border border-white/30 text-white"
          >
            <option value="" disabled>เลือกสถานะ</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="text-black">{s}</option>
            ))}
          </select>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-white"
          />
          {previewPaths.length > 0 && (
            <div className="flex gap-3 overflow-x-auto">
              {previewPaths.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`preview-${i}`} 
                  className="h-24 w-24 object-cover rounded-xl border border-white/30"
                />
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-red-500 rounded-xl text-white"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-500 rounded-xl text-white"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
