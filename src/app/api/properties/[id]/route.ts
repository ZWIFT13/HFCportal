// src/app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // ดึง id จาก path URL

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const deleted = await prisma.property.delete({ where: { id } });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
