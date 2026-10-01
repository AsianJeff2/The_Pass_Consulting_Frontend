import { CONTACT_EMAIL, INQUIRY_MAILTO } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import LegalNavigation, { LegalBreadcrumb } from "@/components/LegalNavigation";

export const metadata = pageMetadata(
  "Website terms",
  "Information about The Pass Consulting website, inquiries, service scope, and separate consulting agreements.",
  "/terms",
);

export default function TermsPage() {
  return <main id="main" className="legal-page container">
    <LegalBreadcrumb currentPath="/terms" />
    <span className="eyebrow">THE PASS CONSULTING</span>
    <h1>Website <em>terms.</em></h1>
    <p className="legal-intro">Michael Park operates this website for The Pass Consulting. Contact <a href={INQUIRY_MAILTO}>{CONTACT_EMAIL}</a> with questions.</p>
    <p>Last updated September 30, 2026.</p>
    <LegalNavigation currentPath="/terms" />
    <h2>Website information</h2>
    <p>Michael describes hospitality consulting services and shows illustrative deliverable layouts on this site. Those examples contain no client results. Scope, fees, dates, and deliverables depend on a separate written agreement with you. Visiting the website or sending an inquiry creates no paid consulting engagement.</p>
    <h2>Consulting scope</h2>
    <p>Michael offers operational analysis and recommendations. The website provides general information. You should consult a qualified professional for legal, tax, investment, accounting assurance, employment-law, or food-safety advice. Michael does not promise a particular financial or operating result.</p>
    <h2>Inquiries and respectful use</h2>
    <p>Use the inquiry form to introduce your business. Keep financial records, payment details, passwords, and information about employees or guests out of the form. Share information you have authority to provide. Avoid spam, impersonation, attempts to disrupt the website, or access to systems without permission.</p>
    <h2>Content and outside services</h2>
    <p>Michael and the relevant rights holders retain rights in the website&apos;s original text, artwork, and software. You may read the site and share links. Ask Michael before reusing original artwork or publishing substantial copies of the site&apos;s content, subject to rights that law gives you.</p>
    <p>Outside services apply their own terms. Michael may update the site or interrupt access for maintenance. You can reach him through the business email address if the form is unavailable.</p>
    <h2>Privacy</h2>
    <p>The <Link href="/privacy">privacy notice</Link> explains website inquiries and planned business outreach. The <Link href="/data-protection">data protection overview</Link> and <Link href="/data-protection/client-records">client-records guide</Link> explain engagement prerequisites. Use <Link href="/privacy/requests">privacy requests</Link> to ask about your information or stop contact. A signed consulting agreement addresses client records and the responsibilities of both parties.</p>
    <Link className="text-link" href="/#inquiry">Return to the inquiry <span aria-hidden="true">↗</span></Link>
  </main>;
}
