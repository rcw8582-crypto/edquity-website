import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";

import {
  EDQUITY_TERM,
  EDQUITY_PRONUNCIATION,
  EDQUITY_PART_OF_SPEECH,
  EDQUITY_DEFINITION,
  EDQUITY_DEFINITION_PROPERTY,
  EDQUITY_DEFINITION_ORGANIZATION,
  EDQUITY_DEFINITION_PLAIN,
  EDUCATION_EQUITY_DIMENSIONS,
  EDQUITY_RELATION,
  EDQUITY_TEST,
  EDQUITY_ETYMOLOGY_SHORT,
  EDQUITY_ETYMOLOGY,
  EDQUITY_DERIVED,
  EDQUITY_GAP,
  EDQUITY_EXCLUSIONS,
  EDQUITY_SOURCES,
  EDQUITY_FENCE,
  EDATM_EQUITY_STATEMENT,
  EDQUITY_META_DESCRIPTION,
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
 *
 * The order of sections carries an argument of its own. The entry comes first,
 * the field the term belongs to comes second, and this organization appears
 * only in the last section. A reader who stops halfway has read a definition
 * they could apply to their own state without us.
 */
export default function Edquity() {
  const senses = [
    { n: 1, body: EDQUITY_DEFINITION },
    { n: 2, body: EDQUITY_DEFINITION_PROPERTY },
    { n: 3, body: EDQUITY_DEFINITION_ORGANIZATION, note: "proper" },
  ];

  return (
    <div className="pt-20">
      <PageMeta
        title="EDquity: A Definition"
        description={EDQUITY_META_DESCRIPTION}
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
                <span className="text-accent font-black text-lg md:text-2xl shrink-0 leading-relaxed">
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

      {/* The field the coinage belongs to, placed directly after the entry so a
          researcher or a funder reads the word as a contribution to education
          equity rather than as a private substitute for it */}
      <section className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-ink mb-4">
            Where the word sits
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight">
            Education equity
          </h2>
          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-12 max-w-3xl">
            {EDQUITY_RELATION}
          </p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {EDUCATION_EQUITY_DIMENSIONS.map((dimension) => (
              <div
                key={dimension.name}
                className="border-t-2 border-accent pt-5"
              >
                <h3 className="text-xl font-bold text-primary mb-2">
                  {dimension.name}
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {dimension.body}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6 max-w-3xl">
            The two dimensions follow Field, Kuczera, and Pont (2007), and the
            test below turns them into something a system can check.
          </p>
        </div>
      </section>

      {/* The test: what makes the definition falsifiable rather than aspirational */}
      <section className="bg-background">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 leading-tight">
            The test
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            Sense 1 holds only when all four of these are true at once. Any one
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

      {/* What it excludes, and the distance it names */}
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
              The distance it names
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              A condition stated as an end state gives nobody anything to close.
              This one names a distance you can point at for one child, and a
              school, a district, or a state holds as many of those distances as
              it enrolls children.
            </p>
            <div className="bg-primary text-primary-foreground rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">
                The EDquity gap
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                {EDQUITY_GAP}
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

      {/* Attribution, so the framing is citable rather than asserted */}
      <section className="bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent-ink mb-6">
            References
          </h2>
          <ul className="space-y-4">
            {EDQUITY_SOURCES.map((source) => (
              <li
                key={source}
                className="text-sm md:text-base text-muted-foreground leading-relaxed"
                style={{ paddingLeft: "1.75rem", textIndent: "-1.75rem" }}
              >
                {source}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* This organization, and only here. The section exists to show a reader
          that the term does not depend on us, so the fence comes before the
          calls to action rather than after them. */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            How we pursue it
          </h2>
          <p className="text-lg text-primary-foreground/75 leading-relaxed mb-8 max-w-3xl">
            {EDQUITY_FENCE}
          </p>
          <blockquote className="border-l-4 border-accent pl-6 md:pl-8 mb-10">
            <p className="text-xl md:text-2xl font-semibold leading-snug">
              {EDATM_EQUITY_STATEMENT}
            </p>
          </blockquote>
          <p className="text-lg text-primary-foreground/75 leading-relaxed mb-10 max-w-3xl">
            We read every program against the same set of conditions, organized
            across six domains and grounded in research on what makes a program
            work in practice. A family receives a plain-language report on what
            their child's program is missing, and a school receives trend data
            across its own documents showing what its programs consistently
            miss.
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
