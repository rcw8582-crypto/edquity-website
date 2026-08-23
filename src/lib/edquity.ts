// Single source of truth for the EDquity definition.
//
// The word is our own coinage, so every surface that quotes it has to quote it
// identically. A definition repeated from memory across a page, a report cover,
// a one-pager and an email signature drifts into several definitions, and a
// term with several definitions is not a term. Import from here instead of
// retyping, the same way every booking link comes from src/lib/booking.ts.

/** The headword, as it is always set: capital E, capital D, lowercase rest. */
export const EDQUITY_TERM = "EDquity";

export const EDQUITY_PRONUNCIATION = "/ˈɛd.kwɪ.ti/";

export const EDQUITY_PART_OF_SPEECH = "noun";

/**
 * Sense 1, the condition. This is the canonical definition and the one to use
 * when only one will fit.
 *
 * Use it on family-facing surfaces. It names cost as the barrier, which is the
 * true and load-bearing part for a parent deciding whether to trust a free
 * service.
 */
export const EDQUITY_DEFINITION =
  "The condition in which every family can find out how strong their child's education plan is, judged against one standard, by someone with nothing to gain from the answer, without paying for the privilege.";

/**
 * Sense 2, the practice.
 *
 * Use it on institutional surfaces: the Fellowship, the IEP Quality Improvement
 * Program, teacher professional development, funder materials. A special
 * education director cares that the instrument stays constant, and running
 * sense 1 at a district slightly implies the district is the one charging.
 */
export const EDQUITY_DEFINITION_PRACTICE =
  "The practice of measuring education plans against a single evidence-based standard regardless of who requests the review.";

/** Sense 3, the proper noun. */
export const EDQUITY_DEFINITION_ORGANIZATION =
  "The organization that does this.";

/**
 * The family-facing paraphrase, for spoken use and for surfaces where the
 * formal definition would read as stiff: intake email, table signage, the
 * opening of a workshop.
 */
export const EDQUITY_DEFINITION_PLAIN =
  "You get to know how strong your child's plan is, measured the same way it would be measured for a family who could afford to hire someone, and finding out costs you nothing.";

/**
 * The three conditions that have to hold together. Sense 1 is satisfied only
 * when all three are true, which is what makes the definition testable rather
 * than aspirational.
 */
export const EDQUITY_TEST: ReadonlyArray<{ name: string; body: string }> = [
  {
    name: "One standard",
    body: "The same instrument reads every plan, and it does not change according to who asked for the reading.",
  },
  {
    name: "No stake",
    body: "Whoever scores the plan gains nothing from the score, so neither the school that wrote it nor the family that received it produces the finding.",
  },
  {
    name: "No toll",
    body: "The finding reaches the family whether or not they can pay. Price may gate representation, continuity, or training, and it never gates the finding itself.",
  },
];

export const EDQUITY_ETYMOLOGY_SHORT = "ED (education) + equity, fused rather than hyphenated.";

export const EDQUITY_ETYMOLOGY =
  "Education handed over without the means to evaluate it produces documents nobody outside the institution can check. Equity asserted without education attached to it stays abstract, a value rather than a measurement. Neither half works alone, which is why the word does not come apart.";

/** Derived forms, so they stay consistent wherever they appear. */
export const EDQUITY_DERIVED: ReadonlyArray<{
  term: string;
  partOfSpeech: string;
  body: string;
}> = [
  {
    term: "EDquitable",
    partOfSpeech: "adjective",
    body: "Describing a system in which families can evaluate what their children actually received.",
  },
  {
    term: "EDquity gap",
    partOfSpeech: "noun",
    body: "The distance between what a family can find out for free and what a paying family can find out.",
  },
];

/**
 * The number the definition yields. Quoted in funder materials, where the
 * standing critique of equity definitions is that they name an end state
 * without naming anything countable.
 */
export const EDQUITY_GAP_MEASURE =
  "The share of families in a system whose child's plan has been evaluated against a common standard by an independent party, at no cost to the family.";

/**
 * What the word does not claim. Kept alongside the definition because a
 * definition earns its keep by excluding things, and these three exclusions are
 * what keep ours from collapsing into the broad, unfalsifiable definitions the
 * field already has too many of.
 */
export const EDQUITY_EXCLUSIONS: ReadonlyArray<string> = [
  "It makes no claim about equal outcomes, so two children with equally strong plans may progress differently.",
  "It makes no claim about equal resources, since a system can distribute unevenly and still satisfy the test, or distribute evenly and fail it.",
  "It sits earlier than both, because it names the condition that makes any claim about outcomes or resources checkable.",
];

/**
 * Search-result description. Deliberately shorter than EDQUITY_DEFINITION,
 * which runs past the length Google will show, and kept here so the page does
 * not end up holding a second copy of the definition that can drift.
 */
export const EDQUITY_META_DESCRIPTION =
  "EDquity: knowing how strong your child's education plan is, judged against one standard, by someone with nothing to gain, at no cost to you.";

/** Canonical path of the definition page, for links from other surfaces. */
export const EDQUITY_DEFINITION_URL = "/edquity";
