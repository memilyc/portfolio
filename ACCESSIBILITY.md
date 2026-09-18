# Accessibility audit — 18 September 2026

Target: [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/).
Status: accessibility improvements implemented; full conformance has not been established.
These changes are local and have not been deployed.

## Changes

- An accessibility statement near the bottom states the WCAG 2.2 AA target and provides a prominent email link for reporting barriers.

- Native section links, focus transfer to sections, and a skip-to-content link.
- Visible keyboard focus, minimum 24px button targets, and narrow-screen wrapping.
- Higher contrast text colors in all four themes, including résumé overlay text.
- Portrait alternative text, a main landmark, and named navigation and terminal output.
- Guestbook labels, associated status messages, invalid-field focus, and live validation feedback.
- Testimonials start paused, with explicit play/pause controls, pause when content receives focus,
  current-dot state, and expanded state for the full recommendation.
- Native Tab navigation leaves the terminal input. Completion uses Alt+/ or Right Arrow.
- Window layout buttons provide click and keyboard alternatives to dragging and resizing.
- Close and minimize can be restored with the keyboard. Browser Find remains available.
- Reduced-motion preferences suppress animation and terminal typing; decorative blinking stops within five seconds.
- Reader boot no longer moves focus to the hidden terminal. Native mouse cursors remain visible.

## Verification

Headless Chromium with axe-core 4.10.3, using WCAG 2 A/AA, 2.1 AA, and 2.2 AA rule tags:

| State | Result |
| --- | --- |
| Reader: dark, light, brown, purple at 1280px and 320px | Zero detected violations in eight scans |
| Terminal: introductory output and `about`, all four themes | Zero detected violations |
| Page and reader horizontal overflow at 320px | None detected |
| Keyboard section navigation and focus transfer | Passed |
| Terminal Tab exit and Alt+/ completion | Passed |
| Close/restore and minimize/restore with keyboard | Passed |
| Guestbook invalid nickname and focus | Passed |
| Testimonial expansion, play/pause, and pause on focus | Passed |
| Window movement and resize via click and keyboard | Passed |
| WCAG text-spacing overrides at 1280px and 320px | No page or reader horizontal overflow |
| Reduced-motion window animation | Disabled as expected |
| JavaScript parsing and `git diff --check` | Passed |

Guestbook read data and analytics responses were intercepted in test runs. No public guestbook
messages were submitted. These checks do not validate production backend behavior.

## Remaining conformance review

Automated scans cover only a subset of WCAG requirements. Before claiming full AA conformance:

- Test VoiceOver/Safari and NVDA/Firefox, especially terminal output announcements, asynchronous
  game prompts, form errors, and compact navigation.
- Check 200% text enlargement and 400% browser zoom across all states.
  A 320px viewport and text-spacing overrides were tested; actual browser zoom and text enlargement were not.
- Exercise every quiz, adventure, egg-hunt, leaderboard, guestbook pagination, loading, error, and
  success state. The scans above do not establish coverage of those states.
- Review game timing, live-update frequency, and any flashing command effects for 2.2.1, 2.2.2,
  and 2.3.1, including whether any essential-timing exception actually applies.
- Independently audit the linked résumé and external destinations; they were outside this audit.

## Usability review — follow-up

Assessment at the time of review: the reader view had a useful accessible foundation, but navigation under
magnification remained a barrier. The navigation findings below were addressed in the mobile follow-up. The terminal is a more demanding optional experience.
Zero automated violations do not establish full usability or WCAG conformance.

### Confirmed findings

1. **Resolved in mobile follow-up: compact navigation was clipped on short screens.** At 320 × 256 CSS pixels
   (the viewport dimensions corresponding to a 1280 × 1024 screen at 400% zoom), the
   dropdown measured 320px high and started at y = -123px. About and Skills were fully
   above the viewport and Projects was almost entirely above it. The menu has no
   constrained height or internal scrolling. This is a reflow/navigation concern;
   actual browser zoom was not performed.
2. **Resolved in mobile follow-up: compact navigation came after content in keyboard order.** At
   320 × 800, Sections was the 45th of 45 visible enabled focusable items when the menu
   was closed. Its placement in the DOM makes it difficult to discover early with Tab.
3. **Resolved in mobile follow-up: desktop navigation did not adapt to enlarged text.** A simulated 200%
   text enlargement (doubling computed font sizes, not browser text-only zoom) showed
   the horizontal navigation extending past the right edge of the window. Reader
   body content wrapped without horizontal overflow. Navigation fit detection uses
   the reader width rather than the actual width required by the labels.
