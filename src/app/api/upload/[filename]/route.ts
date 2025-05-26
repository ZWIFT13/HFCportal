// src/app/api/upload/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import mime from 'mime-types';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }  // ← เปลี่ยนตรงนี้
) {
  // decode & sanitize filename
  const rawName = decodeURIComponent(params.filename);
  const safeName = path.basename(rawName);

  // absolute path to upload dir
  const uploadDir = path.resolve(process.cwd(), 'tmp', 'upload');
  const filePath = path.join(uploadDir, safeName);

  // check existence
  try {
    await access(filePath, constants.F_OK);
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }

  // read & respond
  const buffer = await readFile(filePath);
  const contentType = mime.lookup(safeName) || 'application/octet-stream';

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': buffer.byteLength.toString(),
    },
  });
}
