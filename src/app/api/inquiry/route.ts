import { handleInquiry } from "@/lib/inquiry";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(request: Request): Promise<Response> {
  return handleInquiry(request, {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FROM: process.env.CONTACT_FROM,
    SITE_URL: process.env.SITE_URL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  });
}