4. **Resolved: the terminal `view` command lost focus.** Switching now moves focus
   to the reader main landmark; entering the terminal moves focus to its command input.

### Additional usability concerns from source review

- Terminal output announcement behavior still requires assistive-technology testing.
  Announcement and follow-output controls are now available; the continuous live log
  marks repeating lines with `aria-live="off"`. Any key, command-input edit, stop button,
  or switch to reader now stops that log. Scrolling up pauses automatic following.
- Active section links now expose `aria-current="location"`.
- Small 10–12px toolbar text, many controls before content, and window-management
  controls increase effort. Larger defaults and a simpler primary reading interface
  would improve comfort even where minimum WCAG requirements are met.

Recommended order: constrain/scroll the compact menu; respond to navigation label
width; move compact navigation before content in DOM order; manage view-switch focus;
then test and simplify terminal announcements with VoiceOver and NVDA.

This follow-up reviewed local files and headless Chromium behavior. It did not use
VoiceOver/NVDA, test real browser zoom, or audit the published site or linked résumé.


## Terminal accessibility changes — follow-up implementation

- Switching from the terminal to reader moves focus to the main content.
- Visible, labeled controls let visitors toggle output announcements and automatic following.
- Scrolling up pauses following, including during viewport changes and command-input focus.
  Visitors explicitly check Follow latest output to resume.
- Repeating `tail -f` log lines are marked `aria-live="off"`; a separate polite status
  reports start and stop. Actual speech behavior has not been verified with a screen reader.
- Any key or command-input edit stops the continuous log without cancelling the key's usual action.
  A Stop live output button is also available; stopping does not leave focus on a disabled button.
- Leaving terminal view stops the continuous log.
- Command-input instructions explain Enter, Tab, completion, and reviewing older output.

Headless Chromium checks passed for focus transfer, both announcement settings, repeating-line
markup, keyboard and button stopping, history review without forced scrolling, follow resumption,
and leaving the command input with Tab. Eight axe-core scans of terminal states across four
themes at 1280px and 320px detected zero WCAG-tagged violations. No JavaScript runtime errors
were observed. These tests used intercepted guestbook/analytics responses and submitted no
public guestbook messages. VoiceOver/NVDA and all game states remain outside this verification.


## Mobile usability changes — follow-up implementation

- Output settings use native disclosure controls, closed initially, with labeled options and
  keyboard guidance inside a scrollable panel. Settings are available to touch and keyboard users.
- The stop button is visible only while the continuous live log is running; status announcements
  remain available without adding visual rows.
- Sections stays before reader content in DOM order. Compact menus occupy normal layout space,
  have bounded scrolling, and do not float over page content. The menu is the fourth Tab stop on mobile.
- Navigation switches to compact mode when label content no longer fits, including enlarged text.
- Mobile-only desktop window controls and unused drag/resize handles are hidden. View and theme
  controls remain visible. Native Output settings and Sections summaries have 44px targets.
- Short screens use smaller toolbar spacing and hide the decorative credit. Opening output settings
  temporarily hides recommended commands to preserve room for output and command input; commands
  return when settings close. Commands can still be entered normally.
- The accessibility email button remains in the document near the bottom, without a floating overlay.

Verified in touch-emulated headless Chromium at 320 × 800, 390 × 844, 600 × 350, and 320 × 256:
menu bounds, reaching lower menu links, section focus, early Tab order, settings access, log-stop
button access, command input bounds, output visibility, and no page/window overflow. WCAG-tagged
axe scans detected zero violations in those tested terminal states. Simulated 200% text at
390 × 844 retained settings and input access, working command chips, an email button within the
viewport width, and zero detected violations across four themes. This is viewport/keyboard-space
simulation, not testing an actual iOS/Android soft keyboard or real browser text-only zoom.

## Latest re-audit

The updated site was re-audited in 50 automated states, plus focused interaction tests.
Zero violations were detected automatically, with incomplete contrast checks requiring
manual review. The four barriers found in that audit have since been fixed: enlarged/short terminal layouts,
terminal disclosure focus, hidden command-shortcut focus, and guestbook pagination focus.
The final targeted verification run passed 33 automated scans and keyboard regression checks.
See [the re-audit report](ACCESSIBILITY-REAUDIT.md) for reproduction steps and evidence.
