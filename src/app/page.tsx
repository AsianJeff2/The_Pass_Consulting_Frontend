import type { Metadata } from "next";
import PassSculpture from "@/components/PassSculpture";
import DeliverablePreview from "@/components/DeliverablePreview";
import InquiryForm from "@/components/InquiryForm";
import ScrollSequence from "@/components/ScrollSequence";
import { Arrow } from "@/components/Brand";
import { publicSiteUrl } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: publicSiteUrl()?.href } };

const services = [
  { title: "The whole operation", tag: "Operational diagnostics", text: "Bring your numbers, processes, and owner perspective together to understand where to focus." },
  { title: "Your team, in rhythm", tag: "Labor & staffing", text: "Look at scheduling alongside demand. Understand how staffing patterns support service, and where the fit could be better." },
  { title: "Room in the margins", tag: "Food & operating costs", text: "Examine the relationship between food costs, labor, and sales to make sense of your cost structure." },
  { title: "The patterns behind demand", tag: "Sales & guest demand", text: "Explore sales by day and daypart, alongside repeat-guest patterns. Find the questions that matter for your next decision." },
];

const process = [
  ["Listen", "First, your perspective.", "We start with your goals, your constraints, and what running the business feels like today."],
  ["Understand", "Look beneath the surface.", "We examine operating data and processes, question assumptions, and connect the findings."],
  ["Prioritize", "Decide what matters next.", "Together, we consider the options and trade-offs, then focus on a practical sequence of actions."],
  ["Put into practice", "Give the plan a purpose.", "You leave with clear recommendations, an implementation roadmap, and measures to revisit."],
];

