import Link from "next/link";
export default function NotFound() {
  return <main id="main" className="legal-page container"><span className="eyebrow">404 / A DIFFERENT TURN</span><h1>Let’s get you<br /><em>back on course.</em></h1><p>This page could not be found.</p><Link className="button-primary" href="/">Return to The Pass <span aria-hidden="true">↗</span></Link></main>;
}
