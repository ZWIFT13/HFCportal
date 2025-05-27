// src/app/api/properties/[id]/route.ts
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(request: Request) {
  // ดึง id จาก URL path แทนการใช้ second-argument context
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const id = segments[segments.length - 1];

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  // ลบรายการพร้อม cascading ลบ images อัตโนมัติ (ถ้า ON DELETE CASCADE ตั้งไว้)
  const { data: deleted, error } = await supabaseAdmin
    .from("properties")
    .delete()
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("DELETE /api/properties/[id] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, deleted }, { status: 200 });
}
