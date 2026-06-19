# CLAUDE.md — TractionLab Landing Page
Designli | TractionLab | PO-owned project

This file gives Claude Code the context it needs to work on this project without asking unnecessary questions. Read it before doing anything else.

> **First time?**
> 1. Rename this file to `CLAUDE.md`
> 2. Drop it in the root of your project folder
> 3. Open Claude Code and say: "Read CLAUDE.md and let's get started"

---

## What this project is

A coming-soon landing page for a TractionLab engagement. Its only job is to collect waitlist signups and feed them into PostHog. There is no backend, no database, no auth. PostHog is the source of truth for all signups until the full product exists.

This is a PO-owned project. The tech lead is not involved here. Keep solutions simple and within the PO's ability to maintain.

The person running this Claude Code session is a Product Owner, not a developer. Prefer plain explanations over technical jargon. When multiple approaches exist, always choose the simpler one. If a step requires terminal commands or config changes, explain what the command does. For low-risk commands (installs, file creation, local config), just run it. For mid-to-high risk commands (deployments, deletions, env changes, anything that affects production), explain and wait for explicit approval before executing.

---

## First-time setup

If the Project details block below still has `[FILL IN]` placeholders, this project has not been set up yet. Run the setup flow before doing anything else.

### Step 1 — Guided onboarding

Ask the PO the following questions one at a time. Wait for each answer before moving to the next. Do not ask them all at once.

**Product information**
1. What is the product called?
2. Describe the product in one sentence — what does it do?
3. Who is it for? Describe the target user in a sentence.
4. Do you have a value proposition written? If yes, paste it. If no, we will draft one together after setup is complete.
5. What is the domain name for this product? (Even if it is not connected yet — just the name.)
6. Do you have brand colors? If yes, share the hex codes. If no, describe the visual style you are going for.
7. Do you have a logo file ready? If yes, what is the filename?

**Accounts — walk through this list one item at a time**

If an account does not exist yet, pause, guide the PO to create it, and wait for confirmation before continuing. Do not skip ahead.

1. **GitHub** — Does a repository exist for this project? If yes, what is the repo name (format: owner/repo-name)? If no, go to github.com, create a new empty repository, and come back with the URL.
2. **PostHog** — Is a PostHog project created? If yes, paste the project API key. If no, go to posthog.com, create a new project, copy the API key from Project Settings, and come back.
3. **Vercel** — Is a Vercel account connected to the GitHub repo? If no, go to vercel.com, sign up with GitHub, connect the repository, and come back.
4. **Slack** — Is there a Slack incoming webhook set up for the project channel? If yes, paste the webhook URL. If no, go to your Slack workspace → Apps → Incoming Webhooks → Add new, select the project channel, copy the webhook URL, and come back.

### Step 2 — Update this file

Once all answers are collected, update the Project details block and the TBD section in this file with the real values. Do not leave any `[FILL IN]` or `TBD` placeholders once setup is complete.

Ask the PO: "I have everything I need. Should I update the CLAUDE.md file now with all the details we just went through?" If they say yes, write the values directly into this file. This keeps it accurate for every session that follows — the PO should never have to repeat setup information.

---

## Project details

```
Product name:         Buck Hub (formerly "The Roundup")
Product description:  One trusted source of truth for people who own, train, and invest in bucking bulls — track every animal, capture field media even with no signal, and keep partners automatically informed.
Target user:          Ranchers & trainers (primary), bull owners (secondary), and partner-investors (secondary) in the bucking-bull business.
Value proposition:    "No Fluff, No Bull." — One place to see what you own, what it's doing, and the media that proves it. Rugged, grounded, plain-spoken.
Domain:               Not yet acquired — to be connected later.
Brand colors:         Pine green #2B4538 (primary) · Mid green #3C5247 · Sage #8EC398 (accent) · Tan #CEBC84 · Cream #E4DBBD · Paper #FAFAF9 (bg) · Ink #181F19 (text)
Logo file:            public/buck-hub-logo.svg (Brown & Tan, with name) · public/buck-hub-mark.svg (gray mark, no name)
```

---

## Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | Astro (static) | No SSR needed; keep it static |
| Hosting | Vercel | Connected to this GitHub repo; deploys on push to main |
| Analytics + email | PostHog | Source of truth for signups, events, drip emails, and feature flags |
| Email fallback | Loops.so or Resend | Only if PostHog Workflows cannot handle the drip sequence |
| Feedback routing | GitHub Issues | Repo and token in env vars — see TBD section below |
| Notifications | Slack incoming webhook | Webhook URL in env vars — see TBD section below |
| Version control | GitHub | Main branch = production |

