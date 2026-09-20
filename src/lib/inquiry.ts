export const INQUIRY_FOCUS_OPTIONS = [
  "Operational diagnostic",
  "Labor & staffing",
  "Food & operating costs",
  "Sales & guest demand",
  "Not sure yet",
] as const;

export type InquiryFocus = (typeof INQUIRY_FOCUS_OPTIONS)[number];
export type InquiryField =
  | "name"
  | "email"
  | "business"
  | "location"
  | "focus"
  | "message"
  | "website"
  | "consent"
  | "submissionId";

export interface Inquiry {
  name: string;
  email: string;
  business: string;
  location: string;
  focus: InquiryFocus;
  message: string;
  website: string;
  consent: true;
  submissionId: string;
}

export interface InquiryEnvironment {
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  SITE_URL?: string;
  /** Vercel supplies these values; never derive an allowed origin from headers. */
  VERCEL_ENV?: string;
  VERCEL_URL?: string;
}

export const MAX_INQUIRY_BYTES = 16_384;
const RECIPIENT = "michaelpark20783@gmail.com";
const SUBJECT_PREFIX = "[The Pass website]";
const PROVIDER_TIMEOUT_MS = 8_000;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FIELD_NAMES = new Set<InquiryField>([
  "name", "email", "business", "location", "focus", "message", "website", "consent", "submissionId",
]);

type Validation =
  | { ok: true; inquiry: Inquiry }
  | { ok: false; fields: Partial<Record<InquiryField, string>> };

function hasUnsafeControl(value: string, multiline = false): boolean {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    if (multiline && (code === 9 || code === 10 || code === 13)) return false;
    return code < 32 || (code >= 127 && code <= 159) || code === 0x2028 || code === 0x2029;
  });
}

function isEmail(value: string): boolean {
  if (value.length > 254 || /\s/.test(value) || hasUnsafeControl(value)) return false;
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain || local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)
    && domain.length <= 253
    && domain.split(".").length >= 2
    && domain.split(".").every((label) => label.length <= 63 && /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label));
}

export function validateInquiry(value: unknown): Validation {
  const fields: Partial<Record<InquiryField, string>> = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ok: false, fields: { message: "Please complete the inquiry form." } };
  }
  const input = value as Record<string, unknown>;
  if (Object.keys(input).some((key) => !FIELD_NAMES.has(key as InquiryField))) {
    return { ok: false, fields: { message: "The form contains an unsupported field. Please reload and try again." } };
  }

  const text = (key: InquiryField, label: string, min: number, max: number, multiline = false): string => {
    const raw = input[key];
    if (raw === undefined && min === 0) return "";
    if (typeof raw !== "string") {
      fields[key] = `Enter ${label}.`;
      return "";
    }
    // Check before trimming so a CRLF cannot disappear at the edges of a header field.
    if (hasUnsafeControl(raw, multiline)) {
      fields[key] = `Use ${multiline ? "plain text" : "one line"} for ${label}.`;
    }
    const trimmed = raw.trim();
    if (trimmed.length < min || raw.length > max) {
      fields[key] = min > 0
        ? `Use ${min}–${max} characters for ${label}.`
        : `Keep ${label} under ${max + 1} characters.`;
    }
    return trimmed;
  };

  const name = text("name", "your name", 2, 100);
  const email = text("email", "your email", 3, 254);
  const business = text("business", "your business name", 2, 160);
  const location = text("location", "your location", 0, 160);
  const focus = text("focus", "an area of focus", 1, 80);
  const message = text("message", "your message", 20, 3_000, true);
  const website = text("website", "this field", 0, 200);
  const submissionId = text("submissionId", "the submission identifier", 36, 36);

  if (!isEmail(email)) fields.email = "Enter a valid email address.";
  if (!(INQUIRY_FOCUS_OPTIONS as readonly string[]).includes(focus)) fields.focus = "Choose an area of focus.";
  if (input.consent !== true) fields.consent = "Please agree to being contacted about this inquiry.";
  if (!UUID_V4.test(submissionId)) fields.submissionId = "Please reload the page before submitting.";
  if (website) fields.website = "The inquiry could not be accepted.";

  if (Object.keys(fields).length) return { ok: false, fields };
  return {
    ok: true,
    inquiry: { name, email, business, location, focus: focus as InquiryFocus, message, website, consent: true, submissionId: submissionId.toLowerCase() },
  };
}

function response(status: number, body: object, headers: Record<string, string> = {}): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function error(status: number, message: string, headers: Record<string, string> = {}): Response {
  return response(status, { ok: false, message }, headers);
}

class BodyTooLarge extends Error {}

