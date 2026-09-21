import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = publicSiteUrl();
  if (!site || process.env.VERCEL_ENV === "preview") return [];
  return [{ url: site.href, priority: 1 }, { url: new URL("/privacy", site).href, priority: 0.2 }];
}