export default function Home() {
  return <main id="main" className="home-page">
    <ScrollSequence />
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-stage container">
        <div className="hero-topline"><span className="eyebrow">Independent hospitality consulting</span><span>Southern California & beyond</span></div>
        <div className="hero-copy">
          <h1 id="hero-title" data-reveal><span className="reveal-line"><span>Good hospitality.</span></span><span className="reveal-line"><span>Stronger <em>business.</em></span></span></h1>
          <p className="hero-intro">You put everything into your restaurant.<br /> Let’s bring the same care to the business behind it.</p>
          <a className="button-primary hero-cta" href="#inquiry">Start a conversation <Arrow diagonal /></a>
        </div>
        <div className="hero-art" aria-hidden="true"><PassSculpture /></div>
        <div className="hero-bottom"><a className="scroll-link" href="#expertise"><span className="scroll-line" aria-hidden="true" />A closer look <Arrow /></a><p>For the people<br />behind the place.</p></div>
      </div>
    </section>

    <section className="expertise chapter" id="expertise" aria-labelledby="expertise-title">
      <div className="container">
        <div className="section-meta"><span className="eyebrow">Where we can help</span><span className="section-rule" data-rule aria-hidden="true" /></div>
        <div className="expertise-intro"><h2 id="expertise-title" data-reveal><span className="reveal-line"><span>A wider view.</span></span><span className="reveal-line"><span><em>A sharper focus.</em></span></span></h2><p>A restaurant is a connected business. We help you understand how the pieces work together, and where a closer look can make a difference.</p></div>
        <div className="service-list">{services.map((service, index) => <article className="service-row" key={service.tag} data-reveal>
          <span className="service-number" aria-hidden="true">0{index + 1}</span><div className="service-title"><span className="eyebrow">{service.tag}</span><h3>{service.title}</h3></div><p>{service.text}</p>
        </article>)}</div>
        <div className="expertise-end"><p>One location or a growing group.<br />We start with where you are.</p><a className="text-link" href="#inquiry">Discuss your operation <Arrow diagonal /></a></div>
      </div>
    </section>

    <section className="approach chapter" id="approach" aria-labelledby="approach-title">
      <div className="container">
        <div className="section-meta"><span className="eyebrow">Our approach</span><span className="section-rule" data-rule aria-hidden="true" /></div>
        <div className="approach-layout">
          <div className="approach-sticky"><h2 id="approach-title" data-reveal><span className="reveal-line"><span>From a full picture</span></span><span className="reveal-line"><span>to a <em>clear next step.</em></span></span></h2><p>Your experience matters as much as the spreadsheet. We bring both into the conversation, with human judgment at every stage.</p><div className="process-indicator" aria-hidden="true"><span className="process-current">01</span><span className="process-progress"><i /></span><span>04</span></div></div>
          <div className="process-list">{process.map(([title, subtitle, text], i) => <article className="process-step" key={title} data-step={i}>
            <span className="step-number">0{i + 1}</span><div><h3 data-reveal>{title}</h3><strong>{subtitle}</strong><p>{text}</p></div>
          </article>)}</div>
        </div>
        <div className="approach-footer"><p>Rigorous analysis.<br /><em>A conversation throughout.</em></p><a className="text-link" href="#deliverables">What you leave with <Arrow /></a></div>
      </div>
    </section>

    <section className="deliverables chapter" id="deliverables" aria-labelledby="deliverables-title"><div className="container"><div className="section-meta"><span className="eyebrow">The work, in your hands</span><span className="section-rule" data-rule aria-hidden="true" /></div><div className="deliverables-heading"><h2 id="deliverables-title" data-reveal>Insight, made <em>useful.</em></h2><p>Clear findings. A practical plan.<br />Something your team can return to.</p></div><DeliverablePreview /></div></section>

    <section className="about chapter" id="about" aria-labelledby="about-title"><div className="container about-grid"><div className="about-heading"><span className="eyebrow">The person behind The Pass</span><h2 id="about-title" data-reveal>Independent<br />in <em>spirit.</em><br />Considered<br />in practice.</h2></div><div className="about-copy"><p className="about-lead">Independent operators deserve the same thoughtful analysis that larger organizations turn to.</p><p>The Pass is Michael Park’s hospitality consulting practice. It brings a focused, evidence-led perspective to the questions behind running a restaurant, with recommendations shaped around your business.</p><p>Based in Southern California and open to working with operators beyond it. Each engagement begins with a conversation about fit, priorities, and scope.</p><div className="founder"><span className="founder-name">Michael Park</span><span>Founder, The Pass Consulting</span></div></div></div></section>

    <section className="faq-section container" aria-labelledby="faq-title"><div className="faq-intro"><span className="eyebrow">Before we begin</span><h2 id="faq-title">A few questions.</h2></div><div className="faq-list">{[
      ["Who do you work with?", "The Pass focuses on independent restaurant operators. We’re based in Southern California, but inquiries are welcome from elsewhere. The first conversation helps us understand your business and whether the work is a good fit."],
      ["Do I need to know exactly what the problem is?", "No. A question, a recurring frustration, or a decision you’re weighing is a useful starting point. We can discuss what you’re seeing and decide what is worth investigating."],
      ["What does an engagement cost?", "Scope and fees are discussed after we understand your goals and the work involved. You’ll have a clear scope to consider before an engagement begins."],
      ["What should I share to get started?", "A short description of your restaurant and what you’d like to work on is enough. Please keep confidential financial records, employee details, and other sensitive information out of the inquiry form. We can discuss appropriate next steps directly."],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className="inquiry chapter" id="inquiry" aria-labelledby="inquiry-title"><div className="container inquiry-grid"><div className="inquiry-copy"><span className="eyebrow">Let’s talk</span><h2 id="inquiry-title" data-reveal>What’s next<br />for <em>your<br className="inquiry-break" /> restaurant?</em></h2><p>Tell Michael a little about your business and what’s on your mind. We’ll take it from there.</p><div className="direct-email"><span>Prefer email?</span><a href="mailto:michaelpark20783@gmail.com?subject=%5BThe%20Pass%20website%5D%20Inquiry">michaelpark20783@gmail.com <Arrow diagonal /></a></div></div><div className="inquiry-card"><InquiryForm /></div></div></section>
  </main>;
}
