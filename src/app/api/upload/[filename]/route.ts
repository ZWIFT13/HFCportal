// src/app/api/upload/[filename]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(
  request: Request,
  context: { params: { filename: string } }
) {
  const { filename } = context.params;
  // โฟลเดอร์เดียวกับ POST (/tmp/upload)
  const uploadDir = path.join('/tmp', 'upload');
  const filePath = path.join(uploadDir, filename);

  if (!existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  // อ่านไฟล์เป็น Buffer
  const data = await fs.readFile(filePath);
  const contentType = mime.lookup(filename) || 'application/octet-stream';

  return new NextResponse(data, {
    status: 200,
    headers: { 'Content-Type': contentType },
  });
}
