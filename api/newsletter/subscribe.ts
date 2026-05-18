/**
 * Vercel serverless function: POST /api/subscribe
 *
 * Receives a newsletter signup, validates email, and creates the
 * contact in Resend. The contact lands in your account's default
 * audience and is visible in the Audience tab at resend.com/audience.
 *
 * Required environment variable:
 *   RESEND_API_KEY  (already set in Vercel for the contact form)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

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
    });

    // Treat "already exists" as a successful subscription so we never
    // tell a returning subscriber that they failed to sign up.
    if (result.error) {
      const errMessage = String(result.error.message ?? "").toLowerCase();
      if (errMessage.includes("already exists") || errMessage.includes("duplicate")) {
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
