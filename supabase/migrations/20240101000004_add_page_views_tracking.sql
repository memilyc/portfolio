-- Migration: Add page view tracking table
-- Purpose: Track visitor sources, referrers, and basic analytics

CREATE TABLE IF NOT EXISTS page_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  path TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  country TEXT,
  city TEXT
);

-- Indexes for efficient querying
CREATE INDEX idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX idx_page_views_referrer ON page_views(referrer);
CREATE INDEX idx_page_views_path ON page_views(path);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (track page views)
CREATE POLICY "Allow public inserts" ON page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read analytics
CREATE POLICY "Allow authenticated reads" ON page_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Optional: Add a view for easy analytics queries
CREATE OR REPLACE VIEW page_views_daily AS
SELECT 
  DATE(created_at) as view_date,
  path,
  referrer,
  COUNT(*) as view_count,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
GROUP BY DATE(created_at), path, referrer;
