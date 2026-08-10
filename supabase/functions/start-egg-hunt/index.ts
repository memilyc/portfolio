// supabase/functions/start-egg-hunt/index.ts
// Deploy: supabase functions deploy start-egg-hunt
//
// Creates a server-side egg hunt session and returns the session ID.
// The client must use this ID when registering eggs and submitting results.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS, err, json, clientIp, sha256 } from "../_shared/util.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const ipHash = await sha256(clientIp(req));

  const { data: session, error } = await supabase
    .from("egg_hunt_sessions")
    .insert({ ip_hash: ipHash })
    .select("id")
    .single();

  if (error || !session) return err("Could not create session", 500);

  return json({ sessionId: session.id });
});
