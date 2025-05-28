// src/components/MapEmbed.tsx
'use client';

import React from 'react';

type Props = {
  input: string; // could be a Google embed URL or a search query/location link
};

export default function MapEmbed({ input }: Props) {
  if (!input) {
    return (
      <div className="flex items-center justify-center h-full text-white/70">
        ไม่พบตำแหน่งที่ตั้ง
      </div>
    );
  }

  // ถ้าเป็น Google Maps embed URL อยู่แล้ว ให้ใช้ตรงๆ
  const isEmbedLink = input.includes('google.com/maps') && input.includes('output=embed');
  const srcUrl = isEmbedLink
    ? input
    : `https://maps.google.com/maps?q=${encodeURIComponent(input)}&output=embed`;

  return (
    <iframe
      src={srcUrl}
      className="w-full h-full rounded-md border"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
