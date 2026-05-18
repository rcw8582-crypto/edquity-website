/**
 * Vercel serverless function: POST /api/volunteer
 *
 * Receives a volunteer signup, validates input, then performs two
 * actions in parallel:
 *
 *   1. Emails info@edquityatthemargins.org with the volunteer's
 *      name, email, area of interest, and optional message so Reba
 *      can follow up directly.
 *   2. Adds the volunteer to the Resend Volunteers segment so they
 *      can be included in future broadcasts to volunteers.
 *
 * Required environment variable:
 *   RESEND_API_KEY
 *
 * Optional environment variable:
 *   RESEND_VOLUNTEERS_SEGMENT_ID  (overrides the default segment id)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Volunteer Form <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

// "Volunteers" segment in Reba's Resend account. Override with the
// RESEND_VOLUNTEERS_SEGMENT_ID env var if the segment is ever
// recreated and gets a new UUID.
const VOLUNTEERS_SEGMENT_ID =
  process.env.RESEND_VOLUNTEERS_SEGMENT_ID || "7d2f03eb-3da1-403f-81ec-789c5f3328b9";

type Body = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  interest?: unknown;
  message?: unknown;
};

function isNonEmptyString(v: unknown, maxLen: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= maxLen;
}

function isOptionalString(v: unknown, maxLen: number): v is string | undefined {
  if (v === undefined || v === null || v === "") return true;
  return typeof v === "string" && v.trim().length <= maxLen;
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

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[volunteer] RESEND_API_KEY not configured");
    return Response.json(
      { error: "Volunteer form not configured. Please email us directly at info@edquityatthemargins.org." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { firstName, lastName, email, interest, message } = body;

  if (!isNonEmptyString(firstName, 100)) {
    return Response.json({ error: "Please provide your first name." }, { status: 400 });
  }
  if (!isNonEmptyString(lastName, 100)) {
    return Response.json({ error: "Please provide your last name." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!isOptionalString(interest, 200)) {
    return Response.json({ error: "Invalid area of interest." }, { status: 400 });
  }
  if (!isOptionalString(message, 5000)) {
    return Response.json({ error: "Message is too long." }, { status: 400 });
  }

  const cleanFirstName = (firstName as string).trim();
  const cleanLastName = (lastName as string).trim();
  const cleanEmail = (email as string).trim().toLowerCase();
  const cleanInterest =
    typeof interest === "string" && interest.trim().length > 0
      ? interest.trim()
      : "Not specified";
  const cleanMessage =
    typeof message === "string" && message.trim().length > 0
      ? message.trim()
      : "";

  const resend = new Resend(RESEND_API_KEY);

  // Run both side effects in parallel. Email-to-Reba is the
  // critical path (her followup workflow). Segment add is a
  // best-effort enhancement; if it fails we still return success.
  const [emailResult, segmentResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: cleanEmail,
      subject: `[EDATM Volunteer] ${cleanFirstName} ${cleanLastName} - ${cleanInterest}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 640px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">New volunteer signup</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 140px; vertical-align: top;"><strong>Name:</strong></td>
              <td style="padding: 8px 0;">${escapeHtml(cleanFirstName)} ${escapeHtml(cleanLastName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;">${escapeHtml(cleanEmail)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; vertical-align: top;"><strong>Area of interest:</strong></td>
              <td style="padding: 8px 0;">${escapeHtml(cleanInterest)}</td>
            </tr>
          </table>
          ${
            cleanMessage
              ? `<div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
                   <strong style="color: #64748b; display: block; margin-bottom: 8px;">Message:</strong>
                   <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(cleanMessage)}</div>
                 </div>`
              : `<div style="border-top: 1px solid #e2e8f0; padding-top: 16px; color: #64748b; font-style: italic;">
                   No additional message provided.
                 </div>`
          }
          <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
            Reply to this email to respond directly to ${escapeHtml(cleanFirstName)}.<br />
            ${escapeHtml(cleanFirstName)} has also been added to the Volunteers segment in Resend.<br />
            Submitted via the volunteer form on edquityatthemargins.org.
          </p>
        </div>
      `,
      text: `New volunteer signup

Name: ${cleanFirstName} ${cleanLastName}
Email: ${cleanEmail}
Area of interest: ${cleanInterest}

${cleanMessage ? `Message:\n${cleanMessage}\n\n` : "No additional message provided.\n\n"}---
Reply to this email to respond directly to ${cleanFirstName}.
${cleanFirstName} has also been added to the Volunteers segment in Resend.
Submitted via the volunteer form on edquityatthemargins.org.`,
    }),
    resend.contacts.create({
      email: cleanEmail,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      unsubscribed: false,
      segments: [{ id: VOLUNTEERS_SEGMENT_ID }],
    }),
  ]);

  if (emailResult.status === "rejected") {
    console.error("[volunteer] email send rejected:", emailResult.reason);
    return Response.json(
      { error: "We could not deliver your submission right now. Please try again in a few minutes." },
      { status: 502 }
    );
  }

  if (emailResult.value.error) {
    console.error("[volunteer] Resend email error:", emailResult.value.error);
    return Response.json(
      { error: "We could not deliver your submission right now. Please try again in a few minutes." },
      { status: 502 }
    );
  }

  // Segment add failures are non-fatal. Log and continue.
  if (segmentResult.status === "rejected") {
    console.warn("[volunteer] segment add rejected:", segmentResult.reason);
  } else if (segmentResult.value.error) {
    const errMessage = String(segmentResult.value.error.message ?? "").toLowerCase();
    // If the contact already exists, attempt to add them to the
    // segment directly. Silent on failure since the email
    // notification still went through.
    if (errMessage.includes("already exists") || errMessage.includes("duplicate")) {
      try {
        await resend.contacts.segments.add({
          email: cleanEmail,
          segmentId: VOLUNTEERS_SEGMENT_ID,
        });
      } catch {
        // ignore
      }
    } else {
      console.warn("[volunteer] segment add error:", segmentResult.value.error);
    }
  }

  return Response.json({ ok: true });
}

export const config = { runtime: "edge" };
