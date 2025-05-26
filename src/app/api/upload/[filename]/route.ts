import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

export const runtime = 'nodejs';

export async function GET(
  request: Request,
  context: { params: { filename: string } }
) {
  const { filename } = context.params;
  const uploadDir = '/tmp/upload';
  const filePath = path.join(uploadDir, filename);

  try {
    const data = await readFile(filePath);
    const contentType = mime.lookup(filename) || 'application/octet-stream';
    return new NextResponse(data, {
      headers: { 'Content-Type': contentType },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
