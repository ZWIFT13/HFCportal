// src/components/EditPropertyModal.tsx
'use client'

import React, { useRef, useState } from 'react'
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

const PROP_OPTIONS = [
  "บ้านเดี่ยว",
  "บ้านโครงการ",
  "บ้านแฝด",
  "คอนโด",
];
const INVESTOR_OPTIONS = [
  "นายทุน",
  "ประมูล",
  "อื่นๆ",
];
const TEAM_OPTIONS = [
  "พี่นัท",
  "พี่ฮอล",
  "พี่ซันเดย์",
  "พี่หมูแดง",
  "พี่โอม",
  "พี่ปุ๊กปิ๊ก",
  "ทีมอื่นๆ",
];
const STATUS_OPTIONS = [
  "รอประเมิน",
  "รอดูทรัพย์",
  "รอประมูล",
  "รอทำธุรกรรม",
  "เสร็จแล้ว",
];

type FormFields = {
  id: string;
  propertyType: string;
  ownerName: string;
  ownerPhone: string;
  estimatedPrice: string;
  approvedPrice: string;
  province: string;
  locationLink: string;
  mapEmbedLink: string;
  investor: string;
  agentName: string;
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
    propertyType: property.propertyType ?? '',
    ownerName: property.ownerName ?? '',
    ownerPhone: property.ownerPhone ?? '',
    estimatedPrice: property.estimatedPrice != null ? String(property.estimatedPrice) : '',
    approvedPrice: property.approvedPrice != null ? String(property.approvedPrice) : '',
    province: property.province ?? '',
    locationLink: property.locationLink ?? '',
    mapEmbedLink: property.mapEmbedLink ?? '',
    investor: property.investor ?? '',
    agentName: property.agentName ?? '',
    status: property.status ?? '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewPaths, setPreviewPaths] = useState<string[]>(property.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Show preview
    const previews: string[] = [];
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      previews.push(url);
    });
    setPreviewPaths(previews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Upload images if new
      let paths = previewPaths;
      if (images.length > 0) {
        const fd = new FormData();
        images.forEach(file => fd.append('images', file));
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
          {/* ID */}
          <input
            name="id"
            placeholder="รหัสทรัพย์ (ID)"
            value={form.id}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
            disabled // ไม่ให้แก้ไขรหัส
          />

          {/* ประเภททรัพย์ */}
          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" disabled>เลือกประเภททรัพย์</option>
            {PROP_OPTIONS.map((option) => (
              <option key={option} value={option} className="text-black">
                {option}
              </option>
            ))}
          </select>

          {/* ชื่อเจ้าของ */}
          <input
            name="ownerName"
            placeholder="ชื่อเจ้าของ"
            value={form.ownerName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
          />

          {/* เบอร์เจ้าของ */}
          <input
            name="ownerPhone"
            placeholder="เบอร์เจ้าของ"
            value={form.ownerPhone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
          />

          {/* ราคาประเมิน */}
          <input
            name="estimatedPrice"
            placeholder="ราคาประเมิน (บาท)"
            value={form.estimatedPrice}
            onChange={handleChange}
            type="number"
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
          />

          {/* ราคาอนุมัติ */}
          <input
            name="approvedPrice"
            placeholder="ราคาอนุมัติ (บาท)"
            value={form.approvedPrice}
            onChange={handleChange}
            type="number"
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
          />

          {/* จังหวัด */}
          <input
            name="province"
            list="province-options"
            placeholder="เลือกจังหวัด"
            value={form.province}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
          />
          <datalist id="province-options">
            {THAI_PROVINCES.map((prov) => (
              <option key={prov} value={prov} />
            ))}
          </datalist>

          {/* location link */}
          <input
            name="locationLink"
            placeholder="Google Maps Link (location link)"
            value={form.locationLink}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
          />

          {/* map embed link */}
          <input
            name="mapEmbedLink"
            placeholder="Google Maps Embed (map embed link) (ถ้ามี)"
            value={form.mapEmbedLink}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
          />

          {/* นายทุน/ประมูล */}
          <select
            name="investor"
            value={form.investor}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" disabled>เลือกนายทุน หรือประมูล</option>
            {INVESTOR_OPTIONS.map(option => (
              <option key={option} value={option} className="text-black">{option}</option>
            ))}
          </select>

          {/* ทีมงาน */}
          <select
            name="agentName"
            value={form.agentName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" disabled>เลือกทีมงาน</option>
            {TEAM_OPTIONS.map(option => (
              <option key={option} value={option} className="text-black">{option}</option>
            ))}
          </select>

          {/* สถานะ */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
            style={{ colorScheme: 'dark' }}
          >
            <option value="" disabled>เลือกสถานะ</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="text-black">{s}</option>
            ))}
          </select>

          {/* อัปโหลดรูป: ปุ่มใหญ่ดีไซน์สวย */}
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg mb-2 transition flex items-center justify-center gap-2"
            >
              <span>📷</span> อัปโหลดรูปภาพ
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {previewPaths.length > 0 && (
              <div className="flex gap-3 overflow-x-auto mt-2">
                {previewPaths.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`uploaded-${i}`}
                    className="h-24 w-24 object-cover rounded-xl border border-white/30"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-red-500 rounded-xl text-white font-semibold hover:bg-red-600 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-500 rounded-xl text-white font-semibold hover:bg-blue-600 transition"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
