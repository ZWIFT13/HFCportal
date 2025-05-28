// src/app/api/properties/[id]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface UpdatePropertyDTO {
  ownerName?: string;
  ownerPhone?: string;
  propertyType?: string;
  agentName?: string;
  status?: string;
  investor?: string;
  estimatedPrice?: number;
  approvedPrice?: number;
  locationLink?: string;
  mapEmbedLink?: string;
  province?: string;
  images?: string[];
}

// GET single property
export async function GET(
  req: NextRequest,
  context: any // <-- ต้องเป็น any! (หรือไม่ต้องใส่ type)
) {
  const id = context.params.id;
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*, images(url)')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE property
export async function DELETE(
  req: NextRequest,
  context: any
) {
  const id = context.params.id;
  const { error } = await supabaseAdmin
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

// PATCH update property
export async function PATCH(
  req: NextRequest,
  context: any
) {
  const id = context.params.id;
  const dto = (await req.json()) as UpdatePropertyDTO;

  const dbPayload: Partial<Record<string, unknown>> = {};
  if (dto.ownerName  !== undefined) dbPayload.owner_name = dto.ownerName;
  if (dto.ownerPhone !== undefined) dbPayload.owner_phone = dto.ownerPhone;
  if (dto.propertyType !== undefined) dbPayload.property_type = dto.propertyType;
  if (dto.agentName  !== undefined) dbPayload.agent_name = dto.agentName;
  if (dto.status     !== undefined) dbPayload.status     = dto.status;
  if (dto.investor   !== undefined) dbPayload.investor   = dto.investor;
  if (dto.estimatedPrice !== undefined) dbPayload.estimated_price = dto.estimatedPrice;
  if (dto.approvedPrice  !== undefined) dbPayload.approved_price  = dto.approvedPrice;
  if (dto.locationLink   !== undefined) dbPayload.location_link   = dto.locationLink;
  if (dto.mapEmbedLink   !== undefined) dbPayload.map_embed_link   = dto.mapEmbedLink;
  if (dto.province       !== undefined) dbPayload.province         = dto.province;

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('properties')
    .update(dbPayload)
    .eq('id', id)
    .select('*, images(url)')
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: updateError?.message ?? 'Update failed' }, { status: 500 });
  }

  // ถ้ามี images, ลบของเดิมแล้วเพิ่มใหม่
  if (Array.isArray(dto.images)) {
    await supabaseAdmin.from('images').delete().eq('property_id', id);
    await supabaseAdmin.from('images').insert(
      dto.images.map((url) => ({ url, property_id: id }))
    );
  }

  return NextResponse.json(updated);
}
