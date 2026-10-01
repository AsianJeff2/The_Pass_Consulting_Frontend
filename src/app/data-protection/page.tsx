import Link from "next/link";
import { CONTACT_EMAIL, PRIVACY_MAILTO } from "@/lib/contact";
import LegalNavigation, { LegalBreadcrumb } from "@/components/LegalNavigation";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Data protection",
  "The purposes, access limits, tool approvals, and intake prerequisites for handling nonpublic consulting records at The Pass Consulting.",
  "/data-protection",
);

export default function DataProtectionPage() {
  return <main id="main" className="legal-page container">
    <LegalBreadcrumb currentPath="/data-protection" />
    <span className="eyebrow">THE PASS CONSULTING</span>
    <h1>Data protection</h1>
    <p className="legal-intro">Client financial records need an agreed purpose, limited access, and a clear end to their use. This page outlines the prerequisites for an engagement that involves nonpublic records.</p>
    <LegalNavigation currentPath="/data-protection" />
    <h2>Agree the scope before sharing</h2>
    <p>Before any client records are shared, Michael and the client must agree on the operating question, required fields, approved tools, permitted uses, and retention dates. The engagement agreement and data protection addendum set the exact responsibilities. Michael supplies those documents during scope review.</p>
    <p>The public website provides an inquiry form. It provides no client login, file upload, or records portal. Use it for a short introduction and keep financial records, bank or card details, passwords, and employee or guest information out of the message.</p>
    <h2>Use only what the work needs</h2>
    <p>The standard service scopes use aggregate operating summaries and redacted records. The client must remove unrelated fields before transfer. A persistent ID can still identify a person, so replacing a name with an ID is not enough to establish anonymity.</p>
    <p>Personal payroll, guest profiles, consumer financial accounts, and other restricted records require a separate assessment, agreed scope, and safeguards before intake. The <Link href="/data-protection/client-records">client-records guide</Link> lists the information to leave out.</p>
    <h2>Approve access and tools</h2>
    <p>Before intake can begin, Michael must verify the agreed transfer and storage controls, including encryption, account protection, named access, and a tested return or deletion process. The client must approve services or people that will receive its records. These prerequisites must be completed for the chosen tools; this page does not establish that a tool or account has passed those checks.</p>
    <p>Optional direct system access is limited to approved aggregate report views, read-only permissions, and an agreed duration. The engagement documents must name the system, views, access limits, and revocation process. The client does not have to provide live access or master credentials.</p>
    <h2>Keep use within the agreement</h2>
    <p>The proposed engagement terms limit client records and derived nonpublic information to the scheduled services. Client approval is required before a new vendor or AI service receives records. Records are not approved for model training, prospect lists, unrelated client work, or publicity by signing the standard engagement documents.</p>
    <p>A case study or testimonial requires approval of the exact final public content, any necessary individual or third-party releases, and a separately signed amendment that authorizes that specific publicity purpose. The underlying records remain confidential.</p>
    <h2>Return, deletion, and concerns</h2>
    <p>The engagement documents must set the return or deletion event and identify any records that must be retained. Provider backups can have a separate deletion cycle. Michael must explain the verified limits rather than promise removal from systems outside his control.</p>
    <p>For a privacy request or suspected exposure, email <a href={PRIVACY_MAILTO}>{CONTACT_EMAIL}</a> with a brief description. Leave out confidential attachments and credentials. Michael will assess the concern under the applicable engagement terms and law.</p>
    <p>Read the <Link href="/privacy">privacy notice</Link> for website and outreach information, <Link href="/privacy/requests">privacy requests</Link> for request instructions, and <Link href="/data-protection/client-records">sharing client records</Link> before preparing engagement inputs.</p>
  </main>;
}
