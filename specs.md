# Portfolio specification

Current implementation reference for the portfolio in this repository. Update this file when the shipped behavior or architecture changes. For acceptance criteria, see [requirements.md](requirements.md); for change rules, see [steer.md](steer.md).

## Purpose and experience

The site presents M. Emily Chang as a Senior Support Engineer. The default reader view leads with customer and technical impact. An optional terminal view offers commands, a mock filesystem, quiz, easter egg hunt, leaderboard, and guestbook. The featured PostgreSQL performance story and Connection Calculator are the main technical proof point.

## Architecture

- `index.html` contains the HTML, CSS, configuration, reader rendering, terminal behavior, and client-side interactions. There is no frontend build step.
- `assets/` contains the portrait, sharing assets, and downloadable résumé PDF.
- `robots.txt` permits normal crawlers and `OAI-SearchBot`, disallows `GPTBot`, and points to `sitemap.xml`. `sitemap.xml` currently contains the canonical portfolio URL. `llms.txt` provides a short public orientation file but is not a search-control mechanism.
- `supabase/migrations/` defines the database schema and policies. `supabase/functions/` contains Edge Functions for quiz and egg-hunt sessions, guestbook posting, and page-view tracking.
- `package.json` provides the optional `a11y:pa11y` check; the published frontend does not depend on an npm build.
- The configured public URL is `https://memilyc.github.io/portfolio/`. The current repository deploys the static site from `main` through GitHub Pages. Verify the live deployment configuration before changing it.

## Reader view

The reader is the default view. The initial HTML contains a semantic summary of the career narrative, selected impact, and contact route so it remains understandable before JavaScript runs. `buildReader()` then renders the full interactive reader and its flat navigation. The navigation order is About, Experience, Work, Testimonials, Community, Skills, Résumé, Contact, Guestbook. Work links to `#projects`. Strengths and the accessibility statement appear in the document but are not separate navigation items.

The desktop navigation is one horizontally scrollable row. When the reader is 600 CSS pixels wide or narrower, `checkNavFit()` adds `nav-compact` and shows the Sections button. The compact control sits near the bottom-right of the portfolio window, with a scrollable dropdown. It precedes reader content in DOM order. Choosing a section moves focus to it and scrolls it into view.

## Window and mobile layout

The portfolio is displayed inside a movable window. The window is a named CSS container (`portfolio-window`); its width can be narrow even on a wide browser viewport. Responsive layout therefore uses both viewport media queries and a container query. Mobile viewport code also pins the window to the visual viewport when an on-screen keyboard changes the visible area.

The compact Sections control has both viewport and narrow-container positioning rules. In the narrow-container path, it is positioned absolutely inside the portfolio window, with `left: auto` and `right: 12px`. Do not add an `inset-inline` shorthand after `right`: that previously reset the right anchor and put the control on the left.

On narrow layouts, scrolling the reader more than 24px adds `reader-scrolled` to the window. CSS then hides the title-bar Accessibility launcher; returning to the top shows it again. The accessibility statement and contact link remain in reader content.

## Accessibility and privacy

The site targets WCAG 2.2 Level AA but does not claim verified conformance. It includes a skip link, visible focus styles, section-focus transfer, keyboard window controls, reduced-motion behavior, testimonial controls, and accessibility preferences for text size, contrast, links, and motion. See [ACCESSIBILITY.md](ACCESSIBILITY.md) for audit history and remaining verification.

Page-view tracking records the path, referrer, browser user agent, coarse location headers when available, and a shortened IP hash. The reader footer discloses this and offers a localStorage-backed opt-out. Guestbook entries are public. See [PRIVACY_COMPLIANCE.md](PRIVACY_COMPLIANCE.md) for implementation notes; that file is not a legal compliance determination.

## Search metadata

The document head declares the canonical portfolio URL and supplies title, description, Open Graph, Twitter, and `Person` JSON-LD metadata. JSON-LD represents only visible, sourced identity and profile information: M. Emily Chang, Senior Support Engineer, Kuala Lumpur, portfolio URL, public image, LinkedIn, and GitHub.
