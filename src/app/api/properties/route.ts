// src/app/api/properties/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Payload shape coming from client (camelCase)
 */
interface CreatePropertyDTO {
  id?: string;
  ownerName: string;
  ownerPhone: string;
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

/**
 * The row shape as stored in Postgres (snake_case + images.url)
 */
type DBProperty = {
  id: string;
  owner_name: string;
  owner_phone: string;
  property_type: string | null;
  agent_name: string | null;
  status: string | null;
  investor: string | null;
  estimated_price: number | null;
  approved_price: number | null;
  location_link: string | null;
  map_embed_link: string | null;
  province: string | null;
  created_at: string;
  images: { url: string }[];
};

/**
 * Shape we return to the frontend (camelCase + images URL array)
 */
type Property = {
  id: string;
  ownerName: string;
  ownerPhone: string;
  propertyType?: string;
  agentName?: string;
  status?: string;
  investor?: string;
  estimatedPrice?: number;
  approvedPrice?: number;
  locationLink?: string;
  mapEmbedLink?: string;
  province?: string;
  createdAt: string;
  images: string[];
};

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('properties')
    .select('*, images(url)');

  if (error) {
    console.error('GET /api/properties error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const props: Property[] = (data as DBProperty[]).map(p => ({
    id: p.id,
    ownerName: p.owner_name,
    ownerPhone: p.owner_phone,
    propertyType: p.property_type ?? undefined,
    agentName: p.agent_name ?? undefined,
    status: p.status ?? undefined,
    investor: p.investor ?? undefined,
    estimatedPrice: p.estimated_price ?? undefined,
    approvedPrice: p.approved_price ?? undefined,
    locationLink: p.location_link ?? undefined,
    mapEmbedLink: p.map_embed_link ?? undefined,
    province: p.province ?? undefined,
    createdAt: p.created_at,
    images: p.images.map(i => i.url),
  }));

  return NextResponse.json(props);
}

export async function POST(request: Request) {
  const dto = (await request.json()) as CreatePropertyDTO;

  // build a typed snake_case payload for insertion
  const dbPayload: {
    id?: string;
    owner_name: string;
    owner_phone: string;
    property_type: string | null;
    agent_name: string | null;
    status: string | null;
    investor: string | null;
    estimated_price: number | null;
    approved_price: number | null;
    location_link: string | null;
    map_embed_link: string | null;
    province: string | null;
  } = {
    // only include id if user provided one
    ...(dto.id ? { id: dto.id } : {}),
    owner_name: dto.ownerName,
    owner_phone: dto.ownerPhone,
    property_type: dto.propertyType ?? null,
    agent_name: dto.agentName ?? null,
    status: dto.status ?? null,
    investor: dto.investor ?? null,
    estimated_price: dto.estimatedPrice ?? null,
    approved_price: dto.approvedPrice ?? null,
    location_link: dto.locationLink ?? null,
    map_embed_link: dto.mapEmbedLink ?? null,
    province: dto.province ?? null,
  };

  try {
    // 1) insert property (id will default to gen_random_uuid()::text if omitted)
    const { data: prop, error: propError } = await supabaseAdmin
      .from('properties')
      .insert([dbPayload])
      .select('id')
      .single();

    if (propError || !prop) {
      const msg = propError?.message ?? 'Failed to create property';
      console.error('POST /api/properties insert error:', msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const propertyId = prop.id;

    // 2) insert images if provided
    const images = Array.isArray(dto.images) ? dto.images : [];
    if (images.length > 0) {
      const imagesData = images.map(url => ({
        url,
        property_id: propertyId,
      }));
      const { error: imgError } = await supabaseAdmin
        .from('images')
        .insert(imagesData);

      if (imgError) {
        console.error('POST /api/properties insert images error:', imgError.message);
        return NextResponse.json({ error: imgError.message }, { status: 500 });
      }
    }

    // 3) fetch newly created record with images
    const { data: newItemData, error: fetchError } = await supabaseAdmin
      .from('properties')
      .select('*, images(url)')
      .eq('id', propertyId)
      .single();

    if (fetchError || !newItemData) {
      const msg = fetchError?.message ?? 'Failed to fetch property';
      console.error('POST /api/properties fetch error:', msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const dbRow = newItemData as DBProperty;
    const result: Property = {
      id: dbRow.id,
      ownerName: dbRow.owner_name,
      ownerPhone: dbRow.owner_phone,
      propertyType: dbRow.property_type ?? undefined,
      agentName: dbRow.agent_name ?? undefined,
      status: dbRow.status ?? undefined,
      investor: dbRow.investor ?? undefined,
      estimatedPrice: dbRow.estimated_price ?? undefined,
      approvedPrice: dbRow.approved_price ?? undefined,
      locationLink: dbRow.location_link ?? undefined,
      mapEmbedLink: dbRow.map_embed_link ?? undefined,
      province: dbRow.province ?? undefined,
      createdAt: dbRow.created_at,
      images: dbRow.images.map(i => i.url),
    };

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('POST /api/properties unexpected error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}