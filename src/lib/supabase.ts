// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// —————————————————————————————————————————————————————————————
// 1) Supabase client สำหรับเรียกจากฝั่ง Browser / React (public)
// —————————————————————————————————————————————————————————————
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// —————————————————————————————————————————————————————————————
// 2) Supabase admin client สำหรับเรียกจากฝั่ง Server (service role)
// —————————————————————————————————————————————————————————————
// (ใส่ตัวแปรนี้ใน ENV: SUPABASE_SERVICE_ROLE_KEY)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
