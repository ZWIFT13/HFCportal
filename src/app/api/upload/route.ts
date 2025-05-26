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

    // สร้างโฟลเดอร์ถ้ายังไม่มี
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const paths: string[] = [];
    for (const file of files) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
        const filename = `${randomUUID()}.${ext}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        // คืน URL ให้ client ดึงไฟล์ผ่าน GET route ด้านล่าง
        paths.push(`/api/upload/${filename}`);
      }
    }

    return NextResponse.json({ paths }, { status: 200 });
  } catch (err: any) {
    console.error('POST /api/upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
