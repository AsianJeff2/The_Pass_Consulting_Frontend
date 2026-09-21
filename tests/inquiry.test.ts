import assert from "node:assert/strict";
import test from "node:test";
import {
  handleInquiry,
  MAX_INQUIRY_BYTES,
  validateInquiry,
  type InquiryEnvironment,
} from "../src/lib/inquiry.ts";

const environment: InquiryEnvironment = {
  RESEND_API_KEY: "re_test_placeholder_not_a_real_key",
  CONTACT_FROM: "The Pass <inquiries@example.com>",
  SITE_URL: "https://thepass.example",
};
const valid = {
  name: "Jordan Example",
  email: "jordan@example.com",
  business: "Example Restaurant",
  location: "Riverside, CA",
  focus: "Operational diagnostic",
  message: "We would like to understand our food and staffing costs.",
  website: "",
  consent: true,
  submissionId: "123e4567-e89b-42d3-a456-426614174000",
};

function request(body: unknown = valid, headers: Record<string, string> = {}): Request {
  return new Request("https://thepass.example/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://thepass.example", ...headers },
    body: JSON.stringify(body),
  });
}

const shouldNotFetch: typeof fetch = async () => {
  assert.fail("No provider request should be made for this input");
};
const accepted: typeof fetch = async () => Response.json({ id: "mock-email-id" });

test("forwards only to Michael, puts visitor in reply_to, and confirms provider acceptance", async () => {
  let calls = 0;
  const fetcher: typeof fetch = async (url, init) => {
    calls++;
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(init?.method, "POST");
    assert.equal(init?.redirect, "error");
    assert.ok(init?.signal instanceof AbortSignal);
    const headers = new Headers(init?.headers);
    assert.equal(headers.get("authorization"), `Bearer ${environment.RESEND_API_KEY}`);
    assert.equal(headers.get("idempotency-key"), `the-pass-inquiry/${valid.submissionId}`);
    const payload = JSON.parse(String(init?.body));
    assert.deepEqual(payload.to, ["michaelpark20783@gmail.com"]);
    assert.equal(payload.from, environment.CONTACT_FROM);
    assert.equal(payload.reply_to, valid.email);
    assert.equal(payload.subject, "[The Pass website] Example Restaurant");
    assert.match(payload.text, /Location: Riverside, CA/);
    assert.match(payload.text, /We would like to understand/);
    assert.equal(payload.html, undefined);
    return Response.json({ id: "accepted-id" });
  };
  const result = await handleInquiry(request(), environment, fetcher);
  assert.equal(calls, 1);
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("cache-control"), "no-store");
  assert.deepEqual(await result.json(), { ok: true });
});

test("an unchanged retry has the same provider key and exact message payload", async () => {
  const calls: { key: string | null; body: BodyInit | null | undefined }[] = [];
  const fetcher: typeof fetch = async (_url, init) => {
    calls.push({ key: new Headers(init?.headers).get("idempotency-key"), body: init?.body });
    return Response.json({ id: "same-accepted-id" });
  };
  assert.equal((await handleInquiry(request(), environment, fetcher)).status, 200);
  assert.equal((await handleInquiry(request(), environment, fetcher)).status, 200);
  assert.deepEqual(calls[0], calls[1]);
});

test("optional location may be omitted and message line breaks are retained", async () => {
  const result = validateInquiry({ ...valid, location: undefined, message: `${valid.message}\nOur schedule changes every week.` });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.inquiry.location, "");
    assert.match(result.inquiry.message, /\nOur schedule/);
  }
});

test("rejects invalid email, enum, consent, length, and submission identifiers before sending", async () => {
  const result = await handleInquiry(request({
    ...valid,
    name: "J",
    email: "invalid-address",
    focus: "Unrecognized focus",
    message: "short",
    consent: "true",
    submissionId: "not-a-uuid",
  }), environment, shouldNotFetch);
  assert.equal(result.status, 400);
  const body = await result.json();
  assert.equal(body.ok, false);
  for (const field of ["name", "email", "focus", "message", "consent", "submissionId"]) {
    assert.equal(typeof body.fields[field], "string");
  }
});

