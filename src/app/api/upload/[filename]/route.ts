// src/app/api/upload/[filename]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const uploadDir = path.join('/tmp', 'upload');
  const filePath = path.join(uploadDir, filename);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // อ่านไฟล์ทั้งก้อนเป็น Buffer แล้วส่งกลับ
  const data = await readFile(filePath);
  const contentType = mime.lookup(filename) || 'application/octet-stream';

  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // ถ้าต้องการให้เบราว์เซอร์แสดงเป็นรูป สามารถตั้ง Cache-Control ไว้ได้นะครับ
      // 'Cache-Control': 'public, max-age=3600',
    },
  });
}
