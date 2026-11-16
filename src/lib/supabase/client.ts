import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

/** Browser client. Only used where the browser must talk to Supabase directly (file uploads). */
export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseKey);
}
