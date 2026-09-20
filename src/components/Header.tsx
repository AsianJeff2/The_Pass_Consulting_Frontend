"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Arrow, Brand } from "./Brand";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const home = pathname === "/";
  const href = (id: string) => `${home ? "" : "/"}#${id}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!panel.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href={href("expertise")}>Expertise</a><a href={href("approach")}>Our approach</a><a href={href("about")}>About</a>
        </nav>
        <a className="header-cta" href={href("inquiry")}>Start a conversation <Arrow diagonal /></a>
        <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls={open ? "mobile-navigation" : undefined} onClick={() => setOpen(!open)}>
          <span className={open ? "menu-lines is-open" : "menu-lines"}><i /><i /></span>
        </button>
      </div>
      {open && <nav ref={panel} id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
        {[["expertise", "Expertise"], ["approach", "Our approach"], ["about", "About"], ["inquiry", "Start a conversation"]].map(([id, label]) => <a key={id} href={href(id)} onClick={() => setOpen(false)}>{label}<Arrow /></a>)}
      </nav>}
    </header>
  );
}
