// src/app/api/properties/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { Property as PrismaProperty } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      ownerName,
      ownerPhone,
      propertyType,
      agentName,
      progressStatus,
      investor,
      estimatedPrice,
      approvedPrice,
      locationLink,
      mapEmbedLink,
      images,    // คาดว่าจะเป็น array
      province,
      status,
    } = body;

    const newProperty = await prisma.property.create({
      data: {
        id,
        ownerName,
        ownerPhone,
        propertyType,
        agentName,
        progressStatus,
        investor,
        estimatedPrice: Number(estimatedPrice),
        approvedPrice: Number(approvedPrice),
        locationLink,
        mapEmbedLink,
        province,
        status,
        images: JSON.stringify(images ?? []),  // เก็บเป็น JSON string เสมอ
      },
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Error saving property';
    console.error('❌ POST /api/properties error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const properties = await prisma.property.findMany();

    const result: Array<Omit<PrismaProperty, 'images'> & { images: unknown[] }> =
      properties.map((p) => {
        let imgs: unknown[] = [];
        try {
          imgs = JSON.parse(p.images);
        } catch {
          // หาก parse ไม่ได้ ให้เป็น empty array
          imgs = [];
        }
        return { ...p, images: imgs };
      });

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Error fetching properties';
    console.error('❌ GET /api/properties error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
