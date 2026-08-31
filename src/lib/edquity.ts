// Single source of truth for the EDquity definition.
//
// The word is our own coinage, so every surface that quotes it has to quote it
// identically. A definition repeated from memory across a page, a report cover,
// a one-pager and an email signature drifts into several definitions, and a
// term with several definitions is not a term. Import from here instead of
// retyping, the same way every booking link comes from src/lib/booking.ts.
//
// Revised 2026-08-30. The previous version defined the word entirely around a
// family finding out what their child's program is worth, which left student
// and educator programming outside the definition and disclaimed any claim on
// outcomes. Education equity is the removal of the predictability of outcomes,
// so the definition now carries the outcome and runs through all three pillars.

/** The headword, as it is always set: capital E, capital D, lowercase rest. */
export const EDQUITY_TERM = "EDquity";

export const EDQUITY_PRONUNCIATION = "/ˈɛd.kwɪ.ti/";

export const EDQUITY_PART_OF_SPEECH = "noun";

/* ------------------------------------------------------------------ *
 * The construct we work inside.
 * ------------------------------------------------------------------ */

/**
 * Education equity as the field defines it. Quoted before the coinage on any
 * surface where a reader needs to know we are working inside an established
 * construct rather than inventing a private one.
 */
export const EDUCATION_EQUITY_CONSTRUCT =
  "Education equity is the condition in which a student's circumstances do not obstruct what they are able to achieve, in which every student holds a common minimum standard of education regardless of background or location, and in which institutions change their own practice rather than asking children and families to absorb the difference.";

/**
 * The two dimensions the construct rests on (Field, Kuczera, & Pont, 2007).
 * Our four-part test below is these two dimensions made operational, which is
 * the reason the test has the shape it has.
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
 * What the organization does about it, in one sentence. This is the line that
 * governs program design, and every pillar below reports to it.
 */
export const EDATM_EQUITY_STATEMENT =
  "Equitable outcomes for students, produced by supporting families, educators, and students directly.";

/**
 * What counts as an outcome, stated concretely so the word does not float.
 * Kept specific because the standing criticism of equity definitions is that
 * they name an end state without naming anything you could check.
 */
export const EDQUITY_OUTCOME =
  "Measurable academic and functional progress written into the program and actually delivered, graduation with a regular diploma, and the postsecondary goals federal law requires the program to work toward.";

/* ------------------------------------------------------------------ *
 * The senses.
 * ------------------------------------------------------------------ */

/**
 * Sense 1, the condition. The canonical definition and the one to use when
 * only one will fit.
 *
 * It names all three pillars, because the strength of a program is determined
 * by what a family can pay for, what an educator was trained to see, and
 * whether the student was ever brought into the room.
 */
export const EDQUITY_DEFINITION =
  "The condition in which the strength of a child's education program does not depend on what their family can pay, on what their educator was trained to notice, or on whether the child was ever told what the program says about them.";

/**
 * Sense 2, the practice. Use it on institutional surfaces: the Fellowship, the
 * IEP Quality Improvement Program, teacher professional development, funder
 * materials.
 *
 * The closing clause is the outcome limb. Measurement is the mechanism here,
 * not the end.
 */
export const EDQUITY_DEFINITION_PRACTICE =
  "The practice of measuring every education program against one evidence-based standard, applied by someone with nothing to gain from the result, so that the difference between what one child receives and what another receives shows as a number a school can be asked to close.";

/** Sense 3, the proper noun. */
export const EDQUITY_DEFINITION_ORGANIZATION =
  "The organization that does this.";

/**
 * The family-facing paraphrase, for spoken use and for surfaces where the
 * formal definition would read as stiff: intake email, table signage, the
 * opening of a workshop.
 */
export const EDQUITY_DEFINITION_PLAIN =
  "You get to know how strong your child's program is, measured the same way it would be measured for a family who could afford to hire someone, finding out costs you nothing, and you leave knowing what to ask the school to change.";

/* ------------------------------------------------------------------ *
 * The three pillars. Each names who we support, the condition that holds when
 * the support lands, and the outcome that condition serves. Use the sense that
 * matches the surface: the family sense on family surfaces, the educator sense
 * on district and PD surfaces, the student sense on Pathways, Scholars, and
 * the Playbook.
 * ------------------------------------------------------------------ */