---

## Pre-requisite — Scaffold the Astro project first

Before running the PostHog wizard or touching any code, the Astro project must exist. Check for a `package.json` in the project root. If it is not there, the project has not been scaffolded yet.

**Run this first:**

```
npm create astro@latest . -- --template minimal --install --no-git
```

Answer the prompts:
- TypeScript: **Strict**
- Install dependencies: **Yes**
- Git: **No** (we handle this separately)

Once `package.json` exists, continue with PostHog setup.

Do not run `npx @posthog/wizard@latest` before the Astro project exists — the wizard needs a framework to detect.

---

## Environment variables

Never hardcode credentials. All secrets go in `.env` locally and in Vercel's environment settings for production.

```
PUBLIC_POSTHOG_KEY=            # PostHog project API key (public — safe to use client-side). PUBLIC_ prefix is REQUIRED so Astro exposes it to the browser.
PUBLIC_POSTHOG_HOST=           # PostHog ingestion host, e.g. https://us.i.posthog.com (US) or https://eu.i.posthog.com (EU)
GITHUB_TOKEN=                  # see TBD section below
GITHUB_REPO=                   # see TBD section below — format: owner/repo-name
SLACK_WEBHOOK_URL=             # see TBD section below
```

PostHog's public API key is safe to expose in client-side code. It is not a secret.
All other values are set in the TBD section and copied into Vercel's environment settings for production.

---

## PostHog setup

PostHog handles analytics, cohorts, email channels, and the drip workflow. Set up the project before touching code.

**Required before the landing page goes live — skip any item already done:**
- PostHog project created and API key copied into `.env`
- Founder domain configured as sending domain (Settings → Email)
- PostHog email channels active (Settings → Pipelines → Channels)
- Internal cohort created manually: PO, Dev, Tech Lead
- Customer cohort created manually: founder + stakeholders
- Dynamic cohort configured to auto-capture all future signups

On a returning session, check `.env` for `PUBLIC_POSTHOG_KEY` before running through this list — if the key is there, PostHog is already configured.

**If PostHog Workflows cannot handle the drip sequence**, use Loops.so as the first fallback (native PostHog webhook integration). Resend is the second fallback for transactional-only email.

### Event naming convention

Format: `noun_past_tense_verb` — no camelCase, no hyphens.

```
# Landing page — minimum required events
page_viewed
waitlist_signup_submitted      # fires on every successful form submission
waitlist_signup_failed         # fires if submission errors

# Properties on waitlist_signup_submitted
first_name
email
top_problem                    # optional field; empty string if not filled
source                         # UTM source from URL if present
```

Every event must fire correctly against the internal cohort before the page goes live. Do not test on real users.

On a returning session where the page is already live, skip this step — assume events are firing unless the PO reports a specific tracking issue.

### Critical rules — will break things silently if skipped

**Rule 1 — `identify()` must set email as a person property**

PostHog Workflows looks for `person.properties.email` to send emails — it does NOT use the distinct ID even if the distinct ID is the email address. Always pass email explicitly:

```javascript
posthog.identify(email, {
  first_name: firstName,
  email: email,
  waitlisted: true
})
```

If this is missing, the welcome email workflow will error with "No recipient identifier found" and no emails will send.

**Rule 2 — Cohorts: use person property filters, not behavioral filters**

Behavioral cohorts on new events are unreliable in PostHog — they often show "no matching criteria" even when events exist. Use a person property filter instead:

- Set `waitlisted: true` in the `identify()` call at signup
- Create the cohort with filter: `person.properties.waitlisted` **is set** — do not use `= true`. PostHog stores boolean values in a way that breaks exact-match comparisons; `is set` works regardless of how the value is stored.
- This updates instantly on every signup, no lag

If backfilling early signups: query the events table for `waitlist_signup_submitted`, look up each person's UUID via persons-list, then set `email`, `first_name`, and `waitlisted` via persons-property-set for each.

---

### PostHog Workflows — welcome email sequence

PostHog Workflows are available on the free plan (10,000 messages/month including email). No third-party email provider needed.

**How native email works:**
PostHog sends email directly using Amazon SES under the hood. You provide a "from" name and email address, and PostHog generates DNS records (SPF, DKIM, DMARC) that must be added to your domain. Share these with whoever manages your domain's DNS — it is a one-time setup.

Go to: PostHog → Workflows → Channels → + New channel → Email

