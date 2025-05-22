// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ใส่เฉพาะตัวเลือกที่ Next.js รู้จัก เช่น
  // swcMinify, images.domains, basePath, redirects, rewrites ฯลฯ
};

export default nextConfig;
