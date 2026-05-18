/**
 * Vercel serverless function: POST /api/contact
 *
 * Receives a contact form submission, validates input, and emails it
 * to info@edquityatthemargins.org via Resend. Configured for the
 * verified edquityatthemargins.org domain.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (set in Vercel project settings)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Contact Form <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

type Body = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function isNonEmptyString(v: unknown, maxLen: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= maxLen;
}

function isValidEmail(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const trimmed = v.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  // Practical email check. Not RFC-5322 perfect, but covers everything
  // we care about and rejects obvious junk.
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

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY not configured");
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

  const { name, email, subject, message } = body;

  if (!isNonEmptyString(name, 200)) {
    return Response.json({ error: "Please provide your name." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!isNonEmptyString(subject, 300)) {
    return Response.json({ error: "Please provide a subject." }, { status: 400 });
  }
  if (!isNonEmptyString(message, 10000)) {
    return Response.json({ error: "Please include a message." }, { status: 400 });
  }

  const cleanName = (name as string).trim();
  const cleanEmail = (email as string).trim();
  const cleanSubject = (subject as string).trim();
  const cleanMessage = (message as string).trim();

  const resend = new Resend(RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: cleanEmail,
      subject: `[EDATM Contact] ${cleanSubject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 640px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">New contact form submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 100px; vertical-align: top;"><strong>From:</strong></td>
              <td style="padding: 8px 0;">${escapeHtml(cleanName)} &lt;${escapeHtml(cleanEmail)}&gt;</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Subject:</strong></td>
              <td style="padding: 8px 0;">${escapeHtml(cleanSubject)}</td>
            </tr>
          </table>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; white-space: pre-wrap; line-height: 1.6;">
${escapeHtml(cleanMessage)}
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            Reply to this email to respond directly to ${escapeHtml(cleanName)}.<br />
            Submitted via the contact form on edquityatthemargins.org.
          </p>
        </div>
      `,
      text: `New contact form submission

From: ${cleanName} <${cleanEmail}>
Subject: ${cleanSubject}

${cleanMessage}

---
Reply to this email to respond directly to ${cleanName}.
Submitted via the contact form on edquityatthemargins.org.`,
    });

    if (result.error) {
      console.error("[contact] Resend error:", result.error);
      return Response.json(
        { error: "We could not deliver your message right now. Please try again in a few minutes." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, id: result.data?.id ?? null });
  } catch (err) {
    console.error("[contact] send threw:", err);
    return Response.json(
      { error: "We could not deliver your message right now. Please try again in a few minutes." },
      { status: 502 }
    );
  }
}

export const config = { runtime: "edge" };
