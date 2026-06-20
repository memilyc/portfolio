// supabase/functions/post-guestbook/index.ts
// Deploy: supabase functions deploy post-guestbook

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NICKNAME_RE  = /^[a-zA-Z0-9 _-]{3,20}$/;
const URL_RE       = /https?:\/\//gi;
const SPAM_RE      = /free money|buy crypto|click here|casino|forex|bitcoin investment|make money fast/i;
const RATE_LIMIT   = 5; // posts per hour per IP

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

  const { nickname, message, honeypot } = body;

  // Honeypot
  if (honeypot) return err("Rejected", 400);

  // Nickname
  if (!nickname || !NICKNAME_RE.test(nickname)) {
    return err("Nickname must be 3–20 chars: letters, numbers, spaces, _ or -", 400);
  }
  if (!isClean(nickname)) {
    return err("That nickname isn't allowed. Please choose something appropriate.", 400);
  }

  // Message length
  if (!message || typeof message !== "string") return err("Message required", 400);
  const trimmed = message.trim();
  if (trimmed.length < 2)   return err("Message too short", 400);
  if (trimmed.length > 300) return err("Message too long (max 300 chars)", 400);

  // URL spam
  const urlMatches = trimmed.match(URL_RE) ?? [];
  if (urlMatches.length > 2) return err("Too many links in message", 400);

  // Keyword spam
  if (SPAM_RE.test(trimmed)) return err("Message rejected by spam filter", 400);

  // Profanity check on message too
  if (!isClean(trimmed)) return err("That message isn't allowed. Please keep it appropriate.", 400);

  // Rate limit: 5 posts/hour/IP
  const ip      = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash  = await sha256(ip);
  const hourAgo = new Date(Date.now() - 3600000).toISOString();

  const { count: recentCount } = await supabase
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("action", "guestbook")
    .gte("created_at", hourAgo);

  if ((recentCount ?? 0) >= RATE_LIMIT) {
    return err("Rate limit reached — come back in an hour", 429);
  }

  // Insert
  const { error } = await supabase.from("guestbook").insert({
    nickname: nickname.trim(),
    message:  trimmed,
    ip_hash:  ipHash,
  });

  if (error) return err("Could not save message", 500);

  // Log rate limit
  await supabase.from("rate_limits").insert({ ip_hash: ipHash, action: "guestbook" });

  return new Response(JSON.stringify({ ok: true }), {
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
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
}