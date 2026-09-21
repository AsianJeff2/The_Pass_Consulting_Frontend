"use client";

import { useState } from "react";
import { Arrow } from "./Brand";

const previews = [
  { id: "diagnostic", label: "The diagnostic", kicker: "01 / UNDERSTAND", title: "A clearer picture of the whole operation.", copy: "A focused view of what your operating data and day-to-day experience are telling you. Findings are connected to evidence, with assumptions made explicit.", points: ["Operating patterns, in context", "The questions worth investigating", "Priorities grounded in your business"] },
  { id: "roadmap", label: "The roadmap", kicker: "02 / PRIORITIZE", title: "A practical sequence for what comes next.", copy: "Recommendations become a plan your team can work with. Each priority has a purpose, an owner to agree on, and a way to assess progress.", points: ["Actions ordered by priority", "Dependencies and responsibilities", "Measures to revisit together"] },
  { id: "readout", label: "The conversation", kicker: "03 / ALIGN", title: "A shared understanding. A considered decision.", copy: "A conversation about the findings, the trade-offs, and your next steps. You have space to challenge the analysis and shape a plan that fits the realities of service.", points: ["A live discussion of the findings", "Clear reasoning behind recommendations", "A written reference for your team"] },
];

export default function DeliverablePreview() {
  const [active, setActive] = useState(0);
  const item = previews[active];
  return <div className="deliverable-explorer">
    <div className="preview-options" role="group" aria-label="Explore engagement deliverables">
      {previews.map((preview, index) => <button key={preview.id} type="button" aria-pressed={active === index} aria-controls="deliverable-details" onClick={() => setActive(index)}><span>0{index + 1}</span>{preview.label}<Arrow /></button>)}
    </div>
    <div className="deliverable-panel" id="deliverable-details" aria-live="polite" aria-atomic="true">
      <div className="deliverable-copy"><span className="eyebrow">{item.kicker}</span><h3>{item.title}</h3><p>{item.copy}</p><ul>{item.points.map(point => <li key={point}><span aria-hidden="true">↗</span>{point}</li>)}</ul></div>
      <div className={`document-preview document-${item.id}`} aria-hidden="true">
        <div className="document-heading"><span>THE PASS</span><span>FIELDNOTES / 0{active + 1}</span></div>
        <div className="document-body"><small>YOUR RESTAURANT</small><h4>{active === 0 ? "See the pattern." : active === 1 ? "Make the next move." : "Bring it into focus."}</h4>
          <div className="document-contents">{(active === 0 ? ["The operating questions", "Evidence & assumptions", "Priorities to discuss"] : active === 1 ? ["Actions & dependencies", "Owners & responsibilities", "Measures to revisit"] : ["Findings & context", "Options & trade-offs", "Agreed next steps"]).map((label, i) => <div key={label}>{label}<span>0{i + 1}</span></div>)}</div>
        </div><div className="document-footer"><span>ENGAGEMENT OUTLINE</span><span>THE PASS</span></div>
      </div>
    </div>
    <p className="illustration-note">Illustrative document layouts. Your engagement is scoped to your business.</p>
  </div>;
}
