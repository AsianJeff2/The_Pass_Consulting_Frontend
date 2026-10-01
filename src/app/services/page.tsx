import Link from "next/link";
import { Arrow } from "@/components/Brand";
import { SERVICES, pageMetadata, servicePath } from "@/lib/seo";

export const metadata = pageMetadata("Restaurant Consulting Services", "Explore operational diagnostics, staffing, food costs, and sales reviews for independent restaurants. Discuss your goals and scope with Michael Park.", "/services");

export default function ServicesPage() {
  return <main id="main" className="legal-page container">
    <span className="eyebrow">The Pass Consulting</span>
    <h1>Restaurant consulting <em>services.</em></h1>
    <p className="legal-intro">Choose a starting point for your restaurant’s next decision.</p>
    <p>Michael Park works with independent restaurant operators to examine their operating data and processes. The Pass is based in Southern California and welcomes inquiries from beyond it. You and Michael agree on the questions, scope, and fees before an engagement begins.</p>
    {SERVICES.map((service) => <section key={service.slug} aria-labelledby={service.slug}>
      <h2 id={service.slug}>{service.tag}</h2>
      <p>{service.intro}</p>
      <p><Link href={servicePath(service)} style={{ display: "inline-flex", alignItems: "center", minHeight: "44px" }}>{service.searchTitle}</Link></p>
    </section>)}
    <h2>Bring the decision, then agree on the work</h2>
    <p>You do not need a finished problem statement to start a conversation. Tell Michael about your restaurant and the decision you are weighing. You can agree on an engagement after discussing fit, the records you have, and the work that would help.</p>
    <p>Keep confidential financial records, employee details, and guest information out of the inquiry form. Discuss appropriate data handling before sharing records.</p>
    <Link className="button-primary" href="/#inquiry">Start a conversation <Arrow diagonal /></Link>
  </main>;
}
