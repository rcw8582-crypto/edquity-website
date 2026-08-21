/**
 * Vercel serverless function: POST /api/audit-feedback
 *
 * Receives a response to the IEP Audit usefulness study and emails it to
 * info@edquityatthemargins.org. Two waves run against the same endpoint:
 * Wave 1 a few days after the report lands, Wave 2 after the family's next
 * IEP meeting.
 *
 * The endpoint stores no question text of its own. The form sends an ordered
 * list of {question, answer} pairs, so the study can be reworded on the page
 * without touching this file, which matters while the instrument is still
 * being refined.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Research <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

const WAVES = new Set([
  "Wave 1: Report received",
  "Wave 2: After the meeting",
]);

/** Guards against an oversized payload without capping a thoughtful answer. */
const MAX_RESPONSES = 40;
const MAX_QUESTION = 400;
const MAX_ANSWER = 5000;

type Pair = { question?: unknown; answer?: unknown };

type Body = {
  wave?: unknown;
  respondentName?: unknown;
  respondentEmail?: unknown;
  responses?: unknown;
};

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

function block(question: string, answer: string): string {
  return `<div style="margin: 0 0 18px; padding: 0 0 18px; border-bottom: 1px solid #e2e8f0;">
    <p style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #64748b;">${escapeHtml(question)}</p>
    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #122C54; white-space: pre-wrap;">${escapeHtml(answer)}</p>
  </div>`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[audit-feedback] RESEND_API_KEY not configured");
    return Response.json(
      { error: "We could not record your answers. Please email info@edquityatthemargins.org." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.wave !== "string" || !WAVES.has(body.wave)) {
    return Response.json({ error: "Unknown survey wave." }, { status: 400 });
  }
  if (!Array.isArray(body.responses) || body.responses.length === 0) {
    return Response.json({ error: "Please answer at least one question." }, { status: 400 });
  }
  if (body.responses.length > MAX_RESPONSES) {
    return Response.json({ error: "Too many responses submitted." }, { status: 400 });
  }

  // Blank answers are dropped rather than rejected. Every question in the
  // study is optional by design, because a partial response from a parent
  // mid-dispute is worth more than a response that never arrives.
  const answered = (body.responses as Pair[])
    .map((pair) => ({
      question: optionalString(pair?.question, MAX_QUESTION),
      answer: optionalString(pair?.answer, MAX_ANSWER),
    }))
    .filter((pair) => pair.question !== "" && pair.answer !== "");

  if (answered.length === 0) {
    return Response.json({ error: "Please answer at least one question." }, { status: 400 });
  }

  const wave = body.wave;
  const respondentName = optionalString(body.respondentName, 200);
  const respondentEmail = isValidEmail(body.respondentEmail) ? (body.respondentEmail as string).trim() : "";

  const resend = new Resend(RESEND_API_KEY);

  const internalHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 680px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #122C54; margin: 0 0 6px; font-size: 18px;">Audit usefulness study response</h2>
      <p style="margin: 0 0 20px; font-size: 14px; color: #64748b;">
        ${escapeHtml(wave)} &middot; ${escapeHtml(respondentName || "Anonymous")}${respondentEmail ? ` &lt;${escapeHtml(respondentEmail)}&gt;` : ""}
      </p>
      ${answered.map((pair) => block(pair.question, pair.answer)).join("")}
      <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
        Log this against the family's audit record, then check whether it moves any of the three
        proving thresholds.
      </p>
    </div>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: respondentEmail || undefined,
      subject: `Audit study: ${respondentName || "Anonymous"} (${wave})`,
      html: internalHtml,
    });

    // Acknowledged only when the family gave an address. A thank-you sent to
    // nobody is a bounce, and a family answering anonymously chose not to be
    // written back to.
    if (respondentEmail) {
      await resend.emails.send({
        from: FROM,
        to: respondentEmail,
        subject: "Thank you for telling us how the report worked",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 620px; margin: 0 auto; padding: 24px;">
            <h2 style="margin: 0 0 14px; font-size: 18px;">Thank you</h2>
            <p style="font-size: 15px; line-height: 1.7; color: #334155;">
              Your answers go straight into the next version of the audit report, and they help
              us show funders that this work changes what happens at the IEP table. If you would
              rather talk it through than type it, reply to this email and we will set up fifteen
              minutes at a time that suits you.
            </p>
            <p style="font-size: 15px; line-height: 1.7; color: #334155;">
              Dr. Reba Clarke-Wedderburn<br/>
              EDquity at the Margins
            </p>
          </div>`,
      });
    }
  } catch (err) {
    console.error("[audit-feedback] send failed", err);
    return Response.json(
      { error: "We could not record your answers. Please email info@edquityatthemargins.org." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}

export const config = { runtime: "edge" };
