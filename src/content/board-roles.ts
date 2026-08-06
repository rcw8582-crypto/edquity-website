/**
 * The board and advisory council role bank.
 *
 * These are POSITION DESCRIPTIONS, not job postings. Nothing in here may
 * reference the current recruitment round, how many seats are open, who is
 * seated, or which seat is a priority this year. That information belongs
 * on /board, which describes this moment and will be rewritten many times.
 * A description here should still be accurate and postable in 2031 with a
 * seat that has been filled twice since.
 *
 * The one temporal field is `status`, and it exists so a filled role stays
 * in the bank and stays readable rather than disappearing when the seat is
 * taken. Flip it to "filled" when someone is elected; do not delete the
 * entry, and do not rewrite the description around the person who holds it.
 *
 * Adding a role later means adding an entry here. The index page, the
 * individual role pages, the sitemap, and the prerender pass all read from
 * this array, so nothing else needs touching.
 */

export type RoleStatus = "open" | "filled";
export type RoleKind = "director" | "advisory";

export interface BoardRole {
  slug: string;
  title: string;
  kind: RoleKind;
  status: RoleStatus;
  /** One sentence for the index card and the meta description. */
  summary: string;
  /** Two or three sentences on why the seat exists. */
  purpose: string;
  responsibilities: string[];
  required: string[];
  preferred: string[];
  /** Only where a role carries duties beyond the shared commitment. */
  additionalCommitment?: string;
}

/**
 * Expectations every director carries regardless of seat. Held here rather
 * than repeated in ten descriptions, so a change to the meeting schedule is
 * one edit instead of ten.
 */
export const DIRECTOR_COMMON = {
  reportsTo: "The Board of Directors as a whole",
  term: "Three years, renewable. Directors are elected by the board and the election is recorded in the minutes.",
  compensation: "Unpaid volunteer position. We do not require a personal financial contribution, and no application is judged on whether someone can give.",
  timeCommitment: [
    "Six board meetings a year, held virtually, ninety minutes each",
    "Service on at least one standing committee, meeting monthly during a founding year and quarterly thereafter",
    "Roughly five to eight hours a month during a founding year, and around three hours a month once the organization is established",
  ],
  sharedResponsibilities: [
    "Advise on strategy and support the growth of the organization",
    "Serve as a subject matter expert in your field and contribute to programming",
    "Participate in fundraising by sharing our work with your network, making introductions, and helping identify potential contributors",
    "Present alongside the Executive Director at events and conferences when you are able",
    "Complete a conflict of interest disclosure each year and recuse yourself where it applies",
    "Keep board deliberations, applicant information, and family information confidential",
  ],
  boundary:
    "Board service does not involve working with families directly. Directors do not review individual cases, attend IEP meetings, or advise families about their children. The exception is volunteer activity at a conference or community event, where a director may talk with parents and explain what the organization offers.",
  provided: [
    "Orientation and an onboarding packet covering the bylaws, the conflict of interest policy, and the board agreement",
    "Meeting materials distributed in advance of every meeting",
    "Background check required",
  ],
} as const;

export const ADVISORY_COMMON = {
  reportsTo: "The Executive Director",
  term: "One year, renewable. Council members are appointed by the board and are not directors.",
  compensation: "Unpaid volunteer position. We do not require a personal financial contribution.",
  timeCommitment: [
    "Roughly two to four hours a quarter",
    "The council convenes twice a year, and the remaining work happens when a material needs your review",
  ],
  sharedResponsibilities: [
    "Review our materials before they reach families, checking that what we publish reflects current practice in your field",
    "Advise on workshop content and program design in your specialty",
    "Flag guidance that has gone out of date",
    "Present alongside the Executive Director at workshops and conferences if you would like to",
  ],
  boundary:
    "Council members do not consult on individual cases. We do not send you a child's file or ask you to advise a family. The exception is volunteer activity at a conference or community event, where a council member may talk with parents and explain what we offer.",
  provided: [
    "Orientation to our review methodology and the materials you will be asked to read",
    "Background check required",
  ],
  governanceNote:
    "Advisory council members hold no vote and carry no fiduciary duty. Under Article V of our bylaws, committee membership is limited to directors, so council members do not sit on board committees. They work with the Executive Director, and their input reaches the board through her report.",
} as const;

