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
* **Easter Egg Hunt:** Timed hunt for 20+ hidden commands — server-side session tracking prevents score spoofing
* **Leaderboard:** Filter by difficulty or category — `leaderboard easy`, `leaderboard emily`, `leaderboard egg-hunt`
* **Guestbook:** Sign and read messages — `guestbook` / `guestbook sign` (profanity filtering, link redaction, spam protection)
* **Testimonials:** LinkedIn recommendations displayed with progressive expansion — `testimonials`, `testimonials all`
* **Quote Command:** Random inspirational quotes with options — `quote -n 5`, `quote --all`
* **Dad Jokes:** Terrible jokes with options — `dadjoke -n 3`, `dadjoke --all`
* **Linux Commands:** Authentic terminal experience with `ls`, `pwd`, `whoami`, `id`, `uname`, `cat`, `tree`, `man`, and more
* **Command History:** Arrow keys to cycle through history, `!!` to repeat last command, `history` to view
* **Easter Eggs:** 20+ hidden commands to discover (`resume`, `whyhireme`, `uptime`, `tail -f production.log`, `sudo make me a sandwich`, `salary`, and more)
* **Themes:** Dark, Light, and Brown themes — switchable via dot buttons in the title bar, the `theme` terminal command, or the `?theme=brown` URL parameter (useful for CV links).
* **Responsive Design:** Fully fluid layout that adjusts from desktop terminals to mobile device touch targets.
* **Performance:** Zero frontend dependencies (Supabase JS client loaded via CDN), lightning-fast loading, no build process required.
* **Analytics:** Built-in privacy-friendly visitor tracking with referrer analysis (no cookies, no third-party services).

## Tech Stack

* **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
* **Backend:** Supabase (PostgreSQL, Edge Functions, RLS)
* **Styling:** CSS Variables for easy theme management and modular component design
* **Deployment:** Static site hosting friendly (GitHub Pages, Netlify, etc.)

## Project Structure

```
portfolio/
├── index.html              # Entire frontend — single file, no build step
├── assets/
│   ├── em.png              # Avatar / OG image / apple-touch-icon
│   └── em.ico              # Favicon
├── supabase/
│   ├── functions/          # Deno edge functions (deployed to Supabase)
│   │   ├── start-quiz/
│   │   ├── submit-quiz/
│   │   ├── post-guestbook/
│   │   ├── track-page-view/
│   │   ├── start-egg-hunt/
│   │   ├── register-egg/
│   │   └── submit-egg-hunt/
│   └── migrations/         # SQL migrations — apply in order
├── PRIVACY_COMPLIANCE.md
└── README.md
```

## Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Apply the migrations in `supabase/migrations/` in order:
   - `20240101000000_init.sql` — schema (tables, RLS, indexes)
   - `20240101000001_seed_questions.sql` — trivia questions
   - `20240101000002_add_difficulty.sql` — difficulty column on leaderboard
   - `20240101000003_add_question_status.sql` — question status/publishing
   - `20240101000004_add_page_views_tracking.sql` — analytics table
   - `20240101000005_add_egg_hunt_sessions.sql` — server-side egg hunt sessions
3. Deploy all edge functions:
   ```bash
   supabase functions deploy start-quiz --no-verify-jwt
   supabase functions deploy submit-quiz --no-verify-jwt
   supabase functions deploy post-guestbook --no-verify-jwt
   supabase functions deploy track-page-view --no-verify-jwt
   supabase functions deploy start-egg-hunt --no-verify-jwt
   supabase functions deploy register-egg --no-verify-jwt
   supabase functions deploy submit-egg-hunt --no-verify-jwt
   ```
4. Set your Supabase URL and anon key in `CONFIG.supabase` inside `index.html`

## Analytics & Visitor Tracking

This portfolio includes a lightweight, privacy-friendly analytics system powered by Supabase Edge Functions. It tracks where your visitors come from without cookies or third-party services.

### What Gets Tracked

- **Referrer URL**: Where visitors clicked from (LinkedIn, Twitter, Google, etc.)
- **Page Path**: Which section they viewed
- **Geolocation**: Country/city (if available from CDN headers)
- **User Agent**: Browser/device information
- **Unique Visitors**: Anonymized via SHA-256 IP hashing

### Query Your Analytics

Go to your [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard) and run these queries:

#### Top Referrer Sources

