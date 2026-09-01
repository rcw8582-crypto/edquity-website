import { Link } from "wouter";
import { ClipboardCheck, GraduationCap, Presentation, ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";

/**
 * Institutional Services: the landing page for everything schools and
 * districts buy. It introduces the three programs and directs to their own
 * pages; it deliberately duplicates none of their detail. The Fellowship is
 * reachable through this page and the Quality Improvement page, never from
 * the footer (Reba, Sep 1 2026).
 */

const NAVY = "#122C54";
const GREEN = "#22C55E";
const TEAL = "#14B8A6";
const TEAL_TEXT = "#0F766E";

const PROGRAMS = [
  {
    icon: <ClipboardCheck size={26} color={GREEN} />,
    eyebrow: "For the school or system",
    title: "IEP Quality Improvement Program",
    href: "/iep-quality-improvement",
    text: "A school-year engagement: your school submits a fixed sample of redacted IEPs each month, we blind-review them against our 54-condition rubric grounded in IDEA and the Endrew F. standard, and you receive a monthly quality report with trends and ranked priorities, plus a plain-language summary for every IEP author.",
    facts: ["September through May", "Monthly reports for leaders and authors", "Remote and FERPA-protected"],
    cta: "Explore the Program",
  },
  {
    icon: <Presentation size={26} color={TEAL} />,
    eyebrow: "For your teachers and staff",
    title: "Teacher Professional Development",
    href: "/professional-development",
    text: "Full-day sessions built from what real IEPs show: high-quality IEP writing, implementation with fidelity, data-based learner profiles, progress monitoring, and the two-day Co-Education Lifecycle for co-teaching pairs. Open registration for individuals and groups, or private cohorts on your own date, virtual or on-site.",
    facts: ["$150 per seat, $135 in groups over five", "Cohort sessions at $2,025 for 15 seats", "Certificates and PDP-eligible hours"],
    cta: "See the sessions and register",
  },
  {
    icon: <GraduationCap size={26} color={GREEN} />,
    eyebrow: "For your special education leader",
    title: "The EDquity Leader Fellowship",
    href: "/fellowship",
    text: "A selective, year-long program that develops the leader who manages your special education programming into a Certified IEP Quality Improvement Leader, powered by monthly blind evaluations of your school's own IEPs: 30 unique documents across the year, a $29,950 diagnostic donated in full to fellowship schools.",
    facts: ["$8,000 per seat, Title II-A and IDEA Part B eligible", "Founding cohort July 2027 to May 2028", "Applications open January 2027"],
    cta: "The Fellowship and application",
  },
];

export default function InstitutionalServices() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="Institutional Services"
        description="How EDquity at the Margins works with schools, districts, and systems: the IEP Quality Improvement Program, full-day Teacher Professional Development, and the EDquity Leader Fellowship. All three run on the same 54-condition audit standard, and ten percent of every fee funds free family services."
      />

      {/* Hero */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>
            Institutional Services
          </p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,50px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 24px", letterSpacing: "-1.5px" }}>
            Independent eyes on your IEP quality
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 880, margin: "0 auto" }}>
            We work with schools, districts, and systems three ways, all built on the same
            54-condition audit standard grounded in IDEA 34 CFR Part 300 and the Endrew F.
            substantive standard. Choose the one that fits where your organization is.
          </p>
        </div>
      </section>

      {/* The three programs */}
      <section className="sp-lg" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gap: 26 }}>
          {PROGRAMS.map((p) => (
            <div key={p.title} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "clamp(24px,3.5vw,38px)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                {p.icon}
                <p style={{ fontSize: 12.5, fontWeight: 700, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1.2, margin: 0 }}>{p.eyebrow}</p>
              </div>
              <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.4px" }}>{p.title}</h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 18px", maxWidth: 1000 }}>{p.text}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
                {p.facts.map((f) => (
                  <span key={f} style={{ display: "inline-block", padding: "8px 14px", borderRadius: 999, background: "#fff", border: "1px solid #e2e8f0", fontSize: 13.5, fontWeight: 600, color: NAVY }}>
                    {f}
                  </span>
                ))}
              </div>
              <Link href={p.href} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", padding: "13px 28px", borderRadius: 8, fontWeight: 800, fontSize: 15, textDecoration: "none" }}>
                {p.cta} <ArrowRight size={17} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* How this funds family services */}
      <section className="sp-lg" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "30px 32px" }}>
            <h2 style={{ fontSize: "clamp(21px,2.5vw,28px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.4px" }}>
              How this funds free services for families
            </h2>
            <p style={{ fontSize: 16.5, color: "#475569", lineHeight: 1.8, margin: "0 0 14px" }}>
              Ten percent of every engagement and registration fee is designated to the Family Audit
              Fund, which keeps the family IEP Audit, the Advocacy Toolkit, and every parent workshop
              free. Families never pay us anything.
            </p>
            <p style={{ fontSize: 16.5, color: "#475569", lineHeight: 1.8, margin: 0 }}>
              We never accept payment from a school or district in connection with an individual
              child's case. Schools that enroll are purchasing a review of their own IEP quality
              across their system, never a position on any one student.{" "}
              <Link href="/transparency" style={{ color: NAVY, fontWeight: 700 }}>
                Read our full transparency commitments
              </Link>
              .
            </p>
          </div>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "26px 0 0", textAlign: "center" }}>
            Not sure which fits? Email{" "}
            <a href="mailto:info@edquityatthemargins.org" style={{ color: TEAL_TEXT, fontWeight: 700 }}>info@edquityatthemargins.org</a>{" "}
            or call <a href="tel:+17868106178" style={{ color: TEAL_TEXT, fontWeight: 700 }}>(786) 810-6178</a>{" "}
            and we will point you to the right one.
          </p>
        </div>
      </section>
    </div>
  );
}
