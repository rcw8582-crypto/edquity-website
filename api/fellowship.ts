/**
 * Vercel serverless function: POST /api/fellowship
 *
 * Receives an EDquity Leader Fellowship application, validates input,
 * then performs two actions:
 *
 *   1. Emails info@edquityatthemargins.org with the full application
 *      so the selection committee can review it.
 *   2. Sends the applicant the application-received acknowledgment
 *      with the selection timeline.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Leader Fellowship <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

type Body = {
  fullName?: unknown;
  title?: unknown;
  email?: unknown;
  phone?: unknown;
  experience?: unknown;
  schoolName?: unknown;
  district?: unknown;
  schoolType?: unknown;
  needIndicators?: unknown;
  spedEnrollment?: unknown;
  iepsReviewed?: unknown;
  missionCase?: unknown;
  operationalCase?: unknown;
  institutionalSignOff?: unknown;
  dataAgreement?: unknown;
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
    console.error("[fellowship] RESEND_API_KEY not configured");
    return Response.json(
      { error: "Email service not configured. Please email your application directly to info@edquityatthemargins.org." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isNonEmptyString(body.fullName, 200)) {
    return Response.json({ error: "Please provide your full name." }, { status: 400 });
  }
  if (!isNonEmptyString(body.title, 200)) {
    return Response.json({ error: "Please provide your professional title." }, { status: 400 });
  }
  if (!isValidEmail(body.email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!isNonEmptyString(body.experience, 60)) {
    return Response.json({ error: "Please select your years of special education experience." }, { status: 400 });
  }
  if (!isNonEmptyString(body.schoolName, 300)) {
    return Response.json({ error: "Please provide your school or LEA name." }, { status: 400 });
  }
  if (!isNonEmptyString(body.schoolType, 100)) {
    return Response.json({ error: "Please select your school type." }, { status: 400 });
  }
  if (!isNonEmptyString(body.missionCase, 4000)) {
    return Response.json({ error: "Please complete the mission case statement." }, { status: 400 });
  }
  if (!isNonEmptyString(body.operationalCase, 4000)) {
    return Response.json({ error: "Please complete the operational case statement." }, { status: 400 });
  }
  if (body.institutionalSignOff !== true || body.dataAgreement !== true) {
    return Response.json({ error: "Both certifications are required to apply." }, { status: 400 });
  }

  const fullName = (body.fullName as string).trim();
  const title = (body.title as string).trim();
  const email = (body.email as string).trim();
  const phone = optionalString(body.phone, 60);
  const experience = (body.experience as string).trim();
  const schoolName = (body.schoolName as string).trim();
  const district = optionalString(body.district, 300);
  const schoolType = (body.schoolType as string).trim();
  const needIndicators = Array.isArray(body.needIndicators)
    ? (body.needIndicators as unknown[]).filter((x): x is string => typeof x === "string").slice(0, 8).join("; ")
    : "";
  const spedEnrollment = optionalString(body.spedEnrollment, 20);
  const iepsReviewed = optionalString(body.iepsReviewed, 20);
  const missionCase = (body.missionCase as string).trim();
  const operationalCase = (body.operationalCase as string).trim();

  const resend = new Resend(RESEND_API_KEY);

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 680px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">New EDquity Leader Fellowship application</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        ${row("Applicant", `${fullName} <${email}>`)}
        ${row("Title", title)}
        ${row("Phone", phone || "Not provided")}
        ${row("SPED experience", experience)}
        ${row("School / LEA", schoolName)}
        ${row("District / CMO", district || "Not provided")}
        ${row("School type", schoolType)}
        ${row("Need indicators", needIndicators || "None selected")}
        ${row("SPED enrollment", spedEnrollment || "Not provided")}
        ${row("IEPs reviewed annually", iepsReviewed || "Not provided")}
      </table>
      <h3 style="font-size: 15px; margin: 20px 0 6px;">The mission case</h3>
      <div style="border-left: 3px solid #14B8A6; padding: 4px 0 4px 14px; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(missionCase)}</div>
      <h3 style="font-size: 15px; margin: 20px 0 6px;">The operational case</h3>
      <div style="border-left: 3px solid #14B8A6; padding: 4px 0 4px 14px; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(operationalCase)}</div>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        Both required certifications were checked. Remind the applicant to email the signed School Leader Commitment Letter if it has not arrived.<br />
        Submitted via the fellowship application on edquityatthemargins.org.
      </p>
    </div>
  `;

  const ackHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 640px; margin: 0 auto; padding: 24px; line-height: 1.65;">
      <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">Your EDquity Leader Fellowship application has been received</h2>
      <p>Hi ${escapeHtml(fullName)},</p>
      <p>Thank you for applying to the founding cohort of the EDquity Leader Fellowship. We have received your profile and institutional information.</p>
      <p>Because the founding cohort is strictly limited to 3 to 4 schools to protect our evaluation and coaching capacity, selection is competitive, and every submission is reviewed uniformly against our published criteria.</p>
      <p style="margin: 16px 0 6px;"><strong>Key dates</strong></p>
      <ul style="margin: 0 0 16px; padding-left: 20px;">
        <li>Application review: September 5 to 11, 2026</li>
        <li>Cohort announcements: mid-September 2026</li>
        <li>Launch Institute: late September 2026</li>
      </ul>
      <p><strong>One required step if you have not completed it:</strong> email your signed School Leader Commitment Letter to info@edquityatthemargins.org. Your application is not complete until we receive it.</p>
      <p>If we need clarifying details about your caseload or commitment letter, we will reach out directly. Thank you for your commitment to legally defensible, ambitious IEPs for our most vulnerable students.</p>
      <p style="margin-top: 20px;">The EDquity Fellowship Selection Committee<br />
      <a href="https://edquityatthemargins.org/fellowship" style="color: #14B8A6;">edquityatthemargins.org/fellowship</a></p>
    </div>
  `;

  try {
    const internal = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[Fellowship Application] ${fullName}, ${schoolName}`,
      html: internalHtml,
      text: `New fellowship application from ${fullName} <${email}>, ${title}, ${schoolName}. See HTML version for full detail.`,
    });
    if (internal.error) {
      console.error("[fellowship] internal email failed:", internal.error);
      return Response.json(
        { error: "We could not submit your application. Please email it to info@edquityatthemargins.org." },
        { status: 502 }
      );
    }

    // Acknowledgment is best-effort: the application already reached the
    // committee, so a failure here should not read as a failed submission.
    const ack = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Your EDquity Fellowship application has been received",
      html: ackHtml,
      text: `Hi ${fullName}, thank you for applying to the founding cohort of the EDquity Leader Fellowship. Application review runs September 5 to 11, 2026, with cohort announcements in mid-September. If you have not already done so, email your signed School Leader Commitment Letter to info@edquityatthemargins.org.`,
    });
    if (ack.error) {
      console.error("[fellowship] acknowledgment email failed:", ack.error);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[fellowship] unexpected error:", err);
    return Response.json(
      { error: "We could not submit your application. Please email it to info@edquityatthemargins.org." },
      { status: 502 }
    );
  }
}