export const EDQUITY_PILLARS: ReadonlyArray<{
  pillar: string;
  condition: string;
  outcome: string;
  measure: string;
}> = [
  {
    pillar: "Families",
    condition:
      "Every family can find out how strong their child's education program is, judged against one standard, by someone with nothing to gain from the answer, without paying for the privilege.",
    outcome:
      "So that a family's race, income, or language stops predicting the strength of the program their child receives.",
    measure:
      "The share of families in a system whose child's program has been evaluated against a common standard by an independent party, at no cost to the family.",
  },
  {
    pillar: "Educators",
    condition:
      "The people who write education programs hold the same standard the reviewer holds, before any program reaches a family, and the systems that employ them read their own documents the way an outside party would read them.",
    outcome:
      "So that practitioners and systems can see and interrupt the patterns in their own practice that produce weaker programs for some children than for others, rather than attributing the difference to the children or their families.",
    measure:
      "The share of practitioners who have read their own written programs against the standard before those programs go to families, and the trend across a system's own documents year over year.",
  },
  {
    pillar: "Students",
    condition:
      "A student knows what their own program is meant to do for them, can say it in their own words, and takes part in the decisions that set it.",
    outcome:
      "So that the student's own gifts, interests, and goals shape what the program asks of them, and so that they keep the capacity to direct their own education after the program ends.",
    measure:
      "The share of students who can state their own goals and accommodations along with the reason for each, and who attended and spoke at the meeting that set them.",
  },
];

/**
 * The family sense kept under its own name, because family surfaces need the
 * cost clause carrying the sentence and the pillar array is not always the
 * right shape for a page.
 */
export const EDQUITY_DEFINITION_FAMILY = EDQUITY_PILLARS[0].condition;
export const EDQUITY_DEFINITION_EDUCATOR = EDQUITY_PILLARS[1].condition;
export const EDQUITY_DEFINITION_STUDENT = EDQUITY_PILLARS[2].condition;

/** The student paraphrase, addressed to the student directly. */
export const EDQUITY_DEFINITION_STUDENT_PLAIN =
  "You know what your program is supposed to do for you, you can explain it yourself, and you sit at the table where it gets decided.";

/* ------------------------------------------------------------------ *
 * The test.
 * ------------------------------------------------------------------ */

/**
 * The four conditions that have to hold together. The first two operationalize
 * inclusion, the third operationalizes fairness (Field, Kuczera, & Pont, 2007),
 * and the fourth keeps the definition from resting at information: a finding
 * that changes nothing about what a child receives has not produced equity.
 */
export const EDQUITY_TEST: ReadonlyArray<{ name: string; body: string }> = [
  {
    name: "One standard",
    body: "The same instrument reads every program, and it does not change according to who asked for the reading.",
  },
  {
    name: "No stake",
    body: "Whoever scores the program gains nothing from the score, so neither the school that wrote it nor the family that received it produces the finding.",
  },
  {
    name: "No toll",
    body: "Nothing the person cannot control stands between them and the finding. Price gates a family, exclusion from the meeting gates a student, and evaluation risk gates an educator.",
  },
  {
    name: "Something changes",
    body: "The finding reaches someone with the standing to act on it, and either the program changes or the reason it did not is on the record.",
  },
];

/**
 * What the toll looks like for each stakeholder. The test does not vary, so
 * this is the piece that lets one definition run across three pillars.
 */
export const EDQUITY_TOLLS: ReadonlyArray<{
  stakeholder: string;
  toll: string;
}> = [
  {
    stakeholder: "Family",
    toll: "Price, so a rigorous read reaches families who can buy one and a reassurance reaches everyone else.",
  },
  {
    stakeholder: "Educator",
    toll: "Evaluation risk, so the standard arrives as a judgment of the practitioner instead of a tool they can use.",
  },
  {
    stakeholder: "Student",
    toll: "Exclusion from the table, so the program is decided about the student rather than with them.",
  },
  {
    stakeholder: "System",
    toll: "Reputational cost, so a system measures only what it expects to look good measuring.",
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
    body: "Describing a system in which families, educators, and students can all evaluate what a child actually received, and in which what they find changes what comes next.",
  },
  {
    term: "EDquity gap",
    partOfSpeech: "noun",
    body: "The distance between what a family can find out for free and what a paying family can find out.",
  },
];

