# Portfolio requirements

Acceptance criteria for changes to this portfolio. These describe intended behavior; [specs.md](specs.md) records the current implementation and [steer.md](steer.md) sets working rules.

## Content and navigation

- Reader view must be usable immediately without opening the terminal.
- The public career narrative must use the actual Software Engineer → Systems Administrator → Support Engineer → Senior Support Engineer progression and defensible evidence. Do not add unsourced metrics, dates, outcomes, or attribution.
- Keep the reader navigation flat and in this order: About → Experience → Work → Testimonials → Community → Skills → Résumé → Contact → Guestbook. Keep its labels and anchors aligned with the rendered sections.
- Keep the PostgreSQL performance case and Connection Calculator prominent. Keep testimonials attributed and expandable without losing context.
- Keep the terminal optional. Switching views must preserve usable focus and an obvious way back.

## Responsive behavior

- At a narrow browser viewport or a narrow portfolio window, reader content must reflow without horizontal page or window overflow.
- On a phone-sized reader, the Sections button must render at the bottom-right of the portfolio window, respect the bottom safe area, and remain reachable while scrolling. Its menu must fit short screens and allow scrolling to every link.
- A wide viewport with a manually narrowed portfolio window must use the narrow layout. A wide window must retain the flat desktop navigation row.
- On narrow layouts, the title-bar Accessibility button must be visible at the reader top, hide after scrolling down, and reappear when the reader returns to the top. Its hidden state must not leave an invisible keyboard stop or strand focus in an open panel.
- Title-bar view and theme controls must remain operable. Opening a mobile keyboard must not hide the active terminal input or current output.

## Accessibility and privacy

- All primary controls must work with keyboard and touch, have clear names, and show visible focus. Section navigation must transfer focus to its destination.
- Honor reduced-motion preferences and preserve text enlargement, contrast, and link-visibility settings.
- Treat WCAG 2.2 AA as a target. Do not claim conformance based only on automated checks; report manual and assistive-technology gaps accurately.
- Keep the analytics notice and working opt-out. Do not describe hashed technical identifiers as inherently anonymous or claim legal compliance without a separate review.
- Disclose that submitted guestbook entries are public; validate and moderate through the existing backend path.

## Search and AI discovery

- The canonical public portfolio URL is `https://memilyc.github.io/portfolio/`; its document head must declare that URL as canonical.
- The site must provide a root `robots.txt` and `sitemap.xml`. `robots.txt` must allow general discovery and `OAI-SearchBot`, while disallowing `GPTBot` unless Emily explicitly changes that training-permission decision.
- The initial HTML response must contain a readable, semantic summary of the name, role, career evidence, featured impact, and contact path. JavaScript may enhance or replace the reader experience after load.
- Structured data must match visible, sourced portfolio content. Do not add credentials, dates, outcomes, or claims that are not present in the page.
- `llms.txt` is an optional orientation file, not a substitute for crawlable content, a sitemap, or structured data. It must link only to public canonical material.

## Verification before release

- Run `git diff --check` and parse any changed inline JavaScript.
- Validate `robots.txt` and `sitemap.xml` as plain-text/XML resources, and validate any JSON-LD before release.
- For navigation or layout changes, inspect the rendered page at a phone viewport and at a narrow inner window on a wider viewport. Check actual button bounds and computed position, not just the CSS declaration.
- For mobile scroll behavior, check the top, after scrolling, returning to the top, menu open, and keyboard focus. Verify the accessibility launcher and Sections control do not obstruct content.
- Run the relevant accessibility check when behavior changes, then document what that check did and did not cover. Do not make a production-backend claim from mocked or intercepted requests.
- After an authorized deployment, verify the pushed commit and inspect the published page when available. A successful push alone does not establish that the rendered site is correct.
