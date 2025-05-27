-- scripts/init_db.sql

-- 1) เปิดใช้ pgcrypto สำหรับ gen_random_uuid()
create extension if not exists "pgcrypto";

-- 2) สร้างตาราง properties
create table public.properties (
  id             uuid        primary key default gen_random_uuid(),
  owner_name     text        not null,
  owner_phone    text        not null,
  property_type  text,
  agent_name     text,
  status         text,
  investor       text,
  estimated_price integer,
  approved_price  integer,
  location_link   text,
  map_embed_link  text,
  province        text,
  created_at     timestamptz not null default now()
);

-- 3) สร้างตาราง images
create table public.images (
  id          uuid        primary key default gen_random_uuid(),
  url         text        not null,
  alt_text    text,
  property_id uuid        not null references public.properties(id) on delete cascade,
  uploaded_at timestamptz not null default now()
);

-- 4) เปิด RLS
alter table public.properties enable row level security;
alter table public.images     enable row level security;

-- 5) Policy ให้ anon อ่าน/เขียนได้ (ปรับเงื่อนไขตามต้องการ)
create policy "anon select properties" on public.properties for select to anon using (true);
create policy "anon insert properties" on public.properties for insert to anon with check (true);
create policy "anon select images"     on public.images     for select to anon using (true);
create policy "anon insert images"     on public.images     for insert to anon with check (true);
