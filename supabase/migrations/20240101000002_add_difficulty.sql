-- Add difficulty column to leaderboard
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS difficulty TEXT NOT NULL DEFAULT 'mixed';

-- Add index for filtering by difficulty
CREATE INDEX IF NOT EXISTS idx_leaderboard_difficulty ON leaderboard (difficulty, score DESC, duration_seconds ASC);
