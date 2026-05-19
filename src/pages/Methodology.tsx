import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";

const CALENDLY = "https://calendly.com/dr-reba/discovery";

interface SectionProps {
  number: string;
  title: string;
  iepLabel: string;
  intro?: string;
  lookFor: string[];
  research: string;
  relatedReading?: { label: string; href: string };
  relatedTool?: { label: string; href: string };
}

function MethodologySection({
  number,
  title,
  iepLabel,
  intro,
  lookFor,
  research,
  relatedReading,
  relatedTool,
}: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="border-b border-border py-12 last:border-b-0"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-32 shrink-0">
          <p className="text-5xl font-bold text-accent leading-none">{number}</p>
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            In your IEP, this is the {iepLabel} section
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">
            {title}
          </h2>
          {intro && (
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">{intro}</p>
          )}
          <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
            What we look for
          </p>
          <ul className="space-y-2 mb-6 list-disc pl-5">
            {lookFor.map((item, idx) => (
              <li key={idx} className="text-base text-foreground leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-muted/40 rounded-xl p-4 text-sm space-y-2">
            <p>
              <span className="font-semibold text-primary">Research foundation: </span>
              <span className="text-muted-foreground">{research}</span>
            </p>
            {(relatedReading || relatedTool) && (
              <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1">
                {relatedReading && (
                  <Link
                    href={relatedReading.href}
                    className="text-accent font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Read: {relatedReading.label}
                    <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                )}
                {relatedTool && (
                  <Link
                    href={relatedTool.href}
                    className="text-accent font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Tool: {relatedTool.label}
                    <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function Methodology() {
  return (
    <div className="pt-20">
      <PageMeta
        title="How We Review Your Child's IEP"
        description="Six areas EDquity at the Margins reviews in every IEP we audit. Grounded in IDEA and peer-reviewed research on what makes an IEP work for the child it serves."
      />

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-4">
            Our Methodology
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            How we review your child's IEP
          </h1>
          <p className="text-lg text-primary-foreground/85 leading-relaxed mb-4">
            When we review your child's IEP, whether through a free discovery call, an IEP Document Analysis, or a coaching session, we look at six areas. Each is grounded in the requirements of the Individuals with Disabilities Education Act (IDEA, 34 CFR Part 300) and in peer-reviewed research on what makes an IEP work for the child it serves.
          </p>
          <p className="text-base text-primary-foreground/70 leading-relaxed">
            Use this guide when you read your child's IEP at home, when you prepare for the next meeting, or when you are deciding whether to book a deeper audit with us.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <MethodologySection
            number="01"
            iepLabel="Present Levels"
            title="Starting Point: where your child is today"
            intro="Every IEP begins with a description of what your child can currently do. That description is the foundation for every goal, service, and accommodation that follows. If the starting point is vague, the rest of the IEP cannot be measured."
            lookFor={[
              "The IEP names a specific assessment, with the administration date and the score, not just 'teacher observation' or 'below grade level.'",
              "It describes what your child can do now using real numbers, not phrases like 'struggles with' or 'is below same-age peers.'",
              "It explains how the disability affects learning in the classroom, in plain language.",
              "A teacher who has never met your child could read it and know what to teach next.",
            ]}
            research="IDEA 34 CFR 300.320(a)(1); McKenna et al. (2024)"
            relatedReading={{ label: "The Stranger Test", href: "/news/the-stranger-test-strong-iep-goals" }}
          />

          <MethodologySection
            number="02"
            iepLabel="Annual Goals"
            title="Goals: what your child is working toward"
            intro="Annual goals are where the IEP tells the world what your child is expected to accomplish over the next year. A goal that is not measurable cannot prove progress, and a goal that does not include a baseline cannot show whether progress has happened."
            lookFor={[
              "Every goal describes something observable and measurable. The verbs are solve, write, read, identify, complete. Not improve, understand, demonstrate awareness.",
              "Every goal includes a baseline drawn from the Starting Point section, so the team can see the trajectory the goal expects.",
              "Every goal has a measurable target and a deadline.",
              "The progress measurement method is specific enough that any teacher could repeat it the same way.",
            ]}
            research="Endrew F. v. Douglas County School District (2017); IDEA 34 CFR 300.320(a)(2); Kurth et al. (2022)"
            relatedReading={{ label: "The Stranger Test", href: "/news/the-stranger-test-strong-iep-goals" }}
            relatedTool={{ label: "IEP Goal Checker", href: "/tools/iep-goal-checker" }}
          />

          <MethodologySection
            number="03"
            iepLabel="Accommodations and Modifications"
            title="Supports: what helps your child access learning"
            intro="Accommodations change how your child accesses material. Modifications change what your child is expected to learn. Both should be specific to what your child needs, not boilerplate language carried over from year to year."
            lookFor={[
              "Each accommodation traces back to a specific need named in the Starting Point section.",
              "Accommodations differ by subject or setting where your child's needs differ.",
              "Classroom accommodations and testing accommodations match each other, so your child is not getting one set of supports during the lesson and a different set on the test.",
            ]}
            research="IDEA 34 CFR 300.320(a)(6); Kurth et al. (2022)"
          />

          <MethodologySection
            number="04"
            iepLabel="Special Education and Related Services"
            title="Services: what the school is providing"
            intro="Services are the time, the people, and the place where the school delivers specialized instruction or therapy. Vague service language is one of the most common ways an IEP looks compliant on paper but cannot be enforced in practice."
            lookFor={[
              "Each service names what it is, who provides it, how many minutes per week, how long each session, the start and end dates, and where it happens.",
              "The total amount of service time is proportional to the level of need described in the Starting Point. A 10-minute weekly check-in cannot remediate a years-long reading gap.",
              "Each service connects to at least one annual goal, so the school can show what the service is for.",
            ]}
            research="IDEA 34 CFR 300.320(a)(4); IDEA 34 CFR 300.323; Endrew F. (2017)"
          />

          <MethodologySection
            number="05"
            iepLabel="Transition Plan"
            title="Future: planning for after high school"
            intro="For students age 16 and older, the IEP must include a transition plan that connects this year's coursework to life after high school. Many transition plans are templates filled out the same way for every student. A transition plan that is not specific to your child is not legally compliant."
            lookFor={[
              "A current, age-appropriate transition assessment exists. Career interest inventory, adaptive behavior scale, self-determination assessment.",
              "The IEP names measurable postsecondary goals in further education, employment, and independent living where appropriate.",
              "This year's course of study clearly connects to the postsecondary goals.",
              "Your child was invited to and participated in the transition planning.",
            ]}
            research="IDEA 34 CFR 300.320(b); McKenna et al. (2024)"
          />

          <MethodologySection
            number="06"
            iepLabel="Overall Document"
            title="The whole IEP: does it hold together?"
            intro="An IEP can have a strong Starting Point, strong Goals, and strong Services and still fail your child if the pieces do not connect. The final review asks whether the document is internally consistent, legally complete, and accessible to the family it serves."
            lookFor={[
              "All required IEP team members were present at the meeting, or their absences were properly documented and waived.",
              "Your family received the procedural safeguards notice in writing.",
              "Every need named in the Starting Point connects to a Goal, which connects to a Service, which connects to an Accommodation. The document tells one consistent story about your child.",
              "The IEP passes the stranger test: a teacher who has never met your child could carry out this IEP as written.",
              "The language is plain enough that your family can read and use the IEP without an interpreter or a special education degree.",
            ]}
            research="IDEA 34 CFR 300.321, 300.322, 300.504; Kurth et al. (2022)"
            relatedReading={{ label: "The Stranger Test", href: "/news/the-stranger-test-strong-iep-goals" }}
          />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-muted/40 border-t border-border py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Want all six areas reviewed for your child's IEP?
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Every EDquity at the Margins IEP Document Analysis covers all six areas above, applied to your child's specific document. The result is a written report that names exactly what is missing or inadequate, with the language to ask for what your child needs at the next meeting. $250, with scholarship-funded access for families with financial constraints.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer">
              <Button className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full px-6">
                Book a free discovery call
              </Button>
            </a>
            <Link href="/services">
              <Button
                variant="outline"
                className="rounded-full px-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                See all services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
