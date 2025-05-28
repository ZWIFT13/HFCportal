// src/app/components/DashboardNavbar.tsx
"use client";

import Logo from "./Logo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const statuses = [
  "ทั้งหมด",
  "รอประเมิน",
  "รอดูทรัพย์",
  "รอประมูล",
  "รอทำธุรกรรม",
  "เสร็จแล้ว",
];

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
    <nav className="w-full bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-md mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Logo */}
      <div className="flex-shrink-0 self-center sm:self-auto">
        {/* ขนาดเล็กลงครึ่งหนึ่ง จากเดิม h-8 → h-4, sm:h-10 → sm:h-5 */}
        <Logo className="h-10 w-auto" />
      </div>

      {/* กล่องค้นหา */}
      <input
        type="text"
        placeholder="ค้นหารหัสทรัพย์ (เช่น PROP001)"
        value={searchId}
        onChange={(e) => onSearchIdChange(e.target.value)}
        className="w-full sm:flex-1 h-12 rounded-full px-4 bg-transparent border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* ตัวกรองสถานะ + วันที่ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full sm:w-auto h-12 rounded-full px-4 bg-transparent border border-white/30 text-white focus:outline-none"
        >
          {statuses.map((s) => (
            <option key={s} value={s} className="text-black">
              {s}
            </option>
          ))}
        </select>

        <div className="relative w-full sm:w-auto">
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            placeholderText="เลือกวัน"
            dateFormat="dd/MM/yyyy"
            className="w-full sm:w-auto h-12 rounded-full px-4 bg-transparent border border-white/30 text-white placeholder-white/60 focus:outline-none"
            popperPlacement="bottom-start"
            portalId="date-portal"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/60">
            🗓️
          </span>
        </div>
      </div>
    </nav>
  );
}
