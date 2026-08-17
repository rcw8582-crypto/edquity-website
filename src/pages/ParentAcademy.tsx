import { Link } from "wouter";
import { CheckCircle2, Users } from "lucide-react";
import PageMeta from "@/components/PageMeta";

import { BOOKING_URL } from "@/lib/booking";

const NAVY = "#122C54";
const GREEN = "#22C55E";

/**
 * The Parent IEP Advocacy Academy curriculum page. Course copy was written
 * by Dr. Clarke-Wedderburn; the four courses run in school-year order.
 */

interface Course {
  title: string;
  tagline: string;
  audience: string;
  blurb: string;
  goal: string;
  objectives: string[];
  evidence: string;
}

const COURSES: Course[] = [
  {
    title: "Reading Your Child's IEP",
    tagline: "Recommended September opener",
    audience: "For every family with an IEP in hand · 90 minutes · in person or virtual",
    blurb:
      "The hands-on heart of the catalog. Bring your child's IEP, or work from our sample, and we decode it together: goals, services, minutes, and accommodations, so you know exactly what the school promised your child. This is where parents most often discover what was missing all along.",
    goal:
      "You can read your child's IEP the way an auditor does: knowing what every section promises and which promises are too vague to keep.",
    objectives: [
      "Find and explain each section of your child's IEP in your own words.",
      "Check every goal against the five-part measurability test: a starting point, a behavior you can see, a target, a deadline, and a way to measure it. Could a stranger pick it up and know whether your child met it?",
      "Mark the vague and missing pieces on your own child's IEP, working alongside us with highlighters and pens.",
      "Leave with a marked-up copy and your prioritized list of what to raise at the next meeting.",
    ],
    evidence:
      "When researchers audit IEPs, unmeasurable goals are the most common failure they find (Ruble et al., 2010), and IEP quality is the strongest known predictor of whether children reach their goals (Ruble & McGrew, 2013). A goal nobody can measure is a promise nobody has to keep.",
  },
  {
    title: "Your Procedural Safeguards, Decoded",
    tagline: "The rights booklet, section by section",
    audience: "For every family who has ever been handed the rights booklet · 90 minutes · in person or virtual",
    blurb:
      "Every time the school evaluates your child, holds a meeting, or turns down a request, it hands you the procedural safeguards notice and asks you to sign that you received it. Researchers put that booklet at a college reading level. This workshop walks it section by section, in plain language, until the document you keep signing for becomes a document you can actually use.",
    goal:
      "The rights booklet you have been signing for becomes a working index of your family's power, one section at a time.",
    objectives: [
      "Navigate your district's actual safeguards notice and find any right in under a minute, using the section map you build in session.",
      "Explain, in your own words, the five sections families use most: consent, evaluations and independent evaluations, prior written notice, your child's records, and what to do when you disagree.",
      "Match real family situations to the section that answers each one.",
      "Mark your own copy with the marking key, so the rights you need most are flagged before you need them.",
    ],
    evidence:
      "State procedural safeguards notices average a 16th-grade reading level, 94% require college-level or graduate reading, and most lack a glossary or table of contents (Mandic et al., 2012; Fitzgerald & Watkins, 2006). The updated analysis found no state's notice below an 11th-grade level (Gray et al., 2019). Families cannot use rights they cannot read, and this session is the plain-language bridge the research keeps calling for.",
  },
  {
    title: "Is the IEP Working? Mid-Year Check-In",
    tagline: "Make the gap undeniable",
    audience: "For families half a year into an IEP · 90 minutes · in person or virtual",
    blurb:
      "By January the evidence is in. This workshop shows you how to use mid-year data to judge whether the services on paper are actually being delivered and actually working, and exactly how to respond when they are not.",
    goal:
      "You can put the promised services and the delivered services side by side and make the gap undeniable.",
    objectives: [
      "Build a promised-versus-delivered table from your child's own service grid.",
      "Compare mid-year progress data against each goal's starting point, not against hope.",
      "Request an IEP meeting in writing when the gap is real, and ask the Endrew F. question: what will change so my child makes real progress?",
      "Write your if-then plan for the spring semester.",
    ],
    evidence:
      "Bringing credible data about your own child targets the core driver of parent-school conflict, the team seeing a different child than you see (Lake & Billingsley, 2000), and federal Endrew F. guidance expects programs to change when data show they are not working (U.S. Department of Education, 2017).",
  },
  {
    title: "When You Disagree: Mediation, Complaints & Due Process",
    tagline: "Honest odds, ready record",
    audience: "For families at an impasse with the school · 90 minutes · in person or virtual",
    blurb:
      "When the team cannot agree, you still have options, and every one of them is explained here in plain language: from requesting another meeting through mediation, state complaints, and due process, including when an attorney matters and how to build the paper trail before you need it.",
    goal:
      "You choose your next step with honest odds in front of you, and your record is ready before you need it.",
    objectives: [
      "Order every option from least to most formal: another meeting, a facilitated IEP meeting, mediation, a state complaint, due process.",
      "Say when mediation is the smart move: it produces agreement in roughly 70% of cases nationally.",
      "Weigh due process honestly: parents with representation prevail at about three times the rate of parents alone, so this session covers where to find free and low-cost advocates before you ever need a hearing.",
      "Build the paper trail now, with the documentation habits that make every option stronger.",
    ],
    evidence:
      "Mediation resolves 70 to 75% of disputes nationally (CADRE, 2024), while self-represented parents prevailed in only about 11% of hearings versus 31% with an attorney (Blackwell & Blackwell, 2015). Low-income families file far fewer disputes, with cost and fear of the district's resources as the documented barriers (U.S. Government Accountability Office, 2019), which is why free help and early options lead this session.",
  },
];

