// supabase/functions/register-egg/index.ts
// Deploy: supabase functions deploy register-egg
//
// Records that a specific egg was found in a hunt session.
// Verifies the session belongs to the calling IP before updating.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

  const ip     = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = await sha256(ip);

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
    return new Response(JSON.stringify({ ok: true, found: session.found_eggs.length }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const newEggs = [...session.found_eggs, egg];
  await supabase
    .from("egg_hunt_sessions")
    .update({ found_eggs: newEggs })
    .eq("id", sessionId);

  return new Response(JSON.stringify({ ok: true, found: newEggs.length }), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});

function err(msg: string, status: number) {
  return new Response(JSON.stringify({ error: msg }), {
    status, headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
  });
}

async function sha256(msg: string): Promise<string> {
  const buf    = new TextEncoder().encode(msg);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}
