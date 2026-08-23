import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";

import {
  EDQUITY_TERM,
  EDQUITY_PRONUNCIATION,
  EDQUITY_PART_OF_SPEECH,
  EDQUITY_DEFINITION,
  EDQUITY_DEFINITION_PRACTICE,
  EDQUITY_DEFINITION_ORGANIZATION,
  EDQUITY_DEFINITION_PLAIN,
  EDQUITY_TEST,
  EDQUITY_ETYMOLOGY_SHORT,
  EDQUITY_ETYMOLOGY,
  EDQUITY_DERIVED,
  EDQUITY_GAP_MEASURE,
  EDQUITY_EXCLUSIONS,
} from "@/lib/edquity";
import { PORTAL_REGISTER_URL } from "@/lib/booking";

/**
 * The canonical home of the term. Every other surface that quotes the
 * definition links here, and the text itself comes from src/lib/edquity.ts so
 * this page can never drift from the report cover or the one-pager.
 *
 * Deliberately free of scroll-triggered animation. The definition is the whole
 * point of the page, so it must not depend on an IntersectionObserver firing:
 * with MotionConfig reducedMotion="user", a visitor who prefers reduced motion
 * never receives the whileInView target and would read a blank panel.
 *
 * Structured as a dictionary entry rather than an essay on purpose. A coinage
 * is easier to adopt when it is presented as a word with senses than as an
 * argument to be agreed with, and the entry form is what makes it quotable.
 */
export default function Edquity() {
  const senses = [
    { n: 1, body: EDQUITY_DEFINITION },
    { n: 2, body: EDQUITY_DEFINITION_PRACTICE },
    { n: 3, body: EDQUITY_DEFINITION_ORGANIZATION, note: "proper" },
  ];

  return (
    <div className="pt-20">
      <PageMeta
        title="EDquity: A Definition of Equity You Can Measure"
        description="EDquity is the condition in which every family can find out how good their child's education plan is, judged against one standard, by someone with nothing to gain from the answer, without paying for the privilege."
      />

      {/* The entry itself, set as the hero because the definition is the page */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-8">
            A definition
          </p>

          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-3">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              {EDQUITY_TERM}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/60 font-mono">
              {EDQUITY_PRONUNCIATION}
            </p>
            <p className="text-lg md:text-xl italic text-primary-foreground/60">
              {EDQUITY_PART_OF_SPEECH}
            </p>
          </div>

          <div className="h-px bg-primary-foreground/20 my-8" />

          <ol className="space-y-7">
            {senses.map((sense) => (
              <li key={sense.n} className="flex gap-5">
                <span className="text-accent font-black text-xl shrink-0 leading-relaxed">
                  {sense.n}.
                </span>
                <p className="text-lg md:text-2xl leading-relaxed">
                  {sense.note && (
                    <span className="italic text-primary-foreground/55 mr-2">
                      ({sense.note})
                    </span>
                  )}
                  {sense.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The test: what makes the definition falsifiable rather than aspirational */}
      <section className="bg-background">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">
            The test
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            Sense 1 holds only when all three of these are true at once. Any one
            of them failing is enough to say a system does not have it.
          </p>

          <div className="border-t border-border">
            {EDQUITY_TEST.map((condition) => (
              <div
                key={condition.name}
                className="flex flex-col md:flex-row gap-4 md:gap-10 border-b border-border py-8"
              >
                <h3 className="text-xl font-bold text-primary md:w-56 shrink-0">
                  {condition.name}
                </h3>
                <p className="text-base md:text-lg text-foreground leading-relaxed flex-1">
                  {condition.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Etymology */}
      <section className="bg-muted/40">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight">
            Etymology
          </h2>
          <p className="text-xl md:text-2xl font-semibold text-primary mb-6 leading-snug">
            {EDQUITY_ETYMOLOGY_SHORT}
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            {EDQUITY_ETYMOLOGY}
          </p>
        </div>
      </section>

      {/* Plain-language version */}
      <section className="bg-background">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-ink mb-4">
            Said plainly, to a family
          </p>
          <blockquote className="border-l-4 border-accent pl-6 md:pl-8">
            <p className="text-xl md:text-3xl font-semibold text-primary leading-snug">
              {EDQUITY_DEFINITION_PLAIN}
            </p>
          </blockquote>
        </div>
      </section>

      {/* What it excludes, and the number it yields */}
      <section className="bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 leading-tight">
              What the word does not mean
            </h2>
            <ul className="space-y-4">
              {EDQUITY_EXCLUSIONS.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 shrink-0" />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 leading-tight">
              What it counts
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Definitions of equity are usually criticized for naming an end
              state without naming anything countable. This one yields a figure
              you can compute for a school, a district, or a state, this year.
            </p>
            <div className="bg-primary text-primary-foreground rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
                The EDquity gap
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                {EDQUITY_GAP_MEASURE}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Derived forms */}
      <section className="bg-muted/40">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 leading-tight">
            Derived forms
          </h2>
          <div className="space-y-8">
            {EDQUITY_DERIVED.map((form) => (
              <div key={form.term} className="border-l-2 border-border pl-6">
                <p className="text-xl font-bold text-primary mb-1">
                  {form.term}{" "}
                  <span className="text-base font-normal italic text-muted-foreground">
                    {form.partOfSpeech}
                  </span>
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {form.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where the standard comes from, and how to get the measurement */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            The instrument behind the definition
          </h2>
          <p className="text-lg text-primary-foreground/75 leading-relaxed mb-4 max-w-3xl">
            None of this would mean anything without something to measure with.
            We read every plan against the same set of conditions, organized
            across six domains and grounded in research on what makes a plan
            work in practice, and the instrument does not change according to who
            asked for the reading.
          </p>
          <p className="text-lg text-primary-foreground/75 leading-relaxed mb-10 max-w-3xl">
            A family receives a plain-language report on what their child's plan
            is missing. A school receives trend data across its own documents
            showing what its plans consistently miss. Same measurement, opposite
            direction.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/our-methodology"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold px-7 py-4 rounded-lg hover:opacity-90 transition-opacity"
              data-testid="edquity-cta-methodology"
            >
              See the six domains
              <ArrowRight size={18} />
            </Link>
            <a
              href={PORTAL_REGISTER_URL}
              className="inline-flex items-center gap-2 border-2 border-primary-foreground/40 font-bold px-7 py-4 rounded-lg hover:bg-primary-foreground/10 transition-colors"
              data-testid="edquity-cta-audit"
            >
              Get your free IEP audit
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
