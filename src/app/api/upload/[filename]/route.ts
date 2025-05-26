// src/app/api/upload/[filename]/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

/**
 * รับ GET /api/upload/{filename}
 * อ่านไฟล์จาก /tmp/upload/{filename} แล้วส่งกลับพร้อม Content-Type
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;
  const filePath = path.join('/tmp/upload', filename);

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
