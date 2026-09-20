import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicSiteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: publicSiteUrl(),
  title: { default: "The Pass Consulting | Clarity for independent hospitality", template: "%s | The Pass Consulting" },
  description: "Thoughtful hospitality consulting for independent restaurant operators. Understand your operation, focus your priorities, and build a practical path forward with Michael Park.",
  applicationName: "The Pass Consulting",
  icons: { icon: "/icon.svg" },
  openGraph: { title: "The Pass Consulting", description: "Good hospitality deserves a strong business behind it.", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "The Pass Consulting", description: "Clarity for independent hospitality." },
  robots: process.env.VERCEL_ENV === "preview" ? { index: false, follow: false } : undefined,
};
export const viewport: Viewport = { themeColor: "#f5f3eb" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /></body></html>;
}
