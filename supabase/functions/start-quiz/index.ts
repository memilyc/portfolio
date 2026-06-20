// supabase/functions/start-quiz/index.ts
// Deploy: supabase functions deploy start-quiz
//
// Creates a quiz session. The browser never sees correct answers.
// Accepts optional ?category=postgresql&difficulty=easy

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

  const url        = new URL(req.url);
  const category   = url.searchParams.get("category") || null;
  const difficulty = url.searchParams.get("difficulty") || null;
  const count      = 10;

  // Fetch questions (only published; strip correct_answer before sending to client)
  let query = supabase
    .from("trivia_questions")
    .select("id, question, option_a, option_b, option_c, option_d, category, difficulty")
    .eq("status", "published")
    .limit(count * 4); // fetch extra so we can randomise

  if (category)   query = query.eq("category", category);
  if (difficulty)  query = query.eq("difficulty", difficulty);

  const { data: rows, error } = await query;
  if (error || !rows?.length) {
    return new Response(JSON.stringify({ error: "Could not load questions" }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Shuffle and take `count`
  const shuffled = rows.sort(() => Math.random() - 0.5).slice(0, count);
  const ids      = shuffled.map((q) => q.id);

  // Get raw IP and hash it
  const ip     = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = await sha256(ip);

  // Create session
  const { data: session, error: sessErr } = await supabase
    .from("quiz_sessions")
    .insert({ question_ids: ids, ip_hash: ipHash })
    .select("id")
    .single();

  if (sessErr) {
    return new Response(JSON.stringify({ error: "Session error" }), {
      status: 500, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ sessionId: session.id, questions: shuffled, category, difficulty }),
    { headers: { ...CORS, "Content-Type": "application/json" } },
  );
});

async function sha256(msg: string): Promise<string> {
  const buf    = new TextEncoder().encode(msg);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
}