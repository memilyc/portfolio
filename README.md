# M. Emily Chang | Portfolio

A sleek, retro-inspired personal portfolio that functions as both a static document and an interactive terminal. Built with vanilla JavaScript, CSS3, HTML5, and Supabase.

## Features

* **Dual View Modes:**
    * **Terminal View:** A fully functional, interactive CLI environment with command history, autocomplete, and fuzzy-matching for commands.
    * **Reader View:** A clean, accessible, and readable layout for users who prefer standard web navigation.
* **Interactive Trivia Quiz:**
    * Difficulty levels: `quiz easy`, `quiz medium`, `quiz hard`
    * Exclusive Emily quiz: `quiz emily`
    * Questions stored in Supabase, server-side scoring via edge functions
* **Leaderboard:** Filter by difficulty or category — `leaderboard easy`, `leaderboard emily`
* **Guestbook:** Sign and read messages — `guestbook` / `guestbook sign`
* **Quote Command:** Random inspirational quotes — `quote`
* **Easter Eggs:** 15+ hidden commands to discover (`resume`, `whyhireme`, `uptime`, `tail -f production.log`, `sudo make me a sandwich`, and more)
* **Command Line Experience:**
    * Supports familiar commands like `help`, `about`, `skills`, `projects`, `contact`, `neofetch`.
    * Fuzzy-matching logic handles typos gracefully.
    * Tab-completion for faster interaction.
* **Themes:** Dark and Light mode support with persistence via `localStorage`.
* **Responsive Design:** Fully fluid layout that adjusts from desktop terminals to mobile device touch targets.
* **Performance:** Zero frontend dependencies (Supabase JS client loaded via CDN), lightning-fast loading, no build process required.

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

| Command | Description |
| :--- | :--- |
| `help` | Displays all available commands. |
| `about` | Shows your professional summary. |
| `skills` | Lists your technical stack and expertise. |
| `projects` | Displays your portfolio highlights. |
| `strengths` | Shows your CliftonStrengths. |
| `contact` | Lists your contact methods and links. |
| `cv` | Triggers a download/view of your CV. |
| `quiz` | Start a trivia quiz (mixed difficulty). |
| `quiz easy` / `medium` / `hard` | Start a quiz at a specific difficulty. |
| `quiz emily` | Exclusive Emily personal lore quiz. |
| `leaderboard` | View top quiz scores. |
| `leaderboard easy` / `emily` | Filter leaderboard by difficulty or category. |
| `guestbook` | Read recent guestbook entries. |
| `guestbook sign` | Sign the guestbook. |
| `quote` | Show a random inspirational quote. |
| `neofetch` | System info in ASCII art. |
| `credits` | Show who built this. |
| `theme` | Toggles between Dark and Light mode. |
| `clear` | Clears the terminal screen. |

Plus 15+ hidden easter egg commands — try typing Linux commands 😉

## Usage

Simply host the `index.html` file on any static web host. No build step required.

---

*This portfolio was designed and built by **Emily** with help from **Claude**, **ChatGPT**, and **Qoder**.*
