"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const statuses = ["ทั้งหมด", "พร้อมขาย", "กำลังประเมิน", "นัดดู", "เสร็จแล้ว"];

type Props = {
  searchId: string;
  onSearchIdChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
};

export default function DashboardNavbar({
  searchId,
  onSearchIdChange,
  selectedStatus,
  onStatusChange,
  selectedDate,
  onDateChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white/4 backdrop-blur-lg rounded-3xl p-4 shadow-md mb-6">
      {/* 🔍 Search ID */}
      <input
        type="text"
        placeholder="ค้นหารหัสทรัพย์ (เช่น PROP001)"
        value={searchId}
        onChange={(e) => onSearchIdChange(e.target.value)}
        className="h-12 flex-1 min-w-[200px] rounded-full px-5 bg-transparent border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* 🧭 Filter by Status */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="h-12 rounded-full px-5 bg-transparent border border-white/30 text-white focus:outline-none"
      >
        {statuses.map((status) => (
          <option key={status} value={status} className="text-black">
            {status}
          </option>
        ))}
      </select>

      {/* 🗓️ Filter by Date */}
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={onDateChange}
          placeholderText="เลือกวัน"
          dateFormat="dd/MM/yyyy"
          className="h-12 rounded-full px-5 bg-transparent border border-white/30 text-white placeholder-white/60 focus:outline-none"
          popperPlacement="bottom-start"
          wrapperClassName="w-full"
          portalId="date-portal"
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/60">
          🗓️
        </span>
      </div>
    </div>
  );
}