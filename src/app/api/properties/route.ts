// src/app/api/properties/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const properties = await prisma.property.findMany();
    // images ถูกเก็บเป็น Json ใน DB อยู่แล้ว จึงไม่ต้อง parse อีก
    return NextResponse.json(properties);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('GET /api/properties error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // สมมติ body.images เป็น string[]
    const newProperty = await prisma.property.create({
      data: {
        ...body,
        // ถ้า fields อื่นต้องแปลง type ก็ทำตรงนี้
        estimatedPrice: body.estimatedPrice
          ? Number(body.estimatedPrice)
          : undefined,
        approvedPrice: body.approvedPrice
          ? Number(body.approvedPrice)
          : undefined,
      },
    });
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('POST /api/properties error:', message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
