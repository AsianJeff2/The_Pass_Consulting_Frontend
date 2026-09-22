"use client";

import { CONTACT_EMAIL, INQUIRY_MAILTO } from "@/lib/contact";
import { useEffect, useRef, useState, type FormEvent } from "react";

const FOCUS_OPTIONS = [
  "Operational diagnostic",
  "Labor & staffing",
  "Food & operating costs",
  "Sales & guest demand",
  "Not sure yet",
] as const;

type FormValues = {
  name: string;
  email: string;
  business: string;
  location: string;
  focus: (typeof FOCUS_OPTIONS)[number];
  message: string;
  website: string;
  consent: boolean;
};

type FieldName = keyof FormValues;
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus = "idle" | "sending" | "error" | "success";

const INITIAL_VALUES: FormValues = {
  name: "",
  email: "",
  business: "",
  location: "",
  focus: "Not sure yet",
  message: "",
  website: "",
  consent: false,
};

const FIELD_LABELS: Record<FieldName, string> = {
  name: "Your name",
  email: "Email address",
  business: "Restaurant or business",
  location: "Location",
  focus: "Where would you like support?",
  message: "What is happening in your business?",
  website: "Website",
  consent: "Permission to reply",
};

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Enter your name (at least 2 characters).";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address so Michael can reply.";
  }
  if (values.business.trim().length < 2) {
    errors.business = "Enter your restaurant or business name.";
  }
  if (values.message.trim().length < 20) {
    errors.message = "Share a little more about your business (at least 20 characters).";
  }
  if (!values.consent) {
    errors.consent = "Please confirm that Michael may reply to your inquiry.";
  }

  return errors;
}

function readFieldErrors(value: unknown): FieldErrors {
  if (!value || typeof value !== "object") return {};

  const errors: FieldErrors = {};
  for (const field of Object.keys(FIELD_LABELS) as FieldName[]) {
    const message = (value as Record<string, unknown>)[field];
    if (typeof message === "string" && message.length > 0) {
      errors[field] = message;
    }
  }
  return errors;
}