```sql
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
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_views,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### Geographic Distribution

```sql
SELECT
  country,
  COUNT(*) as visits,
  COUNT(DISTINCT ip_hash) as unique_visitors
FROM page_views
WHERE country IS NOT NULL
GROUP BY country
ORDER BY visits DESC;
```

### Privacy Features & Legal Compliance

- ✅ **No cookies required** — uses localStorage only for opt-out preference
- ✅ **No personal data collected** — only technical metadata (referrer, path, user agent)
- ✅ **IP addresses are hashed** — SHA-256 hashed, not reversible
- ✅ **User opt-out mechanism** — available in reader view footer
- ✅ **No third-party data sharing** — data stays in your Supabase project
- ✅ **Row Level Security** — public can only insert, not read analytics data

## Security

- **XSS prevention**: all user-supplied and DB-sourced content is HTML-escaped before rendering
- **Session ownership**: quiz sessions are bound to the creating IP hash — can't be hijacked and submitted by another IP
- **Server-side egg hunt scoring**: each egg discovery is registered server-side; the submit endpoint reads the DB count, ignoring any client-supplied value
- **Guestbook**: profanity filter, link redaction, honeypot field, rate limiting (5 posts/hour/IP), SHA-256 IP hashing
- **RLS**: all tables use Row Level Security; edge functions run with the service role key server-side only

## Customization

Everything is configured via a single `CONFIG` object inside the `<script>` tag in `index.html`.

1. Open `index.html`
2. Locate the `const CONFIG = { ... }` block
3. Update the fields:
    * **`name`, `role`, `tagline`**: your professional header info
    * **`about`**: array of strings for your bio paragraphs
    * **`skills`**: nested array of `[Category, Description]` pairs
    * **`projects`**: array of objects with `title`, `stack`, `desc`, and `url`
    * **`contact`**: links for email, LinkedIn, GitHub, etc.
    * **`supabase`**: your Supabase URL and anon key

## Commands Reference

### Core Commands

| Command | Description |
| :--- | :--- |
| `help` | Displays all available commands |
| `about` | Shows your professional summary |
| `skills` | Lists your technical stack and expertise |
| `projects` | Displays your portfolio highlights |
| `strengths` | Shows your CliftonStrengths |
| `testimonials` | View colleague recommendations |
| `contact` | Lists your contact methods and links |
| `cv` | Opens your CV in a new tab |
| `neofetch` | System info in ASCII art |
| `credits` | Show who built this |
| `theme` | Show theme picker (Dark / Light / Brown) |
| `theme dark` / `light` / `brown` | Switch to a specific theme |
| `clear` | Clears the terminal screen |

### Interactive Features

| Command | Description |
| :--- | :--- |
| `quiz` | Start a trivia quiz (interactive difficulty selection) |
| `quiz easy` / `medium` / `hard` / `emily` | Start with a specific difficulty/category |
| `leaderboard` | View top quiz scores |
| `leaderboard easy` / `emily` / `egg-hunt` | Filter leaderboard by category |
| `guestbook` | Read recent guestbook entries |
| `guestbook sign` | Sign the guestbook |
| `egghunt` | Start the timed easter egg hunt |
| `quote` | Show a random inspirational quote |
| `quote -n 5` | Show 5 random quotes |
| `quote --all` | Show all quotes |
| `dadjoke` | Tell a terrible dad joke |
| `dadjoke -n 3` | Tell 3 jokes |
| `dadjoke --all` | Tell all jokes |

### Linux Commands

| Command | Description |
| :--- | :--- |
| `pwd` | Print working directory |
| `ls` / `ls -a` / `ls -l` / `ls -alh` | List directory contents |
| `whoami` / `whoami -v` | Display current user |
| `id` | Show user ID and groups |
| `uname -a` | System information |
| `cat <file>` | Read file contents (`about.md`, `contact.txt`, etc.) |
| `tree` | Display directory structure |
| `man <cmd>` | Show manual page |
| `history` | View last 20 commands |
| `!!` | Repeat last command |
| `↑` / `↓` | Cycle through command history |

### Hidden Easter Eggs

20+ hidden commands — try `uptime`, `tail -f production.log`, `sudo make me a sandwich`, `salary`, `top`, `free -m`, `htop`, and more!

## Usage

Host `index.html` on any static web host. No build step required.

---

*Designed and built by **Emily** with help from **Claude**, **ChatGPT**, and **Qoder**.*
