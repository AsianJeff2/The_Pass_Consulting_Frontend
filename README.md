# The Pass Consulting

A public restaurant consulting website, built with Next.js, React, TypeScript, and Three.js. Designed for independent restaurant operators in Southern California and beyond.

This branch contains a release candidate prepared September 30, 2026. The website already has an earlier live deployment. These local changes await controller integration and owner publication; this README does not claim that the new pages are live.

## Run locally

Use Node 22.18+ (or Node 24) and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. In PowerShell, copy the environment template with `Copy-Item .env.example .env.local`. The dev server binds to loopback only. Use the same hostname as `SITE_URL`: if you instead browse to `http://127.0.0.1:3000`, set that exact origin in `.env.local` and restart. Otherwise the inquiry endpoint rejects the mismatched origin.

The page works without an email account. A form submission shows an honest configuration error until the server environment is set. There is no simulated success mode in the shipped code. Never put secrets into a `NEXT_PUBLIC_` variable or commit `.env.local`.

## Included

- Responsive homepage with expertise, approach, illustrative deliverables, founder introduction, FAQs, and an inquiry form.
- Editorial ivory/forest/brass design with open service rows, overlapping chapters, a sticky desktop process narrative, and short headline entrances. Native scrolling remains intact; reduced-motion preferences disable choreography.
- Original interactive Three.js place setting with ceramic, brass, and glass. Three.js loads separately; the scene renders on demand and falls back to an original static SVG when WebGL is unavailable.
- Keyboard navigation, skip link, visible focus, labeled fields, inline validation, preserved inputs after failures, and accepted-for-sending confirmation.
- Direct email links plus browser-based Gmail and copy-address alternatives, including form failure and success states.
- Server-side Resend endpoint with `inquiries@thepassconsulting.com` as the fixed recipient and required sender mailbox, visitor reply-to routing, bounded input, origin checks, honeypot, provider timeout, and retry idempotency.
- Service index (`/services`) and four service detail routes covering operational diagnostics, labor and staffing, food and operating costs, and sales and guest demand. Each page has a distinct main heading, absolute title, self-canonical, and share metadata. Service pages include factual Service and BreadcrumbList JSON-LD; home includes WebSite data.
- Complete privacy notice (`/privacy`), privacy-request guide (`/privacy/requests`), data protection overview (`/data-protection`), client-record sharing guide (`/data-protection/client-records`), and website terms (`/terms`). Each uses the existing legal-page design, shared topic navigation, breadcrumbs, distinct metadata, and a self-canonical. The public pages explain scope and intake prerequisites; unsigned engagement contracts and internal procedures stay private.
- Custom 404 title, favicon, generated social image, eleven-URL sitemap, and robots metadata. Preview deployments are marked noindex. The production URL defaults to `https://www.thepassconsulting.com`; a valid `SITE_URL` can override it for another configured origin.
- Gmail filter import file for the dedicated business mailbox's `The Pass/Website inquiries` label, preserving the Inbox and unread status.

No client portal, document uploads, analytics trackers, or connection to the internal consulting production engine is included. Sample document graphics are labeled illustrative and contain no client outcomes or private data.

## Verify

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Tests use Node's built-in runner and mock Resend. They make no live email requests. The build prerenders the public pages; `/api/inquiry` remains a server function.

## Before publication

The owner and controller must complete these gates before publishing this candidate:

- Confirm the exact legal entity name, formation status, operating name, and Michael Park's relationship to that entity. Have counsel confirm which person or entity provides the services and controls the website and outreach data.
- Align the public operator and data-responsible identity across the five public privacy/data protection/terms pages and the publisher/provider JSON-LD in `src/lib/seo.ts` with that confirmation. Check the mirrored notice drafts and contracts for the same identity. The candidate currently names Michael Park as a Person in JSON-LD; this is an interim source choice pending confirmation, not a resolved LLC identity.
- Set each dated public legal notice's effective and last-updated date to the actual publication date in the controller's deployment commit. The current September 30, 2026 dates identify the prepared candidate, which has not been published. Check the staged source and mirrored drafts before release; do not publish stale candidate dates.
- Verify the privacy mailbox and activate the private privacy-request register and retention review before publishing the request procedures. Check actual hosting, email, and outreach-provider collection and production settings against the public copy; correct any mismatch. Keep business outreach conditional until its launch gates pass.
- Obtain California counsel's review of all five public legal pages and the law that applies to the actual business and records before release. A review PR or these summaries does not establish CCPA, GLBA, or other legal coverage.
- After those edits, rerun the registered verification commands and obtain independent review of the final source. Retain `https://www.thepassconsulting.com` as the production origin; recheck redirects, canonicals, robots, all eleven public URLs, and the sitemap after release. A review PR does not clear those publication gates.

