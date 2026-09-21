import PassSculpture from "@/components/PassSculpture";
import DeliverablePreview from "@/components/DeliverablePreview";
import InquiryForm from "@/components/InquiryForm";
import { Arrow } from "@/components/Brand";
import { publicSiteUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: publicSiteUrl()?.href } };

const services = [
  { number: "01", title: "The operation, as a whole.", tag: "OPERATIONAL DIAGNOSTICS", text: "Step back from the pace of service. Bring your numbers, processes, and owner perspective together to understand where to focus.", icon: "operation" },
  { number: "02", title: "The right rhythm for your team.", tag: "LABOR & STAFFING", text: "Look at scheduling alongside demand. Understand how staffing patterns support service, and where the fit could be better.", icon: "labor" },
  { number: "03", title: "A closer look at your margins.", tag: "FOOD & OPERATING COSTS", text: "Make sense of your cost structure. Examine the relationship between food costs, labor, and sales to inform better decisions.", icon: "cost" },
  { number: "04", title: "Understand what brings guests back.", tag: "SALES & GUEST DEMAND", text: "Explore sales by day and daypart, alongside repeat-guest patterns. Find the questions that matter for your next chapter.", icon: "demand" },
];

function ServiceIcon({ type }: { type: string }) {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    {type === "operation" ? <><rect x="7" y="7" width="34" height="34" rx="2" /><path d="M7 24h34M24 7v34" /><rect x="14" y="14" width="20" height="20" rx="10" className="icon-fill" /></> : type === "labor" ? <><path d="M8 34V20M19 34V9M30 34V15M41 34V5M6 41h37" /><path d="m6 24 12-6 12 5L42 13" className="icon-accent" /></> : type === "cost" ? <><circle cx="24" cy="24" r="17" /><circle cx="24" cy="24" r="10" /><path d="M24 3v42M3 24h42" className="icon-accent" /></> : <><path d="M5 34c7 0 6-20 13-20s6 20 13 20 6-20 12-20M5 41h38" /><path d="m36 14 7-1 1 7" className="icon-accent" /></>}
  </svg>;
}

