// src/app/api/upload/[filename]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  context: { params: { filename: string } }
) {
  const { filename } = context.params;
  const uploadDir = '/tmp/upload';
  const filePath = path.join(uploadDir, filename);

  // ถ้าไม่มีไฟล์ ให้คืน 404
  if (!existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const buffer = await readFile(filePath);
  const contentType = mime.lookup(filename) || 'application/octet-stream';

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType
    }
  });
}
