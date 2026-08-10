// supabase/functions/_shared/util.ts
// Shared helpers for edge functions. Bundled into each function at deploy time
// via relative import; the _shared dir is not deployed as its own function.

export const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export const NICKNAME_RE = /^[a-zA-Z0-9 _-]{3,20}$/;

const BLOCKED = /shit|fuck|cunt|dick|bitch|asshole|bastard|whore|slut|nigger|nigga|faggot|retard|pedo|rapist|porn|xxx|sex|dildo|pussy|penis|vagina|cum|orgasm|fetish|nsfw|wank|jizz|cock|twat|wanker|bollocks|masturbat|semen|erection|genital|horny|kys|kill.?yourself|nazi|hitler|racist|bigot/i;

export function isClean(s: string): boolean {
  return !BLOCKED.test(s);
}

export function err(msg: string, status: number) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

/** First IP from x-forwarded-for, falling back to x-real-ip, then "unknown". */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function sha256(msg: string): Promise<string> {
  const buf    = new TextEncoder().encode(msg);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}
