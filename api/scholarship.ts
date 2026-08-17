/**
 * Vercel serverless function: POST /api/scholarship
 *
 * Receives a Families First Scholarship application, validates input,
 * then emails info@edquityatthemargins.org with the full application and
 * sends the applicant an acknowledgment.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "Families First Scholarship <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

const CRITERIA_LABELS: Record<string, string> = {
  income: "Low income (at or below 200% of federal poverty guidelines)",
  assistance: "Public assistance (SNAP, Medicaid/CHIP, WIC, TANF, or housing assistance)",
  single_parent: "Single-parent household",
  foster: "Foster or kinship family",
  hardship: "Recent hardship",
  language: "Language barrier",
  rural: "Rural or tribal community",
  urgent: "Urgent IEP situation",
};

type Body = {
  program?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  childFirstName?: unknown;
  childAge?: unknown;
  school?: unknown;
  district?: unknown;
  state?: unknown;
  householdSize?: unknown;
  householdIncome?: unknown;
  fplPercent?: unknown;
  situation?: unknown;
  criteriaSelected?: unknown;
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
    <td style="padding: 6px 0; color: #64748b; width: 220px; vertical-align: top;"><strong>${label}</strong></td>
    <td style="padding: 6px 0;">${escapeHtml(value)}</td>
  </tr>`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[scholarship] RESEND_API_KEY not configured");
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

  if (!isNonEmptyString(body.program, 100)) {
    return Response.json({ error: "Please choose the program you are applying for." }, { status: 400 });
  }
  if (!isNonEmptyString(body.firstName, 100) || !isNonEmptyString(body.lastName, 100)) {
    return Response.json({ error: "Please provide your first and last name." }, { status: 400 });
  }
  if (!isValidEmail(body.email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!isNonEmptyString(body.childFirstName, 100)) {
    return Response.json({ error: "Please provide your child's first name." }, { status: 400 });
  }
  if (!isNonEmptyString(body.childAge, 40)) {
    return Response.json({ error: "Please provide your child's age or grade." }, { status: 400 });
  }
  if (!isNonEmptyString(body.school, 200) || !isNonEmptyString(body.district, 200)) {
    return Response.json({ error: "Please provide your child's school and district." }, { status: 400 });
  }
  if (!isNonEmptyString(body.state, 60)) {
    return Response.json({ error: "Please select your state." }, { status: 400 });
  }
  if (!Array.isArray(body.criteriaSelected) || body.criteriaSelected.length === 0) {
    return Response.json({ error: "Please select at least one eligibility criterion." }, { status: 400 });
  }

  const criteria = (body.criteriaSelected as unknown[])
    .filter((c): c is string => typeof c === "string" && c in CRITERIA_LABELS)
    .map((c) => CRITERIA_LABELS[c]);
  if (criteria.length === 0) {
    return Response.json({ error: "Please select at least one eligibility criterion." }, { status: 400 });
  }

  const program = (body.program as string).trim();
  const name = `${(body.firstName as string).trim()} ${(body.lastName as string).trim()}`;
  const email = (body.email as string).trim();
  const phone = optionalString(body.phone, 40);
  const childFirstName = (body.childFirstName as string).trim();
  const childAge = (body.childAge as string).trim();
  const school = (body.school as string).trim();
  const district = (body.district as string).trim();
  const state = (body.state as string).trim();
  const householdSize = optionalString(body.householdSize, 4);
  const householdIncome = optionalString(body.householdIncome, 20);
  const fplPercent = optionalString(body.fplPercent, 8);
  const situation = optionalString(body.situation, 2000);

  const resend = new Resend(RESEND_API_KEY);

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 680px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">New Families First Scholarship application</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        ${row("Program", program)}
        ${row("Parent/guardian", `${name} <${email}>`)}
        ${row("Phone", phone || "Not provided")}
        ${row("Child", `${childFirstName}, ${childAge}`)}
        ${row("School / District", `${school}, ${district}`)}
        ${row("State", state)}
        ${row("Household size", householdSize || "Not provided")}
        ${row("Household income", householdIncome || "Not provided")}
        ${row("Computed % of poverty guideline", fplPercent ? `${fplPercent}%` : "Not computed")}
        ${row("Criteria selected", criteria.join("; "))}
        ${row("Their note", situation || "None")}
      </table>
    </div>`;

  const acknowledgmentHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 620px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 14px; font-size: 18px;">We received your Families First Scholarship application</h2>
      <p style="font-size: 15px; line-height: 1.7; color: #334155;">
        Thank you for applying for the Families First Scholarship for the ${escapeHtml(program)}.
        We review applications within five business days and will reply to this email address.
        Nothing is due from your family while you wait, and applying does not obligate you to enroll.
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
      replyTo: email,
      subject: `Families First application: ${name} (${program})`,
      html: internalHtml,
    });
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "We received your Families First Scholarship application",
      html: acknowledgmentHtml,
    });
  } catch (err) {
    console.error("[scholarship] send failed", err);
    return Response.json(
      { error: "We could not submit your application. Please email info@edquityatthemargins.org directly." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
