// src/app/api/upload/[filename]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

// กำหนด interface ให้ context.params ชัดเจน
interface Context {
  params: {
    filename: string;
  };
}

export async function GET(
  _request: Request,
  context: Context
) {
  const { filename } = context.params;
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