**DNS notes — treat this as a hard project dependency, not an afterthought:**
- Raise DNS verification at project kickoff — it can take days for IT to action
- Do not build the welcome sequence and assume email will work — verify DNS is green before sharing the page with real users
- Until DNS is verified, all Workflow emails fail silently with "email integration domain is not verified"
- PostHog generates the exact DNS records under Settings → Pipelines → Channels
- Propagation can take up to 48 hours but usually resolves in under an hour
- The SPF record on `@` must be **merged** with any existing SPF record — do not add a second one or email will break
- Records needed: SPF (merge), DKIM (CNAME records), DMARC

**Recommended welcome sequence for any waitlist:**

Trigger: `waitlist_signup_submitted` event
→ Email 1 (immediate): welcome, confirm they're on the list, invite a reply
→ Delay: 1 day
→ Email 2: one open question about their problem (drives replies and early learning)
→ Exit

**Trigger masking:** set hash to `{person.properties.email}` with TTL of `94608000` (3 years) to prevent duplicate welcome emails if the same person submits twice.

**Template variables available in email body:**
- `{{ person.properties.first_name }}`
- `{{ person.properties.email }}`
- `{{ event.properties.source }}` (UTM source if captured)

---

## Landing page — what it must do

**Page structure (in order):**
1. Sticky nav — logo left, layout variant switcher center (desktop only), "Join the waitlist" anchor CTA right
2. Hero — value proposition copy (headline + subtitle + body) on the left, waitlist form on the right
3. Urgency signal — a short line near the form eyebrow (e.g. "First cohort · [audience] only")
4. "What you'll get" section — three feature cards (01 / 02 / 03), each with a title and 2–3 line description
5. Bottom CTA — aspirational one-liner + repeated waitlist form
6. Footer — logo, year, project label

**Form behavior:**
- Two form instances on the page (hero + bottom CTA) — each must have a unique `instanceId` to avoid DOM conflicts
- On submission: fire `waitlist_signup_submitted`, call `posthog.identify`, hide form, show inline confirmation — no redirect
- On mobile: only Center Stage variant applies; variant switcher is hidden

**Layout variants (desktop only):**
- Center Stage — centered, single column, default and mobile fallback
- Side by Side — copy left, form right, two-column hero
- Split — full-viewport two-panel (navy left / navy-card right with coral border)
- Variant preference persists in localStorage; switching always scrolls to top

Every time the URL is shared externally, use a UTM-tagged version (one URL per channel).

### Form success state

On successful waitlist submission:
- Show inline confirmation: "You're on the list. We'll be in touch." — no redirect
- Hide the form, show the success state in the same container
- If multiple form instances exist on the page, all must switch to success simultaneously
- Persist across page reloads using localStorage — returning visitors should never see the form again

Implementation: use a custom DOM event (e.g. `waitlist:signed_up`) to sync multiple instances on the same page load, and `localStorage` to persist the signed-up state across visits.

---

### UTM URL kit — generate before sharing the page externally

Generate one URL per channel before the landing page goes live. PostHog captures UTMs automatically — they appear as the `source` property on every `waitlist_signup_submitted` event.

Always add `utm_campaign=[project-name]-launch` to every URL.

| Channel | utm_source | utm_medium |
|---|---|---|
| Slack DM | `slack` | `dm` |
| Slack channel (e.g. latam-delivery) | `slack` | `[channel-name]` |
| LinkedIn post | `linkedin` | `post` |
| LinkedIn comment | `linkedin` | `comment` |
| Reddit post | `reddit` | `post` |
| Reddit comment | `reddit` | `comment` |

Use one URL per channel every time the page is shared. Never share the untagged base URL externally.

---

### PostHog subscriptions — Slack digest

Set this up after the page is live and signups are coming in. It gives the PO and client a weekly summary without having to log into PostHog.

#### Step 1 — Connect the PostHog Slack app (one-time, admin required)

Go to PostHog → Project Settings → Integrations → Slack → Connect.

This requires workspace admin approval. If you are not the admin, send this message to whoever manages the Slack workspace:

> Hi [admin name], I need the PostHog app approved in our Slack workspace.
> It's used to send automated analytics digests to a project channel — no
> write access to messages, read-only notifications only. You can approve it
> at: Settings → Manage apps → Pending requests. Let me know if you need
> anything else from my end. Thanks!

Once approved, the integration appears in PostHog and you can proceed.

#### Step 2 — Create the insight

A Trends insight must exist before a subscription can be attached to it.

