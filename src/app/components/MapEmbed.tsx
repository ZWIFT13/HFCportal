'use client';

import React from 'react';

type Props = {
  input: string; // ลิงก์อะไรก็ได้จาก Google Maps หรือชื่อสถานที่
};

// ดึง lat,long หรือ place จากลิงก์ Google Maps (รองรับเกือบทุกแบบ)
function extractMapEmbedUrl(input: string): string {
  if (!input) return '';

  // 1. ถ้าเป็น embed URL แล้ว
  if (/google\.com\/maps\/.*output=embed/.test(input)) return input;

  // 2. ถ้าเป็น Shortlink (maps.app.goo.gl/xxxx) — ใช้เป็น query (Google resolve ได้)
  if (/maps\.app\.goo\.gl\//.test(input)) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(input)}&output=embed`;
  }

  // 3. หา lat,long จากลิงก์ (@13.8xxx,100.6xxx)
  const atLatLng = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atLatLng) {
    const [, lat, lng] = atLatLng;
    return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
  }

  // 4. /place/ชื่อสถานที่ ในลิงก์ยาว
  const placeMatch = input.match(/\/place\/([^\/\?]+)/);
  if (placeMatch) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeMatch[1])}&output=embed`;
  }

  // 5. ถ้าเป็น search หรือ place id
  const searchMatch = input.match(/maps\.google\.com\/maps\/(search|place)\/([^\/\?]+)/);
  if (searchMatch) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(searchMatch[2])}&output=embed`;
  }

  // 6. ถ้าเจอพิกัดใน query (13.8xxx,100.6xxx)
  const coordMatch = input.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (coordMatch) {
    const [, lat, lng] = coordMatch;
    return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
  }

  // 7. fallback: ใช้ค่าทั้งหมดเป็น query (ชื่อ, url อะไรก็ตาม)
  return `https://maps.google.com/maps?q=${encodeURIComponent(input)}&output=embed`;
}

export default function MapEmbed({ input }: Props) {
  const srcUrl = extractMapEmbedUrl(input);

  if (!srcUrl) {
    return (
      <div className="flex items-center justify-center h-full text-white/70">
        ไม่พบตำแหน่งที่ตั้ง
      </div>
    );
  }

  return (
    <iframe
      src={srcUrl}
      className="w-full h-full rounded-md border"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      style={{ minHeight: 300 }}
    />
  );
}
