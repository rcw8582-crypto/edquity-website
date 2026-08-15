/**
 * Vercel serverless function: POST /api/college-success
 *
 * Receives a College Success course seat request, validates input,
 * then performs two actions:
 *
 *   1. Emails info@edquityatthemargins.org with the full request
 *      so seats can be confirmed in order.
 *   2. Sends the parent an acknowledgment with the cohort dates.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity College Success <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

type Body = {
  parentName?: unknown;
  parentEmail?: unknown;
  parentPhone?: unknown;
  studentName?: unknown;
  gradeLevel?: unknown;
  schoolName?: unknown;
  county?: unknown;
  state?: unknown;
  accessNeeds?: unknown;
  questions?: unknown;
  eligibilityConfirmed?: unknown;
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
  return s.length > max ? s.slice(0, max - 3) + "…" : s;
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
    <td style="padding: 6px 0; color: #64748b; width: 200px; vertical-align: top;"><strong>${label}</strong></td>
    <td style="padding: 6px 0;">${escapeHtml(value)}</td>
  </tr>`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[college-success] RESEND_API_KEY not configured");
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

  if (!isNonEmptyString(body.parentName, 200)) {
    return Response.json({ error: "Please provide your full name." }, { status: 400 });
  }
  if (!isValidEmail(body.parentEmail)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!isNonEmptyString(body.studentName, 200)) {
    return Response.json({ error: "Please provide your student's first name." }, { status: 400 });
  }
  if (!isNonEmptyString(body.gradeLevel, 40)) {
    return Response.json({ error: "Please select your student's grade level." }, { status: 400 });
  }
  if (!isNonEmptyString(body.schoolName, 300)) {
    return Response.json({ error: "Please provide your student's high school." }, { status: 400 });
  }
  if (!isNonEmptyString(body.county, 120)) {
    return Response.json({ error: "Please provide your county." }, { status: 400 });
  }
  if (!isNonEmptyString(body.state, 60)) {
    return Response.json({ error: "Please provide your state." }, { status: 400 });
  }
  if (body.eligibilityConfirmed !== true) {
    return Response.json({ error: "The course is for college-bound juniors and seniors with a current IEP; please confirm eligibility." }, { status: 400 });
  }

  const parentName = (body.parentName as string).trim();
  const parentEmail = (body.parentEmail as string).trim();
  const parentPhone = optionalString(body.parentPhone, 60);
  const studentName = (body.studentName as string).trim();
  const gradeLevel = (body.gradeLevel as string).trim();
  const schoolName = (body.schoolName as string).trim();
  const county = (body.county as string).trim();
  const state = (body.state as string).trim();
  const accessNeeds = optionalString(body.accessNeeds, 2000);
  const questions = optionalString(body.questions, 2000);

  const resend = new Resend(RESEND_API_KEY);

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 680px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">New College Success seat request</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        ${row("Parent/guardian", `${parentName} <${parentEmail}>`)}
        ${row("Phone", parentPhone || "Not provided")}
        ${row("Student", studentName)}
        ${row("Grade level", gradeLevel)}
        ${row("High school", schoolName)}
        ${row("County / State", `${county}, ${state}`)}
        ${row("Access needs", accessNeeds || "None listed")}
        ${row("Questions", questions || "None")}
      </table>
      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        Eligibility confirmed: college-bound junior or senior with a current IEP.<br />
        Seats are limited; confirm by email in the order requests arrive, as sponsorships allow.<br />
        Submitted via the College Success page on edquityatthemargins.org.
      </p>
    </div>
  `;

  const ackHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 640px; margin: 0 auto; padding: 24px; line-height: 1.65;">
      <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">Your College Success seat request has been received</h2>
      <p>Hi ${escapeHtml(parentName)},</p>
      <p>Thank you for requesting a College Success seat for ${escapeHtml(studentName)}. Nothing is due now; we confirm every seat by email, in the order requests arrive.</p>
      <p style="margin: 16px 0 6px;"><strong>Inaugural cohort dates</strong></p>
      <ul style="margin: 0 0 16px; padding-left: 20px;">
        <li>Parent and student orientation: Tuesday, January 12, 2027</li>
        <li>Six weekly virtual sessions: Tuesdays, January 19 through February 23, 2027</li>
      </ul>
      <p>Every seat is sponsored and free to your student. We confirm seats as sponsorships are secured, on a first-come, first-served basis, and no payment is ever collected from families. If the inaugural cohort fills before your request is confirmed, we confirm your student's seat in the next cohort of the year.</p>
      <p>If you told us about access needs, we will build for them from the start and follow up if we have questions.</p>
      <p style="margin-top: 20px;">EDquity at the Margins<br />
      <a href="https://edquityatthemargins.org/college-success" style="color: #14B8A6;">edquityatthemargins.org/college-success</a></p>
    </div>
  `;

  try {
    const internal = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: parentEmail,
      subject: `[College Success Seat Request] ${studentName}, ${gradeLevel}, ${county} County`,
      html:
        internalHtml +
        pasteRow("College Success Requests", [
          new Date().toISOString().slice(0, 10),
          parentName,
          parentEmail,
          parentPhone,
          studentName,
          gradeLevel,
          schoolName,
          county,
          state,
          short(accessNeeds),
          short(questions),
        ]),
      text: `New College Success seat request from ${parentName} <${parentEmail}> for ${studentName} (${gradeLevel}, ${schoolName}, ${county} County, ${state}). See HTML version for full detail.`,
    });
    if (internal.error) {
      console.error("[college-success] internal email failed:", internal.error);
      return Response.json(
        { error: "We could not submit your request. Please email it to info@edquityatthemargins.org." },
        { status: 502 }
      );
    }

    // Acknowledgment is best-effort: the request already reached the inbox,
    // so a failure here should not read as a failed submission.
    const ack = await resend.emails.send({
      from: FROM,
      to: parentEmail,
      subject: "Your College Success seat request has been received",
      html: ackHtml,
      text: `Hi ${parentName}, thank you for requesting a College Success seat for ${studentName}. Orientation for the inaugural cohort is Tuesday, January 12, 2027, with six weekly virtual sessions Tuesdays, January 19 through February 23, 2027; if the inaugural cohort fills, we confirm your student in the next cohort of the year. We confirm every seat by email and nothing is due now.`,
    });
    if (ack.error) {
      console.error("[college-success] acknowledgment email failed:", ack.error);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[college-success] unexpected error:", err);
    return Response.json(
      { error: "We could not submit your request. Please email it to info@edquityatthemargins.org." },
      { status: 502 }
    );
  }
}

export const config = { runtime: "edge" };
