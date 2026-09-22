# Business email and website inquiries

The public contact address is **inquiries@thepassconsulting.com**, a dedicated business mailbox. It is shared by the homepage, footer, privacy notice, form fallback links, and server routing through `src/lib/contact.ts`.

| Mail flow | From | To | Reply behavior |
| --- | --- | --- | --- |
| Website form notification through Resend | `The Pass <inquiries@thepassconsulting.com>` | `inquiries@thepassconsulting.com` | `reply_to` is the visitor's validated address |
| A visitor using a website email link | The visitor's email account | `inquiries@thepassconsulting.com` | Reply from the dedicated business mailbox |
| Michael's personal response to an inquiry | `inquiries@thepassconsulting.com` through the mailbox provider | The visitor | Continue the conversation in the business mailbox |

The form posts to `/api/inquiry`. The server validates the submission, fixes the recipient, and sends one plain-text notification through Resend. Visitors cannot choose `to`, `from`, or `reply_to`. Every form subject starts with `[The Pass website]`; email links prefill `[The Pass website] Inquiry`. There is no automated email to the visitor.

This migration updates repository configuration and routing. It does not provision the business mailbox, change DNS or Vercel settings, connect a Google account, or import a filter. No live email is sent by the automated tests. The endpoint returns `{ "ok": true }` only when Resend returns a successful response containing an email ID. Provider acceptance does not guarantee inbox placement; the email can still bounce or be filtered later.

## Dedicated mailbox and DNS

1. Provision `inquiries@thepassconsulting.com` as the dedicated mailbox with your mail provider. Website hosting, a CNAME, and MX records alone do not create it. Confirm you can sign in as that business user. If using Google Workspace, activate Gmail for the user.
2. Keep the root domain's MX records pointing to the mailbox provider. A public DNS check on September 21, 2026 returned `smtp.google.com` for `thepassconsulting.com`; that identifies the configured inbound route, but does not establish that the mailbox is provisioned or working.
3. Verify `thepassconsulting.com` as the sending domain in Resend, since the visible sender uses that exact domain. Install the exact sending records shown in that domain's **Records** tab at their specified DNS names. Resend may provide CNAME records or an MX/TXT setup; do not substitute a generic template. If it lists a sending MX record, that belongs at the return-path subdomain shown by Resend, not in place of Google's root MX. A CNAME cannot share its hostname with other record types. Enabling Resend Receiving is not part of this setup; incoming conversations belong in the business mailbox.
4. Configure outbound mail authentication for the mailbox provider as well as Resend. Follow each provider's SPF and DKIM instructions at the correct hostnames; do not create multiple SPF policies at one hostname. Check the domain's DMARC alignment for both sending paths before tightening its policy. Do not copy placeholder DNS values from this repository.
5. In the business mailbox, set the display name and signature to The Pass Consulting / Michael Park. Replies must use `inquiries@thepassconsulting.com` as From. The website's Resend key does not configure Gmail's sending account or signature.

