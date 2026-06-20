-- Add published/draft status to trivia questions
ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft'));

-- Mark all existing questions as published (they're already live)
UPDATE trivia_questions SET status = 'published' WHERE status IS NULL;

-- Add index for the common query pattern
CREATE INDEX IF NOT EXISTS idx_trivia_status ON trivia_questions (status, category, difficulty);
