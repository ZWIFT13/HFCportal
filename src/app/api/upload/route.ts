// src/app/api/upload/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    // file inputs มาในรูป File
    const files = form.getAll('images') as Blob[]; 

    const uploadDir = '/tmp/upload';
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const paths: string[] = [];
    for (const file of files) {
      // file เป็น Blob แต่ใน runtime มันคือ Web File
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = (file instanceof File
        ? file.name.split('.').pop()
        : 'bin'
      )?.toLowerCase() ?? 'bin';
      const filename = `${randomUUID()}.${ext}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      paths.push(`/api/upload/${filename}`);
    }

    return NextResponse.json({ paths });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    console.error('POST /api/upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