test("rejects CRLF injection even when a newline is at the end of a header field", async () => {
  for (const field of ["name", "email", "business", "location"]) {
    const result = await handleInquiry(request({ ...valid, [field]: `${valid[field as keyof typeof valid]}\r\n` }), environment, shouldNotFetch);
    assert.equal(result.status, 400, field);
    assert.equal((await result.json()).ok, false);
  }
});

test("rejects recipient overrides and a populated honeypot without claiming success", async () => {
  for (const addition of [{ to: "attacker@example.com" }, { website: "https://spam.example" }]) {
    const result = await handleInquiry(request({ ...valid, ...addition }), environment, shouldNotFetch);
    assert.equal(result.status, 400);
    assert.equal((await result.json()).ok, false);
  }
});

test("missing provider configuration and an invalid sender fail visibly", async () => {
  for (const overrides of [
    { RESEND_API_KEY: undefined },
    { CONTACT_FROM: undefined },
    { CONTACT_FROM: "inquiries@example.com\r\nBcc: attacker@example.com" },
    { SITE_URL: undefined },
    { SITE_URL: "http://thepass.example" },
  ]) {
    const result = await handleInquiry(request(), { ...environment, ...overrides }, shouldNotFetch);
    assert.equal(result.status, 503);
    assert.equal((await result.json()).ok, false);
  }
});

test("origin allowlist rejects other sites, absent origin, and attacker Vercel projects", async () => {
  for (const origin of ["https://attacker.example", "null", "https://attacker.vercel.app", "https://thepass.example.attacker.com"]) {
    assert.equal((await handleInquiry(request(valid, { Origin: origin }), environment, shouldNotFetch)).status, 403);
  }
  const withoutOrigin = request();
  withoutOrigin.headers.delete("origin");
  assert.equal((await handleInquiry(withoutOrigin, environment, shouldNotFetch)).status, 403);
});

test("permits only the exact platform-provided preview origin in preview mode", async () => {
  const previewEnvironment = { ...environment, VERCEL_ENV: "preview", VERCEL_URL: "the-pass-abc123.vercel.app" };
  const preview = request(valid, { Origin: "https://the-pass-abc123.vercel.app" });
  assert.equal((await handleInquiry(preview, previewEnvironment, accepted)).status, 200);
  assert.equal((await handleInquiry(request(valid, { Origin: "https://the-pass-other.vercel.app" }), previewEnvironment, shouldNotFetch)).status, 403);
  assert.equal((await handleInquiry(request(valid, { Origin: "https://the-pass-abc123.vercel.app" }), { ...previewEnvironment, VERCEL_ENV: "production" }, shouldNotFetch)).status, 403);
});

test("rejects unsupported content types and malformed JSON", async () => {
  assert.equal((await handleInquiry(request(valid, { "Content-Type": "text/plain" }), environment, shouldNotFetch)).status, 415);
  const malformed = new Request("https://thepass.example/api/inquiry", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: "https://thepass.example" }, body: "{",
  });
  assert.equal((await handleInquiry(malformed, environment, shouldNotFetch)).status, 400);
});

test("rejects declared oversized bodies before reading or sending", async () => {
  assert.equal((await handleInquiry(request(valid, { "Content-Length": String(MAX_INQUIRY_BYTES + 1) }), environment, shouldNotFetch)).status, 413);
});

test("caps actual streamed bytes even with a missing or false Content-Length", async () => {
  for (const declaredLength of [undefined, "1"]) {
    let canceled = false;
    let chunks = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        chunks++;
        controller.enqueue(new Uint8Array(9_000).fill(97));
      },
      cancel() { canceled = true; },
    });
    const headers = new Headers({ "Content-Type": "application/json", Origin: "https://thepass.example" });
    if (declaredLength) headers.set("Content-Length", declaredLength);
    const init: RequestInit & { duplex: "half" } = { method: "POST", headers, body: stream, duplex: "half" };
    const result = await handleInquiry(new Request("https://thepass.example/api/inquiry", init), environment, shouldNotFetch);
    assert.equal(result.status, 413);
    assert.equal(canceled, true);
    assert.ok(chunks <= 3);
  }
});

