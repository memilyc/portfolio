# M. Emily Chang | Portfolio

A sleek, retro-inspired personal portfolio that functions as both a static document and an interactive terminal. Built with vanilla JavaScript, CSS3, HTML5, and Supabase.

## Features

* **Dual View Modes:**
    * **Terminal View:** A fully functional, interactive CLI environment with command history, autocomplete, and fuzzy-matching for commands.
    * **Reader View:** A clean, accessible, and readable layout for users who prefer standard web navigation.
* **macOS Window Controls:** Functional traffic light buttons (🔴 close, 🟡 minimize, 🟢 maximize) with smooth animations, keyboard shortcuts (Esc, ⌘+M, ⌘+F), and state persistence via localStorage.
* **Interactive Trivia Quiz:**
    * Select difficulty interactively or specify: `quiz easy`, `quiz medium`, `quiz hard`, `quiz emily`
    * Questions stored in Supabase, server-side scoring via edge functions
    * Post-quiz review of incorrect answers
* **Leaderboard:** Filter by difficulty or category — `leaderboard easy`, `leaderboard emily`
* **Guestbook:** Sign and read messages — `guestbook` / `guestbook sign` (with profanity filtering and link sanitization)
* **Testimonials:** LinkedIn recommendations displayed with progressive expansion — `testimonials`, `testimonials all`
* **Quote Command:** Random inspirational quotes with options — `quote -n 5`, `quote --all`
* **Dad Jokes:** Terrible jokes with options — `dadjoke -n 3`, `dadjoke --all`
* **Linux Commands:** Authentic terminal experience with `ls`, `pwd`, `whoami`, `id`, `uname`, `cat`, `tree`, `man`, and more
* **Command History:** Arrow keys to cycle through history, `!!` to repeat last command, `history` to view
* **Easter Eggs:** 20+ hidden commands to discover (`resume`, `whyhireme`, `uptime`, `tail -f production.log`, `sudo make me a sandwich`, `salary`, and more)
* **Themes:** Dark and Light mode support with persistence via `localStorage`.
* **Responsive Design:** Fully fluid layout that adjusts from desktop terminals to mobile device touch targets.
* **Performance:** Zero frontend dependencies (Supabase JS client loaded via CDN), lightning-fast loading, no build process required.
* **Analytics:** Built-in privacy-friendly visitor tracking with referrer analysis (no cookies, no third-party services).

## Tech Stack

* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
* **Backend:** Supabase (PostgreSQL, Edge Functions, RLS)
* **Styling:** CSS Variables for easy theme management and modular component design
* **Deployment:** Static site hosting friendly (GitHub Pages, GitLab Pages, Netlify, etc.)

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Apply the migrations in `supabase/migrations/` in order:
   - `20240101000000_init.sql` — schema (tables, RLS, indexes)
   - `20240101000001_seed_questions.sql` — 30 trivia questions
   - `20240101000002_add_difficulty.sql` — difficulty column on leaderboard
3. Deploy edge functions:
   ```bash
   supabase functions deploy start-quiz --no-verify-jwt
   supabase functions deploy submit-quiz --no-verify-jwt
   supabase functions deploy post-guestbook --no-verify-jwt
   ```
4. Set your Supabase anon key in `CONFIG.supabase.anonKey` inside `index.html`
5. Deploy the page view tracker:
   ```bash
   supabase functions deploy track-page-view --no-verify-jwt
   ```

## Analytics & Visitor Tracking

This portfolio includes a lightweight, privacy-friendly analytics system powered by Supabase Edge Functions. It tracks where your visitors come from without cookies or third-party services.

### What Gets Tracked

- **Referrer URL**: Where visitors clicked from (LinkedIn, Twitter, Google, etc.)
- **Page Path**: Which section they viewed
- **Geolocation**: Country/city (if available from CDN headers)
- **User Agent**: Browser/device information
- **Unique Visitors**: Anonymized via SHA-256 IP hashing

### Query Your Analytics

Go to [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard/project/ugowiqdbpjyaqvtcucqh/sql) and run these queries:

#### Top Referrer Sources

```sql
-- See where your visitors are coming from
SELECT 
  referrer,
  COUNT(*) as visits,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
WHERE referrer IS NOT NULL AND referrer != ''
GROUP BY referrer
ORDER BY visits DESC
LIMIT 20;
```

#### Traffic by Platform

```sql
-- Group referrers by platform (LinkedIn, Twitter, Google, etc.)
SELECT 
  CASE 
    WHEN referrer LIKE '%linkedin.com%' THEN 'LinkedIn'
    WHEN referrer LIKE '%twitter.com%' OR referrer LIKE '%x.com%' THEN 'Twitter/X'
    WHEN referrer LIKE '%google.%' THEN 'Google'
    WHEN referrer LIKE '%github.com%' THEN 'GitHub'
    WHEN referrer LIKE '%reddit.com%' THEN 'Reddit'
    WHEN referrer LIKE '%facebook.com%' THEN 'Facebook'
    WHEN referrer IS NULL OR referrer = '' THEN 'Direct (typed URL)'
    ELSE 'Other: ' || SPLIT_PART(SPLIT_PART(referrer, '://', 2), '/', 1)
  END as source,
  COUNT(*) as total_visits,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
GROUP BY source
ORDER BY total_visits DESC;
```

#### Daily Traffic Overview

```sql
-- Daily page views and unique visitors
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_views,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### LinkedIn Traffic Breakdown

```sql
-- See which LinkedIn pages are sending traffic
SELECT 
  referrer,
  COUNT(*) as clicks
