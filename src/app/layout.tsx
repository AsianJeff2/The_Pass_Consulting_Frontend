import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicSiteUrl } from "@/lib/site";
import { HOME_TITLE, HOME_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: publicSiteUrl(),
  title: { default: `${HOME_TITLE} | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description: HOME_DESCRIPTION,
  applicationName: "The Pass Consulting",
  icons: { icon: "/icon.svg" },
  openGraph: { title: "The Pass Consulting", description: HOME_DESCRIPTION, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "The Pass Consulting", description: HOME_DESCRIPTION },
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : undefined,
};
export const viewport: Viewport = { themeColor: "#f5f3eb" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /></body></html>;
}
