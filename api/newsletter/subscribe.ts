/**
 * Vercel serverless function: POST /api/newsletter/subscribe
 *
 * Receives a newsletter signup, validates email, and creates the
 * contact in Resend tagged with the "website subscribers" segment.
 * If that segment does not yet exist in the Resend account, it is
 * created automatically on first use.
 *
 * Required environment variable:
 *   RESEND_API_KEY
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SEGMENT_NAME = "website subscribers";

// Cached so we hit Resend's segments.list only once per cold start
// instead of on every signup request.
let cachedSegmentId: string | null = null;

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

/**
 * Resolve the "website subscribers" segment ID. Looks it up by name,
 * creates it if missing, caches the result for subsequent calls.
 */
async function getOrCreateWebsiteSegmentId(resend: Resend): Promise<string | null> {
  if (cachedSegmentId) return cachedSegmentId;

  try {
    const list = await resend.segments.list();
    const existing = list.data?.data?.find(
      (s) => s.name.toLowerCase() === SEGMENT_NAME.toLowerCase()
    );
    if (existing) {
      cachedSegmentId = existing.id;
      return cachedSegmentId;
    }

    const created = await resend.segments.create({ name: SEGMENT_NAME });
    if (created.error) {
      console.error("[subscribe] segment create error:", created.error);
      return null;
    }
    if (created.data?.id) {
      cachedSegmentId = created.data.id;
      return cachedSegmentId;
    }
    return null;
  } catch (err) {
    console.error("[subscribe] segment resolve threw:", err);
    return null;
  }
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
  const segmentId = await getOrCreateWebsiteSegmentId(resend);

  try {
    const result = await resend.contacts.create({
      email: cleanEmail,
      firstName: cleanFirstName,
      unsubscribed: false,
      // Tag the new contact with the website subscribers segment so
      // Reba can target them in broadcasts separately from contacts
      // who reached us through other channels.
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });

    // Treat duplicate signup as success so a returning subscriber
    // never sees an error.
    if (result.error) {
      const errMessage = String(result.error.message ?? "").toLowerCase();
      if (errMessage.includes("already exists") || errMessage.includes("duplicate")) {
        // If the contact already exists, still try to add them to the
        // segment via the contact-segments add API. Silent on failure
        // since the primary signup goal is met.
        if (segmentId) {
          try {
            await resend.contacts.segments.add({ email: cleanEmail, segmentId });
          } catch {
            // ignore: existing contact was the goal; segment add is bonus
          }
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
