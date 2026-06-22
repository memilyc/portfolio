// supabase/functions/submit-egg-hunt/index.ts
// Deploy: supabase functions deploy submit-egg-hunt
//
// Receives { nickname, found, duration }
// Validates nickname, rate-limits, writes leaderboard row for egg-hunt category.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NICKNAME_RE = /^[a-zA-Z0-9 _-]{3,20}$/;
const RATE_LIMIT  = 10; // submissions per day per IP (lower than quiz — harder to game)

const BLOCKED = /shit|fuck|cunt|dick|bitch|asshole|bastard|whore|slut|nigger|nigga|faggot|retard|pedo|rapist|porn|xxx|sex|dildo|pussy|penis|vagina|cum|orgasm|fetish|nsfw|wank|jizz|cock|twat|wanker|bollocks|masturbat|semen|erection|genital|horny|kys|kill.?yourself|nazi|hitler|racist|bigot/i;

function isClean(s: string): boolean {
  return !BLOCKED.test(s);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const body = await req.json().catch(() => null);
  if (!body) return err("Invalid request", 400);

  const { nickname, found, duration, honeypot } = body;

  if (honeypot) return err("Rejected", 400);

  if (!nickname || !NICKNAME_RE.test(nickname)) {
    return err("Nickname must be 3–20 chars: letters, numbers, spaces, _ or -", 400);
  }
  if (!isClean(nickname)) {
    return err("That nickname isn't allowed. Please choose something appropriate.", 400);
  }

  if (typeof found !== "number" || found < 1 || found > 10) {
    return err("Invalid found count", 400);
  }
  if (typeof duration !== "number" || duration < 10 || duration > 86400) {
    return err("Invalid duration", 400);
  }

  const ip     = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = await sha256(ip);
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

  return new Response(JSON.stringify({ success: true }), {
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
