export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }   // ← เปลี่ยนให้ params เป็น Promise
) {
  // รอให้ params resolve แล้วดึง filename มา
  const { filename } = await params;
  const uploadsDir = path.join('/tmp', 'uploads');
  const filePath = path.join(uploadsDir, filename);

  // ถ้าไม่มีไฟล์ → 404
  if (!existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  // อ่านทั้งไฟล์เป็น Buffer
  const fileBuffer = await readFile(filePath);

  // หา Content-Type จากนามสกุล
  const contentType = mime.lookup(filename) || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // ถ้าต้องการ inline preview ให้ uncomment บรรทัดนี้:
      // 'Content-Disposition': `inline; filename="${filename}"`,
    },
  });
}
