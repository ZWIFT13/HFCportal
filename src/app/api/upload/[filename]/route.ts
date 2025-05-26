// src/app/api/upload/[filename]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(
  _req: Request,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const filePath = path.join('/tmp/uploads', filename);  // <-- ชื่อโฟลเดอร์ตรงกับ POST

  if (!existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const buffer = await readFile(filePath);
  const contentType = mime.lookup(filename) || 'application/octet-stream';

  return new NextResponse(buffer, {
    status: 200,
    headers: { 'Content-Type': contentType },
  });
}
