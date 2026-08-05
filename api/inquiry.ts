/**
 * Vercel serverless function: POST /api/inquiry
 *
 * Receives a school inquiry from the IEP Quality Improvement Program page,
 * validates input, then:
 *
 *   1. Emails info@edquityatthemargins.org with the inquiry so Reba
 *      can follow up.
 *   2. Sends the requester a short acknowledgment.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity at the Margins <forms@edquityatthemargins.org>";
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

function short(s: string, max = 140): string {
  return s.length > max ? s.slice(0, max - 3) + "\u2026" : s;
}

/**
 * Renders a one-row HTML table whose cell order matches the matching tab
 * in "EDATM Website Form Submissions.xlsx". Copying the row out of the
 * email and pasting it into Excel lands each value in its own column, so
 * submissions can be logged without retyping every field.
 */
function pasteRow(tab: string, values: string[]): string {
  const cells = values
    .map(
      (v) =>
        `<td style="border: 1px solid #cbd5e1; padding: 4px 8px; font-size: 12px;">${escapeHtml(v)}</td>`
    )
    .join("");
  return `
    <h3 style="font-size: 14px; margin: 22px 0 4px;">Copy this row into the workbook</h3>
    <p style="color: #64748b; font-size: 12px; margin: 0 0 8px;">Select the row below, copy it, then paste into the <strong>${escapeHtml(tab)}</strong> tab of EDATM Website Form Submissions.xlsx. Excel puts each value in its own column. Leave the remaining tracking columns for your own notes.</p>
    <table style="border-collapse: collapse;"><tr>${cells}</tr></table>
  `;
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
    return Response.json({ error: "Please tell us which program you are asking about." }, { status: 400 });
  }
  if (!isNonEmptyString(body.message, 5000)) {
    return Response.json({ error: "Please tell us what you would like to know." }, { status: 400 });
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
      <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">New school inquiry</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        ${row("Contact", `${name} <${email}>`)}
        ${row("Title", title || "Not provided")}
        ${row("Organization", organization)}
        ${row("Organization type", orgType || "Not provided")}
        ${row("Phone", phone || "Not provided")}
        ${row("Asking about", service)}
        ${row("IEPs in program", iepVolume || "Not provided")}
      </table>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        Reply to this email to respond directly to ${escapeHtml(name)}.<br />
        Submitted via the IEP Quality Improvement Program inquiry form on edquityatthemargins.org.
      </p>
    </div>
  `;

  try {
    const internal = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[School Inquiry] ${service}: ${organization}`,
      html:
        internalHtml +
        pasteRow("Consulting Inquiries", [
          new Date().toISOString().slice(0, 10),
          name,
          title,
          organization,
          orgType,
          email,
          phone,
          service,
          iepVolume,
          short(message),
        ]),
      text: `New school inquiry from ${name} <${email}>, ${organization}. Asking about: ${service}. ${message}`,
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
      subject: "We received your question, EDquity at the Margins",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 620px; margin: 0 auto; padding: 24px; line-height: 1.65;">
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for reaching out about the ${escapeHtml(service)}. We received your question and will reply within two business days.</p>
          <p>Dr. Reba Clarke-Wedderburn<br />Founder and Executive Director, EDquity at the Margins</p>
        </div>
      `,
      text: `Hi ${name}, thank you for reaching out about the ${service}. We received your question and will reply within two business days.`,
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

export const config = { runtime: "edge" };
