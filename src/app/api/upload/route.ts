// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { mkdir, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const files = form.getAll('images') as File[];

    // Must match the GET route’s folder:
    const uploadDir = '/tmp/upload';

    // Ensure directory exists
    try {
      await access(uploadDir, constants.F_OK);
    } catch {
      await mkdir(uploadDir, { recursive: true });
    }

    const paths: string[] = [];
    for (const file of files) {
      if (file.size > 0) {
        // Read the blob into a buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        // Extract extension
        const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
        const filename = `${randomUUID()}.${ext}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        // Point to the dynamic GET route
        paths.push(`/api/upload/${filename}`);
      }
    }

    return NextResponse.json({ paths });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    console.error('POST /api/upload error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
