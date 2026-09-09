// Single source of truth for the EDquity definition.
//
// The word is our own coinage, so every surface that quotes it has to quote it
// identically. A definition repeated from memory across a page, a report cover,
// a one-pager and an email signature drifts into several definitions, and a
// term with several definitions is not a term. Import from here instead of
// retyping, the same way every booking link comes from src/lib/booking.ts.
//
// Revised 2026-09-09, and the revision is a correction of principle rather than
// a rewording. Both previous versions built the definition out of measurement:
// one standard, an assessor with no stake, a finding that reaches someone. That
// made the word describe this organization's method, so the term only held if
// this organization existed, and the access number it yielded counted our own
// service reaching families. A construct that reads zero everywhere until one
// nonprofit arrives is a product metric wearing a definition's clothes.
//
// EDquity now names a condition of the world. A school meets it or fails it
// whether or not anyone reads its documents, and any party can pursue it. The
// audit, the rubric, the Fellowship and the family reports describe how we
// pursue the condition, and they live outside the definition. Everything the
// old file held about measurement stays recoverable with
// `git show HEAD~1:src/lib/edquity.ts` and belongs on the methodology page.

/* ================================================================== *
 * PART ONE: THE DEFINITION.
 *
 * Nothing in this section names this organization, an instrument, or a
 * price. Anyone may use it, cite it, or apply it to their own system.
 * ================================================================== */

/** The headword, as it is always set: capital E, capital D, lowercase rest. */
export const EDQUITY_TERM = "EDquity";

export const EDQUITY_PRONUNCIATION = "/ˈɛd.kwɪ.ti/";

export const EDQUITY_PART_OF_SPEECH = "noun";

/**
 * Sense 1, the condition. The canonical definition and the one to use when
 * only one will fit.
 *
 * Quality holds the subject position on purpose. What a child receives should
 * follow from that child's need, so a definition saying what a child receives
 * must not depend on disability would forbid the very thing disability law
 * requires. Quality is the thing that must never vary.
 *
 * "Intersecting identities and circumstances" carries Crenshaw (1989) and
 * covers income and geography, which read as circumstance rather than
 * identity. "Including" keeps the list open, since a closed enumeration would
 * imply these seven items exhaust the question.
 */
export const EDQUITY_DEFINITION =
  "A condition in which the quality of the education a child receives is not dependent on the child's intersecting identities and circumstances, including race, ethnicity, national origin, family income, home language, disability, or where the child lives.";

/**
 * Sense 2, the property. Use it where a reader needs the term to hold by
 * degree rather than all at once, which is most institutional writing: a
 * system is closer to the condition or further from it.
 */
export const EDQUITY_DEFINITION_PROPERTY =
  "A school, district, or state holds EDquity to the degree that the quality of the education it provides does not vary based on the child's intersecting identities and circumstances.";

/** Sense 3, the proper noun. */
export const EDQUITY_DEFINITION_ORGANIZATION =
  "The organization that does this.";

/**
 * The family-facing paraphrase, for spoken use and for surfaces where the
 * formal definition would read as stiff: intake email, table signage, the
 * opening of a workshop. It restores the need limb, which families hear
 * first.
 */
export const EDQUITY_DEFINITION_PLAIN =
  "Your child gets what they need, and the quality of what they get does not depend on your race, your income, the language you speak at home, or where you live.";

/* ------------------------------------------------------------------ *
 * Where the term sits in the field.
 * ------------------------------------------------------------------ */

/**
 * The two dimensions education equity rests on (Field, Kuczera, & Pont, 2007).
 * Our test operationalizes them, so the test has the shape it has because of
 * this pair. Quoted before the coinage wherever a reader needs to know we work
 * inside an established construct rather than inventing a private one.
 */
export const EDUCATION_EQUITY_DIMENSIONS: ReadonlyArray<{
  name: string;
  body: string;
}> = [
  {
    name: "Fairness",
    body: "Personal and social circumstances such as race, income, language, or disability do not stand between a student and their educational potential.",
  },
  {
    name: "Inclusion",
    body: "A basic minimum standard of education is shared by every student, whatever their background, characteristics, or location.",
  },
];

/**
 * What the coinage contributes, stated plainly so nobody has to guess whether
 * the word competes with education equity or belongs to it.
 */
export const EDQUITY_RELATION =
  "EDquity names education equity as a single noun, and it holds the individual child rather than a group average at its center.";

/* ------------------------------------------------------------------ *
 * The test.
 * ------------------------------------------------------------------ */

/**
 * The four conditions that have to hold together. No prediction states
 * fairness and common floor states inclusion (Field, Kuczera, & Pont, 2007).
 * The other two hold the individual child where a policy phrase would hold a
 * group average.
 *
 * No prediction reads as identities in combination rather than as a list of
 * single characteristics, because a single-axis test would pass a system that
 * serves Black students adequately and girls adequately while failing Black
 * girls with disabilities (Crenshaw, 1989).
 */
