// supabase/functions/register-egg/index.ts
// Deploy: supabase functions deploy register-egg
//
// Records that a specific egg was found in a hunt session.
// Verifies the session belongs to the calling IP before updating.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS, err, json, clientIp, sha256 } from "../_shared/util.ts";

const VALID_EGGS = new Set([
  "tail -f", "systemctl status emily", "git blame", "sudo",
  "cat /etc/motd", "ps aux", "find", "rm -rf", "recruiter-mode",
  "references", "salary", "whyhireme", "uptime", "pipeline",
  "journalctl", "top", "free -m", "htop", "easter-egg", "fs-egg",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid request", 400);

  const { sessionId, egg } = body;

  if (!sessionId || typeof sessionId !== "string") return err("Missing sessionId", 400);
  if (!egg || !VALID_EGGS.has(egg)) return err("Invalid egg", 400);

  const ipHash = await sha256(clientIp(req));

  const { data: session } = await supabase
    .from("egg_hunt_sessions")
    .select("id, ip_hash, found_eggs, completed")
    .eq("id", sessionId)
    .single();

  if (!session) return err("Session not found", 404);
  if (session.completed) return err("Hunt already submitted", 409);
  if (session.ip_hash !== ipHash) return err("Session mismatch", 403);

  // Idempotent: only add if not already recorded
  if (session.found_eggs.includes(egg)) {
    return json({ ok: true, found: session.found_eggs.length });
  }

  const newEggs = [...session.found_eggs, egg];
  await supabase
    .from("egg_hunt_sessions")
    .update({ found_eggs: newEggs })
    .eq("id", sessionId);

  return json({ ok: true, found: newEggs.length });
});
