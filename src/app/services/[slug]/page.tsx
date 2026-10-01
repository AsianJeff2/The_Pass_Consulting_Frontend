import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/Brand";
import { SERVICES, pageMetadata, serializeStructuredData, servicePath, serviceStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((item) => item.slug === slug);
  if (!service) notFound();
  return pageMetadata(service.searchTitle, service.description, servicePath(service));
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((item) => item.slug === slug);
  if (!service) notFound();
  const structuredData = serviceStructuredData(service);
  return <main id="main" className="legal-page container">
    {structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(structuredData) }} />}
    <nav aria-label="Breadcrumb">
      <ol style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", listStyle: "none", margin: "0 0 24px", padding: 0 }}>
        <li><Link href="/" style={{ display: "inline-flex", alignItems: "center", minHeight: "44px" }}>Home</Link></li>
        <li><span aria-hidden="true">/ </span><Link href="/services" style={{ display: "inline-flex", alignItems: "center", minHeight: "44px" }}>Services</Link></li>
        <li><span aria-hidden="true">/ </span><span aria-current="page">{service.tag}</span></li>
      </ol>
    </nav>
    <span className="eyebrow">Independent restaurant consulting</span>
    <h1>{service.searchTitle}</h1>
    <p className="legal-intro">{service.intro}</p>
    <h2>A decision worth examining</h2>
    <p>{service.fit}</p>
    <h2>The review</h2>
    <p>{service.examination}</p>
    <h2>Questions to bring</h2>
    <ul style={{ paddingLeft: "24px", margin: "0 0 24px", color: "var(--muted)" }}>{service.questions.map((question) => <li key={question} style={{ marginBottom: "12px" }}>{question}</li>)}</ul>
    <h2>The work you can agree on</h2>
    <p>{service.deliverables}</p>
    <h2>Start with the context</h2>
    <p>The Pass is Michael Park’s consulting practice, based in Southern California and open to working with independent operators beyond it. For the first conversation, share a short description of your restaurant and the decision you face. Keep financial records, employee details, and guest information out of the inquiry form. Michael will discuss scope and data handling with you before requesting records.</p>
    <Link className="button-primary" href="/#inquiry">Discuss your restaurant <Arrow diagonal /></Link>
    <h2>Other areas of focus</h2>
    {SERVICES.filter((item) => item.slug !== service.slug).map((item) => <p key={item.slug}><Link href={servicePath(item)} style={{ display: "inline-flex", alignItems: "center", minHeight: "44px" }}>{item.tag}</Link></p>)}
  </main>;
}
