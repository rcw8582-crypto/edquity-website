/**
 * Vercel serverless function: POST /api/intake
 *
 * Receives the Parent Intake Form (including Section 7 consents),
 * validates it, then:
 *
 *   1. Registers the family in the EDquity360 portal by posting to its
 *      /api/public/intake endpoint, which creates the account, the child
 *      record, the Box folders, and a free audit in pending_upload, then
 *      emails the family a sign-in link. This replaces the old flow where
 *      every website intake had to be retyped into the portal by hand.
 *   2. Emails info@edquityatthemargins.org with the full intake and a
 *      timestamped record of exactly which consents were given. This
 *      email is the durable consent/authorization record — file it.
 *
 * The portal owns the Supabase, Box, and encryption credentials; this
 * function holds only the shared secret that lets it call the endpoint.
 *
 * The portal sends the family their welcome email because it carries the
 * magic link. When that call or that email fails, this function falls back
 * to its own acknowledgment so a family is never left with silence, and
 * says so loudly in the internal email.
 *
 * Consents 1, 2, and 4 are required; consent 3 (research) is optional
 * and must never gate services.
 *
 * Required environment variables:
 *   RESEND_API_KEY         (set in Vercel project settings)
 *   PORTAL_INTAKE_URL      portal endpoint, e.g. https://portal.edquityatthemargins.org/api/public/intake
 *   PORTAL_INTAKE_SECRET   shared secret matching the portal's WEBSITE_INTAKE_SECRET
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const PORTAL_INTAKE_URL = process.env.PORTAL_INTAKE_URL;
const PORTAL_INTAKE_SECRET = process.env.PORTAL_INTAKE_SECRET;
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
  const childLastName = str(body.childLastName, 100);
  const yearOfBirth = str(body.yearOfBirth, 4);
  const childGrade = str(body.childGrade, 40);
  const schoolDistrict = str(body.schoolDistrict, 200);
  const state = str(body.state, 2).toUpperCase();
  const disabilityCategory = str(body.disabilityCategory, 100);
  const meetingTiming = str(body.meetingTiming, 100);
  const situation = str(body.situation, 8000);
  const hearAboutUs = str(body.hearAboutUs, 300);
  const consent1 = body.consent1 === true;
  const consent2 = body.consent2 === true;
  const consent3Research = body.consent3Research === true;
  const consent4Communication = body.consent4Communication === true;

  if (!parentName || !email || !childFirstName || !childLastName || !yearOfBirth || !situation) {
    return Response.json({ error: "Please complete all required fields." }, { status: 400 });
  }
  if (!/^\d{4}$/.test(yearOfBirth)) {
    return Response.json({ error: "Please choose your child's year of birth." }, { status: 400 });
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

  // ─── Register the family in the portal ──────────────────────
  // A failure here must not lose the intake: the notification email below
  // still carries everything, so the submission is recoverable by hand.
  // What changes is what the parent is told, since the portal is what
  // sends the sign-in link.
  let portalResult:
    | { ok: true; referenceCode: string; existingAccount: boolean; emailSent: boolean }
    | { ok: false; reason: string } = { ok: false, reason: "Portal registration was not attempted." };

  if (!PORTAL_INTAKE_URL || !PORTAL_INTAKE_SECRET) {
    console.error("[intake] PORTAL_INTAKE_URL or PORTAL_INTAKE_SECRET not configured");
    portalResult = { ok: false, reason: "Portal endpoint is not configured on the website project." };
  } else {
    try {
      const portalRes = await fetch(PORTAL_INTAKE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-edatm-intake-secret": PORTAL_INTAKE_SECRET,
        },
        body: JSON.stringify({
          parentName,
          parentEmail: email,
          parentPhone: phone,
          state,
          childFirstName,
          childLastName,
          yearOfBirth: Number(yearOfBirth),
          childGrade,
          disabilityCategory,
          schoolDistrict,
          meetingTiming,
          situation,
          hearAboutUs,
          consentResearch: consent3Research,
        }),
      });
      const portalBody = (await portalRes.json().catch(() => ({}))) as Record<string, unknown>;
      if (portalRes.ok && portalBody.ok === true) {
        portalResult = {
          ok: true,
          referenceCode: String(portalBody.referenceCode ?? ""),
          existingAccount: portalBody.existingAccount === true,
          emailSent: portalBody.emailSent === true,
        };
      } else {
        portalResult = {
          ok: false,
          reason: `Portal returned ${portalRes.status}: ${String(portalBody.error ?? "no detail")}`,
        };
        console.error("[intake] portal registration failed:", portalResult.reason);
      }
    } catch (err) {
      portalResult = { ok: false, reason: `Could not reach the portal: ${String(err)}` };
      console.error("[intake] portal registration threw:", err);
    }
  }

  // The portal's welcome email carries the magic link, so it is the one the
  // family should get. Fall back to our own only when it did not go out.
  const needsFallbackAck = !portalResult.ok || !portalResult.emailSent;

  const portalStatusBlock = portalResult.ok
    ? `<div style="border-left: 4px solid ${portalResult.existingAccount ? "#FBBF24" : "#22C55E"}; background: ${portalResult.existingAccount ? "#fffbeb" : "#f0fdf4"}; padding: 12px 14px; margin: 0 0 18px;">
        <strong>Portal record created: ${escapeHtml(portalResult.referenceCode)}</strong><br/>
        ${portalResult.existingAccount
          ? "This email already had a portal account, so the child was added to it. Check that this is the same family and not a mistyped address before the audit proceeds."
          : "New family account created."}<br/>
        Welcome email with sign-in link: ${portalResult.emailSent ? "sent" : "NOT SENT — share portal access from the admin side."}
      </div>`
    : `<div style="border-left: 4px solid #ef4444; background: #fef2f2; padding: 12px 14px; margin: 0 0 18px;">
        <strong>Portal registration FAILED. Nothing was created in the portal.</strong><br/>
        ${escapeHtml(portalResult.reason)}<br/>
        Register this family by hand from Admin → Families → Register a family. The parent was told we received the form and will be in touch.
      </div>`;

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 680px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #122C54; margin: 0 0 6px; font-size: 18px;">New parent intake: ${escapeHtml(childFirstName)} (${escapeHtml(schoolDistrict || "district not given")})</h2>
      <p style="color: #64748b; font-size: 13px; margin: 0 0 16px;">Submitted ${submittedAt}. This email is the consent and authorization record for this family. Keep it.</p>
      ${portalStatusBlock}
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
        ${row("Last name", childLastName)}
        ${row("Year of birth", yearOfBirth)}
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
          childLastName,
          yearOfBirth,
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

    // Only when the portal's welcome email (which carries the sign-in link)
    // did not go out. Otherwise the family would get two messages telling
    // them different things about what happens next.
    if (needsFallbackAck) {
      const ack = await resend.emails.send({
        from: FROM,
        to: email,
        subject: "We received your intake form, EDquity at the Margins",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 620px; margin: 0 auto; padding: 24px; line-height: 1.65;">
            <p>Hi ${escapeHtml(parentName)},</p>
            <p>Thank you for trusting EDquity at the Margins with your child's education. We received your intake form, including your consent and authorization selections.</p>
            <p>Dr. Clarke-Wedderburn will set up your secure portal access and email it to you within 48 hours. <strong>Please wait for that email before sending any documents.</strong> It will carry a sign-in link where you can upload your child's IEP safely.</p>
            <p>Your IEP Audit is free. That is the model, not a promotion.</p>
            <p>Dr. Reba Clarke-Wedderburn<br />Founder and Executive Director, EDquity at the Margins</p>
          </div>
        `,
        text: `Hi ${parentName}, we received your intake form, including your consent selections. Dr. Clarke-Wedderburn will set up your secure portal access and email it to you within 48 hours. Please wait for that email before sending any documents.`,
      });
      if (ack.error) {
        console.error("[intake] fallback acknowledgment email failed:", ack.error);
      }
    }

    return Response.json({
      ok: true,
      referenceCode: portalResult.ok ? portalResult.referenceCode : "",
    });
  } catch (err) {
    console.error("[intake] unexpected error:", err);
    return Response.json(
      { error: "We could not submit your intake. Please email us at info@edquityatthemargins.org." },
      { status: 502 }
    );
  }
}

export const config = { runtime: "edge" };
