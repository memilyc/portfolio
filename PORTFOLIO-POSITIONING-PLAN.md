# Portfolio Positioning and Storytelling Plan

Status: planning only; no implementation changes are authorized by this plan.
Last updated: 2026-09-26

## Core positioning

Primary identity:

> Senior Support Engineer for complex enterprise SaaS environments.

Core promise:

> I connect customer impact, technical investigation, and lasting improvement.

Short elevator pitch:

> I solve complex customer problems, explain them clearly, and leave behind improvements that help the next person.

The hero pitch is the compressed value proposition. The About section should provide career context. A featured case study should provide evidence. These should share the same idea without repeating the same paragraph.

Primary public role: Senior Support Engineer.

Adjacent directions such as Technical Services and Customer Success Engineering should remain secondary rather than competing with the primary identity.

## Short visitor journey

The main path should be short enough to scan and deep enough to trust:

```text
Recognise Emily
  -> see how she creates value
  -> read one strong proof story
  -> see trust and community signals
  -> contact or leave a signal
```

Use five primary content blocks rather than ten equal sections:

1. Hero: role, promise, proof metrics, résumé/contact
2. Operating model: career arc plus `Listen -> Investigate -> Explain -> Improve`
3. Featured impact: one concise case study with optional technical detail
4. Trust and reach: selected testimonials plus Co-director/podcast summary
5. Closing: contact, optional `Beyond the ticket`, and `Leave a signal`

Accessibility and privacy remain part of the page but should not interrupt the narrative.

### Length rules

- Keep the default reader path to approximately 5–7 meaningful viewports before optional exploration.
- Use one or two sentences per default content block.
- Show only the summary of the featured case study initially; place technical detail behind an explicit `Read the technical detail` control or a linked case-study page.
- Show three short testimonial excerpts, not full recommendations.
- Combine the career arc and working method into one compact section.
- Combine testimonials and community/public work into one trust-and-reach section.
- Keep detailed skills, strengths, terminal commands, quiz content, and full testimonials as optional depth.
- Keep detailed technical skills available as optional depth, while the main path uses capability summaries.
- Keep guestbook messages visible in the final `Leave a signal` area as community proof and an invitation to respond.
- Do not use a résumé preview card; provide a direct `Download résumé` link in the hero and contact block.
- Do not make scrolling through every detail necessary to understand the role or reach the résumé.

Do not use a blocking first-visit persona popup. If audience guidance is useful, use optional non-modal links such as `Hiring quickly`, `See my technical impact`, and `Explore the full experience`.

## Hero direction

Suggested structure:

```text
M. Emily Chang

Senior Support Engineer

I turn difficult enterprise incidents into clear fixes,
useful tools, and better product experiences.

9+ years · 125+ documentation updates ·
600+ technical pairing sessions · US$9M ARR portfolios

[View featured impact] [Download résumé]
[Explore the terminal]
```

The résumé and contact path must be reachable without using the terminal.

## Career arc

```text
Software Engineer
  -> Systems Administrator
  -> Support Engineer
  -> Senior Support Engineer
```

Narrative direction:

> My career has moved progressively closer to the point where software, infrastructure, and people meet.

This explains why Emily can work across applications, databases, infrastructure, and customer communication.

## Working method

Use one central operating model:

```text
Listen -> Investigate -> Explain -> Improve
```

- Listen: understand impact, urgency, and what is actually blocked.
- Investigate: work across applications, databases, infrastructure, configuration, and reproducible evidence.
- Explain: translate complex findings for customers, teammates, and Engineering.
- Improve: leave behind a fix, tool, automation, documentation, or better process.

This is the connective tissue between the career arc, technical proof, testimonials, community work, and guestbook ending.

## Stage 4: one featured technical impact story

Do not publish four long case studies. Use one complete story that naturally connects customer impact, technical investigation, incident leadership, PostgreSQL reasoning, and reusable tooling:

```text
Customer war room
  -> structured diagnosis
  -> evidence-led PostgreSQL and GitLab tuning
  -> safe configuration guidance
  -> reusable PostgreSQL Connection Calculator
```

Featured theme:

> From a performance war room to reusable PostgreSQL guidance.

Suggested structure:

