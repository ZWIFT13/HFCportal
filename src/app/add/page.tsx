"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  progressStatus: string;
  investor: string;
  estimatedPrice: string;
  approvedPrice: string;
  locationLink: string;
  mapEmbedLink: string;
  province: string;
  status: string;
};

export default function AddPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormFields>({
    id: "",
    ownerName: "",
    ownerPhone: "",
    propertyType: "",
    agentName: "",
    progressStatus: "",
    investor: "",
    estimatedPrice: "",
    approvedPrice: "",
    locationLink: "",
    mapEmbedLink: "",
    province: "",
    status: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewPaths, setPreviewPaths] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    setPreviewPaths([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach((file) => formData.append("images", file));

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const { paths } = await uploadRes.json();
    setPreviewPaths(paths);

    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images: paths }),
    });

    if (res.ok) router.push("/");
    else alert("เกิดข้อผิดพลาด");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/20 backdrop-blur-xl rounded-[2rem] p-10 shadow-xl border border-white/30">
        <h1 className="text-3xl font-semibold text-white mb-8 text-center">เพิ่มข้อมูลทรัพย์</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(Object.keys(form) as (keyof FormFields)[])
            .filter((key) => !["province", "status"].includes(key))
            .map((key) => (
              <input
                key={key}
                name={key}
                placeholder={key}
                value={form[key]}
                onChange={handleChange}
                required={["id", "ownerName"].includes(key)}
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
              />
          ))}

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

          {/* สถานะ */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/60 rounded-xl border border-white/30 focus:outline-none backdrop-blur-md"
            style={{ colorScheme: "dark" }} // ป้องกัน text จม
          >
            <option value="" disabled>เลือกสถานะ</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="text-black">{s}</option>
            ))}
          </select>

          {/* รูปภาพ */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full text-white"
          />
          {previewPaths.length > 0 && (
            <div className="flex gap-3 overflow-x-auto">
              {previewPaths.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="h-24 w-24 object-cover rounded-xl border border-white/30"
                  alt={`uploaded-${i}`}
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-500/80 text-white font-semibold hover:bg-blue-600 transition"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
}
