// src/app/api/uploads/[filename]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const uploadsDir = path.join('/tmp', 'uploads');
  const filePath = path.join(uploadsDir, filename);

  // ถ้าไฟล์ไม่มี ให้คืน 404
  if (!existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  // อ่านทั้งไฟล์กลับมาเป็น Buffer
  const fileBuffer = await readFile(filePath);

  // กำหนด Content-Type ตามนามสกุล
  const contentType = mime.lookup(filename) || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // ถ้าต้องการ inline download:
      // 'Content-Disposition': `inline; filename="${filename}"`,
    },
  });
}
