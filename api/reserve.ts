/**
 * Vercel serverless function: POST /api/reserve
 *
 * Receives a seat request for the Parent IEP Advocacy Academy or Camp
 * EDquity, validates input, emails info@edquityatthemargins.org, and sends
 * the family an acknowledgment. No payment is collected; cohorts are
 * invoiced once minimum enrollment is reached.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Programs <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

const PROGRAMS = new Set([
  "Parent IEP Advocacy Academy",
  "Camp EDquity (fall break camp, grades 6-10)",
]);

type Body = {
  program?: unknown;
  parentName?: unknown;
  parentEmail?: unknown;
  parentPhone?: unknown;
  childName?: unknown;
  childAge?: unknown;
  questions?: unknown;
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
    <td style="padding: 6px 0; color: #64748b; width: 200px; vertical-align: top;"><strong>${label}</strong></td>
    <td style="padding: 6px 0;">${escapeHtml(value)}</td>
  </tr>`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[reserve] RESEND_API_KEY not configured");
    return Response.json(
      { error: "Email service not configured. Please email your request directly to info@edquityatthemargins.org." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.program !== "string" || !PROGRAMS.has(body.program)) {
    return Response.json({ error: "Please choose a program." }, { status: 400 });
  }
  if (!isNonEmptyString(body.parentName, 200)) {
    return Response.json({ error: "Please provide your full name." }, { status: 400 });
  }
  if (!isValidEmail(body.parentEmail)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const program = body.program;
  const parentName = (body.parentName as string).trim();
  const parentEmail = (body.parentEmail as string).trim();
  const parentPhone = optionalString(body.parentPhone, 40);
  const childName = optionalString(body.childName, 200);
  const questions = optionalString(body.questions, 2000);

  const resend = new Resend(RESEND_API_KEY);

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 680px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">New seat request</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        ${row("Program", program)}
        ${row("Parent/guardian", `${parentName} <${parentEmail}>`)}
        ${row("Phone", parentPhone || "Not provided")}
        ${row("Child", childName || "Not provided")}
        ${row("Note", questions || "None")}
      </table>
      <p style="font-size: 13px; color: #64748b;">Count this toward the cohort's minimum; invoice when the cohort reaches minimum plus buffer.</p>
    </div>`;

  const acknowledgmentHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 620px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 14px; font-size: 18px;">We received your seat request</h2>
      <p style="font-size: 15px; line-height: 1.7; color: #334155;">
        Thank you for requesting a seat in the ${escapeHtml(program)}. No payment is due now.
        Once the cohort reaches minimum enrollment, we will email your invoice, and seats are
        confirmed in the order payment arrives. If tuition is a barrier, you can apply for the
        Families First Scholarship at edquityatthemargins.org/scholarship.
      </p>
      <p style="font-size: 15px; line-height: 1.7; color: #334155;">
        Dr. Reba Clarke-Wedderburn<br/>
        EDquity at the Margins
      </p>
    </div>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: parentEmail,
      subject: `Seat request: ${parentName} (${program})`,
      html: internalHtml,
    });
    await resend.emails.send({
      from: FROM,
      to: parentEmail,
      subject: "We received your seat request",
      html: acknowledgmentHtml,
    });
  } catch (err) {
    console.error("[reserve] send failed", err);
    return Response.json(
      { error: "We could not submit your request. Please email info@edquityatthemargins.org directly." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}

export const config = { runtime: "edge" };