export default function Home() {
  return <main id="main">
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy"><div className="eyebrow hero-eyebrow"><span className="status-dot" />INDEPENDENT HOSPITALITY CONSULTING</div>
        <h1 id="hero-title">Good hospitality.<br />Stronger <em>business.</em></h1>
        <p className="hero-intro">You put everything into your restaurant.<br className="desktop-break" /> Let’s bring the same care to the business behind it.</p>
        <div className="hero-actions"><a className="button-primary" href="#inquiry">Start a conversation <Arrow diagonal /></a><a className="text-link" href="#approach">Explore our approach <Arrow /></a></div>
        <div className="hero-footnote"><span className="fine-rule" /><p>Independent thinking.<br /><strong>Built around your operation.</strong></p></div>
      </div>
      <div className="hero-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="sculpture-wrap"><PassSculpture /></div>
        <div className="glass-caption"><span className="caption-symbol" aria-hidden="true">↗</span><div><span className="eyebrow">A FRESH PERSPECTIVE</span><strong>Clarity. Then possibility.</strong></div><span className="caption-index">01—03</span></div>
        <span className="art-note">A DIFFERENT ANGLE CHANGES WHAT YOU SEE.</span>
      </div>
    </section>
    <div className="principles-bar"><div className="container"><span>FOR THE PEOPLE BEHIND THE PLACE</span><p>Independent restaurants</p><span className="bar-plus" aria-hidden="true">+</span><p>Evidence with context</p><span className="bar-plus" aria-hidden="true">+</span><p>Practical next steps</p></div></div>

    <section className="expertise section-pad" id="expertise" aria-labelledby="expertise-title"><div className="container">
      <div className="section-heading"><div><span className="eyebrow">01 / WHERE WE CAN HELP</span><h2 id="expertise-title">A wider view.<br /><em>A sharper focus.</em></h2></div><p>A restaurant is a connected business. We help you understand how the pieces work together, and where a closer look can make a difference.</p></div>
      <div className="service-grid">{services.map(service => <article className="service-card" key={service.number}><div className="service-card-top"><span className="service-number">{service.number}</span><ServiceIcon type={service.icon} /></div><span className="eyebrow">{service.tag}</span><h3>{service.title}</h3><p>{service.text}</p><a className="service-link" href="#inquiry" aria-label={`Discuss ${service.tag.toLowerCase()}`}>Let’s take a closer look <Arrow diagonal /></a></article>)}</div>
      <div className="expertise-bottom"><span className="little-star" aria-hidden="true">✳</span><p>One location or a growing group. An early question or a specific challenge.<br /><strong>We start with where you are.</strong></p></div>
    </div></section>

    <section className="approach section-pad" id="approach" aria-labelledby="approach-title"><div className="container">
      <div className="section-heading"><div><span className="eyebrow">02 / A CONSIDERED APPROACH</span><h2 id="approach-title">From a full picture<br />to a <em>clear next step.</em></h2></div><p>Your experience matters as much as the spreadsheet. We bring both into the conversation, with human judgment at every stage.</p></div>
      <div className="process-grid">{[
        ["Listen", "First, your perspective.", "We start with your goals, your constraints, and what running the business feels like today."],
        ["Understand", "Look beneath the surface.", "We examine operating data and processes, question assumptions, and connect the findings."],
        ["Prioritize", "Decide what matters next.", "Together, we consider the options and trade-offs, then focus on a practical sequence of actions."],
        ["Put into practice", "Give the plan a purpose.", "You leave with clear recommendations, an implementation roadmap, and measures to revisit."],
      ].map(([title, subtitle, text], i) => <article className="process-step" key={title}><div className="step-line"><span>0{i + 1}</span><Arrow /></div><h3>{title}</h3><strong>{subtitle}</strong><p>{text}</p></article>)}</div>
      <div className="approach-footer"><p>Rigorous analysis. A conversation throughout.</p><a className="text-link light-link" href="#inquiry">Tell us what you’re working on <Arrow diagonal /></a></div>
    </div></section>

    <section className="deliverables section-pad container" aria-labelledby="deliverables-title"><div className="section-heading"><div><span className="eyebrow">03 / SOMETHING YOU CAN WORK WITH</span><h2 id="deliverables-title">Insight, made <em>useful.</em></h2></div><p>Clear thinking deserves a clear format. Explore the kind of work that supports an engagement.</p></div><DeliverablePreview /></section>

    <section className="about section-pad" id="about" aria-labelledby="about-title"><div className="container about-grid"><div className="about-mark"><div className="architectural-mark" aria-hidden="true"><i /><i /><i /><span>THE<br /><em>PASS.</em></span></div><span className="eyebrow">WHERE PREPARATION MEETS POSSIBILITY</span></div><div className="about-copy"><span className="eyebrow">04 / THE THINKING BEHIND THE PASS</span><h2 id="about-title">Big-picture rigor.<br /><em>Independent spirit.</em></h2><p className="about-lead">Independent operators deserve the same thoughtful analysis that larger organizations turn to.</p><p>The Pass is Michael Park’s hospitality consulting practice. It brings a focused, evidence-led perspective to the questions behind running a restaurant, with recommendations shaped around your business.</p><p>Based in Southern California and open to working with operators beyond it. Each engagement begins with a conversation about fit, priorities, and scope.</p><div className="founder"><span className="founder-monogram" aria-hidden="true">mp.</span><div><strong>Michael Park</strong><span>Founder, The Pass Consulting</span></div></div></div></div></section>

    <section className="faq-section section-pad container" aria-labelledby="faq-title"><div className="faq-intro"><span className="eyebrow">BEFORE WE BEGIN</span><h2 id="faq-title">A few good<br /><em>questions.</em></h2></div><div className="faq-list">{[
      ["Who do you work with?", "The Pass focuses on independent restaurant operators. We’re based in Southern California, but inquiries are welcome from elsewhere. The first conversation helps us understand your business and whether the work is a good fit."],
      ["Do I need to know exactly what the problem is?", "No. A question, a recurring frustration, or a decision you’re weighing is a useful starting point. We can discuss what you’re seeing and decide what is worth investigating."],
      ["What does an engagement cost?", "Scope and fees are discussed after we understand your goals and the work involved. You’ll have a clear scope to consider before an engagement begins."],
      ["What information should I share to get started?", "A short description of your restaurant and what you’d like to work on is enough. Please keep confidential financial records, employee details, and other sensitive information out of the inquiry form. We can discuss appropriate next steps directly."],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className="inquiry section-pad" id="inquiry" aria-labelledby="inquiry-title"><div className="container inquiry-grid"><div className="inquiry-copy"><span className="eyebrow"><span className="status-dot" /> A CONVERSATION IS A GOOD START</span><h2 id="inquiry-title">What’s next<br />for <em>your restaurant?</em></h2><p>Tell Michael a little about your business and what’s on your mind. We’ll take it from there.</p><div className="contact-note"><span aria-hidden="true">↗</span><p>No polished brief needed.<br /><strong>Just a place to begin.</strong></p></div><div className="direct-email"><span>Prefer email?</span><a href="mailto:michaelpark20783@gmail.com?subject=%5BThe%20Pass%20website%5D%20Inquiry">michaelpark20783@gmail.com <Arrow diagonal /></a></div></div><div className="inquiry-card"><InquiryForm /></div></div></section>
  </main>;
}