export const BOARD_ROLES: BoardRole[] = [
  {
    slug: "treasurer",
    title: "Treasurer",
    kind: "director",
    status: "open",
    summary: "Officer of the board responsible for financial oversight, the budget, and audit readiness.",
    purpose:
      "The Treasurer holds the board's financial oversight function and chairs the Finance Committee. The seat exists so that financial judgment sits with someone independent of the Executive Director, which is what makes the board's oversight real rather than nominal.",
    responsibilities: [
      "Oversee financial reporting, budgeting, and audit readiness",
      "Chair the Finance Committee",
      "Review monthly financial statements with the Executive Director",
      "Lead the annual budget process in partnership with the President and the Executive Director",
      "Structure restricted and unrestricted fund tracking for grant compliance",
      "Support Form 990 preparation and ensure it is filed on time each year",
      "Maintain financial policies covering expense reimbursement, signature authority, and reserve targets",
      "Report the financial position of the organization to the board at every meeting",
    ],
    required: [
      "Experience in nonprofit finance, public accounting, foundation grants management, or corporate finance",
      "No prior personal or financial relationship with the organization or its leadership, so the seat counts as independent",
      "Comfort reading and explaining financial statements to people who do not read them for a living",
    ],
    preferred: [
      "CPA licensure",
      "Experience with Form 990 preparation or review",
      "Experience building financial policy from scratch at an early-stage organization",
      "Lived experience as the parent or caregiver of a child with a disability",
    ],
    additionalCommitment:
      "A monthly finance check-in with the Executive Director, and additional hours during budget season and grant reporting cycles.",
  },
  {
    slug: "development-and-institutional-partnerships",
    title: "Development and Institutional Partnerships Director",
    kind: "director",
    status: "open",
    summary: "Chairs the Development Committee and leads the board's fundraising and institutional relationships.",
    purpose:
      "This seat carries the board's fundraising leadership and its understanding of how school systems buy. It exists because an organization that serves families for free has to raise what it spends, and because institutional services designed without knowledge of how districts budget do not get bought.",
    responsibilities: [
      "Chair the Development Committee",
      "Own the annual fundraising plan alongside the Executive Director",
      "Build and maintain the funder pipeline and the grant calendar",
      "Open doors to education foundations, school system leaders, and individual donors",
      "Advise the board on how school systems budget and procure, so institutional services match how districts operate",
      "Lead board participation in fundraising and hold other directors to it",
    ],
    required: [
      "Experience raising money, whether in development, grantmaking, or a role where you made asks and introductions",
      "A network you are willing to open on behalf of the organization",
    ],
    preferred: [
      "Experience with education funders specifically",
      "Background as a former special education director or district administrator",
      "Foundation or grantmaking experience",
      "Lived experience as the parent or caregiver of a child with a disability",
    ],
    additionalCommitment:
      "This seat carries no role in scoring and no preview of audit findings. The independence of our reviews is what makes them worth buying, and a fundraising relationship must never touch a finding. A director who currently works for a school system or a foundation we may approach is not disqualified, and recusal is defined in writing before they are seated.",
  },
  {
    slug: "secretary",
    title: "Secretary",
    kind: "director",
    status: "open",
    summary: "Officer of the board responsible for the governance record and corporate compliance.",
    purpose:
      "The Secretary keeps the organization's governance record accurate and its compliance current. The seat matters because minutes are evidence, and an organization that cannot produce its own record cannot demonstrate to a funder, an auditor, or a court that its board actually governed.",
    responsibilities: [
      "Maintain the official record of every board and committee meeting, covering agendas, minutes, attendance, and votes",
      "Distribute meeting notices, agendas, and supporting materials on time",
      "Serve as custodian of the governance documents, including the bylaws, the conflict of interest policy, and board resolutions",
      "Track director terms, committee assignments, and annual disclosures",
      "Maintain compliance with Tennessee nonprofit corporation law and 501(c)(3) reporting obligations",
      "Coordinate the annual board self-assessment and the onboarding of new directors",
      "Sign official corporate documents alongside the President as the bylaws require",
    ],
    required: [
      "Experience in nonprofit governance, corporate paralegal work, executive administration, project management, or organizational compliance",
      "Strong writing and close attention to detail",
      "Comfort with cloud-based document systems",
    ],
    preferred: [
      "Experience maintaining a governance library or corporate record",
      "Familiarity with state charitable registration and annual reporting",
      "Lived experience as the parent or caregiver of a child with a disability",
    ],
  },
  {
    slug: "family-law-or-disability-rights",
    title: "At-Large Director, Family Law or Disability Rights",
    kind: "director",
    status: "open",
    summary: "Brings legal and policy judgment to program design and the organization's compliance posture.",
    purpose:
      "This seat brings legal judgment to work that is built directly on federal law. It exists so that what we publish to families is accurate against current IDEA case law and state regulation, and so the board can see legal risk before it becomes a problem.",
    responsibilities: [
      "Advise on family-facing services, published guidance, and the organization's legal compliance posture",
      "Help shape program design so reviews and workshops reflect current IDEA case law and state special education regulation",
      "Review family-facing materials, including workshop curricula, report templates, and consent forms, for legal accuracy and accessibility",
      "Cultivate relationships with disability rights groups, family law clinics, and education advocacy networks",
      "Help the board identify legal and reputational risk early",
    ],
    required: [
      "Background in special education law, family law, disability rights advocacy, parent training and information centers, or IDEA dispute resolution",
      "Ability to translate legal requirements into language a family can act on",
    ],
    preferred: [
      "Current or former practice as an attorney, judge, or law school faculty member",
      "Leadership experience at an advocacy organization",
      "Experience as a parent advocate in IEP disputes",
      "Lived experience as the parent or caregiver of a child with a disability",
    ],
  },
  {
    slug: "parent-director",
    title: "Parent Director",
    kind: "director",
    status: "open",
    summary: "Brings the lived experience of the IEP process into every governance decision the board makes.",
    purpose:
      "A majority of this board must be parents of children with disabilities. That is a governance requirement rather than a gesture, and these seats hold it. The people who have sat on the wrong side of an IEP table should hold most of the votes over an organization built to serve them.",
    responsibilities: [
      "Bring the perspective of a family who has been through the IEP process into board decisions",
      "Review family-facing materials before they reach families",
      "Judge whether programs are reaching the families they are meant to reach",
      "Serve on a standing committee",
      "Refer other parents into the recruitment pipeline",
    ],
    required: [
      "Lived experience as the parent or caregiver of a child with a disability ages birth through 26",
    ],
    preferred: [
      "Experience with families whose circumstances differ from your own, whether by state, language, income, or disability category",
      "Willingness to learn the governance side, which we will teach",
    ],
    additionalCommitment:
      "No professional credential and no prior board service are required for this seat. If you have never served on a board, we will teach you what the role asks, and that is not a disadvantage in your application.",
  },
  {
    slug: "advisor-behavior-analysis",
    title: "Advisory Council Member, Behavior Analysis",
    kind: "advisory",
    status: "open",
    summary: "Advises on how behavior plans, functional assessments, and behavior goals are read and written.",
    purpose:
      "Behavior is where IEPs most often fail quietly, through plans that describe a child rather than teach one. This seat exists so our guidance to families about behavior plans reflects current practice rather than what was standard a decade ago.",
    responsibilities: [
      "Advise on how behavior intervention plans and functional behavior assessments should be read",
      "Review guidance and workshop content covering behavior goals and supports",
      "Flag where our materials misstate or oversimplify behavioral practice",
    ],
    required: [
      "Current certification as a Board Certified Behavior Analyst",
      "Experience with behavior planning in school settings",
    ],
    preferred: [
      "Experience working with families rather than only with schools",
      "Familiarity with how behavior appears in IEP documentation across states",
    ],
  },
  {
    slug: "advisor-speech-and-language",
    title: "Advisory Council Member, Speech and Language",
    kind: "advisory",
    status: "open",
    summary: "Advises on communication goals, speech and language services, and augmentative communication.",
    purpose:
      "Communication goals are among the most frequently written and least frequently measured parts of an IEP. This seat exists so our guidance about them is accurate and useful to a family reading their child's plan.",
    responsibilities: [
      "Advise on communication goals and how service minutes should be read",
      "Review guidance covering speech and language services and augmentative communication",
      "Flag where our materials misstate current practice in the field",
    ],
    required: [
      "Current licensure as a speech and language pathologist",
      "Experience delivering or supervising school-based services",
    ],
    preferred: [
      "Experience with augmentative and alternative communication",
      "Experience explaining services to families rather than only documenting them",
    ],
  },
  {
    slug: "advisor-school-psychology",
    title: "Advisory Council Member, School Psychology",
    kind: "advisory",
    status: "open",
    summary: "Advises on evaluation, eligibility, and how assessment data should be read.",
    purpose:
      "Evaluation is where a child's eligibility and services are decided, and it is the part of the process families understand least. This seat exists so our guidance about evaluations and psychoeducational reports is accurate.",
    responsibilities: [
      "Advise on evaluation practice, eligibility determination, and reevaluation",
      "Review guidance covering how families should read a psychoeducational report",
      "Flag where our materials misstate assessment practice or over-claim what data can show",
    ],
    required: [
      "Current credential or licensure as a school psychologist",
      "Experience conducting evaluations and writing psychoeducational reports",
    ],
    preferred: [
      "Experience with disproportionality in identification",
      "Experience with evaluation of multilingual learners",
    ],
  },
  {
    slug: "advisor-low-incidence-disabilities",
    title: "Advisory Council Member, Low-Incidence Disabilities",
    kind: "advisory",
    status: "open",
    summary: "Advises on programming and service intensity for students with significant support needs.",
    purpose:
      "Families of children with significant support needs are the least served by generic IEP guidance, and their plans carry the highest stakes. This seat exists so our work is usable by those families rather than written past them.",
    responsibilities: [
      "Advise on programming and service intensity for students with significant support needs",
      "Review guidance covering alternate assessment, related services, and placement",
      "Flag where our materials assume a student profile that does not fit these families",
    ],
    required: [
      "Substantial professional experience with students who have low-incidence disabilities",
    ],
    preferred: [
      "Experience across more than one disability category within this population",
      "Experience with transition planning for students with significant support needs",
    ],
  },
  {
    slug: "advisor-education-policy-and-law",
    title: "Advisory Council Member, Education Policy and Law",
    kind: "advisory",
    status: "open",
    summary: "Advises on policy content and how state regulation differs from the federal floor.",
    purpose:
      "Federal law sets a floor and every state builds differently on top of it. This seat exists so our state-specific guidance is right, because guidance that is accurate in one state and wrong in another is worse than no guidance at all.",
    responsibilities: [
      "Advise on policy content and on where state regulation exceeds or differs from the federal floor",
      "Review state-specific guidance before it is published to families",
      "Flag regulatory or case law changes that make published guidance out of date",
    ],
    required: [
      "Professional background in education policy research, education law, or special education regulation",
    ],
    preferred: [
      "Familiarity with more than one state's special education regulation",
      "Experience tracking regulatory change and its effect on practice",
    ],
  },
];

export function roleBySlug(slug: string): BoardRole | undefined {
  return BOARD_ROLES.find((role) => role.slug === slug);
}

/** Route paths for the prerender pass and the sitemap. */
export const ROLE_ROUTES = BOARD_ROLES.map((role) => `/board/roles/${role.slug}`);
