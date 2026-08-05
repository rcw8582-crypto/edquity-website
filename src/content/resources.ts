/**
 * The free resource library.
 *
 * Each entry gets its own page at /resources/<slug>. Before this existed, all
 * five PDFs sat behind a single card on /resources, which meant one indexable
 * page for the whole library and no way for a family searching "what do I bring
 * to an IEP meeting" to land on the worksheet that answers it. Every `body`
 * paragraph below describes what is actually in the file; nothing here is
 * aspirational copy.
 *
 * `related` carries slugs, so each page links to three others and no resource
 * page is a dead end.
 */

export type ResourceKind = "Worksheet" | "Reference card" | "Template";

export interface Resource {
  slug: string;
  title: string;
  kind: ResourceKind;
  /** One sentence. Used on the hub card and as the meta description base. */
  summary: string;
  /** The problem the resource solves, in the family's terms. 2 paragraphs. */
  body: string[];
  /** Section-by-section contents, taken from the file itself. */
  inside: string[];
  /** Practical guidance on when and how to use it. */
  howToUse: string;
  file: string;
  accent: string;
  related: string[];
}

export const RESOURCES: Resource[] = [
  {
    slug: "iep-meeting-notecatcher",
    title: "IEP Meeting Notecatcher",
    kind: "Worksheet",
    summary:
      "A printable worksheet for the meeting itself, with the three questions every family should ask and a before-you-sign checklist.",
    body: [
      "The school district arrives at your child's IEP meeting with a team and a folder of data. Most families arrive with a chair. That imbalance is not about intelligence or caring, it is about preparation, and preparation is the one part of the meeting entirely within your control.",
      "This worksheet is the plan you bring instead of nothing. It walks you through the night before, holds the notes you take while the team talks, and then slows you down at the end, when the pen is in your hand and the room is waiting. The sections that matter most are the last ones, because a signature is the moment your leverage ends.",
    ],
    inside: [
      "Meeting information: who is attending from the school team, and who is attending with you",
      "A documents checklist for what to bring, from the last two progress reports to your own dated observation notes",
      "Space to capture what the team says, section by section, as they say it",
      "A goal-by-goal tracker so no annual goal passes without discussion",
      "A commitments table that records who agreed to what, and by when",
      "A before-you-sign checklist for the decisions you make at the end",
    ],
    howToUse:
      "Print it and fill in the first two sections the night before, so you walk in already prepared rather than assembling your thoughts in the room. Bring a pen. Write while people talk, because a commitment nobody wrote down is a commitment that did not happen.",
    file: "/resources/EDATM_IEP_Meeting_Notecatcher.pdf",
    accent: "#EC4899",
    related: ["iep-eligibility-checklist", "iep-team-directory", "idea-vs-504"],
  },
  {
    slug: "iep-eligibility-checklist",
    title: "Pre-Evaluation Eligibility Checklist",
    kind: "Worksheet",
    summary:
      "Organize what you have observed and put it into a written evaluation request the school has to answer.",
    body: [
      "Under IDEA you have the right to request a special education evaluation in writing at any time, and the school has to respond on a timeline. Most families never learn this, and instead spend a year being told to wait and see while their child falls further behind.",
      "The hard part is not the right, it is the request. A vague concern is easy for a school to absorb and defer. A written request that names specific difficulties, references the school's own record, and asks for evaluation in every area of suspected disability is much harder to set aside.",
    ],
    inside: [
      "Part one: an educational impact checklist covering academics, communication, behavior, attention, peer relationships, and school avoidance",
      "Part two: a school history section for what the school has already tried and what came of it",
      "Part three: what your formal written request needs to contain, item by item",
      "The federal timeline context, with a note that specific deadlines vary by state",
    ],
    howToUse:
      "You do not need to check every box. Check what is true, then use what you checked as the evidence inside your written request. Date the request, keep a copy, and send it to both the principal and the district special education director.",
    file: "/resources/EDATM_IEP_Eligibility_Checklist.pdf",
    accent: "#22C55E",
    related: ["idea-vs-504", "idea-disability-categories", "iep-meeting-notecatcher"],
  },
  {
    slug: "idea-vs-504",
    title: "IDEA vs. Section 504",
    kind: "Reference card",
    summary:
      "A side-by-side comparison of the two laws, built around one question: does your child need different instruction, or better access to the same instruction?",
    body: [
      "Families are often told their child will get a 504 plan as though it were a lighter version of an IEP. It is not a lighter version, it is a different law. IDEA is federal special education law and it provides specialized instruction. Section 504 is federal civil rights law and it provides access and accommodations without specialized instruction.",
      "The difference shows up in the protections you hold as a parent. IDEA requires consent for evaluation and initial placement, an annual review at least every twelve months, prior written notice, and access to mediation and due process. Section 504 requires none of those at the federal level. Knowing which document your child is under tells you which rights you can actually invoke.",
    ],
    inside: [
      "A quick comparison table across what kind of law each is, what each provides, and who pays",
      "Eligibility criteria side by side: thirteen categories plus a need for specialized instruction, against the broader 504 definition",
      "Which protections apply to each, including consent, annual review, and procedural safeguards",
      "The decision question in plain terms, plus the four most common misconceptions corrected",
    ],
    howToUse:
      "Read the decision question first, then work back through the table. If your child needs instruction taught differently rather than the same instruction made more accessible, you are talking about IDEA, and you should say so in those words.",
    file: "/resources/EDATM_IDEA_vs_504_Reference_Card.pdf",
    accent: "#14B8A6",
    related: ["idea-disability-categories", "iep-eligibility-checklist", "iep-meeting-notecatcher"],
  },
  {
    slug: "idea-disability-categories",
    title: "The 13 IDEA Disability Categories",
    kind: "Reference card",
    summary:
      "All thirteen federally recognized categories in plain language, and why the category matters less than families are led to believe.",
    body: [
      "IDEA recognizes thirteen disability categories for eligibility. Families are often handed a category and told that it explains what their child will receive, which is not how the law works. Meeting a category is the starting point, not the end goal.",
      "What actually determines your child's program is the evaluation data, the present levels of performance written into the document, and your advocacy at the table. The category gets your child into the room. It does not decide what happens once they are there.",
    ],
    inside: [
      "All thirteen categories with a brief definition of each",
      "A notes-for-parents column on each category, including which ones are commonly underidentified",
      "Practical distinctions families run into, such as deafness against hearing impairment, and the age limits on developmental delay",
      "The separation between a medical diagnosis and educational eligibility, which are two different determinations",
    ],
    howToUse:
      "Use it to check whether the category on your child's paperwork matches what the evaluation actually found, and to push back if a category is being used to narrow what your child is offered.",
    file: "/resources/EDATM_13_IDEA_Disability_Categories.pdf",
    accent: "#8B5CF6",
    related: ["idea-vs-504", "iep-eligibility-checklist", "iep-team-directory"],
  },
  {
    slug: "iep-team-directory",
    title: "IEP Team Member Directory",
    kind: "Template",
    summary:
      "One place for every name, role, and contact on your child's team, plus a tracker for every call and email.",
    body: [
      "Advocacy runs on knowing who to contact and at what level. Families frequently spend weeks going back and forth with a case manager on a question only the district special education director can answer, and the delay reads as the school being unresponsive when it is really a routing problem.",
      "This template puts the whole team in one place, sorted by level, so you can escalate deliberately rather than hoping the right person eventually sees your email. The communication tracker at the back is the other half of it, because a paper trail you can produce on request changes how a district talks to you.",
    ],
    inside: [
      "Your child's school team: case manager, general and special education teachers, principal, psychologist, related service providers, LEA representative, and aides",
      "District-level contacts: special education director, assistant superintendent, superintendent, board liaison, and the district complaint coordinator",
      "Your own support team: advocate, attorney, private evaluator, therapist, pediatrician, and your state Parent Training and Information Center",
      "A communication tracking table for the date, the person, the topic or decision, and the follow-up owed",
    ],
    howToUse:
      "Fill it in once at the start of the school year and bring it to every meeting. Log every contact the same day, while you still remember what was said, and print extra copies of the tracking page as the year fills up.",
    file: "/resources/EDATM_IEP_Team_Directory.pdf",
    accent: "#FBBF24",
    related: ["iep-meeting-notecatcher", "idea-disability-categories", "iep-eligibility-checklist"],
  },
];

export function getResource(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

export function getRelated(resource: Resource): Resource[] {
  return resource.related
    .map((slug) => getResource(slug))
    .filter((r): r is Resource => Boolean(r));
}