export const EDQUITY_TEST: ReadonlyArray<{ name: string; body: string }> = [
  {
    name: "Need met",
    body: "What a child receives answers that child's need, rather than what the system routinely offers.",
  },
  {
    name: "No prediction",
    body: "No single identity or circumstance, and no combination of them, predicts the quality of the education a child receives.",
  },
  {
    name: "Common floor",
    body: "Every child holds the same minimum standard of education, whatever their background, characteristics, or location.",
  },
  {
    name: "Institution absorbs",
    body: "The system changes its own practice to meet the need, rather than asking the child or the family to make up the difference.",
  },
];

/* ------------------------------------------------------------------ *
 * Etymology and derived forms.
 * ------------------------------------------------------------------ */

export const EDQUITY_ETYMOLOGY_SHORT =
  "ED (education) + equity, fused rather than hyphenated.";

export const EDQUITY_ETYMOLOGY =
  "Equity spoken without a domain attached stays a value that everyone endorses and nobody has to act on. Education spoken without equity attached describes a system that already serves some children well. Fused, the word names one condition in the domain where a child's future gets settled.";

/** Derived forms, so they stay consistent wherever they appear. */
export const EDQUITY_DERIVED: ReadonlyArray<{
  term: string;
  partOfSpeech: string;
  body: string;
}> = [
  {
    term: "EDquitable",
    partOfSpeech: "adjective",
    body: "Describing a system in which the quality of a child's education does not vary based on the child's intersecting identities and circumstances.",
  },
  {
    term: "EDquity gap",
    partOfSpeech: "noun",
    body: "The distance between what a child needs and what the child receives.",
  },
];

/**
 * The gap kept under its own name, because it is the figure quoted on its own
 * and the derived-forms array is not always the right shape for a page.
 */
export const EDQUITY_GAP = EDQUITY_DERIVED[1].body;

/* ------------------------------------------------------------------ *
 * What the word rules out.
 * ------------------------------------------------------------------ */

/**
 * A definition earns its keep by excluding things, so these sit beside it.
 *
 * The measurement exclusion is the load-bearing one. It states in the
 * definition itself that measurement is how a party learns where a system
 * stands, and never what the condition consists of. Removing it would let the
 * old method-shaped definition back in.
 */
export const EDQUITY_EXCLUSIONS: ReadonlyArray<string> = [
  "It does not mean equal treatment, since identical service delivered to unequal need reproduces the gap it was meant to close.",
  "It does not mean equal opportunity by itself, since a chance that only some families can act on has not been distributed.",
  "It does not mean measurement, since a school meets this condition or fails it whether or not anyone reads its documents.",
  "It does not ask the child or the family to change, since the practice that produced the shortfall is what changes.",
];

/* ------------------------------------------------------------------ *
 * Attribution.
 * ------------------------------------------------------------------ */

/**
 * Sources for the framing, in APA, alphabetical. Rendered on the definition
 * page so the construct is attributable rather than asserted. Page ranges want
 * a check against the articles themselves before any of this reaches a funder.
 */
export const EDQUITY_SOURCES: ReadonlyArray<string> = [
  "Crenshaw, K. (1989). Demarginalizing the intersection of race and sex: A Black feminist critique of antidiscrimination doctrine, feminist theory and antiracist politics. University of Chicago Legal Forum, 1989(1), 139–167.",
  "Field, S., Kuczera, M., & Pont, B. (2007). No more failures: Ten steps to equity in education. OECD Publishing.",
  "National Equity Project. (n.d.). Educational equity definition. https://www.nationalequityproject.org/education-equity-definition",
];

/**
 * Search-result description. Deliberately shorter than EDQUITY_DEFINITION,
 * which runs past the length Google will show, and kept here so the page does
 * not end up holding a second copy of the definition that can drift.
 */
export const EDQUITY_META_DESCRIPTION =
  "EDquity: the condition in which the quality of a child's education does not depend on the child's intersecting identities and circumstances.";

/** Canonical path of the definition page, for links from other surfaces. */
export const EDQUITY_DEFINITION_URL = "/edquity";

/* ================================================================== *
 * PART TWO: OUTSIDE THE DEFINITION.
 *
 * This organization's own position. It renders beside the entry and it is
 * not part of the word. Anything method-shaped belongs here or on the
 * methodology page, never above this line.
 * ================================================================== */

/**
 * The fence, rendered on the page so a reader can see that the term does not
 * depend on us. A term requiring its author to exist cannot be adopted, cited,
 * or outlive them.
 */
export const EDQUITY_FENCE =
  "Independent audits, the rubric, the Fellowship, and the family reports are how Edquity at the Margins pursues this condition, and none of it belongs in the word itself. A term that required this organization to exist could not be used by anyone else, cited by anyone else, or outlive it.";

/**
 * What the organization does about the condition, in one sentence. This governs
 * program design, and it is a statement of our work rather than a sense of the
 * word.
 */
export const EDATM_EQUITY_STATEMENT =
  "Equitable outcomes for students, produced by supporting families, educators, and students directly.";
