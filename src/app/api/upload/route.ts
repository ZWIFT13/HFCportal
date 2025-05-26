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

    // โฟลเดอร์ชั่วคราวบน Vercel (ให้ตรงกับ GET route ของคุณ)
    const uploadDir = '/tmp/uploads';
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const paths: string[] = [];
    for (const file of files) {
      if (file.size > 0) {
        // อ่าน buffer จาก File API
        const buffer = Buffer.from(await file.arrayBuffer());
        // หานามสกุล
        const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
        const filename = `${randomUUID()}.${ext}`;
        const filePath = path.join(uploadDir, filename);

        // เขียนไฟล์ขึ้นไป
        await writeFile(filePath, buffer);

        // ส่งกลับเป็น URL GET route
        paths.push(`/api/upload/${filename}`);
      }
    }

    return NextResponse.json({ paths }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('❌ POST /api/upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
