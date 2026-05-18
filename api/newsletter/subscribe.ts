/**
 * Vercel serverless function: POST /api/newsletter/subscribe
 *
 * Receives a newsletter signup, validates email, and creates the
 * contact in Resend tagged with the "website subscribers" segment.
 *
 * Required environment variable:
 *   RESEND_API_KEY
 *
 * Optional environment variable:
 *   RESEND_WEBSITE_SEGMENT_ID  (overrides the default segment id
 *   below; useful if the segment is ever recreated in Resend)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// The "website subscribers" segment created in Reba's Resend account.
// Override with the RESEND_WEBSITE_SEGMENT_ID env var if the segment
// is ever recreated and gets a new UUID.
const WEBSITE_SUBSCRIBERS_SEGMENT_ID =
  process.env.RESEND_WEBSITE_SEGMENT_ID || "147ab7ac-e9a4-4564-9d2b-62d251146ef9";

type Body = {
  email?: unknown;
  firstName?: unknown;
};

function isValidEmail(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const trimmed = v.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function isOptionalString(v: unknown, maxLen: number): v is string | undefined {
  if (v === undefined || v === null || v === "") return true;
  return typeof v === "string" && v.trim().length <= maxLen;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[subscribe] RESEND_API_KEY not configured");
    return Response.json(
      { error: "Newsletter service not configured. Please try again later." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, firstName } = body;

  if (!isValidEmail(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!isOptionalString(firstName, 100)) {
    return Response.json({ error: "Invalid first name." }, { status: 400 });
  }

  const cleanEmail = (email as string).trim().toLowerCase();
  const cleanFirstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName.trim()
      : undefined;

  const resend = new Resend(RESEND_API_KEY);

  try {
    const result = await resend.contacts.create({
      email: cleanEmail,
      firstName: cleanFirstName,
      unsubscribed: false,
      segments: [{ id: WEBSITE_SUBSCRIBERS_SEGMENT_ID }],
    });

    // Treat duplicate signup as success so a returning subscriber
    // never sees an error. If the contact already exists, we still
    // try to add them to the segment via the contact-segments add
    // API, since the create call would have noop'd the segment
    // membership.
    if (result.error) {
      const errMessage = String(result.error.message ?? "").toLowerCase();
      if (errMessage.includes("already exists") || errMessage.includes("duplicate")) {
        try {
          await resend.contacts.segments.add({
            email: cleanEmail,
            segmentId: WEBSITE_SUBSCRIBERS_SEGMENT_ID,
          });
        } catch {
          // ignore: primary signup goal is met regardless of segment update
        }
        return Response.json({ ok: true, alreadySubscribed: true });
      }
      console.error("[subscribe] Resend error:", result.error);
      return Response.json(
        { error: "We could not complete your signup right now. Please try again in a few minutes." },
        { status: 502 }
      );
    }

    return Response.json({ ok: true, id: result.data?.id ?? null });
  } catch (err) {
    console.error("[subscribe] create threw:", err);
    return Response.json(
      { error: "We could not complete your signup right now. Please try again in a few minutes." },
      { status: 502 }
    );
  }
}

export const config = { runtime: "edge" };
