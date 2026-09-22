import { CONTACT_EMAIL, INQUIRY_MAILTO } from "@/lib/contact";
import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Contact privacy" };

export default function PrivacyPage() {
  return <main id="main" className="legal-page container"><span className="eyebrow">THE PASS CONSULTING</span><h1>Contact <em>privacy.</em></h1><p className="legal-intro">A straightforward explanation of what happens when you send an inquiry.</p><p>Last updated September 21, 2026</p>
    <h2>What you share</h2><p>The inquiry form asks for your name, email address, business name, optional location, area of interest, and message. Please do not submit financial records, employee details, passwords, or other sensitive information.</p>
    <h2>How it is used</h2><p>Your information is used to read and respond to your inquiry and discuss a potential consulting engagement. Submitting the form does not subscribe you to a marketing mailing list.</p>
    <h2>How your message reaches Michael</h2><p>The website is designed to run on Vercel. When email delivery is configured, the server sends your inquiry through Resend to The Pass’s business mailbox at {CONTACT_EMAIL}. Your email address is used as the reply-to address. Vercel, Resend, and the mailbox provider process information under their own terms and privacy policies.</p>
    <h2>Website data</h2><p>This site does not add advertising trackers or analytics cookies. The hosting and email services may process technical information needed to operate their services, such as request metadata and delivery logs. The application does not keep a separate database of inquiries.</p>
    <h2>Questions and requests</h2><p>To ask about an inquiry you sent, request a correction, or request deletion from The Pass’s mailbox, email <a href={INQUIRY_MAILTO}>{CONTACT_EMAIL}</a>. Provider logs and backups are managed under each provider’s policies.</p><Link className="text-link" href="/#inquiry">Return to the conversation <span aria-hidden="true">↗</span></Link>
  </main>;
}
