-- egg_hunt_sessions: server-side tracking of egg discoveries
-- Each session is created when a hunt starts; eggs are registered as found.
-- submit-egg-hunt reads found_eggs count from here instead of trusting the client.

CREATE TABLE egg_hunt_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash     TEXT NOT NULL,
  found_eggs  TEXT[] NOT NULL DEFAULT '{}',
  completed   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE egg_hunt_sessions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_egg_hunt_sessions_ip ON egg_hunt_sessions (ip_hash, created_at);
