"use client";

import { useState } from "react";
import { CONTACT_EMAIL, INQUIRY_GMAIL_URL } from "@/lib/contact";

export default function EmailOptions() {
  const [feedback, setFeedback] = useState("");

  async function copyEmail() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setFeedback("Email address copied.");
    } catch {
      setFeedback(`Copy is unavailable. Select and copy ${CONTACT_EMAIL}, or open Gmail.`);
    }
  }

  return <div className="email-options">
    <div className="email-options-actions">
      <a href={INQUIRY_GMAIL_URL} target="_blank" rel="noopener noreferrer">Open Gmail <span className="sr-only">(opens in a new tab)</span><span aria-hidden="true">↗</span></a>
      <button className="email-options-copy" type="button" onClick={copyEmail}>Copy email address</button>
    </div>
    <p className="email-copy-status" role="status" aria-live="polite">{feedback}</p>
    <noscript><style>{".email-options-actions .email-options-copy { display: none; }"}</style></noscript>
  </div>;
}
