// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const files = form.getAll('images') as File[];
    const uploadDir = '/tmp/upload';

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const paths: string[] = [];
    for (const file of files) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
        const filename = `${randomUUID()}.${ext}`;
        await writeFile(path.join(uploadDir, filename), buffer);
        paths.push(`/api/upload/${filename}`);
      }
    }

    return NextResponse.json({ paths }, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
        ? err
        : 'Upload failed';
    console.error('POST /api/upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