/* ------------------------------------------------------------------ *
 * What it counts.
 * ------------------------------------------------------------------ */

/**
 * The access number, quoted in funder materials. Retained under its original
 * name because the report cover and the one-pager already carry it.
 */
export const EDQUITY_GAP_MEASURE =
  "The share of families in a system whose child's education program has been evaluated against a common standard by an independent party, at no cost to the family.";

/**
 * The master test of the construct. Fairness is the claim that circumstances
 * do not obstruct achievement, so the number that tests it is whether you can
 * predict program strength from who the child is. It is computable from audit
 * scores across a caseload, and it is the question at the center of the
 * research agenda as well as the definition.
 */
export const EDQUITY_PREDICTABILITY_MEASURE =
  "Whether the strength of a child's education program can be predicted from the child's race, family income, home language, or school.";

/**
 * The outcome number. Stated as a change in the document and in service
 * delivery, because the finding itself is not the outcome and the organization
 * does not deliver the change: the family acts, and the school changes.
 */
export const EDQUITY_CHANGE_MEASURE =
  "The share of flagged indicators that appear as added or corrected content at the next review, and the share of programs whose services changed as a result.";

/**
 * All four numbers together, for pages and funder materials that report them
 * as a set rather than singly.
 */
export const EDQUITY_MEASURES: ReadonlyArray<{
  name: string;
  question: string;
  measure: string;
}> = [
  {
    name: "Access",
    question:
      "Who can find out how strong their child's program is without paying for the answer?",
    measure: EDQUITY_GAP_MEASURE,
  },
  {
    name: "Predictability",
    question: "Can you predict the strength of a program from who the child is?",
    measure: EDQUITY_PREDICTABILITY_MEASURE,
  },
  {
    name: "Practice",
    question:
      "Do the people who write the programs hold the standard before a family sees the document?",
    measure: EDQUITY_PILLARS[1].measure,
  },
  {
    name: "Change",
    question: "Did the finding change what the child actually receives?",
    measure: EDQUITY_CHANGE_MEASURE,
  },
];

/**
 * What the word does not mean. Kept beside the definition because a definition
 * earns its keep by excluding things.
 *
 * Revised 2026-08-30. The previous three exclusions disclaimed equal outcomes
 * and equal resources and placed the term earlier than both, which put EDquity
 * beside education equity rather than inside it. These exclusions rule out the
 * substitutes for equity instead of ruling out equity itself.
 */
export const EDQUITY_EXCLUSIONS: ReadonlyArray<string> = [
  "It does not mean equal treatment, since identical service delivered to unequal need reproduces the gap it was meant to close.",
  "It does not mean equal opportunity on its own, since a chance that only some families have the information to act on has not actually been distributed.",
  "It does not ask the child or the family to change, since the practice that produced the weaker program is what has to change.",
  "It does not stop at the finding, since a finding that changes nothing about what a child receives has produced information rather than equity.",
];

/**
 * Sources for the construct, in APA. Rendered on the definition page so the
 * framing is attributable rather than asserted.
 */
export const EDQUITY_SOURCES: ReadonlyArray<string> = [
  "Field, S., Kuczera, M., & Pont, B. (2007). No more failures: Ten steps to equity in education. OECD Publishing.",
  "National Equity Project. (n.d.). Educational equity definition. https://www.nationalequityproject.org/education-equity-definition",
];

/**
 * Search-result description. Deliberately shorter than EDQUITY_DEFINITION,
 * which runs past the length Google will show, and kept here so the page does
 * not end up holding a second copy of the definition that can drift.
 */
export const EDQUITY_META_DESCRIPTION =
  "EDquity: the condition in which the strength of a child's education program does not depend on what a family can pay, what an educator was trained to notice, or whether the child was ever told what it says.";

/** Canonical path of the definition page, for links from other surfaces. */
export const EDQUITY_DEFINITION_URL = "/edquity";