test("rejects messages exceeding the form limit even below the transport cap", async () => {
  const result = await handleInquiry(request({ ...valid, message: "a".repeat(3_001) }), environment, shouldNotFetch);
  assert.equal(result.status, 400);
  assert.equal(typeof (await result.json()).fields.message, "string");
});

test("provider failures never expose provider messages, recipient data, or credentials", async () => {
  for (const status of [401, 403, 422, 500]) {
    const fetcher: typeof fetch = async () => Response.json({ message: "private-provider-detail" }, { status });
    const result = await handleInquiry(request(), environment, fetcher);
    assert.equal(result.status, 502);
    const body = await result.text();
    assert.match(body, /"ok":false/);
    assert.doesNotMatch(body, /private-provider-detail|re_test_placeholder|jordan@example/);
  }
});

test("provider throttling has an actionable error status", async () => {
  const throttled = await handleInquiry(request(), environment, async () => Response.json({}, { status: 429 }));
  assert.equal(throttled.status, 429);
  assert.equal(throttled.headers.get("retry-after"), "60");
  assert.equal((await throttled.json()).ok, false);
});

test("concurrent idempotent requests invite an unchanged retry, not a new submission", async () => {
  const result = await handleInquiry(request(), environment, async () => Response.json({
    name: "concurrent_idempotent_requests", message: "private-provider-detail",
  }, { status: 409 }));
  assert.equal(result.status, 409);
  assert.equal(result.headers.get("retry-after"), "5");
  const body = await result.json();
  assert.equal(body.ok, false);
  assert.match(body.message, /still being processed/);
  assert.match(body.message, /retry without changing the form/);
  assert.doesNotMatch(body.message, /reload|different details|private-provider-detail/);
});

test("a confirmed idempotency payload mismatch can advise a new submission", async () => {
  const result = await handleInquiry(request(), environment, async () => Response.json({
    name: "invalid_idempotent_request", message: "private-provider-detail",
  }, { status: 409 }));
  assert.equal(result.status, 409);
  assert.equal(result.headers.get("retry-after"), null);
  const body = await result.json();
  assert.equal(body.ok, false);
  assert.match(body.message, /different details/);
  assert.match(body.message, /reload/);
  assert.doesNotMatch(body.message, /private-provider-detail/);
});

test("unknown, unreadable, and oversized conflict responses preserve the retry key", async () => {
  const cases: (typeof fetch)[] = [
    async () => Response.json({ name: "unknown-conflict", message: "private-provider-detail" }, { status: 409 }),
    async () => Response.json({}, { status: 409 }),
    async () => new Response("not-json", { status: 409 }),
    async () => new Response("x".repeat(8_193), { status: 409 }),
  ];
  for (const fetcher of cases) {
    const result = await handleInquiry(request(), environment, fetcher);
    assert.equal(result.status, 409);
    assert.equal(result.headers.get("retry-after"), "5");
    const body = await result.json();
    assert.equal(body.ok, false);
    assert.match(body.message, /could not be confirmed/);
    assert.match(body.message, /retry without changing the form/);
    assert.doesNotMatch(body.message, /reload|different details|private-provider-detail/);
  }
});

test("network/timeout failures and invalid success receipts do not claim acceptance", async () => {
  const cases: (typeof fetch)[] = [
    async () => { throw new TypeError("connection failed"); },
    async () => { throw new DOMException("timed out", "TimeoutError"); },
    async () => Response.json({}),
    async () => Response.json({ id: "" }),
    async () => new Response("not-json", { status: 200 }),
  ];
  for (const fetcher of cases) {
    const result = await handleInquiry(request(), environment, fetcher);
    assert.equal(result.status, 502);
    assert.equal((await result.json()).ok, false);
  }
});
