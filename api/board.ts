/**
 * Vercel serverless function: POST /api/board
 *
 * Receives a board of directors or advisory council application and does
 * three things, in order of how much it matters that they succeed:
 *
 *   1. Writes the application to the board_applications table in Supabase.
 *      This is the durable record. An email can be deleted; this cannot.
 *   2. Emails info@edquityatthemargins.org with the full submission.
 *   3. Includes a single delimited line in that email, marked by fixed
 *      sentinels, which a Power Automate flow parses to append a row to
 *      the workbook in the board applications folder. The line exists so
 *      the flow never has to guess at prose formatting.
 *
 * Unlike the volunteer form, nothing here touches a Resend segment. Board
 * candidates are evaluated and elected, so adding them to a marketing
 * audience on submission would be wrong.
 *
 * Required environment variable:
 *   RESEND_API_KEY
 *
 * Optional environment variables:
 *   SUPABASE_URL                 (defaults to the portal project)
 *   SUPABASE_SERVICE_ROLE_KEY    (when absent, the database write is
 *                                 skipped and the email still sends, so a
 *                                 missing key degrades the record rather
 *                                 than losing the application)
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = "EDquity Board Application <forms@edquityatthemargins.org>";
const TO = "info@edquityatthemargins.org";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://erggxchftkpczoshcfii.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Sentinels the Power Automate flow keys on. The flow takes everything
 * between them, splits on the pipe, and writes the parts into the table
 * columns in this order. Changing either sentinel or the column order
 * breaks the flow, so both are treated as a contract.
 */
const ROW_START = "<<<EDATM-ROW-START>>>";
const ROW_END = "<<<EDATM-ROW-END>>>";
const CELL = "|";

const TRACKS = ["Board of Directors", "Advisory Council", "Either"];

const SEAT_INTERESTS = [
  "Treasurer",
  "Development and Institutional Partnerships",
  "Secretary",
  "At-Large Director, Family Law or Disability Rights",
  "Parent Director",
  "Not sure yet",
  "Not applying for a director seat",
];

const ADVISORY_ROLES = [
  "Board certified behavior analyst (BCBA)",
  "Speech and language pathologist",
  "School psychologist",
  "Low-incidence disabilities specialist",
  "Education policy researcher or attorney",
  "Other",
];

const YES_NO = ["Yes", "No"];

const NONPROFIT_BOARD_SERVICE = [
  "None yet",
  "Currently serve on one",
  "Have served on one",
  "Have served on two or more",
];

const NONPROFIT_ROLES = [
  "Board chair or president",
  "Treasurer",
  "Secretary",
  "Committee chair",
  "Committee member",
  "Advisory council member",
  "Nonprofit staff or executive",
  "None of these",
];

const NONPROFIT_COMPETENCIES = [
  "Budgeting and financial oversight",
  "Form 990 and tax compliance",
  "Audit or financial review",
  "Grant writing",
  "Fundraising and donor cultivation",
  "Bylaws and governance policy",
  "Strategic planning",
  "Executive director search or evaluation",
  "Risk management and insurance",
  "None of these",
];

const EDUCATION_SETTINGS = [
  "K-12 public school",
  "Charter school",
  "Private school",
  "District or LEA central office",
  "State education agency",
  "Higher education",
  "Education nonprofit or advocacy organization",
  "Education foundation or grantmaker",
  "None of these",
];

const EDUCATION_ROLES = [
  "General education teacher",
  "Special education teacher",
  "Related service provider",
  "School or district administrator",
  "Special education director or coordinator",
  "Researcher",
  "Policy professional",
  "Funder or program officer",
  "Parent advocate",
  "None of these",
];

const SPED_YEARS = ["None", "Fewer than three", "Three to ten", "More than ten"];

const FAMILIARITY = [
  "No background",
  "General awareness",
  "Working knowledge I apply in my work",
  "Deep expertise, this is my field",
];

const DISPUTE_EXPERIENCE = [
  "Due process hearings",
  "Mediation",
  "State complaints",
  "IEP facilitation",
  "None of these",
];

const FUNDRAISING_EXPERIENCE = [
  "Yes, I have led campaigns or major asks",
  "Yes, I have made asks or introductions",
  "No, and I am willing to learn",
  "No",
];

const PRIMARY_CONTRIBUTION = [
  "Lived experience as a parent",
  "Finance and financial oversight",
  "Fundraising and funder relationships",
  "Education law and policy",
  "Clinical or related-service expertise",
  "Nonprofit governance",
  "School system knowledge",
  "Communications",
  "Other",
];

