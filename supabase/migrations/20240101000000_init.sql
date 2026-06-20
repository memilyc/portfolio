-- Portfolio: Trivia, Guestbook, Leaderboard schema
-- Run: supabase db push   OR   paste into SQL Editor

-- ── trivia_questions ──────────────────────────────────────
CREATE TABLE trivia_questions (
  id              SERIAL PRIMARY KEY,
  question        TEXT NOT NULL,
  option_a        TEXT NOT NULL,
  option_b        TEXT NOT NULL,
  option_c        TEXT NOT NULL,
  option_d        TEXT NOT NULL,
  correct_answer  CHAR(1) NOT NULL CHECK (correct_answer IN ('a','b','c','d')),
  category        TEXT NOT NULL DEFAULT 'mixed',
  difficulty      TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard'))
);

-- ── quiz_sessions ─────────────────────────────────────────
CREATE TABLE quiz_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_ids   INTEGER[] NOT NULL,
  ip_hash        TEXT,
  completed      BOOLEAN DEFAULT FALSE,
  score          INTEGER,
  answers        TEXT[],
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ── leaderboard ───────────────────────────────────────────
CREATE TABLE leaderboard (
  id                SERIAL PRIMARY KEY,
  nickname          TEXT NOT NULL,
  score             INTEGER NOT NULL,
  total_questions   INTEGER NOT NULL,
  duration_seconds  INTEGER NOT NULL,
  category          TEXT NOT NULL DEFAULT 'mixed',
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ── guestbook ─────────────────────────────────────────────
CREATE TABLE guestbook (
  id          SERIAL PRIMARY KEY,
  nickname    TEXT NOT NULL,
  message     TEXT NOT NULL,
  ip_hash     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── rate_limits ───────────────────────────────────────────
CREATE TABLE rate_limits (
  id          SERIAL PRIMARY KEY,
  ip_hash     TEXT NOT NULL,
  action      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX idx_rate_limits_lookup    ON rate_limits (ip_hash, action, created_at);
CREATE INDEX idx_leaderboard_ranking   ON leaderboard (score DESC, duration_seconds ASC);
CREATE INDEX idx_guestbook_recent      ON guestbook  (created_at DESC);

-- ── RLS: enable ───────────────────────────────────────────
ALTER TABLE trivia_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard      ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook        ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits      ENABLE ROW LEVEL SECURITY;

-- ── RLS: trivia_questions — public can read (correct_answer excluded by edge fn) ──
CREATE POLICY "trivia_questions_select"
  ON trivia_questions FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── RLS: leaderboard — public read, service-role insert ──
CREATE POLICY "leaderboard_select"
  ON leaderboard FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── RLS: guestbook — public read, service-role insert ──
CREATE POLICY "guestbook_select"
  ON guestbook FOR SELECT
  TO anon, authenticated
  USING (true);

-- ── RLS: quiz_sessions + rate_limits — service-role only (no anon policy) ──
