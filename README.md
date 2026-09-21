# The Pass Consulting

A public hospitality consulting website for Michael Park, built with Next.js, React, TypeScript, and Three.js. Designed for independent restaurant operators in Southern California and beyond.

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
- Server-side Resend endpoint with fixed recipient `michaelpark20783@gmail.com`, reply-to routing, bounded input, origin checks, honeypot, provider timeout, and retry idempotency.
- Contact privacy page, custom 404, favicon, generated social image, sitemap, and robots metadata. Preview deployments are marked noindex. A valid HTTPS `SITE_URL` enables production sitemap URLs.
- Gmail filter import file for `The Pass/Website inquiries`, preserving the Inbox and unread status.

No client portal, document uploads, analytics trackers, or connection to the internal consulting production engine is included. Sample document graphics are labeled illustrative and contain no client outcomes or private data.

## Verify

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Tests use Node's built-in runner and mock Resend. They make no live email requests. The build prerenders the public pages; `/api/inquiry` remains a server function.

## Deploy to Vercel

1. Import `AsianJeff2/The_Pass_Consulting_Frontend` and select the reviewed branch or merge the PR yourself. Use the Next.js preset, Node 22.x or 24.x, `npm ci`, and `npm run build`; keep the default output directory.
2. Add `RESEND_API_KEY`, `CONTACT_FROM`, and the canonical HTTPS `SITE_URL` in server environment settings. Use a domain you own and have verified in Resend. Redeploy after changing environment values.
3. In Vercel Firewall, rate-limit POST requests to `/api/inquiry` before enabling the public email form. The code does not provision an account-level firewall rule.
4. Set up the Gmail label and filter and run a real delivery check. Provider acceptance, Gmail receipt, label application, and reply-to behavior must all be checked after configuration.

See [email and Gmail setup](docs/email-setup.md) for exact steps and [design notes](docs/design-notes.md) for the visual direction and content boundaries.

## Main files

| File | Purpose |
| --- | --- |
| `src/app/page.tsx` | Public page content and sections |
| `src/app/globals.css` | Palette, typography, layout, responsive styles |
| `src/components/PassSculpture.tsx` | Three.js place setting and SVG fallback |
| `src/components/ScrollSequence.tsx` | Progressive headline entrances and scroll-linked scene/progress |
| `src/components/InquiryForm.tsx` | Form states and accessible validation |
| `src/lib/inquiry.ts` | Server validation and email delivery |
| `src/app/api/inquiry/route.ts` | Next.js endpoint and environment boundary |
| `tests/inquiry.test.ts` | Email and request-boundary regression checks |
| `gmail-filter.xml` | Importable Gmail filter |

The public email address is intentional. No credential is required or exposed in browser JavaScript. Final domain, sender verification, Gmail authentication, and live delivery are owner-specific setup.
