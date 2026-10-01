import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/site";
import { SERVICES, servicePath } from "@/lib/seo";
import { LEGAL_PAGES } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = publicSiteUrl();
  if (!site || process.env.VERCEL_ENV === "preview") return [];
  const paths = ["/", "/services", ...SERVICES.map(servicePath), ...LEGAL_PAGES.map(({ path }) => path)];
  return paths.map((path) => ({ url: new URL(path, site).href }));
}
