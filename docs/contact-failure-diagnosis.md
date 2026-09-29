# Contact failure diagnosis and fix

Investigated September 28, 2026 (America/Los_Angeles), against main commit `f0cd00895e56ef6d7003259958cda489e3580396` after PR3 was merged.

## User-visible failures

The visitor could not submit the Let's talk form: the website said the email was being configured. Clicking the displayed email address did not open a usable draft on the user's device. These are separate paths: the form calls the site's Resend API route, while an email-address link uses the browser/operating system's `mailto:` handler.

## Production evidence

1. Opening `https://thepassconsulting.com` returned a 308 redirect to `https://www.thepassconsulting.com/`, which loaded successfully.
2. The page's contact anchors correctly contained `mailto:inquiries@thepassconsulting.com?subject=%5BThe%20Pass%20website%5D%20Inquiry`. The address itself was not misspelled.
3. From the loaded page, an intentionally invalid, empty JSON POST (`{}`) to `/api/inquiry` returned HTTP **503** with:

   ```json
   {"ok":false,"message":"The inquiry form is being configured. Please email Michael directly."}
   ```

4. That empty request cannot pass field validation or send email. In the deployed source, the only 503 branch before field validation was the missing/invalid `SITE_URL` check. The sender/key 503 branch was later, after validation. This isolates the first production failure to origin configuration, before Resend is contacted.
5. The deployed page had no canonical link. The metadata helper also depended on a valid `SITE_URL`, consistent with the same configuration failure.

This proves `SITE_URL` was missing or invalid from the route's perspective, not which exact value was stored in Vercel. No private environment values were read. It does not prove the Resend key, sender verification, mailbox, or inbox delivery are ready; those later stages were not reached.

## Why the previous implementation failed

The API treated the optional site URL/metadata setting as a mandatory email prerequisite. Every submission returned the same configuration error when that setting was absent or malformed, even though the production hostname was already known. It also accepted only the configured hostname: setting the redirecting apex as `SITE_URL` could reject the real `www` page with 403.

The previous tests covered explicit, correctly configured origins and asserted that an absent `SITE_URL` should return 503. They therefore encoded the deployment failure as expected behavior. A successful build and Vercel deployment did not exercise email delivery.

The email hyperlink used a valid `mailto:` URL. [MDN documents that this scheme opens the user's email program](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a#linking_to_an_email_address). The user's mail-handler settings were not inspected, so their exact device-level cause is unverified. The website offered no browser-based alternative when that handoff failed.

## Changes

- Centralize the verified production origin, `https://www.thepassconsulting.com`, in `src/lib/site.ts`. An absent or invalid `SITE_URL` now falls back to this fixed value. Metadata and form origin handling use the same resolver.
- Always permit that exact production origin, while retaining valid explicit local/custom origins and the exact platform-provided Vercel preview hostname. No wildcard, reflected host-header trust, or arbitrary-subdomain acceptance is introduced.
- Keep the Resend key and business sender required. Missing or invalid provider settings still fail before a send; the response now explains temporary unavailability and points visitors to working contact alternatives instead of implying their own email needs setup.
- Add shared **Open Gmail** and **Copy email address** actions to the contact section, footer, and form idle/error/success states. Gmail uses HTTPS and can open without a local mail handler. Neither action sends automatically, and neither transfers the typed form message. Existing email-app links remain available.
- Preserve error focus and entered form fields. Clipboard failures provide truthful feedback and leave a selectable address. New actions have keyboard access, visible focus, 44px minimum targets, and no motion.
- Add `npm run check:email`, using the same sender/key validation as the API. It reports fixed issue codes without disclosing secrets and clearly distinguishes local configuration checks from live provider verification.

## Regression and verification results

Five new regression groups failed against the old handler before implementation: missing/malformed site URL, an empty non-delivering production probe, the apex/`www` mismatch, hostile origins under the default, and previews without `SITE_URL`. The existing 21 tests passed in that run. After implementation, those groups pass while foreign origins, missing origin headers, recipient overrides, stale senders, provider failures, and idempotency behavior remain protected.

All **29 tests**, lint, type checking, and the production build passed. Additional tests cover diagnostic redaction, safe canonical URL resolution, and consistent mailto/Gmail recipient and subject. The configuration checker returned exit 1 with missing sender/key settings and exit 0 with syntactically valid test values; neither run contacted a provider.

Local production browser checks passed at widths 1440, 390, and 320 with no horizontal overflow. The error summary took focus, retained the entered fields, and displayed Gmail/copy alternatives. A mocked success response displayed the same alternatives and moved focus to the status. Keyboard traversal reached both new actions; targets measured 44px high with no animation. The headless browser denied clipboard access, and the UI showed the manual-copy fallback. A browser-only clipboard mock separately verified the exact copied address and success announcement; OS clipboard integration was not proven. The Gmail URL reached Google's sign-in flow with the compose recipient/subject preserved in the continuation URL; signed-in drafting was not tested. Provider calls in automated tests are mocked. No full cross-browser or OS reduced-motion regression was performed for this change; no motion was added.

## Deployment and remaining checks

Independent review caught a no-script CSS specificity issue in the new copy control. The selector was corrected, and a browser fixture containing the rendered page with script execution disabled confirmed all three copy controls were hidden while Gmail links remained visible. Error/success status containers were also separated from copy feedback; browser checks confirmed focus remained correct and no live regions were nested. These checks do not replace a full screen-reader or top-level JavaScript-disabled browser session. All 29 tests, lint, type checking, and the production build passed again after the review fixes.

Merge and redeploy the reviewed fix. Confirm `RESEND_API_KEY` and `CONTACT_FROM=The Pass <inquiries@thepassconsulting.com>` are present in Vercel **Production**, with `thepassconsulting.com` verified in Resend. `SITE_URL` can be omitted for the current production domain; if retained, set it to `https://www.thepassconsulting.com`. Run the [live delivery checklist](email-setup.md#live-delivery-checklist) to prove receipt and reply behavior.

No account settings, DNS, mail filters, or credentials are changed by this PR. No real inquiry is sent by the diagnostic reproduction or tests. The live production site remains on its previous code until the user merges/deploys. The browser Gmail link reaches Google's sign-in flow when logged out; a signed-in Gmail compose session and final inbox delivery require separate confirmation.