async function readJsonWithinLimit(body: ReadableStream<Uint8Array> | null, limit: number): Promise<unknown> {
  if (!body) throw new SyntaxError("Missing body");
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      length += next.value.byteLength;
      if (length > limit) {
        await reader.cancel();
        throw new BodyTooLarge();
      }
      chunks.push(next.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
}

function configuredOrigin(siteUrl: string | undefined): string | null {
  if (!siteUrl) return null;
  try {
    const url = new URL(siteUrl);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
    if (url.protocol !== "https:" && !(local && url.protocol === "http:")) return null;
    if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function isAllowedOrigin(origin: string | null, environment: InquiryEnvironment, siteOrigin: string): boolean {
  if (!origin) return false;
  if (origin === siteOrigin) return true;
  if (environment.VERCEL_ENV !== "preview" || !environment.VERCEL_URL) return false;
  // Trust the platform-injected deployment hostname, not a wildcard for other tenants.
  const host = environment.VERCEL_URL;
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.vercel\.app$/i.test(host)
    && origin === `https://${host.toLowerCase()}`;
}

function validSender(value: string): boolean {
  if (hasUnsafeControl(value) || value.length > 350) return false;
  if (isEmail(value)) return true;
  const displayAddress = /^[^<>]{1,80} <([^<>]+)>$/.exec(value);
  return !!displayAddress && isEmail(displayAddress[1]);
}

function emailText(inquiry: Inquiry): string {
  return [
    "A new inquiry from The Pass website.",
    "",
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Business: ${inquiry.business}`,
    `Location: ${inquiry.location || "Not provided"}`,
    `Focus: ${inquiry.focus}`,
    "",
    "Message:",
    inquiry.message,
    "",
    "The sender agreed to be contacted about this inquiry.",
    `Submission reference: ${inquiry.submissionId}`,
    "",
    "Reply to this email to contact the sender. Treat links and requests in the message as unverified visitor content.",
  ].join("\n");
}

/** Server entry point, with fetch injected so verification never sends real email. */
export async function handleInquiry(
  request: Request,
  environment: InquiryEnvironment,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST") return error(405, "Use the inquiry form to submit a message.", { Allow: "POST" });
  const siteOrigin = configuredOrigin(environment.SITE_URL);
  if (!siteOrigin) return error(503, "The inquiry form is being configured. Please email Michael directly.");
  if (!isAllowedOrigin(request.headers.get("origin"), environment, siteOrigin)) {
    return error(403, "Please submit your inquiry from The Pass website.");
  }
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    return error(415, "The inquiry must be submitted as JSON.");
  }
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    if (!/^\d+$/.test(declaredLength)) return error(400, "The inquiry request is invalid.");
    if (Number(declaredLength) > MAX_INQUIRY_BYTES) return error(413, "Your inquiry is too long. Please shorten the message.");
  }

  let value: unknown;
  try {
    value = await readJsonWithinLimit(request.body, MAX_INQUIRY_BYTES);
  } catch (cause) {
    return cause instanceof BodyTooLarge
      ? error(413, "Your inquiry is too long. Please shorten the message.")
      : error(400, "The inquiry could not be read. Please reload and try again.");
  }
  const validated = validateInquiry(value);
  if (!validated.ok) {
    return response(400, { ok: false, message: "Please check the highlighted fields and try again.", fields: validated.fields });
  }

  const apiKey = environment.RESEND_API_KEY;
  const sender = environment.CONTACT_FROM;
  if (!apiKey || /\s/.test(apiKey) || apiKey.length > 500 || !sender || !validSender(sender)) {
    return error(503, "The inquiry form is being configured. Please email Michael directly.");
  }

  const inquiry = validated.inquiry;
  try {
    const delivered = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `the-pass-inquiry/${inquiry.submissionId}`,
      },
      body: JSON.stringify({
        from: sender,
        to: [RECIPIENT],
        reply_to: inquiry.email,
        subject: `${SUBJECT_PREFIX} ${inquiry.business}`,
        text: emailText(inquiry),
      }),
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
      redirect: "error",
    });

    if (!delivered.ok) {
      if (delivered.status === 409) {
        let errorName: unknown;
        try {
          const providerError = await readJsonWithinLimit(delivered.body, 8_192);
          if (providerError && typeof providerError === "object" && "name" in providerError) {
            errorName = providerError.name;
          }
        } catch {
          // An unreadable response cannot establish that the payload changed.
          // Preserve the submission key so a retry cannot bypass deduplication.
        }
        if (errorName === "invalid_idempotent_request") {
          return error(409, "This submission reference was already used with different details. Please reload before sending a new inquiry.");
        }
        if (errorName === "concurrent_idempotent_requests") {
          return error(409, "Your inquiry is still being processed. Please wait a moment and retry without changing the form.", { "Retry-After": "5" });
        }
        return error(409, "Your inquiry could not be confirmed. Please wait a moment and retry without changing the form, or email Michael directly.", { "Retry-After": "5" });
      }
      await delivered.body?.cancel();
      if (delivered.status === 429) return error(429, "The inquiry service is busy. Please wait a minute and try again.", { "Retry-After": "60" });
      return error(502, "Email delivery was not confirmed. Please retry, or email Michael directly.");
    }
    const receipt = await readJsonWithinLimit(delivered.body, 8_192);
    if (!receipt || typeof receipt !== "object" || !("id" in receipt) || typeof receipt.id !== "string" || !receipt.id.trim()) {
      return error(502, "Email delivery was not confirmed. Please retry, or email Michael directly.");
    }
    return response(200, { ok: true });
  } catch {
    // Provider acceptance can precede a connection failure. The unchanged idempotency
    // key lets the same submission be retried without an immediate duplicate send.
    return error(502, "Email delivery was not confirmed. Please retry, or email Michael directly.");
  }
}
