export function publicSiteUrl(): URL | undefined {
  try {
    const url = new URL(process.env.SITE_URL ?? "");
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return;
    return url;
  } catch {
    return;
  }
}