export default function InquiryForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const submissionId = useRef<string | null>(null);
  const submitting = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "error") summaryRef.current?.focus();
    if (status === "success") successRef.current?.focus();
  }, [status, errors]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  function updateField<K extends FieldName>(field: K, value: FormValues[K]) {
    submissionId.current = null;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (status === "error") {
      setStatus("idle");
      setStatusMessage("");
    }
  }

  function fieldDescription(field: FieldName, hint?: string) {
    const ids = [hint, errors[field] ? `inquiry-${field}-error` : undefined].filter(Boolean);
    return ids.length > 0 ? ids.join(" ") : undefined;
  }

  function fieldError(field: FieldName) {
    return errors[field] ? (
      <span className="field-error" id={`inquiry-${field}-error`}>
        {errors[field]}
      </span>
    ) : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage("Please check the highlighted fields.");
      setStatus("error");
      return;
    }

    submitting.current = true;
    setStatus("sending");
    setStatusMessage("");
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 20_000);

    try {
      submissionId.current ??= crypto.randomUUID();
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, submissionId: submissionId.current }),
        signal: controller.signal,
      });
      const result: unknown = await response.json();

      if (!result || typeof result !== "object") {
        throw new Error("Invalid inquiry response");
      }

      const data = result as { ok?: unknown; message?: unknown; fields?: unknown };
      if (response.ok && data.ok === true) {
        setStatus("success");
        return;
      }

      const serverErrors = readFieldErrors(data.fields);
      const identityRejected = Boolean(data.fields && typeof data.fields === "object" && "submissionId" in data.fields);
      const hiddenFieldRejected = Boolean(serverErrors.website);
      delete serverErrors.website;
      setErrors(serverErrors);
      setStatusMessage(
        identityRejected
          ? "We could not identify this submission. Please email Michael directly, or copy your message and reload the page."
          : hiddenFieldRejected
            ? "We could not accept this inquiry. Please email Michael directly to start a conversation."
            : typeof data.message === "string" && data.message.length > 0
          ? data.message
          : "We could not confirm your inquiry. Your details are still here. Please try again or email Michael directly.",
      );
      setStatus("error");
    } catch {
      setStatusMessage(
        "We could not confirm your inquiry. Your details are still here. Please try again or email Michael directly.",
      );
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      controllerRef.current = null;
      submitting.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className="inquiry-form form-success" ref={successRef} tabIndex={-1} role="status">
        <span className="eyebrow">A good first step</span>
        <h3>Your inquiry is on its way to Michael.</h3>
        <p>Your message has been accepted for sending. Michael will reply to the email address you shared.</p>
        <p className="form-note">If you need to follow up, email <a href={INQUIRY_MAILTO}>{CONTACT_EMAIL}</a>.</p>
      </div>
    );
  }

  return (
    <form className="inquiry-form" method="post" action="/api/inquiry" onSubmit={handleSubmit} noValidate aria-busy={status === "sending"}>
      <noscript><style>{".inquiry-form .form-fields, #inquiry-required { display: none; }"}</style><p className="form-status">This form needs JavaScript. Please <a href={INQUIRY_MAILTO}>email Michael directly</a> to start a conversation.</p></noscript>
      <p className="form-note" id="inquiry-required">Fields marked with an asterisk (*) are required.</p>

      {status === "error" && (
        <div className="form-status form-status-error" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>{statusMessage}</p>
          {Object.keys(errors).some((field) => field !== "website") && (
            <ul>
              {(Object.keys(errors) as FieldName[]).filter((field) => field !== "website").map((field) => (
                <li key={field}>
                  <a href={`#inquiry-${field}`}>{FIELD_LABELS[field]}: {errors[field]}</a>
                </li>
              ))}
            </ul>
          )}
          <p>Or email <a href={INQUIRY_MAILTO}>{CONTACT_EMAIL}</a>.</p>
        </div>
      )}

      <fieldset className="form-fields" disabled={status === "sending"}>
        <legend className="sr-only">Tell us about your business</legend>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="inquiry-name">Your name <span aria-hidden="true">*</span></label>
            <input id="inquiry-name" name="name" autoComplete="name" value={values.name} onChange={(event) => updateField("name", event.target.value)} required minLength={2} maxLength={100} aria-invalid={Boolean(errors.name)} aria-describedby={fieldDescription("name")} placeholder="First and last name" />
            {fieldError("name")}
          </div>
          <div className="form-field">
            <label htmlFor="inquiry-email">Email address <span aria-hidden="true">*</span></label>
            <input id="inquiry-email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={(event) => updateField("email", event.target.value)} required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={fieldDescription("email")} placeholder="you@yourrestaurant.com" />
            {fieldError("email")}
          </div>
          <div className="form-field">
            <label htmlFor="inquiry-business">Restaurant or business <span aria-hidden="true">*</span></label>
            <input id="inquiry-business" name="business" autoComplete="organization" value={values.business} onChange={(event) => updateField("business", event.target.value)} required minLength={2} maxLength={160} aria-invalid={Boolean(errors.business)} aria-describedby={fieldDescription("business")} placeholder="Your business name" />
            {fieldError("business")}
          </div>
          <div className="form-field">
            <label htmlFor="inquiry-location">Location <span className="field-optional">(optional)</span></label>
            <input id="inquiry-location" name="location" autoComplete="address-level2" value={values.location} onChange={(event) => updateField("location", event.target.value)} maxLength={160} aria-invalid={Boolean(errors.location)} aria-describedby={fieldDescription("location")} placeholder="City, state or region" />
            {fieldError("location")}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="inquiry-focus">Where would you like support?</label>
          <select id="inquiry-focus" name="focus" value={values.focus} onChange={(event) => updateField("focus", event.target.value as FormValues["focus"])} aria-invalid={Boolean(errors.focus)} aria-describedby={fieldDescription("focus")}>
            {FOCUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          {fieldError("focus")}
        </div>

        <div className="form-field">
          <label htmlFor="inquiry-message">What is happening in your business? <span aria-hidden="true">*</span></label>
          <textarea id="inquiry-message" name="message" rows={4} value={values.message} onChange={(event) => updateField("message", event.target.value)} required minLength={20} maxLength={3000} aria-invalid={Boolean(errors.message)} aria-describedby={fieldDescription("message", "inquiry-message-hint")} placeholder="Tell us what is working, what feels difficult, and what you would like to change." />
          <span className="field-hint" id="inquiry-message-hint">A few sentences are enough. Please leave out confidential business or guest information.</span>
          {fieldError("message")}
        </div>

        <div hidden aria-hidden="true">
          <label htmlFor="inquiry-website">Website</label>
          <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" maxLength={200} value={values.website} onChange={(event) => updateField("website", event.target.value)} />
        </div>

        <div className="form-consent">
          <label htmlFor="inquiry-consent">
            <input id="inquiry-consent" name="consent" type="checkbox" required checked={values.consent} onChange={(event) => updateField("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={fieldDescription("consent")} />
            <span>I agree that Michael may use these details to respond to my inquiry. <span aria-hidden="true">*</span></span>
          </label>
          {fieldError("consent")}
          <p className="form-note">Read our <a href="/privacy">privacy notice</a>.</p>
        </div>

        <button className="button-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending your inquiry…" : "Start a conversation"}
          <span aria-hidden="true">&#8599;</span>
        </button>
      </fieldset>

      <p className="form-note form-fallback">Prefer email? <a href={INQUIRY_MAILTO}>Write to Michael directly &#8599;</a></p>
      <span className="sr-only" role="status" aria-live="polite">{status === "sending" ? "Sending your inquiry. Please wait." : ""}</span>
    </form>
  );
}
