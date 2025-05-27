// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const files = form.getAll('images') as File[];
    const bucket = 'uploads';
    const folder = 'images';
    const paths: string[] = [];

    for (const file of files) {
      if (file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
      const filename = `${randomUUID()}.${ext}`;
      const filePath = `${folder}/${filename}`;

      // 1) อัปโหลดด้วย service role
      const { error: uploadError } = await supabaseAdmin
        .storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });
      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      // 2) ดึง public URL
      const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (!publicUrl) {
        console.error('Failed to generate public URL for', filePath);
        return NextResponse.json(
          { error: 'Failed to generate public URL' },
          { status: 500 }
        );
      }

      paths.push(publicUrl);
    }

    return NextResponse.json({ paths }, { status: 200 });
  } catch (error: unknown) {
    // Narrow down unknown to a string message without using `any`
    let message: string;
    if (error instanceof Error) {
      message = error.message;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    ) {
      message = (error as { message: string }).message;
    } else {
      message = String(error);
    }

    console.error('POST /api/upload unexpected error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
