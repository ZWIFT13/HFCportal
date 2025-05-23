import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("images") as File[];

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true }); // ✅ สร้างโฟลเดอร์ถ้ายังไม่มี
  }

  const uploadedPaths: string[] = [];

  for (const file of files) {
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();
      const fileName = `${randomUUID()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      uploadedPaths.push(`/uploads/${fileName}`);
    }
  }

  return NextResponse.json({ paths: uploadedPaths }); // ✅ ต้อง return JSON เสมอ
}
