/**
 * The board and advisory council role bank.
 *
 * THE PDF IS THE SOURCE OF TRUTH. Nothing in this file duplicates the body
 * of a position description, and nothing should. Reba maintains the Word
 * document on her Desktop, saves it as a PDF over the matching file in
 * public/board-roles, and the page updates on the next deploy. One edit in
 * one place.
 *
 * What lives here is only what a link needs: the slug that names the PDF,
 * the title, whether the role is a director seat or a council appointment,
 * whether it is currently open, and one line of summary for the index card
 * and the page description.
 *
 * `status` is the only field that tracks the current moment. Flip it to
 * "filled" when a seat is taken. Do not delete the entry. A filled role
 * stays in the bank so the description is still there the next time the
 * seat turns over.
 *
 * Adding a role means dropping a PDF into public/board-roles and adding an
 * entry here. The index page, the role pages, the sitemap, and the
 * prerender pass all read from this array.
 */

export type RoleStatus = "open" | "filled";
export type RoleKind = "director" | "advisory";

export interface BoardRole {
  /** Also the PDF filename: public/board-roles/<slug>.pdf */
  slug: string;
  title: string;
  kind: RoleKind;
  status: RoleStatus;
  /** One line for the index card and the meta description. */
  summary: string;
}

export const BOARD_ROLES: BoardRole[] = [
  {
    slug: "treasurer",
    title: "Treasurer",
    kind: "director",
    status: "open",
    summary: "Leads the board's financial oversight and chairs the Finance Committee.",
  },
  {
    slug: "development-and-institutional-partnerships",
    title: "Development and Institutional Partnerships Director",
    kind: "director",
    status: "open",
    summary: "Chairs the Development Committee and leads the board's fundraising.",
  },
  {
    slug: "secretary",
    title: "Secretary",
    kind: "director",
    status: "open",
    summary: "Keeps the governance record accurate and the organization's compliance current.",
  },
  {
    slug: "family-law-or-disability-rights",
    title: "At-Large Director, Family Law or Disability Rights",
    kind: "director",
    status: "open",
    summary: "Brings legal and policy judgment to program design and compliance.",
  },
  {
    slug: "parent-director",
    title: "Parent Director",
    kind: "director",
    status: "open",
    summary: "Brings the lived experience of the IEP process into every board decision.",
  },
  {
    slug: "advisor-behavior-analysis",
    title: "Advisory Council Member, Behavior Analysis",
    kind: "advisory",
    status: "open",
    summary: "Advises on behavior intervention plans, functional assessments, and behavior goals.",
  },
  {
    slug: "advisor-speech-and-language",
    title: "Advisory Council Member, Speech and Language",
    kind: "advisory",
    status: "open",
    summary: "Advises on communication goals, speech and language services, and augmentative communication.",
  },
  {
    slug: "advisor-school-psychology",
    title: "Advisory Council Member, School Psychology",
    kind: "advisory",
    status: "open",
    summary: "Advises on evaluation, eligibility, and how assessment data should be read.",
  },
  {
    slug: "advisor-low-incidence-disabilities",
    title: "Advisory Council Member, Low-Incidence Disabilities",
    kind: "advisory",
    status: "open",
    summary: "Advises on programming and service intensity for students with significant support needs.",
  },
  {
    slug: "advisor-education-policy-and-law",
    title: "Advisory Council Member, Education Policy and Law",
    kind: "advisory",
    status: "open",
    summary: "Advises on policy content and on how state regulation differs from the federal floor.",
  },
];

export function roleBySlug(slug: string): BoardRole | undefined {
  return BOARD_ROLES.find((role) => role.slug === slug);
}

export function rolePdf(role: BoardRole): string {
  return `/board-roles/${role.slug}.pdf`;
}

/** Route paths for the prerender pass and the sitemap. */
export const ROLE_ROUTES = BOARD_ROLES.map((role) => `/board/roles/${role.slug}`);
