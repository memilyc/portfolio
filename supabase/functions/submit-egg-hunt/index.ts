// supabase/functions/submit-egg-hunt/index.ts
// Deploy: supabase functions deploy submit-egg-hunt
//
// Receives { sessionId, nickname, duration }
// Reads server-side found count from egg_hunt_sessions instead of trusting client.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { CORS, NICKNAME_RE, isClean, err, json, clientIp, sha256 } from "../_shared/util.ts";

const RATE_LIMIT = 10; // submissions per day per IP

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid request", 400);

  const { sessionId, nickname, duration, honeypot } = body;

  if (honeypot) return err("Rejected", 400);

  if (!sessionId || typeof sessionId !== "string") return err("Missing sessionId", 400);

  if (!nickname || !NICKNAME_RE.test(nickname)) {
    return err("Nickname must be 3–20 chars: letters, numbers, spaces, _ or -", 400);
  }
  if (!isClean(nickname)) {
    return err("That nickname isn't allowed. Please choose something appropriate.", 400);
  }

  if (typeof duration !== "number" || duration < 10 || duration > 86400) {
    return err("Invalid duration", 400);
  }

  const ipHash = await sha256(clientIp(req));

  // Load and verify session
  const { data: session } = await supabase
    .from("egg_hunt_sessions")
    .select("id, ip_hash, found_eggs, completed")
    .eq("id", sessionId)
    .single();

  if (!session) return err("Session not found", 404);
  if (session.completed) return err("Hunt already submitted", 409);
  if (session.ip_hash !== ipHash) return err("Session mismatch", 403);

  const found = session.found_eggs.length;
  if (found < 1) return err("No eggs registered for this session", 400);

  // Rate limit
  const dayAgo = new Date(Date.now() - 86400000).toISOString();
  const { count: recentCount } = await supabase
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("action", "egg-hunt")
    .gte("created_at", dayAgo);

  if ((recentCount ?? 0) >= RATE_LIMIT) {
    return err("Rate limit reached — try again tomorrow", 429);
  }

  await supabase.from("leaderboard").insert({
    nickname,
    score: found,
    total_questions: 10,
    duration_seconds: Math.round(duration),
    category: "egg-hunt",
    difficulty: "easter",
  });

  await supabase.from("rate_limits").insert({ ip_hash: ipHash, action: "egg-hunt" });
  await supabase.from("egg_hunt_sessions").update({ completed: true }).eq("id", sessionId);

  return json({ success: true, found });
});