Recommended settings:
- Event: `waitlist_signup_submitted`, math: `total`
- Date range: `-7d`, interval: `day`
- Display: `ActionsBar`, show values on series: on

#### Step 3 — Create the subscription

Go to the insight → Share → Create subscription → Slack.

**Channel access:**
- Public channels appear automatically
- Private channels: type `/invite @PostHog` in the channel first, then paste the channel ID directly into the field (get it from the Slack channel URL: `https://workspace.slack.com/archives/CXXXXXXXXXX`)

**Recommended settings:**
- Frequency: weekly, Friday, 9 AM local time
- Enable "Include an automatic AI summary"

**AI summary context prompt (500 char max):**

> This is a weekly waitlist signups report for [Product Name]. Focus on: total signups this week vs last week, any trend (growing, flat, dropping), and which UTM sources drove the most signups (utm_source property). Flag if any day had a spike or zero. Keep it under 5 bullet points, plain language, no jargon.

Can be paused anytime: PostHog → Subscriptions → toggle enabled off.

---

## Landing page content — collect from PO before building

Do not write any UI copy. Ask the PO for each of these before touching index.astro. Ask one at a time. Do not skip ahead.

If the PO already has an existing HTML file, mockup, or draft landing page, ask them to share it — it is a valid starting point and should be treated as a design and copy reference.

1. **Hero headline** — the big serif statement at the top (e.g. "Product Owners as Traction Engines.")
2. **Subtitle** — one or two lines expanding the headline; can include an italic emphasis line
3. **Body paragraph** — one sentence under the subtitle that reinforces the value
4. **Urgency signal** — who this is for and why now (e.g. "First cohort · Designli POs only")
5. **Feature card 1** — title + 2–3 line description of the first benefit
6. **Feature card 2** — title + 2–3 line description of the second benefit
7. **Feature card 3** — title + 2–3 line description of the third benefit
8. **Bottom CTA headline** — short, aspirational (e.g. "Ready to own traction?")
9. **Bottom CTA subtext** — one sentence that motivates signup (aspirational, not just urgency)

If the PO does not have copy ready, offer to draft based on the product description and value proposition in the Project details block. Always show drafts before writing them into code.

---

## Feedback widget — what it must do

A small button fixed to the bottom right of every page. This is not optional — it goes on the landing page now and on every user-facing surface added later.

**On click, opens a panel with:**
- Feedback type selector: Suggestion / Bug / Question
- Optional email field (no logged-in session on landing page)
- Text area for the message

**On submission:**
- Captures the full current URL including query parameters as a breadcrumb
- Creates a GitHub Issue with: feedback type, breadcrumb, optional email, message
- Sends a Slack notification to the project channel with a summary + link to the Issue
- Shows a confirmation and closes the panel

GitHub repo and Slack webhook values live in the TBD section below — set via env vars, never hardcoded.

---

## Feedback widget — issue response flow

When a GitHub Issue arrives from the feedback widget, follow this exact sequence. Do not skip steps.

### Step 1 — Read the issue

```bash
gh issue view <number> --repo <GITHUB_REPO>
```

Extract: feedback type (Bug / Suggestion / Question), the message body, the submitter email if present, and the page URL breadcrumb.

### Step 2 — Analyze before touching code

- **Bug** — Reproduce the described behavior first. Find the component responsible by reading the referenced page URL and tracing the relevant code. Do not propose a fix until you understand the root cause.
- **Suggestion** — Assess scope before acting. Is it a quick CSS or copy change, or does it require design input? If unclear, ask.
- **Question** — Answer directly if possible. If answering requires a code change, treat it as a Suggestion.

If the issue is ambiguous or the decision belongs to the PO, ask before writing any code.

### Step 3 — Propose, then implement

- **Low-risk changes** (typos, color, copy, spacing): implement first, show the diff, then ask for approval before deploying.
- **Anything requiring judgment** (layout, new behavior, new features): propose the approach and wait for a clear yes before writing code.

### Step 4 — Deploy, close, and notify

Once the fix is live, do all three of these together:

1. Close the GitHub issue with an explanatory comment:
```bash
gh issue comment <number> --repo <GITHUB_REPO> --body "<what changed and why>"
gh issue close <number> --repo <GITHUB_REPO>
```

2. Find the Slack notification for this issue and reply in its thread:
   - Read the project channel to find the bot message that references this issue number
   - Reply with: what was fixed, that it is live, and a link to the production URL
   - Use `thread_ts` so the reply stays inside the notification thread, not as a new channel message