```text
Situation
A customer reported worsening GitLab performance before an upcoming deployment.

My responsibility
I was paged into the emergency call, led the customer war room, gathered system context,
and coordinated investigation while teammates analysed logs in parallel.

Investigation
I clarified which workflow was slow, checked the GitLab version, architecture, recent changes,
and deployment context, then connected database errors with the customer's single-node setup.

Action
I cross-checked the GitLab PostgreSQL tuning guidance, reviewed resources and configuration,
identified the impact of an increased Sidekiq migration queue, recommended reducing that queue,
and recommended a reasonable explicit Puma limit instead of relying on the default, so the
combined workload stayed within a safe database-connection budget.

Outcome
Connection errors stopped, page loads became faster, and the server's computing load decreased.
Developers could continue using GitLab, and the customer agreed to close the call. We did not
recommend increasing the database connection limit beyond what the resource-constrained server
could safely support. The longer-term plan was for the customer to move PostgreSQL to a separate
database instance.

Durable improvement
I created the PostgreSQL Connection Calculator because it was the tool I wished I had during
that incident. It makes the resource and connection calculation faster and more consistent than
doing the manual math from the documentation, and gives other engineers something reusable when
they face a similar situation.
```

The official [GitLab PostgreSQL tuning guidance](https://docs.gitlab.com/administration/postgresql/tune/) supports the public technical context: GitLab performance can be affected by PostgreSQL-related configuration, and connection demand depends on Puma, Sidekiq, topology, and related settings. It does not prove the customer's private configuration or incident, so the case study must keep those details attributed to your experience.

This featured story is stronger than the calculator alone because it shows the full sequence: leading a high-pressure customer conversation, breaking down an ambiguous symptom, coordinating parallel investigation, applying technical judgment, communicating safe recommendations, and then building a reusable tool.

Supporting proof may include:

- 24/7 emergency on-call
- 125+ documentation updates
- 600+ technical pairing sessions
- customer portfolios worth up to US$9M ARR

Do not claim measured time savings, adoption, reduced escalations, or other outcomes without evidence. The verified outcome for the featured war-room story is no more connection errors, faster page loads, lower server computing load, continued developer access to GitLab, and a future plan for a separate database instance.

Keep the following as optional supporting material rather than full primary sections:

- Ansible upgrade edge case
- Convert UTC Bot
- MongoDB technical preparation content
- PgBouncer/RDS mistake story

Interview-prep notes contain draft stories and explicit verification gaps. Public copy must not present unresolved technical details as confirmed facts.

### Secondary verified incident: skipped upgrade stop

Keep the upgrade-path incident in the plan as a secondary story or future supporting card. It should not compete with the performance-war-room case study in the main flow.

The customer had recently upgraded but skipped a mandatory version. The upgrade documentation instructed customers to pass through that version because a later version contained the fix for a known bug. Because the version was skipped, a database migration for a specific table did not complete and the customer saw 500 errors.

Emily led the customer call, gathered context, found the relevant documentation, reviewed logs, and guided the customer through checking the database migration status. Support did not access or modify the customer's instance. Emily shared the migration query for the customer to run, then asked the customer to check the migration status again.

The customer confirmed during the call that the 500 errors were gone and the site was usable again. The database errors no longer appeared in the logs. The follow-up was a summary in the support ticket. Future guidance included following the documented upgrade path, reviewing the upgrade plan with Support when needed, upgrading non-production first, and checking for surprises before production rollout.

Supporting public reference: [GitLab upgrade paths — required upgrade stops](https://docs.gitlab.com/update/upgrade_paths/#required-upgrade-stops). The page explains that some versions are mandatory stops because they contain fixes related to the upgrade process, and that background migrations should finish before proceeding. This supports the general mechanism; it does not identify the customer's exact version, table, or incident.

Safe public framing:

> I led a customer through a safe, evidence-based recovery without directly accessing or modifying their instance.

Do not describe this as Emily running the migration on the customer's system. The customer ran the supplied query.

## Testimonials

Show three concise excerpts by default:

- technical judgment under pressure
- customer and Engineering communication
- lasting documentation, process, or operational improvement

Long recommendations should use an explicit expansion control. The default view must not stretch the layout. Carousel movement should be user-controlled and paused by default.

## Community leadership and public communication

Use the official title:

> Co-director, The Digital Nomad CMX Community

Started: August 2026.

This is one supporting leadership dimension, not a replacement for the Senior Support Engineer identity.

Suggested content:

> I help create spaces for globally distributed professionals to connect, learn, and exchange practical experience.

Selected work:

- Personally hosted a Global Community Mixer with participants from five continents: Asia, Australia, the Americas, Europe, and Africa.
- Invited a speaker and hosted a community talk with a speaker from San Francisco.
- Owned end-to-end event preparation and delivery: event setup in Bevy, slides, event scripts, hosting, and the post-event email.
- Focused on meaningful insight and connection rather than presenting attendance volume as the main measure of success.

Community link: [The Digital Nomad CMX Community](https://events.cmxhub.com/the-digital-nomad-cmx-community/)

Separate public communication item:

> Guest — Tech Tarik Talks: discussed progressing from someone who had never worked directly with customers to a Senior Support Engineer handling complex customer cases while working remotely with a global team from Malaysia.

Podcast episode: [Tech Tarik Talks](https://youtube.com/watch?si=dHQJYx1ZVrZ7UElC&v=C7T2Us5cYgA&feature=youtu.be)

Do not imply formal people management. Use evidence-led terms such as co-directed, organised, hosted, facilitated, and discussed.

## Contact and optional personality layer

Contact direction:

> If your team supports complex products, enterprise customers, or systems that need to become easier to operate, I’d be glad to hear what you’re working on.

Actions:

- Email Emily
- Download résumé
- LinkedIn

Move the terminal, quiz, themes, and easter eggs into an optional section:

> Beyond the ticket

Suggested framing:

> Support engineering is serious work, but it does not have to feel impersonal. Explore the interactive terminal, try a quiz, or leave a note.

This layer should not appear before the visitor has seen the role, featured impact, résumé path, and contact option.

## Guestbook ending

Rename the final interaction:

> Leave a signal

Suggested copy:

> Good support work rarely ends when the ticket is closed. It ends when the explanation is clearer, the next person is less blocked, and the system is a little easier to use.

Prompt:

> What would you add to the log?

Helpful prompts:

- What brought you here?
- Which idea stood out?
- What would you want to troubleshoot or build together?
- What should I explore next?

Submission confirmation:

> Signal received. Thanks for taking the time to leave a note.

## Motion and technology boundary

Do not add WebGL fluid as a background. Do not add GSAP initially.

Use CSS and `IntersectionObserver` for:

- restrained hero entrance
- career-stage activation
- impact-loop reveal
- featured case-study reveal
- optional metric enhancement
- small `Signal received` state transition

Motion must clarify the path from incident to improvement, not compete with the story.

## Accessibility boundary

Every interaction must:

- respect `prefers-reduced-motion`
- show final states immediately when reduced motion is enabled
- keep content available as normal HTML
- preserve keyboard navigation and visible focus
- avoid flashing, auto-scroll, scroll-jacking, and hover-only content
- keep text zoomable and selectable
- avoid colour-only status indicators
- keep testimonial movement paused by default
- use native links, buttons, and form controls
- announce only meaningful status changes
- remain understandable without the terminal or animation

## Future training direction

Keep training separate until its name, audience, offer, and outcomes are clear.

Future structure may become:

```text
Technical impact
Community leadership
Training and enablement
```

Do not add an undefined training identity to the current portfolio plan.

## Implementation phases

### Phase 1: Evidence and positioning

- Preserve the verified featured incident framing: Support guided the customer; Support did not access or modify the instance; the customer ran the supplied query.
- Treat the performance-war-room incident and PostgreSQL Connection Calculator as one featured story because you directly described the calculator as the durable improvement that followed the investigation.
- Use the verified outcome: 500 errors stopped, the site was usable, database errors disappeared from logs, and the customer confirmed recovery on the call.
- Finalise the hero and short pitch.
- Use the official title `Co-director, The Digital Nomad CMX Community`.
- Add the supplied community and podcast links.

### Phase 2: Story architecture

- Reorder the reader view around the visitor journey.
- Add the career arc and working method.
- Build one featured impact story.
- Curate short testimonial excerpts.
- Add community leadership and podcast content.

### Phase 3: Conversion and ending

- Make résumé and contact prominent.
- Move optional experiments later.
- Finish with `Leave a signal` and response prompts.

### Phase 4: Visual and motion polish

- Add restrained motion only after content hierarchy is stable.
- Preserve reduced-motion behavior.
- Keep the static GitHub Pages architecture.

### Phase 5: Validation

Test four journeys:

- Recruiter: identify role, level, location, résumé, and contact quickly.
- Potential manager: understand ownership, judgment, technical scope, and outcomes.
- C-suite or senior leader: see leverage, operational impact, and external representation.
- General visitor: understand the person, enjoy the experience, and feel invited to leave a meaningful note.

## Current assessment

Estimated current direction: 7.3/10 overall.

Target after focused execution: approximately 8.8–9/10.

The target is not more content or more animation. The target is:

> One clear professional story, one strong technical proof point, one supporting leadership dimension, one clear contact path, and one human invitation at the end.

## Open questions to resolve before implementation

1. Do you have any measured performance evidence, or should the outcome remain `performance improved and the customer confirmed closure`?
2. What exact public description should accompany the podcast link, and are there any topics or wording to avoid?
3. Which detailed skills and strengths deserve optional depth after the short main path?
4. What training direction should remain private until it has a separate name and offer?
