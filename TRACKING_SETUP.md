# Supabase Page View Tracker

Lightweight, privacy-friendly analytics for your GitHub Pages portfolio.

## What It Tracks

- **Referrer**: Where visitors come from (Google, LinkedIn, Twitter, etc.)
- **Path**: Which page/section they viewed
- **Geolocation**: Country/city (if available from CDN headers)
- **User Agent**: Browser/device info
- **IP Hash**: Anonymized unique visitor count (SHA-256 hashed)

## Setup Instructions

### 1. Deploy the Database Migration

```bash
# Push the migration to your Supabase project
supabase db push

# OR run the SQL manually in Supabase Dashboard > SQL Editor
# Copy contents of: supabase/migrations/20240101000004_add_page_views_tracking.sql
```

### 2. Deploy the Edge Function

```bash
# Deploy the function
supabase functions deploy track-page-view

# Set required secrets (if not already set)
supabase secrets set SUPABASE_URL=your-project-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Update Your Site

The tracking code is already integrated into `index.html`. Just push your changes to GitHub:

```bash
git add .
git commit -m "Add Supabase page view tracking"
git push origin main
```

## Viewing Your Analytics

### Query Top Referrers

```sql
-- Top referrer sources (last 30 days)
SELECT 
  referrer,
  COUNT(*) as visits,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
WHERE created_at > NOW() - INTERVAL '30 days'
  AND referrer IS NOT NULL
  AND referrer != ''
GROUP BY referrer
ORDER BY visits DESC
LIMIT 20;
```

### Daily Traffic Overview

```sql
-- Daily page views
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_views,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Traffic by Country

```sql
-- Geographic breakdown
SELECT 
  country,
  COUNT(*) as visits,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
WHERE country IS NOT NULL
GROUP BY country
ORDER BY visits DESC;
```

### Popular Landing Pages

```sql
-- Most visited paths
SELECT 
  path,
  COUNT(*) as views,
  COUNT(DISTINCT referrer) as referrer_sources
FROM page_views
GROUP BY path
ORDER BY views DESC
LIMIT 10;
```

### Referrer Categories

```sql
-- Group referrers by source
SELECT 
  CASE 
    WHEN referrer LIKE '%google.com%' THEN 'Google'
    WHEN referrer LIKE '%linkedin.com%' THEN 'LinkedIn'
    WHEN referrer LIKE '%twitter.com%' OR referrer LIKE '%x.com%' THEN 'Twitter/X'
    WHEN referrer LIKE '%github.com%' THEN 'GitHub'
    WHEN referrer LIKE '%reddit.com%' THEN 'Reddit'
    WHEN referrer LIKE '%facebook.com%' THEN 'Facebook'
    WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
    ELSE 'Other'
  END as source,
  COUNT(*) as visits,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY source
ORDER BY visits DESC;
```

## Privacy Features

✅ **IP addresses are hashed** (SHA-256, truncated to 16 chars)  
✅ **No cookies required** - GDPR friendly  
✅ **No personal data stored** - just analytics  
✅ **Row Level Security** - only inserts allowed from anonymous users  
✅ **Fire-and-forget tracking** - doesn't block page load or break if it fails  

## Customization

### Track Additional Events

You can call `trackPageView()` manually for custom events:

```javascript
// Track when someone clicks your resume link
document.querySelector('#resume-link').addEventListener('click', () => {
  trackPageView('/resume-clicked');
});

// Track terminal command usage
function trackCommand(cmd) {
  fetch(`${CONFIG.supabase.url}/functions/v1/track-page-view`, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: `/terminal/${cmd}` })
  });
}
```

### Add UTM Parameter Tracking

Update the `trackPageView()` function to capture UTM params:

```javascript
const params = new URLSearchParams(window.location.search);
const payload = {
  path: window.location.pathname + window.location.hash,
  referrer: document.referrer || null,
  utm_source: params.get('utm_source'),
  utm_medium: params.get('utm_medium'),
  utm_campaign: params.get('utm_campaign')
};
```

Then update the Edge Function to store these fields.

## Troubleshooting

### Function not deploying?
```bash
# Check function logs
supabase functions logs track-page-view

# Redeploy with --no-verify-jwt flag
supabase functions deploy track-page-view --no-verify-jwt
```

### No data appearing?
1. Check browser console for errors
2. Verify Edge Function is deployed: `supabase functions list`
3. Test manually:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/track-page-view \
  -H "Content-Type: application/json" \
  -d '{"path":"/test","referrer":"https://google.com"}'
```

### CORS errors?
The function already includes CORS headers. If you see issues, check:
- Function is deployed correctly
- Supabase project URL is correct in CONFIG

## Cost

✅ **Free tier friendly** - Edge Functions include 500K invocations/month  
✅ **Minimal database storage** - ~500 bytes per page view  
✅ **No third-party services** - everything in your Supabase project  

## Next Steps

- Build a simple dashboard using Supabase Studio
- Set up automated weekly email reports
- Create Grafana dashboard with Supabase as data source
- Add real-time visitor counter to your site
