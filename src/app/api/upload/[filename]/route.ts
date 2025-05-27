// src/app/api/upload/[filename]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import mime from 'mime-types';

export async function GET(request: Request) {
  // ดึง filename จาก URL path
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  const filename = parts[parts.length - 1];

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  // ดาวน์โหลดไฟล์จาก bucket 'uploads'
  const { data, error } = await supabaseAdmin
    .storage
    .from('uploads')
    .download(filename);

  if (error || !data) {
    console.error('Supabase storage download error:', error?.message);
    return NextResponse.json(
      { error: error?.message || 'File not found' },
      { status: 404 }
    );
  }

  // แปลง ReadableStream → Buffer แล้วส่งกลับ
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = mime.lookup(filename) || 'application/octet-stream';

  return new NextResponse(buffer, {
    headers: { 'Content-Type': contentType }
  });
}