FROM page_views
WHERE referrer LIKE '%linkedin.com%'
GROUP BY referrer
ORDER BY clicks DESC;
```

#### Geographic Distribution

```sql
-- Visitors by country
SELECT 
  country,
  COUNT(*) as visits,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
WHERE country IS NOT NULL
GROUP BY country
ORDER BY visits DESC;
```

### Supabase Free Tier Limits

Your analytics are well within the free tier:

- ✅ **500,000 Edge Function invocations/month** (all functions combined)
- ✅ **Typical usage**: 100-1,000 visitors/month = ~1,400 calls (< 0.3% of limit)
- ✅ **Cost**: $0 (even at 100K visitors/month, you'd only use 28% of free tier)
- ✅ **After free tier**: $2 per 1 Million additional invocations

### Privacy Features & Legal Compliance

This analytics implementation is designed to comply with GDPR, CCPA, and other privacy regulations:

- ✅ **No cookies required** - Uses localStorage only for opt-out preference
- ✅ **No personal data collected** - Only technical metadata (referrer, path, user agent)
- ✅ **IP addresses are hashed** - SHA-256 hashed and truncated to 16 chars (not reversible)
- ✅ **User opt-out mechanism** - One-click disable button in the footer
- ✅ **Privacy notice displayed** - Footer informs users about analytics
- ✅ **No third-party data sharing** - Data stays in your Supabase project
- ✅ **Fire-and-forget tracking** - Doesn't block page load or affect UX
- ✅ **Row Level Security** - Public can only insert, not read analytics data

**Users can opt out by:**
1. Scrolling to the footer in reader view
2. Clicking "Disable analytics tracking" button
3. Preference is saved in localStorage and respected on all future visits

**What tracked data looks like:**
```
path: "/#projects"
referrer: "https://www.linkedin.com/feed/"
ip_hash: "a3f8c92d1e5b7f4a"  (hashed, not real IP)
user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X...)"
country: "US"
```

**What is NOT tracked:**
- ❌ Names or email addresses
- ❌ Cookies or session identifiers
- ❌ Mouse movements or clicks
- ❌ Time spent on page
- ❌ Scroll behavior
- ❌ Screen recordings

## Customization

Everything is configured via a single `CONFIG` object inside the `script` tag.

1. Open the `index.html` file.
2. Locate the `const CONFIG = { ... }` block.
3. Update the fields:
    * **`name`, `role`, `tagline`**: Your professional header info.
    * **`about`**: An array of strings representing your bio paragraphs.
    * **`skills`**: A nested array of `[Category, Description]` pairs.
    * **`projects`**: An array of objects with `title`, `stack`, `desc`, and `url`.
    * **`contact`**: Links for email, LinkedIn, GitHub, etc.
    * **`supabase`**: Your Supabase URL and anon key.

## Commands Reference

Once in the Terminal View, users can type the following:

### Core Commands

| Command | Description |
| :--- | :--- |
| `help` | Displays all available commands. |
| `about` | Shows your professional summary. |
| `skills` | Lists your technical stack and expertise. |
| `projects` | Displays your portfolio highlights. |
| `strengths` | Shows your CliftonStrengths. |
| `testimonials` | View colleague recommendations (shows 2, expand with `testimonials all`). |
| `contact` | Lists your contact methods and links. |
| `cv` | Opens your CV in a new tab. |
| `neofetch` | System info in ASCII art. |
| `credits` | Show who built this. |
| `theme` | Toggles between Dark and Light mode. |
| `clear` | Clears the terminal screen. |

### Interactive Features

| Command | Description |
| :--- | :--- |
| `quiz` | Start a trivia quiz (interactive difficulty selection). |
| `leaderboard` | View top quiz scores (filter: `leaderboard easy`, `leaderboard emily`). |
| `guestbook` | Read recent guestbook entries. |
| `guestbook sign` | Sign the guestbook. |
| `quote` | Show a random inspirational quote. |
| `quote -n 5` | Show 5 random quotes. |
| `quote --all` | Show all quotes. |
| `quote -h` | Show quote command help. |
| `dadjoke` | Tell a terrible dad joke. |
| `dadjoke -n 3` | Tell 3 jokes. |
| `dadjoke --all` | Tell all jokes. |
| `dadjoke -h` | Show dadjoke command help. |
| `testimonials` | View colleague recommendations. |
| `testimonials all` | Show all testimonials. |
| `testimonials <number>` | Read specific testimonial. |

### Linux Commands

| Command | Description |
| :--- | :--- |
| `pwd` | Print working directory (`/home/emily/portfolio`). |
| `ls` | List portfolio contents. |
| `ls -a` | Show hidden files (`.config`, `.secrets`). |
| `ls -l` | Long format with permissions. |
| `ls -alh` | Human-readable sizes with all files. |
| `whoami` | Display current user. |
| `whoami -v` | Verbose mode with title. |
| `id` | Show user ID and groups. |
| `uname -a` | System information. |
| `cat <file>` | Read file contents (`about.md`, `contact.txt`). |
| `tree` | Display directory structure. |
| `man <cmd>` | Show manual page (`man quote`, `man ls`). |

### Command History

| Command | Description |
| :--- | :--- |
| `history` | View last 20 commands. |
| `!!` | Repeat last command. |
| `↑` / `↓` | Arrow keys to cycle through history. |

### Hidden Easter Eggs

Plus 20+ hidden commands — try typing Linux commands like `uptime`, `tail -f production.log`, `sudo make me a sandwich`, `salary`, `top`, `free -m`, `htop`, and more!

## Usage

Simply host the `index.html` file on any static web host. No build step required.

---

*This portfolio was designed and built by **Emily** with help from **Claude**, **ChatGPT**, and **Qoder**.*
