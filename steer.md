# Portfolio steering rules

Rules and policies for future work in this repository. Read [specs.md](specs.md) for the current design and [requirements.md](requirements.md) for acceptance criteria. Existing code and live behavior should be checked before treating either document as current.

## Scope and source of truth

- Work in the smallest relevant part of `index.html` or the affected Supabase file. Preserve unrelated local edits.
- Treat the user's observed deployed behavior as evidence. If it conflicts with the CSS, reproduce and inspect the rendered result before declaring a fix.
- Preserve the single-file, dependency-light frontend unless a requested feature clearly warrants an architecture change.
- Update these documents when a change materially alters behavior or policy. Do not silently turn a proposed idea in `PORTFOLIO-POSITIONING-PLAN.md` into a shipped requirement.

## Content policy

- Write public copy in Emily's first-person voice where appropriate. Retain real job titles, dates, ownership, and sourced metrics; flag uncertainty rather than filling gaps.
- Keep the customer problem → investigation → resolution → reusable improvement story clear. Avoid decorative interactions that obscure the evidence.
- Preserve exact attribution in testimonials and other third-party statements. Do not imply an event was attended, hosted, or led without supporting evidence.
- Keep the selected reader order and one-level Sections navigation unless Emily requests a change.

## Interaction policy

- Preserve keyboard access, focus order, named controls, reduced-motion behavior, and the 44px mobile targets where provided.
- Responsive changes must account for both browser viewport width and the width of the movable inner window.
- For positioned controls, inspect the full CSS cascade, including shorthand properties and later media or container rules. Verify actual bounds in a browser at representative mobile sizes.
- Avoid hiding a control while it or its panel contains keyboard focus. If a control is hidden on scroll, provide a predictable way to recover it and retain the related content in the document.
- Keep the reader primary and the terminal optional. Changes to one view should not silently break the other.

## Data and release policy

- Keep Supabase service-role secrets out of the frontend. Client code may use only the existing public key and approved endpoints; validate writes in Edge Functions.
- Preserve the analytics disclosure and opt-out, and describe collected fields accurately. Review `PRIVACY_COMPLIANCE.md` when tracking or guestbook handling changes.
- Check Git status and the intended diff before committing. Use a descriptive commit message. Deploy only when requested or already authorized for the task; confirm the remote and branch first.
- Report verification honestly: distinguish local code checks, local rendered checks, remote push, and live-site checks. If a check could not run, state that plainly.

## Search and publishing policy

- Keep the canonical URL, sitemap, and public profile metadata aligned with the deployed GitHub Pages URL. Do not add query-string, preview, or duplicate URLs to the sitemap.
- Keep `OAI-SearchBot` allowed unless Emily asks to opt out of ChatGPT Search. Treat `GPTBot` as a separate training-permission choice and leave it disallowed unless she explicitly changes it.
- Add only evidence-led, useful pages. Do not create keyword-variant, thin, or AI-generated pages primarily to attract search traffic.
- Keep `llms.txt` concise and public-facing. It may orient tools to canonical pages but must not be represented as an OpenAI standard or a ranking mechanism.
