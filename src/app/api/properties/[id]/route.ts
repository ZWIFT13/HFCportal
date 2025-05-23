// src/app/api/properties/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await prisma.property.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
