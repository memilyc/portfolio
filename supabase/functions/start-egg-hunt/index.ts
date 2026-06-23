// supabase/functions/start-egg-hunt/index.ts
// Deploy: supabase functions deploy start-egg-hunt
//
// Creates a server-side egg hunt session and returns the session ID.
// The client must use this ID when registering eggs and submitting results.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const ip     = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = await sha256(ip);

  const { data: session, error } = await supabase
    .from("egg_hunt_sessions")
    .insert({ ip_hash: ipHash })
    .select("id")
    .single();

  if (error || !session) {
    return new Response(JSON.stringify({ error: "Could not create session" }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ sessionId: session.id }), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});

async function sha256(msg: string): Promise<string> {
  const buf    = new TextEncoder().encode(msg);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}