export default function ParentAcademy() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="Parent IEP Advocacy Academy"
        description="Four evidence-grounded workshops across the school year that teach parents to read the IEP like an auditor, use the procedural safeguards notice, judge mid-year progress, and choose the right step when the team disagrees. $497 per year; the Families First Scholarship covers tuition for families who qualify."
      />

      {/* Hero */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>Year-Long Program</p>
          <h1 style={{ fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.5px" }}>
            Parent IEP Advocacy Academy
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 720, margin: "0 auto 12px" }}>
            Four workshops, sequenced across the school year, in a small cohort with fillable workbooks, live practice on real documents, and direct feedback. By your child's next annual IEP meeting, you have rehearsed every skill you will need in that room.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", margin: "0 0 36px" }}>
            $497 per year · Families First Scholarship available · Each session runs 90 minutes, in person or virtual
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={BOOKING_URL}
              style={{ background: GREEN, color: NAVY, padding: "15px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              Book a Free Call to Enroll
            </a>
            <Link href="/scholarship"
              style={{ background: "transparent", color: "#fff", padding: "15px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16, border: "2px solid rgba(255,255,255,0.4)" }}>
              Apply for the Families First Scholarship
            </Link>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Users size={22} color="#0F766E" />
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>The four courses</h2>
          </div>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 760 }}>
            The Academy follows the rhythm of the school year: read the IEP in the fall, master your rights, judge the evidence at mid-year, and know every option if the team cannot agree.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {COURSES.map((course, i) => (
              <div key={course.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "clamp(24px,3vw,36px)" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#0F766E", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 8px" }}>
                  Course {i + 1} · {course.tagline}
                </p>
                <h3 style={{ fontSize: "clamp(20px,2.4vw,28px)", fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.5px" }}>{course.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 16px" }}>{course.audience}</p>
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 16px" }}>{course.blurb}</p>
                <p style={{ fontSize: 15, color: NAVY, lineHeight: 1.7, margin: "0 0 16px" }}>
                  <strong>Goal:</strong> {course.goal}
                </p>
                <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, margin: "0 0 10px" }}>By the end, you will be able to:</p>
                <div style={{ marginBottom: 18 }}>
                  {course.objectives.map((objective, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                      <CheckCircle2 size={16} color={GREEN} style={{ marginTop: 3, flexShrink: 0 }} />
                      <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, margin: 0 }}>{objective}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px" }}>
                  <strong style={{ color: NAVY }}>The evidence:</strong> {course.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enrollment */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>Join the next cohort</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 10px" }}>
            Tuition is $497 for the year and covers all four courses, workbooks, and quarterly open office hours between sessions. The{" "}
            <Link href="/scholarship" style={{ color: "#0F766E", textDecoration: "underline" }}>Families First Scholarship</Link>{" "}
            covers tuition for families who qualify, with no documentation ever required.
          </p>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, margin: "0 0 28px" }}>
            Schools and districts can bring the Academy to their families as family engagement programming; email{" "}
            <a href="mailto:info@edquityatthemargins.org" style={{ color: "#0F766E", textDecoration: "underline" }}>info@edquityatthemargins.org</a>.
          </p>
          <a href={BOOKING_URL}
            style={{ display: "inline-block", background: GREEN, color: NAVY, padding: "15px 34px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
            Book a Free Call to Enroll
          </a>
        </div>
      </section>
    </div>
  );
}
