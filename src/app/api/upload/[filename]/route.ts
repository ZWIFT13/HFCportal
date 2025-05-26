// src/app/api/upload/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  context: { params: { filename: string } }
) {
  const { filename } = context.params;
  const uploadDir = '/tmp/upload';
  const filePath = path.join(uploadDir, filename);

  if (!existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const fileBuffer = await readFile(filePath);
  const contentType = mime.lookup(filename) || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
