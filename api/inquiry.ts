/**
 * Vercel serverless function: POST /api/inquiry
 *
 * Receives an institutional services inquiry (blind IEP quality audits,
 * the Leader Fellowship, or educator PD) from the For Schools page,
 * validates input, then:
 *
 *   1. Emails info@edquityatthemargins.org with the inquiry so Reba
 *      can follow up with engagement details and pricing.
 *   2. Sends the requester a short acknowledgment.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Institutional Services <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

type Body = {
  name?: unknown;
  title?: unknown;
  organization?: unknown;
  email?: unknown;
  phone?: unknown;
  orgType?: unknown;
  service?: unknown;
  iepVolume?: unknown;
  message?: unknown;
};

function isNonEmptyString(v: unknown, maxLen: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= maxLen;
}

function optionalString(v: unknown, maxLen: number): string {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= maxLen ? v.trim() : "";
}

function isValidEmail(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const trimmed = v.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding: 6px 0; color: #64748b; width: 180px; vertical-align: top;"><strong>${label}</strong></td>
    <td style="padding: 6px 0;">${escapeHtml(value)}</td>
  </tr>`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[inquiry] RESEND_API_KEY not configured");
    return Response.json(
      { error: "Email service not configured. Please email us directly at info@edquityatthemargins.org." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isNonEmptyString(body.name, 200)) {
    return Response.json({ error: "Please provide your name." }, { status: 400 });
  }
  if (!isNonEmptyString(body.organization, 300)) {
    return Response.json({ error: "Please provide your school or organization." }, { status: 400 });
  }
  if (!isValidEmail(body.email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!isNonEmptyString(body.service, 100)) {
    return Response.json({ error: "Please select the service you are interested in." }, { status: 400 });
  }
  if (!isNonEmptyString(body.message, 5000)) {
    return Response.json({ error: "Please tell us briefly about your needs." }, { status: 400 });
  }

  const name = (body.name as string).trim();
  const title = optionalString(body.title, 200);
  const organization = (body.organization as string).trim();
  const email = (body.email as string).trim();
  const phone = optionalString(body.phone, 60);
  const orgType = optionalString(body.orgType, 100);
  const service = (body.service as string).trim();
  const iepVolume = optionalString(body.iepVolume, 20);
  const message = (body.message as string).trim();

  const resend = new Resend(RESEND_API_KEY);

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 660px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">New institutional services inquiry</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        ${row("Contact", `${name} <${email}>`)}
        ${row("Title", title || "Not provided")}
        ${row("Organization", organization)}
        ${row("Organization type", orgType || "Not provided")}
        ${row("Phone", phone || "Not provided")}
        ${row("Service of interest", service)}
        ${row("IEPs in program", iepVolume || "Not provided")}
      </table>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        Reply to this email to respond directly to ${escapeHtml(name)}. Follow up with engagement details and pricing.<br />
        Submitted via the For Schools inquiry form on edquityatthemargins.org.
      </p>
    </div>
  `;

  try {
    const internal = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[For Schools Inquiry] ${service}: ${organization}`,
      html: internalHtml,
      text: `New institutional inquiry from ${name} <${email}>, ${organization}. Service: ${service}. ${message}`,
    });
    if (internal.error) {
      console.error("[inquiry] internal email failed:", internal.error);
      return Response.json(
        { error: "We could not send your inquiry. Please email us at info@edquityatthemargins.org." },
        { status: 502 }
      );
    }

    const ack = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "We received your inquiry, EDquity at the Margins",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 620px; margin: 0 auto; padding: 24px; line-height: 1.65;">
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for your interest in EDquity at the Margins' institutional services. We received your inquiry about ${escapeHtml(service)} and will follow up within two business days with engagement details tailored to ${escapeHtml(organization)}.</p>
          <p>Dr. Reba Clarke-Wedderburn<br />Founder and Executive Director, EDquity at the Margins</p>
        </div>
      `,
      text: `Hi ${name}, thank you for your interest in EDquity at the Margins' institutional services. We received your inquiry about ${service} and will follow up within two business days.`,
    });
    if (ack.error) {
      console.error("[inquiry] acknowledgment email failed:", ack.error);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[inquiry] unexpected error:", err);
    return Response.json(
      { error: "We could not send your inquiry. Please email us at info@edquityatthemargins.org." },
      { status: 502 }
    );
  }
}
