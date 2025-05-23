// src/app/api/upload/route.ts

export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    const uploadDir = path.join('/tmp', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedPaths: string[] = [];
    for (const file of files) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = (file.name.split('.').pop() ?? 'bin').toLowerCase();
        const fileName = `${randomUUID()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        uploadedPaths.push(`/api/uploads/${fileName}`);
      }
    }

    return NextResponse.json({ paths: uploadedPaths }, { status: 200 });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
        ? error
        : 'Unknown error';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
