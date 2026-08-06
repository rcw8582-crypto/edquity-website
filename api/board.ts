/**
 * Vercel serverless function: POST /api/board
 *
 * Receives a board of directors or advisory council application,
 * validates input, and emails info@edquityatthemargins.org with the
 * full submission plus a paste row for the workbook.
 *
 * Unlike the volunteer form, nothing here touches a Resend segment.
 * Board candidates are evaluated and elected, so adding them to a
 * marketing audience on submission would be wrong.
 *
 * Required environment variable:
 *   RESEND_API_KEY
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Board Application <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

/** Kept in sync with the checkbox list rendered on /board. */
const EXPERTISE_OPTIONS = [
  "Board certified behavior analyst (BCBA)",
  "Speech and language pathology",
  "School psychology",
  "Low-incidence disabilities",
  "Special education teaching or administration",
  "Education policy",
  "Education law",
  "Finance, accounting, or audit",
  "Fundraising and development",
  "Nonprofit governance",
  "Communications",
  "Lived experience as a parent navigating the IEP process",
  "Other",
];

const TRACKS = ["Board of Directors", "Advisory Council", "Either"];

const SEAT_INTERESTS = [
  "Parent director",
  "Treasurer",
  "Not sure yet",
  "Not applying for a director seat",
];

const PARENT_ANSWERS = ["Yes", "No"];

type Body = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  cityState?: unknown;
  track?: unknown;
  seatInterest?: unknown;
  isParent?: unknown;
  expertise?: unknown;
  currentRole?: unknown;
  priorBoardService?: unknown;
  conflicts?: unknown;
  whyEdatm?: unknown;
  linkUrl?: unknown;
  disabilityIdentify?: unknown;
  commitment?: unknown;
  howHeard?: unknown;
};

function isNonEmptyString(v: unknown, maxLen: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= maxLen;
}

