// src/app/page.tsx
"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import DashboardNavbar from "@/components/DashboardNavbar";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import PropertyGrid from "@/components/DashboardGrid";
import { Property, PropertyDetail, TransactionType } from "@/types/property";

// กำหนด StatusType เป็น union type ของสถานะที่ใช้
type StatusType = "รอทำธุรกรรม" | "นัดดู" | "กำลังประเมิน" | "เสร็จแล้ว";

// สร้าง mock data 30 รายการ พร้อม flag isNew และ images
const statuses: StatusType[] = ["รอทำธุรกรรม", "นัดดู", "กำลังประเมิน", "เสร็จแล้ว"];
const transactionTypes: TransactionType[] = ["ขายฝาก", "จำนอง"];
const provinces = ["กรุงเทพฯ", "ปทุมธานี", "นนทบุรี", "สมุทรปราการ"];

const mockData: (Property & { isNew: boolean; images: string[] })[] = Array.from(
  { length: 30 },
  (_, i) => ({
    id: `PROP${String(i + 1).padStart(3, "0")}`,
    ownerName: `เจ้าของ PROP${i + 1}`,
    ownerPhone: `08${Math.floor(10000000 + Math.random() * 90000000)}`,
    locationLink: `https://goo.gl/maps/${String(i + 1).padStart(3, "0").toLowerCase()}`,
    province: provinces[i % provinces.length],
    status: statuses[i % statuses.length],
    transactionType: transactionTypes[i % transactionTypes.length],
    isNew: i < 5,
    images: [`house${(i % 4) + 1}.jpg`],
  })
);

// ข้อมูลรายละเอียดตัวอย่าง (ใช้สำหรับ modal)
const mockDetail: PropertyDetail = {
  id: "PROP001",
  ownerName: "คุณสมศรี",
  ownerPhone: "089-123-4567",
  propertyType: "บ้านเดี่ยว",
  agentName: "พี่นัท",
  progressStatus: "กำลังประเมิน",
  investor: "ทุน A",
  estimatedPrice: 3200000,
  approvedPrice: 3000000,
  images: ["house1.jpg", "house2.jpg", "house3.jpg", "house4.jpg"],
  locationLink: "https://goo.gl/maps/example1",
  mapEmbedLink: "https://www.google.com/maps/embed?...",
};

export default function Home() {
  // สถานะล็อกอิน
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dashboard states
  const [searchId, setSearchId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ทั้งหมด");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Handlers
  const handleLogin = () => {
    if (username === "aaa" && password === "Hfc1234") {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Username หรือ Password ไม่ถูกต้อง");
    }
  };

  const filtered = mockData.filter((item) => {
    const matchId = item.id.toLowerCase().includes(searchId.toLowerCase());
    const matchStatus = selectedStatus === "ทั้งหมด" || item.status === selectedStatus;
    return matchId && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const handleDetailClick = (id: string) => {
    setSelectedId(id);
    setShowDetail(true);
  };

  // หน้า Login 
  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white/20 backdrop-blur-2xl rounded-[2rem] p-8 text-white">
          <div className="flex justify-center mb-6">
            <Logo className="h-24 w-auto" />
          </div>
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          <div className="mb-6">
            <label className="block text-xs font-medium mb-2">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full h-12 rounded-full px-4 bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none"
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-medium mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full h-12 rounded-full px-4 bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none"
            />
          </div>

          <button
            onClick={handleLogin}
            className="block mx-auto px-8 py-2 rounded-full bg-white text-black font-semibold"
          >
            LOG IN
          </button>
        </div>
      </main>
    );
  }

  // หน้า Dashboard (ไม่มี Logo ตรงนี้)
  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black min-h-screen p-10">
      {/* Navbar กินเต็มหน้าจอ */}
      <DashboardNavbar
        searchId={searchId}
        onSearchIdChange={setSearchId}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <main className="max-w-6xl mx-auto px-6 py-6">
        <PropertyGrid data={currentData} onDetailClick={handleDetailClick} />
        <div className="flex justify-center items-center gap-4 mt-6 text-white">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-white/20 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-white/20 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      {showDetail && selectedId && (
        <PropertyDetailModal property={mockDetail} onClose={() => setShowDetail(false)} />
      )}
    </div>
  );
}