3. Do not report the task as complete until both GitHub and Slack are updated.

**Notes:**
- The Slack notification is posted by the webhook bot at the same moment the issue is created. It will always exist — search the channel if it is not immediately visible.
- Always reply in the thread (`thread_ts`), never as a standalone message in the channel.
- GitHub repo and Slack channel ID are in the TBD section of this file.

---

## File structure

```
/
├── public/
│   └── [logo file]
├── src/
│   pages/
│     └── index.astro          # main landing page
│   components/
│     └── WaitlistForm.astro      # form + PostHog event (supports multiple instances via instanceId prop)
│     └── FeedbackWidget.astro    # feedback button + panel
│     └── VariantSwitcher.astro   # desktop-only layout switcher (Center Stage / Side by Side / Split)
├── .env                       # local secrets — never commit
├── .env.example               # committed template with empty values
├── astro.config.mjs
└── CLAUDE.md                  # this file
```

---

## Design input

A design foundation must exist before building any UI. Accept it in any of these forms — in order of preference:

1. **Claude Design handoff** — if no design assets exist yet, go to claude.ai/design, share the brand colors, logo, and product description, and generate the landing page visuals there. Once the design looks right, ask Claude Design to export a Claude Code handoff package. Attach that package to this session and treat it as the source of truth. This is the recommended starting point when no Figma file exists.
2. **Figma link** — if the Figma MCP is connected, Claude Code can read it directly
3. **Exported screenshot or mockup** — export frames as PNG from Figma and attach them to the session
4. **Brand reference** — logo file, color hex codes, and a description of the visual style

If any design input is provided, treat it as the source of truth for layout, spacing, and visual style. Extract colors, typography, and structure directly — do not invent alternatives. If something is unclear, ask before assuming.

Check the Project details block first — brand colors and logo may already be filled in from setup. Only ask if they are missing.

---

## Conventions

- Static only — no API routes, no server-side rendering unless absolutely required. Client-side JavaScript (including localStorage for variant persistence) is fine; only SSR and API routes are excluded.
- No unnecessary dependencies — if vanilla JS or an Astro component can do it, do not add a library
- All secrets in env vars — `.env` is in `.gitignore`, `.env.example` is committed with empty values
- UTM parameters must be captured on every `waitlist_signup_submitted` event — source attribution starts from day one
- The feedback widget ships on every user-facing surface, not just this page

---

## Git and deployment discipline

Always keep GitHub and production in sync. Follow this sequence after every change:

1. **Deploy first** — `vercel --prod` pushes the change live immediately via CLI
2. **Commit after** — stage only the files you changed, write a clear message explaining why (not just what)
3. **Push to GitHub** — `git push` so the repo matches what is running in production

Never leave commits unpushed. If you deployed but did not commit, GitHub and production are out of sync — that means no rollback history, no audit trail, and no way for another session to know what is actually live.

### Commit message format

```
<short subject line describing why the change was made>

Co-Authored-By: Claude Sonnet 4.6 noreply@anthropic.com
```

The subject line is required — commits with only a co-author trailer are unreadable in GitHub history. Write it as a reason, not a description (e.g. "fix form double-submit on mobile" not "updated WaitlistForm.astro").

### When Claude Code should not deploy automatically

- **Deletions or destructive changes** — explain what will be removed and wait for explicit approval
- **Environment variable changes** — confirm with the PO before touching Vercel env settings
- **Anything that touches the PostHog workflow or email config** — those affect real users; confirm first

For all other changes (copy, styling, bug fixes, new components): deploy → commit → push without asking.

---

## TBD — set per project before first session

```
GitHub repo:        vormaechea-designli/buckhub-landing
Slack channel:      none yet — Slack not set up for this project
Slack channel ID:   none yet
Slack webhook URL:  none yet — feedback widget will create GitHub Issues only until a webhook exists
GitHub token:       not set — gh CLI is not installed; install gh or set GITHUB_TOKEN before using the feedback-widget issue flow
```

---

## Legal pages — Privacy Policy & Terms & Conditions

Every project that collects user data must have both pages live before going public.

**Templates (reuse these for every new project):**
- `docs/privacy-policy-template.md` — GDPR-compliant privacy policy
- `docs/terms-and-conditions-template.md` — Terms & Conditions

