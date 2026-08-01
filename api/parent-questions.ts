/**
 * Vercel serverless function: POST /api/parent-questions
 *
 * Receives the twelve intake-call questions answered in writing by a
 * family who could not get on a call, then:
 *
 *   1. Emails info@edquityatthemargins.org the full set of answers,
 *      followed by a Playbook starter that regroups those answers under
 *      the sections of My Child's Playbook so the draft can be built by
 *      copying rather than retyping.
 *   2. Sends the parent a short thank-you.
 *
 * The family has already consented at intake; the form asks them to
 * confirm that before submitting.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Family Questions <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

type Body = Record<string, unknown>;

const QUESTIONS: { key: string; label: string }[] = [
  { key: "strengths", label: "What is your child good at, at home and outside school?" },
  { key: "biggestConcern", label: "What is your biggest concern about school right now?" },
  { key: "schoolVsHome", label: "What does the school say, and what do you see at home that matches or does not?" },
  { key: "settingAndChanges", label: "Current classroom setting, and any change coming" },
  { key: "diagnoses", label: "Disability categories or diagnoses, and outside evaluations" },
  { key: "services", label: "Services and supports believed to be received weekly, and whether they happen" },
  { key: "behavior", label: "Behavior incidents, calls home, suspensions, or removals this year" },
  { key: "language", label: "Language spoken at home, and interpretation or translation needs" },
  { key: "health", label: "Health needs the school should plan for" },
  { key: "schoolChanges", label: "Recent changes of school, district, or state" },
  { key: "successfulMeeting", label: "What a successful next IEP meeting would look like" },
  { key: "verbalPromises", label: "Anything the school promised verbally that is not in writing" },
];

/** Regroups the answers under the sections of My Child's Playbook. */
const PLAYBOOK_SECTIONS: { title: string; note: string; keys: string[] }[] = [
  { title: "All About Me", note: "Strengths and interests, in the family's words.", keys: ["strengths"] },
  { title: "Above the surface", note: "What the school sees and reports.", keys: ["biggestConcern", "behavior"] },
  { title: "Below the surface", note: "What the family sees that the school may not, the heart of the iceberg.", keys: ["schoolVsHome"] },
  { title: "My program right now", note: "Setting, eligibility, and services as the family understands them.", keys: ["settingAndChanges", "diagnoses", "services"] },
  { title: "What my team must know", note: "Health, language, and history that has to carry across settings.", keys: ["health", "language", "schoolChanges"] },
  { title: "What we are working toward", note: "The family's goal for the next meeting, plus anything promised but undocumented.", keys: ["successfulMeeting", "verbalPromises"] },
];

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
 * Renders a one-row HTML table whose cell order matches the Parent
 * Questionnaire tab in "EDATM Website Form Submissions.xlsx". Copying the
 * row out of the email and pasting it into Excel lands each value in its
 * own column. The answers themselves stay in the email, not the sheet.
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
    <p style="color: #64748b; font-size: 12px; margin: 0 0 8px;">Select the row below, copy it, then paste into the <strong>${escapeHtml(tab)}</strong> tab of EDATM Website Form Submissions.xlsx. The answers themselves stay in this email.</p>
    <table style="border-collapse: collapse;"><tr>${cells}</tr></table>
  `;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[parent-questions] RESEND_API_KEY not configured");
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
  const childFirstName = str(body.childFirstName, 100);

  if (!parentName || !email || !childFirstName) {
    return Response.json({ error: "Please provide your name, email, and your child's first name." }, { status: 400 });
  }
  if (body.confirmed !== true) {
    return Response.json({ error: "Please confirm you are the parent or legal guardian." }, { status: 400 });
  }

  const answers = new Map<string, string>();
  QUESTIONS.forEach((q) => {
    const value = str(body[q.key], 4000);
    if (value) answers.set(q.key, value);
  });

  if (answers.size === 0) {
    return Response.json({ error: "Please answer at least one question before sending." }, { status: 400 });
  }

  const submittedAt = new Date().toISOString().slice(0, 10);
  const answered = `${answers.size} of ${QUESTIONS.length}`;

  const answerBlocks = QUESTIONS.map((q, i) => {
    const value = answers.get(q.key);
    if (!value) {
      return `<p style="margin: 14px 0 0; color: #94a3b8; font-size: 13px;"><strong>${i + 1}. ${escapeHtml(q.label)}</strong><br />Left blank.</p>`;
    }
    return `<div style="margin: 16px 0 0;">
      <p style="margin: 0 0 4px; font-weight: 700; font-size: 13.5px; color: #122C54;">${i + 1}. ${escapeHtml(q.label)}</p>
      <div style="border-left: 3px solid #22C55E; padding: 4px 0 4px 12px; white-space: pre-wrap; line-height: 1.6; font-size: 14px;">${escapeHtml(value)}</div>
    </div>`;
  }).join("");

  const playbookBlocks = PLAYBOOK_SECTIONS.map((section) => {
    const filled = section.keys.map((k) => answers.get(k)).filter((v): v is string => Boolean(v));
    if (filled.length === 0) return "";
    return `<div style="margin: 14px 0 0;">
      <p style="margin: 0 0 2px; font-weight: 700; font-size: 13.5px; color: #122C54;">${escapeHtml(section.title)}</p>
      <p style="margin: 0 0 6px; font-size: 12px; color: #94a3b8;">${escapeHtml(section.note)}</p>
      <div style="white-space: pre-wrap; line-height: 1.6; font-size: 14px;">${filled.map(escapeHtml).join("\n\n")}</div>
    </div>`;
  }).join("");

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 680px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #122C54; margin: 0 0 6px; font-size: 18px;">Intake questions answered: ${escapeHtml(childFirstName)}</h2>
      <p style="color: #64748b; font-size: 13px; margin: 0 0 18px;">From ${escapeHtml(parentName)} &lt;${escapeHtml(email)}&gt; on ${submittedAt}. ${escapeHtml(answered)} questions answered.</p>

      <h3 style="font-size: 14px; margin: 20px 0 0; border-top: 1px solid #e2e8f0; padding-top: 16px;">The answers</h3>
      ${answerBlocks}

      <h3 style="font-size: 14px; margin: 26px 0 2px; border-top: 1px solid #e2e8f0; padding-top: 16px;">Playbook starter</h3>
      <p style="color: #64748b; font-size: 12px; margin: 0 0 4px;">The same answers regrouped under My Child's Playbook sections, ready to copy into a draft. This is the family's raw language, not finished Playbook copy, so edit before sharing it back.</p>
      ${playbookBlocks}

      <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
        Reply to this email to reach ${escapeHtml(parentName)} directly.<br />
        Submitted through the family questions form on edquityatthemargins.org.
      </p>
    </div>
  `;

  const resend = new Resend(RESEND_API_KEY);

  try {
    const internal = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `[Family Questions] ${childFirstName} (${parentName})`,
      html:
        internalHtml +
        pasteRow("Parent Questionnaire", [
          submittedAt,
          parentName,
          email,
          childFirstName,
          answered,
        ]),
      text: `Intake questions answered for ${childFirstName} by ${parentName} <${email}> on ${submittedAt}. ${answered} answered. ${QUESTIONS.map((q, i) => `${i + 1}. ${q.label}\n${answers.get(q.key) ?? "Left blank."}`).join("\n\n")}`,
    });
    if (internal.error) {
      console.error("[parent-questions] internal email failed:", internal.error);
      return Response.json(
        { error: "We could not send your answers. Please email us at info@edquityatthemargins.org." },
        { status: 502 }
      );
    }

    const ack = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Thank you, we have your answers",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 620px; margin: 0 auto; padding: 24px; line-height: 1.65;">
          <p>Hi ${escapeHtml(parentName)},</p>
          <p>Thank you for taking the time to tell us about ${escapeHtml(childFirstName)}. Everything you wrote goes directly into preparing for the audit and for your next IEP meeting, and what you see at home is often the part no one else in that room can speak to.</p>
          <p>I will read through your answers and follow up by email. If anything else comes to mind in the meantime, just reply to this message.</p>
          <p>Dr. Reba Clarke-Wedderburn<br />Founder and Executive Director, EDquity at the Margins</p>
        </div>
      `,
      text: `Hi ${parentName}, thank you for telling us about ${childFirstName}. Everything you wrote goes into preparing for the audit and your next IEP meeting. Dr. Clarke-Wedderburn will read your answers and follow up by email.`,
    });
    if (ack.error) {
      console.error("[parent-questions] acknowledgment email failed:", ack.error);
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[parent-questions] unexpected error:", err);
    return Response.json(
      { error: "We could not send your answers. Please email us at info@edquityatthemargins.org." },
      { status: 502 }
    );
  }
}

export const config = { runtime: "edge" };
