# Accessibility Verification - Content Restructure - 2026-09-19

Target: WCAG 2.2 Level AA.

This verification covers the reader-view content and layout changes made on 2026-09-19. It supplements the broader automated audit from 2026-09-18; it is not a formal conformance certification.

## Checks completed

- Parsed both inline JavaScript blocks successfully with `new Function(...)`.
- `git diff --check` passed.
- Confirmed one H1 followed by ordered H2 and H3 headings.
- Found no duplicate element IDs or images without `alt` attributes.
- Found no visible primary controls smaller than 24 by 24 CSS pixels; primary call-to-action and privacy controls use at least 44 CSS pixels of height.
- Confirmed keyboard focus reaches the skip link, window controls, view/theme controls, navigation, and section controls in a logical sequence.
- Confirmed the testimonial carousel is paused by default and playback is user initiated.
- Confirmed the page and reader have no horizontal overflow at 320 CSS pixels.
- Confirmed experience cards, the featured project case study, other project cards, and Strengths reflow to one-column mobile layouts.
- Checked rendered text contrast in dark, light, brown, and purple themes using the WCAG relative-luminance thresholds: 4.5:1 for normal text and 3:1 for large text. No below-threshold visible text was detected after the light and brown theme adjustments.
- Checked the browser console after desktop and mobile rendering; no warnings or errors were reported.
- Preserved visible focus indicators and the `prefers-reduced-motion` rules.

## WCAG 2.2 interaction follow-up

- Confirmed the close, minimize, and maximize buttons retain 24 by 24 CSS pixel targets while the visible traffic-light circles remain approximately 12 pixels.
- Confirmed the view and theme controls exceed 24 pixels in both dimensions, the analytics control is 44 pixels high, testimonial controls exceed 24 pixels, and reader guestbook navigation is 44 pixels high.
- Added consistent assistive-text announcements and `noopener noreferrer` to reader and terminal links that open a new tab; their visible labels are unchanged.
- At 375 CSS pixels, verified the Sections button opens with Enter and Space, Escape closes it and returns focus, and Guestbook navigation transfers focus to the section.
- At 320 by 256 CSS pixels, confirmed the compact menu remains within the viewport, scrolls internally to all nine destinations, and introduces no page or reader horizontal overflow.
- Confirmed Escape closes the Window layout disclosure and returns focus to its summary.
- Re-ran the skip-link, theme, view, and testimonial keyboard smoke tests. No browser console warnings or errors were observed.

## Manual follow-up

- Re-run the full axe-core matrix before claiming formal conformance after deployment.
- Test the deployed PDF link and all external destinations.
- Repeat keyboard and screen-reader smoke tests after any future navigation, carousel, guestbook, or theme changes.