type Body = Record<string, unknown>;

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

/** A select whose value must come from a fixed list, or be blank if optional. */
function isFromList(v: unknown, list: string[], required: boolean): boolean {
  if (v === undefined || v === null || v === "") return !required;
  return typeof v === "string" && list.includes(v);
}

/** A checkbox group. Every value must come from the list, duplicates aside. */
function isSubsetOf(v: unknown, list: string[]): v is string[] {
  return (
    Array.isArray(v) &&
    v.length <= list.length &&
    v.every((item) => typeof item === "string" && list.includes(item))
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function optional(v: unknown, fallback = "Not provided"): string {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback;
}

function list(v: unknown, fallback = "None selected"): string {
  return Array.isArray(v) && v.length > 0 ? (v as string[]).join("; ") : fallback;
}

/**
 * Strips the delimiter and the newlines out of a value before it goes into
 * the machine-readable row. A candidate who types a pipe into a free-text
 * answer would otherwise shift every later column in the spreadsheet.
 */
function cellSafe(s: string): string {
  return s.replace(/[|\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 7px 0; color: #64748b; width: 210px; vertical-align: top;"><strong>${escapeHtml(label)}:</strong></td>
      <td style="padding: 7px 0; vertical-align: top;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function block(label: string, value: string): string {
  return `
    <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; margin-top: 14px;">
      <strong style="color: #64748b; display: block; margin-bottom: 6px;">${escapeHtml(label)}</strong>
      <div style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(value)}</div>
    </div>
  `;
}

function section(title: string): string {
  return `<h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #14B8A6; margin: 26px 0 6px;">${escapeHtml(title)}</h3>`;
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

  const b = body;

  if (!isNonEmptyString(b.fullName, 150)) {
    return Response.json({ error: "Please provide your full name." }, { status: 400 });
  }
  if (!isValidEmail(b.email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!isOptionalString(b.phone, 40)) {
    return Response.json({ error: "Invalid phone number." }, { status: 400 });
  }
  if (!isNonEmptyString(b.cityState, 120)) {
    return Response.json({ error: "Please tell us what city and state you are in." }, { status: 400 });
  }
  if (!isFromList(b.track, TRACKS, true)) {
    return Response.json({ error: "Please choose which role you are applying for." }, { status: 400 });
  }
  if (!isFromList(b.isParent, YES_NO, true)) {
    return Response.json(
      { error: "Please tell us whether you are the parent of a child with a disability." },
      { status: 400 }
    );
  }

  const directorTrack = b.track !== "Advisory Council";
  const advisoryTrack = b.track !== "Board of Directors";

  if (directorTrack && !isFromList(b.seatInterest, SEAT_INTERESTS, true)) {
    return Response.json({ error: "Please choose which seat interests you." }, { status: 400 });
  }
  if (advisoryTrack && !isFromList(b.advisoryRole, ADVISORY_ROLES, true)) {
    return Response.json({ error: "Please choose which advisory role fits you." }, { status: 400 });
  }

  if (!isFromList(b.nonprofitBoardService, NONPROFIT_BOARD_SERVICE, true)) {
    return Response.json({ error: "Please answer the question about nonprofit board service." }, { status: 400 });
  }
  if (!isSubsetOf(b.nonprofitRoles, NONPROFIT_ROLES)) {
    return Response.json({ error: "Invalid selection under nonprofit roles." }, { status: 400 });
  }
  if (!isSubsetOf(b.nonprofitCompetencies, NONPROFIT_COMPETENCIES)) {
    return Response.json({ error: "Invalid selection under nonprofit competencies." }, { status: 400 });
  }
  if (!isOptionalString(b.nonprofitExperience, 3000)) {
    return Response.json({ error: "Your nonprofit experience answer is too long." }, { status: 400 });
  }
  if (!isSubsetOf(b.educationSettings, EDUCATION_SETTINGS)) {
    return Response.json({ error: "Invalid selection under education settings." }, { status: 400 });
  }
  if (!isSubsetOf(b.educationRoles, EDUCATION_ROLES)) {
    return Response.json({ error: "Invalid selection under education roles." }, { status: 400 });
  }
  if (!isFromList(b.spedYears, SPED_YEARS, true)) {
    return Response.json({ error: "Please tell us your years working in or with special education." }, { status: 400 });
  }
  if (!isFromList(b.ideaFamiliarity, FAMILIARITY, true)) {
    return Response.json({ error: "Please rate your familiarity with IDEA." }, { status: 400 });
  }
  if (!isFromList(b.section504Familiarity, FAMILIARITY, true)) {
    return Response.json({ error: "Please rate your familiarity with Section 504 and the ADA." }, { status: 400 });
  }
  if (!isSubsetOf(b.disputeExperience, DISPUTE_EXPERIENCE)) {
    return Response.json({ error: "Invalid selection under dispute resolution experience." }, { status: 400 });
  }
  if (!isOptionalString(b.lawKnowledgeSource, 2000)) {
    return Response.json({ error: "Your education law answer is too long." }, { status: 400 });
  }
  if (!isFromList(b.primaryContribution, PRIMARY_CONTRIBUTION, true)) {
    return Response.json({ error: "Please choose your primary contribution." }, { status: 400 });
  }
  if (!isNonEmptyString(b.currentRoleOrg, 300)) {
    return Response.json({ error: "Please tell us your current role and organization." }, { status: 400 });
  }
  if (!isNonEmptyString(b.whyEdatm, 4000)) {
    return Response.json({ error: "Please tell us why you want to serve." }, { status: 400 });
  }
  if (!isNonEmptyString(b.conflicts, 2000)) {
    return Response.json(
      { error: 'Please answer the question about school district and vendor relationships. Write "None" if none apply.' },
      { status: 400 }
    );
  }
  if (!isOptionalString(b.priorBoardService, 2000)) {
    return Response.json({ error: "Prior board service is too long." }, { status: 400 });
  }
  if (!isOptionalString(b.professionalLicense, 200)) {
    return Response.json({ error: "Invalid license or credential." }, { status: 400 });
  }
  if (!isOptionalString(b.linkUrl, 500)) {
    return Response.json({ error: "Invalid profile or resume link." }, { status: 400 });
  }
  if (!isFromList(b.disabilityIdentify, YES_NO, false)) {
    return Response.json({ error: "Invalid self-identification response." }, { status: 400 });
  }
  if (!isOptionalString(b.howHeard, 300)) {
    return Response.json({ error: "Invalid response for how you heard about us." }, { status: 400 });
  }

  // Director-track acknowledgements. Advisory-only applicants take on no
  // fiduciary duty and were never asked to fundraise, so neither applies.
  if (directorTrack) {
    if (!isFromList(b.fundraisingExperience, FUNDRAISING_EXPERIENCE, true)) {
      return Response.json({ error: "Please answer the question about raising money for a nonprofit." }, { status: 400 });
    }
    if (!isOptionalString(b.networks, 3000)) {
      return Response.json({ error: "Your networks answer is too long." }, { status: 400 });
    }
    if (b.commitmentConfirmed !== true) {
      return Response.json(
        { error: "Please confirm the term, the meetings, and the monthly time commitment." },
        { status: 400 }
      );
    }
    if (b.fundraisingConfirmed !== true) {
      return Response.json(
        { error: "Please confirm that you will participate in fundraising." },
        { status: 400 }
      );
    }
  }
  if (advisoryTrack && !directorTrack && b.commitmentConfirmed !== true) {
    return Response.json(
      { error: "Please confirm the one-year appointment and quarterly time commitment." },
      { status: 400 }
    );
  }

  const app = {
    full_name: (b.fullName as string).trim(),
    email: (b.email as string).trim().toLowerCase(),
    phone: optional(b.phone, "") || null,
    city_state: (b.cityState as string).trim(),
    track: b.track as string,
    seat_interest: directorTrack ? (b.seatInterest as string) : null,
    advisory_role: advisoryTrack ? (b.advisoryRole as string) : null,
    is_parent: b.isParent as string,
    disability_identify: optional(b.disabilityIdentify, "") || null,
    nonprofit_board_service: b.nonprofitBoardService as string,
    nonprofit_roles: (b.nonprofitRoles as string[]) ?? [],
    nonprofit_competencies: (b.nonprofitCompetencies as string[]) ?? [],
    nonprofit_experience: optional(b.nonprofitExperience, "") || null,
    education_settings: (b.educationSettings as string[]) ?? [],
    education_roles: (b.educationRoles as string[]) ?? [],
    sped_years: b.spedYears as string,
    idea_familiarity: b.ideaFamiliarity as string,
    section_504_familiarity: b.section504Familiarity as string,
    dispute_experience: (b.disputeExperience as string[]) ?? [],
    law_knowledge_source: optional(b.lawKnowledgeSource, "") || null,
    fundraising_experience: directorTrack ? ((b.fundraisingExperience as string) ?? null) : null,
    networks: directorTrack ? (optional(b.networks, "") || null) : null,
    current_role_org: (b.currentRoleOrg as string).trim(),
    why_edatm: (b.whyEdatm as string).trim(),
    conflicts: (b.conflicts as string).trim(),
    prior_board_service: optional(b.priorBoardService, "") || null,
    primary_contribution: b.primaryContribution as string,
    professional_license: optional(b.professionalLicense, "") || null,
    link_url: optional(b.linkUrl, "") || null,
    how_heard: optional(b.howHeard, "") || null,
    commitment_confirmed: b.commitmentConfirmed === true,
    fundraising_confirmed: b.fundraisingConfirmed === true,
  };

  // The durable record is written first. A failure here is logged and does
  // not stop the email, because losing the notification as well would turn
  // a storage problem into a lost candidate.
  let stored = false;
  if (SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/board_applications`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(app),
      });
      if (res.ok) {
        stored = true;
      } else {
        console.error("[board] Supabase insert failed:", res.status, await res.text());
      }
    } catch (error) {
      console.error("[board] Supabase insert threw:", error);
    }
  } else {
    console.warn("[board] SUPABASE_SERVICE_ROLE_KEY not set, application not stored");
  }

  const submittedOn = new Date().toISOString().slice(0, 10);

  // Column order is the contract with the Power Automate flow and with the
  // workbook. Append new columns at the end; never reorder these.
  const flowRow = [
    submittedOn,
    app.full_name,
    app.email,
    app.phone ?? "",
    app.city_state,
    app.track,
    app.seat_interest ?? "",
    app.advisory_role ?? "",
    app.is_parent,
    app.primary_contribution,
    app.nonprofit_board_service,
    app.nonprofit_roles.join("; "),
    app.nonprofit_competencies.join("; "),
    app.education_settings.join("; "),
    app.education_roles.join("; "),
    app.sped_years,
    app.idea_familiarity,
    app.section_504_familiarity,
    app.dispute_experience.join("; "),
    app.fundraising_experience ?? "",
    app.current_role_org,
    app.professional_license ?? "",
    app.link_url ?? "",
    app.disability_identify ?? "",
    app.how_heard ?? "",
    app.commitment_confirmed ? "Yes" : "No",
    app.fundraising_confirmed ? "Yes" : "No",
    "new",
  ]
    .map((value) => cellSafe(String(value)))
    .join(CELL);

  const resend = new Resend(RESEND_API_KEY);

  const result = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: app.email,
    subject: `[EDATM Board] ${app.full_name} - ${app.track}${app.seat_interest ? ` - ${app.seat_interest}` : ""}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #122C54; max-width: 680px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #122C54; margin: 0 0 4px; font-size: 18px;">New board or advisory council application</h2>
        <p style="color: #64748b; font-size: 12px; margin: 0 0 8px;">
          ${stored ? "Saved to the board_applications table." : "NOT saved to the database. Keep this email as the only copy."}
        </p>

        ${section("Contact and routing")}
        <table style="width: 100%; border-collapse: collapse;">
          ${row("Name", app.full_name)}
          ${row("Email", app.email)}
          ${row("Phone", app.phone ?? "Not provided")}
          ${row("City and state", app.city_state)}
          ${row("Applying for", app.track)}
          ${app.seat_interest ? row("Seat of interest", app.seat_interest) : ""}
          ${app.advisory_role ? row("Advisory role", app.advisory_role) : ""}
          ${row("Primary contribution", app.primary_contribution)}
          ${row("Parent of a child with a disability", app.is_parent)}
          ${row("Self-identifies as disabled", app.disability_identify ?? "Declined to answer")}
        </table>

        ${section("Nonprofit experience")}
        <table style="width: 100%; border-collapse: collapse;">
          ${row("Board service", app.nonprofit_board_service)}
          ${row("Roles held", list(app.nonprofit_roles))}
          ${row("Competencies", list(app.nonprofit_competencies))}
        </table>
        ${app.nonprofit_experience ? block("Most relevant nonprofit experience", app.nonprofit_experience) : ""}

        ${section("Education sector")}
        <table style="width: 100%; border-collapse: collapse;">
          ${row("Settings", list(app.education_settings))}
          ${row("Roles", list(app.education_roles))}
          ${row("Years in special education", app.sped_years)}
        </table>

        ${section("Education law")}
        <table style="width: 100%; border-collapse: collapse;">
          ${row("IDEA familiarity", app.idea_familiarity)}
          ${row("Section 504 and ADA familiarity", app.section_504_familiarity)}
          ${row("Dispute resolution", list(app.dispute_experience))}
        </table>
        ${app.law_knowledge_source ? block("Where their education law knowledge comes from", app.law_knowledge_source) : ""}

        ${
          directorTrack
            ? `${section("Fundraising")}
               <table style="width: 100%; border-collapse: collapse;">
                 ${row("Has raised money before", app.fundraising_experience ?? "Not provided")}
               </table>
               ${app.networks ? block("Networks they could open", app.networks) : ""}`
            : ""
        }

        ${section("Narrative and screening")}
        <table style="width: 100%; border-collapse: collapse;">
          ${row("Current role", app.current_role_org)}
          ${row("License or credential", app.professional_license ?? "Not provided")}
          ${row("Profile or resume", app.link_url ?? "Not provided")}
          ${row("How they heard about us", app.how_heard ?? "Not provided")}
        </table>
        ${block("Why EDquity at the Margins", app.why_edatm)}
        ${block("District, LEA, or vendor relationships", app.conflicts)}
        ${app.prior_board_service ? block("Prior board or committee service", app.prior_board_service) : ""}

        <p style="color: #64748b; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          Reply to this email to respond directly to ${escapeHtml(app.full_name)}.<br />
          Review the district and vendor answer against the Independence and Engagement Policy before advancing this candidate.<br />
          Submitted via the board application form on edquityatthemargins.org.
        </p>

        <p style="color: #cbd5e1; font-size: 10px; margin-top: 20px; font-family: monospace; word-break: break-all;">
          ${ROW_START}${escapeHtml(flowRow)}${ROW_END}
        </p>
      </div>
    `,
    text: `New board or advisory council application
${stored ? "Saved to the board_applications table." : "NOT saved to the database. Keep this email as the only copy."}

CONTACT AND ROUTING
Name: ${app.full_name}
Email: ${app.email}
Phone: ${app.phone ?? "Not provided"}
City and state: ${app.city_state}
Applying for: ${app.track}
Seat of interest: ${app.seat_interest ?? "Not applicable"}
Advisory role: ${app.advisory_role ?? "Not applicable"}
Primary contribution: ${app.primary_contribution}
Parent of a child with a disability: ${app.is_parent}
Self-identifies as disabled: ${app.disability_identify ?? "Declined to answer"}

NONPROFIT EXPERIENCE
Board service: ${app.nonprofit_board_service}
Roles held: ${list(app.nonprofit_roles)}
Competencies: ${list(app.nonprofit_competencies)}
${app.nonprofit_experience ? `Most relevant experience:\n${app.nonprofit_experience}\n` : ""}
EDUCATION SECTOR
Settings: ${list(app.education_settings)}
Roles: ${list(app.education_roles)}
Years in special education: ${app.sped_years}

EDUCATION LAW
IDEA familiarity: ${app.idea_familiarity}
Section 504 and ADA familiarity: ${app.section_504_familiarity}
Dispute resolution: ${list(app.dispute_experience)}
${app.law_knowledge_source ? `Source of knowledge:\n${app.law_knowledge_source}\n` : ""}
${directorTrack ? `FUNDRAISING\nHas raised money before: ${app.fundraising_experience ?? "Not provided"}\n${app.networks ? `Networks they could open:\n${app.networks}\n` : ""}` : ""}
NARRATIVE AND SCREENING
Current role: ${app.current_role_org}
License or credential: ${app.professional_license ?? "Not provided"}
Profile or resume: ${app.link_url ?? "Not provided"}
How they heard about us: ${app.how_heard ?? "Not provided"}

Why EDquity at the Margins:
${app.why_edatm}

District, LEA, or vendor relationships:
${app.conflicts}
${app.prior_board_service ? `\nPrior board or committee service:\n${app.prior_board_service}\n` : ""}
---
Reply to this email to respond directly to ${app.full_name}.
Review the district and vendor answer against the Independence and Engagement Policy before advancing this candidate.
Submitted via the board application form on edquityatthemargins.org.

${ROW_START}${flowRow}${ROW_END}`,
  });

  if (result.error) {
    console.error("[board] Resend email error:", result.error);
    // The application is already stored, so a failed email is not a failed
    // submission. Telling the applicant to resubmit would duplicate the row.
    if (stored) {
      return Response.json({ ok: true });
    }
    return Response.json(
      { error: "We could not deliver your application right now. Please try again in a few minutes." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}

export const config = { runtime: "edge" };