## Deploy to Vercel

1. Import `AsianJeff2/The_Pass_Consulting_Frontend` and select the reviewed branch or merge the PR yourself. Use the Next.js preset, Node 22.x or 24.x, `npm ci`, and `npm run build`; keep the default output directory.
2. Verify `thepassconsulting.com` for sending in Resend. Add `RESEND_API_KEY` and set `CONTACT_FROM` to `The Pass <inquiries@thepassconsulting.com>` in Vercel's server environment settings. `SITE_URL` is optional for the current production domain; if set, use `https://www.thepassconsulting.com`. Update existing Production and any enabled Preview/Development values, then redeploy. Missing provider settings or a different sender mailbox still return 503 without contacting Resend.
3. In Vercel Firewall, rate-limit POST requests to `/api/inquiry` before enabling the public email form. The code does not provision an account-level firewall rule.
4. Confirm the dedicated `inquiries@thepassconsulting.com` mailbox can receive and send mail. Import the filter into that mailbox and run a real delivery check. Verify provider acceptance, mailbox receipt, label application, and a reply from the business address to the visitor.

See [business email setup and migration](docs/email-setup.md) for exact steps and [design notes](docs/design-notes.md) for the visual direction and content boundaries. Changing website code does not update Vercel environment values, provision a mailbox, or change DNS.

For a non-delivering configuration check, run `npm run check:email`. It reads your shell environment and `.env.local` if present, uses the same sender/key validation as the endpoint, and reports fixed issue codes without printing credentials. It does not read Vercel's remote settings or verify the key/domain with Resend. See the [contact failure diagnosis](docs/contact-failure-diagnosis.md) for the reproduced production error and fix.

## Main files

| File | Purpose |
| --- | --- |
| `src/app/page.tsx` | Homepage content and WebSite structured data |
| `src/app/services/page.tsx` | Restaurant consulting service index |
| `src/app/services/[slug]/page.tsx` | Four static service pages and breadcrumb semantics |
| `src/lib/seo.ts` | Authored service content, absolute metadata, and escaped JSON-LD |
| `src/app/privacy/page.tsx` | Complete website and planned outreach privacy notice candidate |
| `src/app/privacy/requests/page.tsx` | Public request and stop-contact instructions |
| `src/app/data-protection/page.tsx` | Engagement data principles and intake prerequisites |
| `src/app/data-protection/client-records/page.tsx` | Approved inputs, transfer boundaries, and closeout |
| `src/components/LegalNavigation.tsx` | Shared topic navigation and legal-page breadcrumbs |
| `src/lib/legal.ts` | Five public legal routes used by navigation and sitemap |
| `src/app/terms/page.tsx` | Website terms candidate |
| `src/app/sitemap.ts` | Eleven public canonical URLs |
| `src/app/globals.css` | Palette, typography, layout, responsive styles |
| `src/components/PassSculpture.tsx` | Three.js place setting and SVG fallback |
| `src/components/ScrollSequence.tsx` | Progressive headline entrances and scroll-linked scene/progress |
| `src/components/InquiryForm.tsx` | Form states and accessible validation |
| `src/components/EmailOptions.tsx` | Gmail compose and copy-address alternatives |
| `src/lib/contact.ts` | Shared public email address, inquiry subject prefix, and mailto link |
| `src/lib/inquiry.ts` | Server validation and email delivery |
| `src/lib/site.ts` | Trusted production origin and optional origin configuration |
| `scripts/check-email-config.ts` | Non-delivering local email configuration check |
| `src/app/api/inquiry/route.ts` | Next.js endpoint and environment boundary |
| `tests/inquiry.test.ts` | Email and request-boundary regression checks |
| `gmail-filter.xml` | Importable Gmail filter |

The public email address is intentional. No credential is required or exposed in browser JavaScript. Sender verification, business mailbox provisioning, Vercel configuration, and live delivery require account-level setup.
