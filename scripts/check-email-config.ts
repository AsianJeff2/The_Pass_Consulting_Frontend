import { emailConfigurationIssues, type EmailConfigurationIssue } from "../src/lib/inquiry.ts";
import { configuredSiteOrigin, siteOrigin } from "../src/lib/site.ts";

const explanations: Record<EmailConfigurationIssue, string> = {
  RESEND_API_KEY_MISSING: "Set RESEND_API_KEY in the environment that will send email.",
  RESEND_API_KEY_INVALID: "Replace RESEND_API_KEY with a key without whitespace; do not paste it into logs or source.",
  CONTACT_FROM_MISSING: "Set CONTACT_FROM to The Pass <inquiries@thepassconsulting.com>.",
  CONTACT_FROM_INVALID: "CONTACT_FROM must use inquiries@thepassconsulting.com, with an optional display name and no newlines.",
};

const issues = emailConfigurationIssues({
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_FROM: process.env.CONTACT_FROM,
});
console.log(`Website origin: ${siteOrigin(process.env.SITE_URL)}`);
if (!configuredSiteOrigin(process.env.SITE_URL)) {
  console.log("SITE_URL is absent or invalid; using the built-in production origin.");
}
for (const issue of issues) console.error(`${issue}: ${explanations[issue]}`);
console.log("This check reads local configuration only. It sends no email and does not verify the API key, domain, or mailbox with a provider.");
if (issues.length) process.exitCode = 1;
else console.log("Local email configuration checks passed. Verify the corresponding Vercel environment, redeploy, and run the delivery checklist.");
