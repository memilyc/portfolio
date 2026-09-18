# Portfolio accessibility re-audit — 18 September 2026

Target: [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/).
Outcome: the four interaction/layout findings below have now been fixed and regression-tested.
Full conformance is not established. This audit did not change the website implementation.

## Scope and results

Local `index.html`, headless Chromium, reduced-motion preference, axe-core 4.10.3.
Backend responses were intercepted: 13 sample guestbook entries and one sample quiz question.
No real guestbook messages, quiz scores, or analytics were submitted.

- 40 baseline scans: reader and terminal, all four themes, at 1280 × 1024,
  320 × 800, 390 × 844, 600 × 350, and 320 × 256.
- 10 additional scans: open menu, invalid guestbook form, expanded recommendation,
  open terminal settings, command shortcut output, mocked quiz, adventure introduction,
  neofetch, and both views with simulated 200% text at 320 × 256.
- **Zero detected violations in 50 WCAG-tagged scans.** Every scan also returned
  `color-contrast` items for manual review; automated contrast coverage is incomplete.
- No observed JavaScript runtime errors. Inline scripts parse and `git diff --check` passes.

Raw results: [audit JSON](audits/accessibility-2026-09-18.json).

## Findings recorded before fixes (now resolved)

### 1. High: enlarged text and a short mobile viewport obscure terminal input

Reproduction: use 320 × 256, double computed font sizes, enter terminal, open Output settings.
The output viewport shrinks to 16px. The input starts at y = 239.80 and is 43px high,
placing its bottom at y = 282.80, below the 256px viewport. The window clips overflow.

This is a confirmed barrier in a simulated enlarged-text/keyboard-space scenario, not a
real-browser zoom or physical-device result. Relevant criteria to review: 1.4.4 Resize Text,
1.4.10 Reflow, and 2.4.11 Focus Not Obscured.

Source: `index.html` terminal controls and options CSS around lines 1130–1173, and mobile
viewport pinning in `fitToViewport()`. Several nonshrinking rows compete for limited height;
the later options rule also overrides the earlier short-screen height limit.

Recommendation: ensure the command row remains within the viewport, bound settings using
available space, and provide scrolling for the surrounding controls when text grows.

### 2. Medium: opening terminal disclosures redirects keyboard focus

Reproduction: focus Output settings summary and press Enter. The disclosure opens, but
`document.activeElement` becomes `cmdline`. Clicking the summary has the same effect.

Cause: the window-wide click-to-focus handler excludes anchors, buttons, and inputs, but
not `summary` or other interactive containers. See `index.html:4279`.

Impact: Tab continues from the command input instead of reaching the newly opened settings.
On a real phone, unexpectedly focusing the input may also open the soft keyboard; this
physical-device effect was not tested. Relevant criteria: 2.4.3 Focus Order and 2.1.1 Keyboard.

Recommendation: limit click-to-focus to the output background, or exclude disclosure controls
and other interactive regions while preserving native focus behavior.

### 3. Medium: mobile command shortcuts retain focus on a hidden button

Reproduction: expand recommended commands, focus `about`, and press Enter. Its handler
runs the command and collapses the grid. Focus remains on the `about` button, which has
no layout rectangles and is no longer visible. See `index.html:2160`.

Impact: users lose a visible focus location after running a shortcut. Relevant criteria:
2.4.3 Focus Order and 2.4.7 Focus Visible.

Recommendation: move focus to the command input or commands toggle after collapsing the grid.

### 4. Medium: guestbook pagination drops focus on the last page

Reproduction: navigate through the mocked guestbook to its final page with Next. The button
is disabled while focused, and `document.activeElement` becomes `BODY`. See `index.html:1541`.

Impact: keyboard users lose their place when they reach a pagination boundary. The polite
page status exists but does not preserve keyboard focus. Relevant criterion: 2.4.3 Focus Order.

Recommendation: transfer focus to the page status (with programmatic focus support) or to
an enabled pagination control when the activated control becomes disabled.

## Improvements confirmed

- Guestbook invalid nickname is marked invalid and receives focus.
- Focusing testimonial content pauses automatic rotation.
- Section navigation appears early and has a scrollable, in-flow compact menu.
- Both views expose usable output controls and section structure at ordinary mobile sizes.
- Quiz question, adventure introduction, and neofetch states were included in automated scans.

## Limitations

No VoiceOver/NVDA speech testing, real browser zoom/text-only zoom, physical iOS/Android keyboard,
production backend behavior, complete game journeys, or linked résumé audit was performed.
Contrast items marked incomplete by axe need visual/manual verification. This audit records
usability barriers and relevant WCAG criteria; it is not a formal conformance certification.


## Fix verification

All four findings were addressed after this audit:

- Terminal settings retain native summary focus; Tab reaches the first setting. The click-to-focus
  handler now applies only to the empty terminal output background, preserving selected output.
- Mobile command shortcuts return focus to their visible disclosure toggle before the grid collapses.
- Guestbook first/last page transitions move focus to the page status when the active button disables.
- Controls and output occupy a scrollable terminal workspace, with the command input outside it.
  The short-screen options height rule now applies after the general rule.

Targeted Chromium regression tests passed. At 320 × 256 with simulated 200% text and expanded
settings, the command input now occupies y = 213–256 (previously 239.80–282.80). The workspace
can scroll to an 80px output region. Settings, log-stop controls, and command entry remain reachable.
Guestbook boundary checks covered both first and last pages using keyboard activation.

The final verification run performed 33 WCAG-tagged axe scans: reader and terminal in four themes
at 320 × 256, 390 × 844, 600 × 350, and 1280 × 800, plus the enlarged short terminal scenario.
Zero violations were detected in that run, and no JavaScript runtime errors were observed.
See [fix verification JSON](audits/accessibility-fixes-2026-09-18.json).
The assistive-technology and physical-device limitations above still apply.
