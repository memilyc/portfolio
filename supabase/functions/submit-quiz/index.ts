// supabase/functions/submit-quiz/index.ts
// Deploy: supabase functions deploy submit-quiz
//
// Receives { sessionId, answers: ['a','c',...], nickname, duration }
// Scores server-side, rate-limits, validates nickname, writes leaderboard.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const NICKNAME_RE = /^[a-zA-Z0-9 _-]{3,20}$/;
const RATE_LIMIT  = 20; // submissions per day per IP

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

  const { sessionId, answers, nickname, duration, honeypot } = body;

  // Honeypot check
  if (honeypot) return err("Rejected", 400);

  // Nickname validation
  if (!nickname || !NICKNAME_RE.test(nickname)) {
    return err("Nickname must be 3–20 chars: letters, numbers, spaces, _ or -", 400);
  }
  if (!isClean(nickname)) {
    return err("That nickname isn't allowed. Please choose something appropriate.", 400);
  }

  // Duration sanity check
  if (typeof duration !== "number" || duration < 5 || duration > 3600) {
    return err("Invalid duration", 400);
  }

  // Load session
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("id, question_ids, completed, ip_hash")
    .eq("id", sessionId)
    .single();

  if (!session) return err("Session not found", 404);
  if (session.completed) return err("Session already submitted", 409);

  // Verify the submitting IP owns this session
  const ip     = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = await sha256(ip);
  if (session.ip_hash && session.ip_hash !== ipHash) return err("Session mismatch", 403);

  const questionIds: number[] = session.question_ids;
  if (!Array.isArray(answers) || answers.length !== questionIds.length) {
    return err("Answer count mismatch", 400);
  }

  // Rate limit check (20/day/IP)
  const dayAgo = new Date(Date.now() - 86400000).toISOString();

  const { count: recentCount } = await supabase
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("action", "leaderboard")
    .gte("created_at", dayAgo);

  if ((recentCount ?? 0) >= RATE_LIMIT) {
    return err("Rate limit reached — try again tomorrow", 429);
  }

  // Fetch correct answers for this session's questions
  const { data: questions } = await supabase
    .from("trivia_questions")
    .select("id, question, correct_answer, category, difficulty, option_a, option_b, option_c, option_d")
    .in("id", questionIds);

  if (!questions) return err("Could not verify answers", 500);

  // Build lookup map ordered by session question order
  const answerMap = Object.fromEntries(questions.map(q => [q.id, q.correct_answer]));
  const questionLookup = Object.fromEntries(questions.map(q => [q.id, q]));
  let score = 0;
  const wrong: Array<{ question: string; your_answer: string; correct_answer: string; option_a: string; option_b: string; option_c: string; option_d: string }> = [];
  for (let i = 0; i < questionIds.length; i++) {
    const q = questionLookup[questionIds[i]];
    const userAnswer = answers[i];
    const correct = answerMap[questionIds[i]];
    if (userAnswer === correct) {
      score++;
    } else {
      // Fetch full question details for review
      wrong.push({
        question: q.question,
        your_answer: userAnswer,
        correct_answer: correct,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
      });
    }
  }

  // Determine category label
  const categories = [...new Set(questions.map(q => q.category))];
  const category   = categories.length === 1 ? categories[0] : "mixed";

  // Determine difficulty label
  const difficulties = [...new Set(questions.map(q => q.difficulty))];
  const difficulty   = difficulties.length === 1 ? difficulties[0] : "mixed";

  // Write to leaderboard
  await supabase.from("leaderboard").insert({
    nickname,
    score,
    total_questions: questionIds.length,
    duration_seconds: Math.round(duration),
    category,
    difficulty,
  });

  // Log rate limit entry
  await supabase.from("rate_limits").insert({ ip_hash: ipHash, action: "leaderboard" });

  // Mark session complete
  await supabase.from("quiz_sessions")
    .update({ completed: true, score, answers })
    .eq("id", sessionId);

  return new Response(JSON.stringify({ score, total: questionIds.length, category, difficulty, wrong }), {
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