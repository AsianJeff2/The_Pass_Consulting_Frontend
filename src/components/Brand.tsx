import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`brand${light ? " brand-light" : ""}`} aria-label="The Pass Consulting, home">
      <svg viewBox="0 0 40 44" fill="none" aria-hidden="true">
        <path d="M5 40V19C5 10.716 11.716 4 20 4s15 6.716 15 15v21M12 40V19a8 8 0 0 1 16 0v21M5 30h30" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span><strong>the pass<span className="brand-period">.</span></strong><small>CONSULTING</small></span>
    </Link>
  );
}

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={diagonal ? "arrow-icon diagonal" : "arrow-icon"}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
