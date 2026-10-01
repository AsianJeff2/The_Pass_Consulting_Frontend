import Link from "next/link";
import { LEGAL_PAGES, type LegalPath } from "@/lib/legal";

type Props = { currentPath: LegalPath };

export function LegalBreadcrumb({ currentPath }: Props) {
  const current = LEGAL_PAGES.find((page) => page.path === currentPath);
  if (!current) return null;
  const parent = LEGAL_PAGES.find((page) => page.path === current.parent);
  return <nav className="legal-breadcrumb" aria-label="Breadcrumb">
    <ol>
      <li><Link href="/">Home</Link></li>
      {parent && <li><span aria-hidden="true">/ </span><Link href={parent.path}>{parent.label}</Link></li>}
      <li><span aria-hidden="true">/ </span><span aria-current="page">{current.label}</span></li>
    </ol>
  </nav>;
}

export default function LegalNavigation({ currentPath }: Props) {
  return <nav className="legal-navigation" aria-label="Privacy and data protection">
    <ul>{LEGAL_PAGES.map((page) => <li key={page.path}><Link href={page.path} aria-current={currentPath === page.path ? "page" : undefined}>{page.label}</Link></li>)}</ul>
  </nav>;
}
