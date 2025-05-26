// src/app/api/upload/[filename]/route.ts
import { NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import mime from 'mime-types';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  // Decode and sanitize the filename
  const rawName = decodeURIComponent(params.filename);
  const safeName = path.basename(rawName);

  // Define the upload directory (must match POST route)
  const uploadDir = path.resolve(process.cwd(), 'tmp', 'upload');
  const filePath = path.join(uploadDir, safeName);

  // Check file existence asynchronously
  try {
    await access(filePath, constants.F_OK);
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Read the file
  const buffer = await readFile(filePath);
  const contentType = mime.lookup(safeName) || 'application/octet-stream';

  // Return the file with proper headers
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': buffer.byteLength.toString(),
    },
  });
}