See [Google Workspace Gmail activation and MX setup](https://knowledge.workspace.google.com/admin/domains/set-up-mx-records-for-google-workspace), [Resend DNS coexistence guidance](https://resend.com/docs/knowledge-base/how-do-i-avoid-conflicting-with-my-mx-records), and [Google's SPF troubleshooting guide](https://knowledge.workspace.google.com/admin/security/troubleshoot-spf-issues).

## Configure Resend and Vercel

1. Complete domain verification in Resend. The required sender mailbox is `inquiries@thepassconsulting.com`; a display name is allowed. The server rejects every other sender mailbox, including old personal addresses, placeholders, test senders, and subdomain variants, with a 503 configuration response before any provider call.
2. Create a Resend API key with sending access, scoped to that domain when available. Keep the key in Vercel's server environment settings. Never use a `NEXT_PUBLIC_` variable or commit a key.
3. Set these environment variables in Vercel, then redeploy:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Your sending API key |
   | `CONTACT_FROM` | `The Pass <inquiries@thepassconsulting.com>` |
   | `SITE_URL` | Your canonical website origin, for example `https://thepassconsulting.com`, without a path; use the `www` origin instead if that is canonical |

4. Update existing values in **Production** and any **Preview/Development** environments where email is enabled. A PR does not overwrite saved Vercel values. Redeploy each affected environment after saving. Choose one canonical production hostname and redirect other aliases to it. The endpoint accepts the exact `SITE_URL` origin. For local development, use `http://localhost:3000`. Vercel preview deployments also accept their exact platform-provided `https://VERCEL_URL` hostname when `VERCEL_ENV=preview`. These two platform variables need no custom value; wildcard `*.vercel.app` origins are never allowed. A custom preview alias must instead be configured as that environment's `SITE_URL`. A configured preview sends real mail to the business mailbox; omit the Resend key in previews where sending should stay disabled.
5. Configure persistent rate limiting before exposing the email endpoint publicly, as described below.
6. Follow the live delivery checklist below after deployment. Check Resend's delivery/bounce records if an accepted inquiry does not arrive.

The application does not fall back to a personal address or Resend's default testing sender. Until the mailbox and verified domain are ready, use the mocked tests below. See [the send-email API](https://resend.com/docs/api-reference/emails/send-email) for From and Reply-To behavior.

## Business Gmail label and filter

If the dedicated mailbox uses Google Workspace, sign in to Gmail **as inquiries@thepassconsulting.com**, then create the parent label **The Pass** and a child label **Website inquiries**. The full label name is `The Pass/Website inquiries`. Importing this filter into the personal Gmail account does not move it to the business mailbox or forward mail.

Create a filter with:

- **To:** `inquiries@thepassconsulting.com`
- **Subject:** `"The Pass website"`
- **Action:** Apply the label `The Pass/Website inquiries`.
- Leave **Skip the Inbox**, **Mark as read**, **Delete it**, and **Forward it** unchecked.

Leave **From** empty so the label catches both Resend form notifications and visitors using the website's direct email link. Those direct emails come from the visitor's account. The subject condition limits this label to website inquiries; ordinary business mail without that subject remains in the Inbox. Labels organize messages; they are not proof a sender is trustworthy.

Alternatively, Gmail's **Settings → See all settings → Filters and Blocked Addresses → Import filters** can import [`gmail-filter.xml`](../gmail-filter.xml). Review its conditions and actions before confirming. The import uses the subject and business recipient, does not archive, and does not mark messages as read. Existing matching email is labeled only if you choose to apply the filter to matching conversations. The old personal-account filter and historical messages are not changed by this repository. For another mailbox provider, create an equivalent recipient/subject rule and folder or label there.

This repository contains an import file and instructions, not a claim that the Gmail account has been changed. Gmail filter behavior is documented in [Google's filter guide](https://support.google.com/mail/answer/6579).

## Live delivery checklist

After configuration and deployment, use a separate test address you control:

- Send a direct message to the business address and confirm arrival. Reply from the business mailbox and verify the external recipient sees `inquiries@thepassconsulting.com` as From.
- Submit the deployed form once. Confirm a Resend email ID and delivered event, then confirm the message reaches the business Inbox with the website label. Check spam if needed; acceptance alone is insufficient.
- Open Reply on that notification. Verify **To** is the visitor's test address and **From** is the business address, then confirm the response arrives externally.
- Open a website email link and send the prefilled subject. Confirm this visitor-originated email gets the same label and stays in the Inbox.
- If the form returns a configuration error, verify the saved `CONTACT_FROM` and server key, environment scope, and redeployment. If Resend rejects delivery, check sender-domain verification and provider events. Do not switch back to the personal address as a workaround.

These checks send real messages and are not run by the automated suite or by creating this PR.

## Delivery behavior and abuse controls

The endpoint rejects invalid fields, missing consent, populated honeypots, foreign origins, unsupported JSON, and bodies larger than 16 KiB. The byte limit applies while streaming, even if Content-Length is missing or false. Names and email header fields cannot contain control characters or newlines. Message content is plain text. No visitor data, provider response bodies, or API keys are logged by this application.

Resend requests time out after eight seconds and never follow redirects. Each submission sends an `Idempotency-Key` derived from a UUID generated by the form. The form must preserve that UUID and the unchanged fields for a retry, and generate a new one when the user edits the submission. Resend keeps these keys for **24 hours**; a retry outside that window can send another email. A connection failure can occur after acceptance, so the UI reports delivery as unconfirmed and allows an unchanged retry. A concurrent submission conflict also asks the visitor to wait and retry unchanged. Only a confirmed `invalid_idempotent_request` error advises a new submission; an unknown conflict never asks the visitor to discard the existing key. There is no durable inquiry database or background delivery queue. See [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).

Origin checks and a honeypot reduce browser-driven spam, but a script can forge an Origin header and leave the honeypot empty. They are not a sufficient public production rate limit. Do not add an in-memory counter: Vercel instances do not share its state and instances restart.

Before launch, configure **Vercel Firewall rate limiting** for the exact `/api/inquiry` path. Fixed Window limiting is available on all plans; Hobby includes one rule. In the project dashboard, open **Firewall → Configure → New Rule**, set conditions for pathname `/api/inquiry` and method `POST`, choose **Rate Limit**, group by source IP, and start with five requests per 60 seconds. The default rejection response is HTTP 429. Use **Review Changes → Publish** to activate the rule, then verify that excess requests are blocked before they reach Resend.

Vercel counts these requests per region. This is not a global hard cap across all regions or all senders. Review the threshold against real traffic and shared-network users, monitor Resend usage, and set a provider spend/usage alert where available. Check your plan's current terms before publishing the rule. The repository does not activate this account-level control. If a deployment cannot provide durable rate limiting, provision a shared durable service before enabling the public form. See [Vercel rate limiting](https://vercel.com/docs/security/vercel-waf/rate-limiting).

The website is a lead form. It accepts no attachments, does not start the consulting engine, and sends no automated client advice or confirmation email. Michael reviews inquiries and replies from the business mailbox. Apply appropriate access and retention practices to the resulting mailbox and Resend records.

## Verification

`npm test` uses Node's built-in test runner and a mocked provider. It covers business sender and recipient routing, visitor Reply-To, rejection of stale sender identities and request routing overrides, retry payload stability, input/consent validation, CRLF injection, honeypots, configuration failures, origin and preview rules, actual streamed byte limits, provider errors and throttling, timeouts, and malformed provider receipts. Tests do not require a Resend key, domain, Google account, or network access.
