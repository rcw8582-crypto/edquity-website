/**
 * Vercel serverless function: POST /api/intake
 *
 * Receives the Parent Intake Form (including Section 7 consents),
 * validates it, then:
 *
 *   1. Emails info@edquityatthemargins.org with the full intake and a
 *      timestamped record of exactly which consents were given. This
 *      email is the durable consent/authorization record — file it.
 *   2. Sends the parent the confirmation the consent page promises,
 *      telling them Dr. Clarke-Wedderburn will confirm the appointment
 *      within 48 hours and to reply with the IEP only after that
 *      confirmation.
 *
 * Consents 1, 2, and 4 are required; consent 3 (research) is optional
 * and must never gate services.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Parent Intake <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

type Body = Record<string, unknown>;

function str(v: unknown, maxLen: number): string {
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
    <td style="padding: 6px 0; color: #64748b; width: 190px; vertical-align: top;"><strong>${label}</strong></td>
    <td style="padding: 6px 0;">${escapeHtml(value)}</td>
  </tr>`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[intake] RESEND_API_KEY not configured");
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

  const parentName = str(body.parentName, 200);
  const email = isValidEmail(body.email) ? (body.email as string).trim() : "";
  const phone = str(body.phone, 60);
  const address = str(body.address, 400);
  const childFirstName = str(body.childFirstName, 100);
  const childDob = str(body.childDob, 30);
  const childGrade = str(body.childGrade, 40);
  const schoolDistrict = str(body.schoolDistrict, 200);
  const state = str(body.state, 60);
  const disabilityCategory = str(body.disabilityCategory, 100);
  const meetingTiming = str(body.meetingTiming, 100);
  const situation = str(body.situation, 8000);
  const hearAboutUs = str(body.hearAboutUs, 300);
  const consent1 = body.consent1 === true;
  const consent2 = body.consent2 === true;
  const consent3Research = body.consent3Research === true;
  const consent4Communication = body.consent4Communication === true;

  if (!parentName || !email || !childFirstName || !situation) {
    return Response.json({ error: "Please complete all required fields." }, { status: 400 });
  }
  if (!consent1 || !consent2 || !consent4Communication) {
    return Response.json(
      { error: "Consents 1, 2, and 4 are required to proceed with services." },
      { status: 400 }
    );
  }

  const submittedAt = new Date().toISOString();
  const consentLine = (given: boolean, label: string) =>
    row(label, given ? `GIVEN at ${submittedAt}` : "NOT given");

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 680px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #122C54; margin: 0 0 6px; font-size: 18px;">New parent intake: ${escapeHtml(childFirstName)} (${escapeHtml(schoolDistrict || "district not given")})</h2>
      <p style="color: #64748b; font-size: 13px; margin: 0 0 16px;">Submitted ${submittedAt}. This email is the consent and authorization record for this family. Keep it.</p>
      <h3 style="font-size: 14px; margin: 16px 0 4px;">Parent</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${row("Name", parentName)}
        ${row("Email", email)}
        ${row("Phone", phone || "Not provided")}
        ${row("Address", address || "Not provided")}
        ${row("Heard about EDquity via", hearAboutUs || "Not provided")}
      </table>
      <h3 style="font-size: 14px; margin: 16px 0 4px;">Child</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${row("First name", childFirstName)}
        ${row("Date of birth", childDob || "Not provided")}
        ${row("Grade", childGrade || "Not provided")}
        ${row("School district", schoolDistrict || "Not provided")}
        ${row("State", state || "Not provided")}
        ${row("Disability category", disabilityCategory || "Not provided")}
        ${row("Next IEP meeting", meetingTiming || "Not provided")}
      </table>
      <h3 style="font-size: 14px; margin: 16px 0 4px;">Situation</h3>
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(situation)}</div>
      <h3 style="font-size: 14px; margin: 16px 0 4px;">Section 7: Consent and Authorization record</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${consentLine(consent1, "Consent 1: Identity and Authorization")}
        ${consentLine(consent2, "Consent 2: Document Review and Service Authorization")}
        ${consentLine(consent3Research, "Consent 3: Research and Impact Reporting (optional)")}
        ${consentLine(consent4Communication, "Consent 4: Communication Authorization")}
      </table>
      <p style="color: #64748b; font-size: 12px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
        Reply to this email to reach ${escapeHtml(parentName)} directly and confirm the audit appointment.
        The parent has been told to wait for your confirmation before sending the IEP.
      </p>
    </div>
  `;

  const resend = new Resend(RESEND_API_KEY);

  try {
    const internal = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[Parent Intake] ${parentName}: ${childFirstName}, ${schoolDistrict || state || "no district given"}`,
      html:
        internalHtml +
        pasteRow("Parent Intake", [
          submittedAt.slice(0, 10),
          parentName,
          email,
          phone,
          childFirstName,
          childGrade,
          schoolDistrict,
          state,
          disabilityCategory,
          meetingTiming,
          consent1 ? "Yes" : "No",
          consent2 ? "Yes" : "No",
          consent3Research ? "Yes" : "No",
          consent4Communication ? "Yes" : "No",
        ]),
      text: `New parent intake from ${parentName} <${email}>. Child: ${childFirstName}. Consents: 1=${consent1}, 2=${consent2}, 3(research)=${consent3Research}, 4=${consent4Communication}. Submitted ${submittedAt}. ${situation}`,
    });
    if (internal.error) {
      console.error("[intake] internal email failed:", internal.error);
      return Response.json(
        { error: "We could not submit your intake. Please email us at info@edquityatthemargins.org." },
        { status: 502 }
      );
    }

    const ack = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "We received your intake form, EDquity at the Margins",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 620px; margin: 0 auto; padding: 24px; line-height: 1.65;">
          <p>Hi ${escapeHtml(parentName)},</p>
          <p>Thank you for trusting EDquity at the Margins with your child's education. We received your intake form, including your consent and authorization selections.</p>
          <p>Dr. Clarke-Wedderburn will review your submission and confirm your free IEP Audit appointment by email within 48 hours. <strong>Please wait for that confirmation before sending any documents.</strong> When it arrives, reply to it with your child's IEP attached.</p>
          <p>Your IEP Audit is free. That is the model, not a promotion.</p>
          <p>Dr. Reba Clarke-Wedderburn<br />Founder and Executive Director, EDquity at the Margins</p>
        </div>
      `,
      text: `Hi ${parentName}, we received your intake form, including your consent selections. Dr. Clarke-Wedderburn will confirm your free IEP Audit appointment by email within 48 hours. Please wait for that confirmation before sending any documents, then reply to it with your child's IEP attached.`,
    });
    if (ack.error) {
      console.error("[intake] acknowledgment email failed:", ack.error);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[intake] unexpected error:", err);
    return Response.json(
      { error: "We could not submit your intake. Please email us at info@edquityatthemargins.org." },
      { status: 502 }
    );
  }
}

export const config = { runtime: "edge" };
