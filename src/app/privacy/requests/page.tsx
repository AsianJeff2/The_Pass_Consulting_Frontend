import Link from "next/link";
import { CONTACT_EMAIL, PRIVACY_MAILTO } from "@/lib/contact";
import LegalNavigation, { LegalBreadcrumb } from "@/components/LegalNavigation";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Privacy requests",
  "How to ask about your information, request a correction or deletion, and stop commercial outreach from The Pass Consulting.",
  "/privacy/requests",
);

export default function PrivacyRequestsPage() {
  return <main id="main" className="legal-page container">
    <LegalBreadcrumb currentPath="/privacy/requests" />
    <span className="eyebrow">THE PASS CONSULTING</span>
    <h1>Privacy requests</h1>
    <p className="legal-intro">Ask about your information, correct it, request deletion, or ask Michael to stop contacting you.</p>
    <LegalNavigation currentPath="/privacy/requests" />
    <h2>Send a request</h2>
    <p>Email <a href={PRIVACY_MAILTO}>{CONTACT_EMAIL}</a> with the subject &quot;Privacy request.&quot; Michael Park handles requests for The Pass Consulting. You can also reply to an existing conversation; a particular subject line is not required for Michael to consider your request.</p>
    <p>Say what you want Michael to do and identify the relevant inquiry, conversation, or engagement. You can ask what information is held about you, request a correction or deletion, or withdraw permission for further inquiry follow-up. Do not attach financial records, identity documents, passwords, or information about other people.</p>
    <h2>Verification and response</h2>
    <p>Michael may use the existing contact channel or ask for limited information to verify your identity and locate the relevant records. If you act for another person, he may need to confirm your authority before sharing information.</p>
    <p>The rights and response deadlines that apply depend on the records, the role of The Pass Consulting, and the applicable law. Michael will assess the request under those requirements and explain the action taken or a supported limitation. A legal recordkeeping duty or dispute may require some records to be retained. Provider backups may follow a separate deletion cycle.</p>
    <h2>Records held for a client</h2>
    <p>If your request concerns records handled for another business during an engagement, Michael will route it to the responsible client and assist under the signed data protection terms and applicable law. He will not disclose that client&#x27;s records without authority. You may also contact the business that originally collected your information.</p>
    <h2>Stop commercial outreach</h2>
    <p>Reply &quot;no thanks&quot; to an outreach message or email the address above. Michael will act promptly to stop commercial outreach. A minimal suppression marker helps prevent future contact, even if other prospect details are deleted. The prepared CRM uses a hashed email address, objection date, and brief reason; the hash is not anonymous. Access and retention are limited to that purpose, subject to legal requirements.</p>
    <p>Submitting a website inquiry permits a reply about that inquiry. It does not subscribe you to marketing or authorize an outreach sequence.</p>
    <h2>Related information</h2>
    <p>Read the <Link href="/privacy">privacy notice</Link> for collection, uses, providers, and retention. The <Link href="/data-protection">data protection overview</Link> explains engagement records, and <Link href="/data-protection/client-records">sharing client records</Link> explains intake.</p>
  </main>;
}