function isOptionalString(v: unknown, maxLen: number): boolean {
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

function short(s: string, max = 140): string {
  return s.length > max ? s.slice(0, max - 3) + "…" : s;
}

function optional(v: unknown, fallback = "Not provided"): string {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback;
}

/**
 * Renders a one-row HTML table whose cell order matches the "Board
 * Applications" tab in "EDATM Website Form Submissions.xlsx". Copying the
 * row out of the email and pasting it into Excel lands each value in its
 * own column, so submissions can be logged without retyping every field.
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
  return `
    <tr>
      <td style="padding: 8px 0; color: #64748b; width: 200px; vertical-align: top;"><strong>${escapeHtml(label)}:</strong></td>
      <td style="padding: 8px 0; vertical-align: top;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function block(label: string, value: string): string {
  return `
    <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 16px;">
      <strong style="color: #64748b; display: block; margin-bottom: 8px;">${escapeHtml(label)}</strong>
      <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(value)}</div>
    </div>
  `;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!RESEND_API_KEY) {
    console.error("[board] RESEND_API_KEY not configured");
    return Response.json(
      { error: "Board application form not configured. Please email us directly at info@edquityatthemargins.org." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    fullName,
    email,
    phone,
    cityState,
    track,
    seatInterest,
    isParent,
    expertise,
    currentRole,
    priorBoardService,
    conflicts,
    whyEdatm,
    linkUrl,
    disabilityIdentify,
    commitment,
    howHeard,
  } = body;

  if (!isNonEmptyString(fullName, 150)) {
    return Response.json({ error: "Please provide your full name." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!isOptionalString(phone, 40)) {
    return Response.json({ error: "Invalid phone number." }, { status: 400 });
  }
  if (!isNonEmptyString(cityState, 120)) {
    return Response.json({ error: "Please tell us what city and state you are in." }, { status: 400 });
  }
  if (typeof track !== "string" || !TRACKS.includes(track)) {
    return Response.json({ error: "Please choose which role you are applying for." }, { status: 400 });
  }
  if (typeof seatInterest !== "string" || !SEAT_INTERESTS.includes(seatInterest)) {
    return Response.json({ error: "Please choose which seat interests you." }, { status: 400 });
  }
  if (typeof isParent !== "string" || !PARENT_ANSWERS.includes(isParent)) {
    return Response.json(
      { error: "Please tell us whether you are the parent of a child with a disability." },
      { status: 400 }
    );
  }
  if (
    !Array.isArray(expertise) ||
    expertise.length === 0 ||
    expertise.length > EXPERTISE_OPTIONS.length ||
    !expertise.every((item) => typeof item === "string" && EXPERTISE_OPTIONS.includes(item))
  ) {
    return Response.json({ error: "Please select at least one area of expertise." }, { status: 400 });
  }
  if (!isNonEmptyString(currentRole, 300)) {
    return Response.json({ error: "Please tell us your current role and organization." }, { status: 400 });
  }
  if (!isOptionalString(priorBoardService, 2000)) {
    return Response.json({ error: "Prior board service is too long." }, { status: 400 });
  }
  if (!isNonEmptyString(conflicts, 2000)) {
    return Response.json(
      { error: "Please answer the question about school district and vendor relationships. Write \"None\" if none apply." },
      { status: 400 }
    );
  }
  if (!isNonEmptyString(whyEdatm, 4000)) {
    return Response.json({ error: "Please tell us why you want to serve." }, { status: 400 });
  }
  if (!isOptionalString(linkUrl, 500)) {
    return Response.json({ error: "Invalid profile or resume link." }, { status: 400 });
  }
  if (!isOptionalString(disabilityIdentify, 200)) {
    return Response.json({ error: "Invalid self-identification response." }, { status: 400 });
  }
  if (!isOptionalString(howHeard, 300)) {
    return Response.json({ error: "Invalid response for how you heard about us." }, { status: 400 });
  }

  // Anyone who might take a director seat has to acknowledge the term and
  // the meeting schedule. Advisory-only applicants carry no fiduciary
  // commitment, so the box does not apply to them.
  const directorTrack = track !== "Advisory Council";
  if (directorTrack && commitment !== true) {
    return Response.json(
      { error: "Please confirm you can serve a three-year term and attend four remote meetings a year." },
      { status: 400 }
    );
  }

  const cleanName = (fullName as string).trim();
  const cleanEmail = (email as string).trim().toLowerCase();
  const cleanPhone = optional(phone);
  const cleanCityState = (cityState as string).trim();
  const cleanExpertise = (expertise as string[]).join("; ");
  const cleanRole = (currentRole as string).trim();
  const cleanPrior = optional(priorBoardService, "None provided");
  const cleanConflicts = (conflicts as string).trim();
  const cleanWhy = (whyEdatm as string).trim();
  const cleanLink = optional(linkUrl);
  const cleanDisability = optional(disabilityIdentify, "Declined to answer");
  const cleanHowHeard = optional(howHeard);

  const resend = new Resend(RESEND_API_KEY);

  const result = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: cleanEmail,
    subject: `[EDATM Board] ${cleanName} - ${track} - ${seatInterest}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 640px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #122C54; margin: 0 0 16px; font-size: 18px;">New board or advisory council application</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
          ${row("Name", cleanName)}
          ${row("Email", cleanEmail)}
          ${row("Phone", cleanPhone)}
          ${row("City and state", cleanCityState)}
          ${row("Applying for", track as string)}
          ${row("Seat of interest", seatInterest as string)}
          ${row("Parent of a child with a disability", isParent as string)}
          ${row("Expertise", cleanExpertise)}
          ${row("Current role", cleanRole)}
          ${row("Profile or resume", cleanLink)}
          ${row("Self-identifies as disabled", cleanDisability)}
          ${row("How they heard about us", cleanHowHeard)}
          ${row("Confirmed term and meeting commitment", directorTrack ? "Yes" : "Not applicable, advisory only")}
        </table>
        ${block("Why EDquity at the Margins", cleanWhy)}
        ${block("District, LEA, or vendor relationships", cleanConflicts)}
        ${block("Prior board or committee service", cleanPrior)}
        <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          Reply to this email to respond directly to ${escapeHtml(cleanName)}.<br />
          Review the district and vendor answer against the Independence and Engagement Policy before advancing this candidate.<br />
          Submitted via the board application form on edquityatthemargins.org.
        </p>
        ${pasteRow("Board Applications", [
          new Date().toISOString().slice(0, 10),
          cleanName,
          cleanEmail,
          cleanPhone,
          cleanCityState,
          track as string,
          seatInterest as string,
          isParent as string,
          cleanExpertise,
          cleanRole,
          short(cleanPrior),
          short(cleanConflicts),
          short(cleanWhy),
          cleanLink,
          cleanDisability,
          cleanHowHeard,
        ])}
      </div>
    `,
    text: `New board or advisory council application

Name: ${cleanName}
Email: ${cleanEmail}
Phone: ${cleanPhone}
City and state: ${cleanCityState}
Applying for: ${track}
Seat of interest: ${seatInterest}
Parent of a child with a disability: ${isParent}
Expertise: ${cleanExpertise}
Current role: ${cleanRole}
Profile or resume: ${cleanLink}
Self-identifies as disabled: ${cleanDisability}
How they heard about us: ${cleanHowHeard}
Confirmed term and meeting commitment: ${directorTrack ? "Yes" : "Not applicable, advisory only"}

Why EDquity at the Margins:
${cleanWhy}

District, LEA, or vendor relationships:
${cleanConflicts}

Prior board or committee service:
${cleanPrior}

---
Reply to this email to respond directly to ${cleanName}.
Review the district and vendor answer against the Independence and Engagement Policy before advancing this candidate.
Submitted via the board application form on edquityatthemargins.org.`,
  });

  if (result.error) {
    console.error("[board] Resend email error:", result.error);
    return Response.json(
      { error: "We could not deliver your application right now. Please try again in a few minutes." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}

export const config = { runtime: "edge" };
