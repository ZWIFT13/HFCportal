// src/app/api/properties/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
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
    images, // เป็น array
  } = body;

  try {
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
        images: JSON.stringify(images), // เก็บ JSON string
      },
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "Error saving property" }, { status: 500 });
  }
}

export async function GET() {
  const properties = await prisma.property.findMany();
  return NextResponse.json(
    properties.map((p) => ({ ...p, images: JSON.parse(p.images) }))
  );
}
