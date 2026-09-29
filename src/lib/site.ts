export const PRODUCTION_SITE_ORIGIN = "https://www.thepassconsulting.com";

/** Only configuration can add an origin; request headers never supply one. */
export function configuredSiteOrigin(value: string | undefined): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) return;
    if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) return;
    return url.origin;
  } catch {
    return;
  }
}

export function siteOrigin(value: string | undefined): string {
  return configuredSiteOrigin(value) ?? PRODUCTION_SITE_ORIGIN;
}

export function publicSiteUrl(): URL | undefined {
  const url = new URL(siteOrigin(process.env.SITE_URL));
  return url.protocol === "https:" ? url : undefined;
}
