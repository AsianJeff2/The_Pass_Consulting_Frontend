import { ImageResponse } from "next/og";

export const alt = "The Pass Consulting. Good hospitality. Stronger business.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", background: "#f5f3eb", color: "#193e32", padding: "64px 72px", alignItems: "center" }}>
    <div style={{ display: "flex", flexDirection: "column", width: 760 }}><div style={{ display: "flex", fontSize: 25, marginBottom: 72, letterSpacing: "-1px" }}>the pass. / CONSULTING</div><div style={{ display: "flex", fontSize: 67, lineHeight: 1.05, letterSpacing: "-3px" }}>Good hospitality.</div><div style={{ display: "flex", fontSize: 67, lineHeight: 1.15, color: "#8a7145", letterSpacing: "-3px" }}>Stronger business.</div><div style={{ display: "flex", fontSize: 16, marginTop: 40, letterSpacing: "2px" }}>INDEPENDENT HOSPITALITY CONSULTING</div></div>
    <svg width="285" height="390" viewBox="0 0 285 390" fill="none"><path d="M20 380V145a122 122 0 0 1 244 0v235h-32V145a90 90 0 0 0-180 0v235Z" fill="#193e32"/><path d="M80 380V195a76 76 0 0 1 152 0v185h-22V195a54 54 0 0 0-108 0v185Z" fill="#bac5ac"/><path d="M134 380V249a47 47 0 0 1 94 0v131h-13V249a34 34 0 0 0-68 0v131Z" fill="#b39b69"/></svg>
  </div>, size);
}
