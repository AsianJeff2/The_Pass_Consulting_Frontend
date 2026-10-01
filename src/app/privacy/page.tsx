import { CONTACT_EMAIL, PRIVACY_MAILTO } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import LegalNavigation, { LegalBreadcrumb } from "@/components/LegalNavigation";

export const metadata = pageMetadata(
  "Privacy notice",
  "How The Pass Consulting handles website inquiries, planned business outreach, and privacy requests.",
  "/privacy",
);

export default function PrivacyPage() {
  return <main id="main" className="legal-page container">
    <LegalBreadcrumb currentPath="/privacy" />
    <span className="eyebrow">THE PASS CONSULTING</span>
    <h1>Your <em>privacy.</em></h1>
    <p className="legal-intro">Michael Park operates The Pass Consulting and uses your inquiry to discuss your business and a possible engagement.</p>
    <p>Effective and last updated September 30, 2026.</p>
    <LegalNavigation currentPath="/privacy" />

    <h2>Information you share</h2>
    <p>The inquiry form asks for your name, email address, business name, optional city or region, area of interest, and message. It also sends your permission to receive a reply and a random submission reference that helps prevent duplicate emails.</p>
    <p>Share a short overview. Leave out financial records, bank or payment card details, passwords, and information about employees or guests. The website accepts no file uploads. Michael will discuss an appropriate way to share client records after you agree on the scope and data safeguards for an engagement.</p>

    <h2>How Michael uses your information</h2>
    <p>Michael reads and responds to inquiries, discusses potential engagements, and keeps correspondence needed for those discussions. Submitting the form does not subscribe you to a marketing list. Michael does not sell inquiry information or share it for cross-context behavioral advertising.</p>

    <h2>Business outreach</h2>
    <p>If Michael starts business consulting outreach, he will use business contact details from public business sources or introductions. He will keep minimal contact details, the source, and brief notes about the business&apos;s fit for consulting in a private CRM. He will use these records to assess a possible engagement and manage relevant conversations. Permission to reply to a website inquiry does not authorize adding you to an outreach sequence.</p>
    <p>Michael will review outreach sources and the continued need for contact records every 90 days. He will remove unused details when there is no continuing business need, subject to an active conversation, an engagement, a request or dispute, and legal recordkeeping duties.</p>
    <p>Michael sends outreach himself. Reply &quot;no thanks&quot; to an outreach message or email the address below to stop commercial outreach. He will act promptly and keep a minimal suppression record so the address is excluded from future outreach. The prepared CRM stores a hashed email address, objection date, and brief reason for this purpose. A hashed address is not anonymous. Michael will limit access and retain the marker while outreach continues, subject to legal retention review.</p>

    <h2>Services that handle an inquiry</h2>
    <p>The website runs on Vercel. The server sends an accepted inquiry through Resend to the business mailbox at {CONTACT_EMAIL}. It includes your email address as the reply-to address. Vercel, Resend, and the business mailbox provider handle information needed to host the site, deliver messages, and maintain the mailbox. Michael may also disclose information to meet a legal obligation or protect people, records, or the service.</p>
    <p>You can use an email link instead of the form. Your email provider then handles your message. The Open Gmail link opens Google&apos;s compose service with the business address and subject; it does not send your message or copy the form fields. These services apply their own privacy policies, including <a href="https://vercel.com/legal/privacy-notice">Vercel&apos;s</a>, <a href="https://resend.com/legal/privacy-policy">Resend&apos;s</a>, and <a href="https://policies.google.com/privacy">Google&apos;s</a>.</p>

    <h2>Technical data and tracking</h2>
    <p>The website does not set advertising or analytics cookies or include third-party tools for tracking your activity across websites. The hosting and email providers may process IP addresses, browser or request information, and delivery or security logs to operate their services. The application keeps no separate inquiry database and does not log your inquiry fields.</p>
    <p>The website does not change its behavior in response to a browser Do Not Track signal. Michael does not enable cross-site behavioral tracking on the website.</p>

    <h2>Retention and requests</h2>
    <p>Michael keeps correspondence for the inquiry or engagement and related business records, then reviews it for deletion. The relevant factors include whether you proceed with an engagement, an outstanding request or dispute, and legal recordkeeping duties. Providers control their own log and backup schedules. A deletion from the mailbox may not remove a provider backup at the same time.</p>
    <p>Email <a href={PRIVACY_MAILTO}>{CONTACT_EMAIL}</a> with the subject &quot;Privacy request&quot; to ask about your information, request a correction or deletion, or raise a privacy concern. Michael handles these requests and may ask for information needed to verify your request. You may withdraw permission for further inquiry follow-up through the same address. Michael may keep records that law requires or that he needs to resolve a dispute.</p>

    <p>The <Link href="/privacy/requests">privacy requests guide</Link> explains what to include and how Michael handles a request. For a paid engagement, see the <Link href="/data-protection">data protection overview</Link> and the <Link href="/data-protection/client-records">guide to sharing client records</Link>.</p>

    <h2>Client records and children</h2>
    <p>Michael handles records for a paid engagement under the signed agreement and its data protection terms. This public inquiry form serves business owners and representatives. Michael does not direct the site to children under 13 or seek their information.</p>

    <h2>Changes to this notice</h2>
    <p>Michael will post changes on this page and update the date above. He will provide a prominent notice or contact affected people about a material change. He will not use information he already holds for a materially different purpose without the affected person&apos;s consent. This does not prevent a disclosure or retention that law requires.</p>
    <Link className="text-link" href="/#inquiry">Return to the inquiry <span aria-hidden="true">↗</span></Link>
  </main>;
}
