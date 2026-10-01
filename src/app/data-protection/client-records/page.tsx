import Link from "next/link";
import LegalNavigation, { LegalBreadcrumb } from "@/components/LegalNavigation";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Sharing client records",
  "What restaurant consulting records to prepare, what to leave out, and how agreed transfer and closeout steps work at The Pass Consulting.",
  "/data-protection/client-records",
);

export default function ClientRecordsPage() {
  return <main id="main" className="legal-page container">
    <LegalBreadcrumb currentPath="/data-protection/client-records" />
    <span className="eyebrow">THE PASS CONSULTING</span>
    <h1>Sharing client records</h1>
    <p className="legal-intro">Start with the operating question. Share records only after Michael and your business agree on the fields, safeguards, and transfer location.</p>
    <LegalNavigation currentPath="/data-protection/client-records" />
    <h2>Start with a business overview</h2>
    <p>Use the inquiry form or business email to describe your restaurant, the operating question, and the periods or locations involved. Keep that introduction brief. The website and ordinary email are not the agreed intake channels for financial records.</p>
    <h2>Prepare the approved inputs</h2>
    <p>The standard scopes can use sales and transaction totals, labor hours and costs grouped by role or daypart, food and operating cost summaries, and redacted supplier records. The final input list depends on the signed scope. Share only records you have authority to provide, covering the agreed fields, locations, and dates.</p>
    <p>Remove bank and card details, passwords, SSNs, government identifiers, employee identifiers, guest contact details, health information, and records about minors. Personal payroll, individual performance records, guest profiles, and regulated consumer financial records are outside standard intake. A need for those records requires a separate signed, counsel-reviewed scope and safeguards before transfer.</p>
    <p>Small groups, distinctive purchases, and persistent IDs can reveal a person&#x27;s identity. Review the summaries with Michael before transfer if their anonymity is uncertain.</p>
    <h2>Confirm the transfer arrangements</h2>
    <p>Before requesting records, Michael and your business must complete the engagement agreement and data protection schedule. They must name the approved transfer and storage services, people with access, permitted uses, retention dates, and any direct system access.</p>
    <p>Michael must verify the agreed controls with the chosen tools before intake begins. He will then provide the approved transfer instructions. Do not send master credentials or substitute a public sharing link. Direct access, if agreed, is read-only, time-limited, and confined to approved aggregate report views.</p>
    <h2>Keep changes within the scope</h2>
    <p>If a new location, period, field, tool, or use becomes necessary, agree on the change before sending the additional records. Restricted fields or views need the required separate amendment and safeguards first. If an unexpected restricted record arrives, Michael must pause its use and seek instructions.</p>
    <h2>Close the engagement</h2>
    <p>Agree on the return or deletion event before intake. At closeout, Michael follows the signed schedule, removes access, and records active-copy deletion and any lawful retention or provider-backup limits.</p>
    <p>Read the <Link href="/data-protection">data protection overview</Link> for the engagement principles, the <Link href="/privacy">privacy notice</Link> for website information, and <Link href="/privacy/requests">privacy requests</Link> to raise a concern.</p>
  </main>;
}
