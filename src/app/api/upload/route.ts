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
    const files = form.getAll('images') as File[];

    // โฟลเดอร์ชั่วคราวบน Vercel
    const uploadDir = '/tmp/upload';
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const paths: string[] = [];
    for (const file of files) {
      if (file.size > 0) {
        const buf = Buffer.from(await file.arrayBuffer());
        const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
        const name = `${randomUUID()}.${ext}`;
        await writeFile(path.join(uploadDir, name), buf);
        // คืน URL ให้ client โหลดต่อจาก GET route
        paths.push(`/api/upload/${name}`);
      }
    }

    return NextResponse.json({ paths }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    console.error('POST /api/upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
