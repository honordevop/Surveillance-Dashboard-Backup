// lib/supabase-server.js
import { createClient } from "@supabase/supabase-js";

export const OPERATIONS_BUCKET = process.env.OPERATIONS_IMAGES_BUCKET || 'operationImages';
// console.log(process.env.OPERATIONS_IMAGES_BUCKET)
// console.log(process.env.SUPABASE_SERVICE_ROLE_KEY)
export function createSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error("Missing Supabase server env vars");
  }
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
