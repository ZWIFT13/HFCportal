// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Public (client-side) keys – ต้องมี NEXT_PUBLIC_ prefix
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Admin (server-side) keys
const supabaseServiceUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ถ้า env ตัวไหนหาย ให้เด้ง error ตอนเริ่มต้นเลย
if (!supabaseUrl || !supabaseAnonKey) {
  console.error({ supabaseUrl, supabaseAnonKey });
  throw new Error(
    'Missing env for Supabase client – ตรวจสอบ NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}
if (!supabaseServiceUrl || !supabaseServiceKey) {
  console.error({ supabaseServiceUrl, supabaseServiceKey });
  throw new Error(
    'Missing env for Supabase admin – ตรวจสอบ SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY'
  );
}

// สร้าง client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseServiceUrl, supabaseServiceKey);