Both were generated from [app-privacy-policy-generator.firebaseapp.com](https://app-privacy-policy-generator.firebaseapp.com/) (GDPR type) and adapted as reusable templates.

**To use for a new project:**
1. Replace all `{{PLACEHOLDER}}` values (see the header of each template for the full list)
2. Include or remove conditional sections (`[AI]`, `[LOCATION]`, `[DSA]`, `[UGC]`) based on what the project does
3. Save as `src/pages/privacy.astro` and `src/pages/terms.astro` using the site's layout
4. Add footer links to both pages from every user-facing surface
5. Deploy and confirm URLs are live before any app store submission

**Key placeholders:**

| Placeholder | Example |
|---|---|
| `{{PRODUCT_NAME}}` | The Traction Engine |
| `{{COMPANY_NAME}}` | Designli (or client company) |
| `{{CONTACT_EMAIL}}` | legal contact email |
| `{{BUSINESS_ADDRESS}}` | Registered business address |
| `{{AGE_OF_CONSENT}}` | 13 (US) or 16 (EU) |
| `{{THIRD_PARTY_SERVICES}}` | List only services actually in use |
| `{{EFFECTIVE_DATE}}` | YYYY-MM-DD |

**Data controller:** Designli for internal products. For client projects, confirm with the client before filling in.

---

### When transitioning from waitlist to product / app store submission

Before submitting to Apple App Store or Google Play, update both legal pages to reflect the full product.

**Privacy Policy — update these sections:**
- `{{THIRD_PARTY_SERVICES}}` — add any new services introduced (auth, payments, crash reporting, etc.)
- Add a **Device Permissions** section listing every permission the app requests (camera, notifications, location, contacts) and why
- If the app uses Apple's App Tracking Transparency (ATT), add an explicit tracking disclosure
- Update `{{EFFECTIVE_DATE}}` to the date of the revision

**Terms & Conditions — update these sections:**
- Include/activate the `[UGC]` section if users can post or share content
- Add in-app purchase and refund terms if the app has paid features
- Update `{{EFFECTIVE_DATE}}`

**App store declarations (done in the developer consoles, not in the policy text):**
- **Apple App Store Connect** → Privacy Nutrition Labels — declare every data type collected; must match the policy
- **Google Play Console** → Data Safety form — same requirement; must match the policy

**Rule:** the policy and the store declarations must be consistent. If PostHog is listed in the policy, it must appear in the data safety form. If you add a new SDK, update both the policy and the store form before the next release.

---

## Vercel Firewall — rate limiting

Configure this after the page is live, not during the build phase. Present the recommended settings to the PO and wait for explicit approval before enabling anything — firewall rules affect live production traffic.

| Surface | Threshold | Action | Reason |
|---|---|---|---|
| Public landing page | 50 req/min | challenge | Shared IPs, SEO crawlers, real humans |
| Form submission | 10–20 req/min | deny | Low legitimate frequency |
| Auth / login | 10 req/min | deny | Credential stuffing risk |
| Internal / invite-only | 15–20 req/min | deny | Known audience, no shared IP risk |

**Action meanings:**
- `challenge` — presents a CAPTCHA-style check; real humans pass, bots almost never do. Use on public pages where locking people out would hurt conversion.
- `deny` — returns a hard 429. Use on endpoints where abuse is expensive and real users rarely hit the limit.

**How to configure:**
Vercel Dashboard → Project → Firewall → Create rule → Rate limiting → set threshold, surface, and action.

This is a mid-to-high risk change. Show the PO which rules you plan to create and wait for a clear yes before saving any rule.

---

## Before asking the PO to do something manually

Always check if what you need already exists before asking the PO to go get it. Specifically:

- **GitHub token** — run `gh auth token` first. If the CLI is authenticated and the token has `repo` scope, use it directly. Do not ask the PO to generate a new one.
- **Vercel project** — run `vercel list` before asking if a project exists. Check `.vercel/project.json` before asking to link.
- **PostHog API key** — check `.env` first. If the wizard already ran, the key is there.
- **Domain availability** — use the Vercel MCP tool to check before asking the PO to look it up.

General rule: exhaust available tools and existing config before escalating to the PO. The PO's time is the bottleneck — only involve them when there is genuinely no other way.

---

## What Claude Code should not do

- Do not create accounts on the PO's behalf — guide them to do it, then wait. Retrieving credentials that already exist (via CLI or .env) is fine — see the Before asking the PO section above.
- Do not add a backend or database — PostHog is the data layer for this phase
- Do not implement auth — not needed on the landing page
- Do not add a CMS — content is hardcoded for this phase
- Do not activate Loops.so or Resend unless PostHog email is explicitly confirmed as unavailable

---

*Designli | TractionLab | PO-owned | Landing Page Phase*
