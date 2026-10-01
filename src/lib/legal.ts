export const LEGAL_PAGES = [
  { path: "/privacy", label: "Privacy notice", parent: "/" },
  { path: "/privacy/requests", label: "Privacy requests", parent: "/privacy" },
  { path: "/data-protection", label: "Data protection", parent: "/" },
  { path: "/data-protection/client-records", label: "Sharing client records", parent: "/data-protection" },
  { path: "/terms", label: "Website terms", parent: "/" },
] as const;

export type LegalPath = (typeof LEGAL_PAGES)[number]["path"];
