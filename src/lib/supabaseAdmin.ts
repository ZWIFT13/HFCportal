// src/lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

// ฝั่ง server (admin) ใช้ service role key
const supabaseServiceUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing env: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
  );
}

export const supabaseAdmin = createClient(
  supabaseServiceUrl,
  supabaseServiceKey
);
