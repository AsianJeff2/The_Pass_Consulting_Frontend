import { CONTACT_EMAIL, INQUIRY_MAILTO } from "@/lib/contact";
import Link from "next/link";
import { Arrow, Brand } from "./Brand";

export default function Footer() {
  return <footer className="site-footer">
    <div className="container footer-top">
      <div><Brand light /><p>Good hospitality.<br />A stronger business behind it.</p></div>
      <div className="footer-links"><Link href="/#expertise">Expertise</Link><Link href="/#approach">Our approach</Link><Link href="/#about">About The Pass</Link></div>
      <div className="footer-contact"><span className="eyebrow">LET’S TALK ABOUT YOUR NEXT CHAPTER</span><a href={INQUIRY_MAILTO}>{CONTACT_EMAIL} <Arrow diagonal /></a><span>Based in Southern California. Working beyond it.</span></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} The Pass Consulting</span><span>Independent thinking. Considered action.</span><Link href="/privacy">Privacy</Link></div>
  </footer>;
}
