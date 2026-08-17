import { useState, FormEvent } from "react";
import { Link } from "wouter";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Laptop,
  Users,
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { trackInquirySubmitted } from "@/lib/analytics";

/**
 * Teacher Professional Development.
 *
 * Content source: "EDATM Teacher PD Overview" (Reba's Word document, August
 * 2026). Sessions grow out of the same forty-condition audit standard the
 * IEP Quality Improvement Program applies, so this page cross-links with
 * that page and the Fellowship rather than restating the methodology.
 *
 * Individual registration is described as "online" in the source document
 * but no registration URL exists yet, so every reserve path currently goes
 * through the inquiry form or info@edquityatthemargins.org. Swap in the
 * registration link where REGISTER_CTA renders once the portal has one.
 */

const NAVY = "#122C54";
const GREEN = "#22C55E";
const TEAL = "#14B8A6";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)",
  fontSize: 15.5, color: "#fff", background: "rgba(255,255,255,0.07)", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "0 0 7px",
};
const fieldWrap: React.CSSProperties = { marginBottom: 18 };

const thStyle: React.CSSProperties = {
  textAlign: "left", padding: "12px 16px", fontSize: 13, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: 1, color: "#64748b",
  borderBottom: "2px solid #e2e8f0",
};
const tdStyle: React.CSSProperties = {
  padding: "14px 16px", fontSize: 15.5, color: "#334155", borderBottom: "1px solid #e2e8f0",
  verticalAlign: "top",
};

const WHY_CHOOSE = [
  "Built from ongoing audits of real IEPs, not hypothetical case studies",
  "Grounded in IDEA requirements and the Endrew F. substantive standard",
  "Focused on improving both compliance and student outcomes",
  "Interactive, application-based learning using authentic examples and guided practice",
  "Designed for immediate use in classrooms, special education programs, and district systems",
  "Led by practitioners who continuously review IEP quality and implementation",
];

const AUDIENCES = [
  "General Education Teachers", "Special Education Teachers", "Case Managers",
  "Interventionists", "Instructional Coaches", "School Psychologists",
  "Related Service Providers", "Assistant Principals", "Principals",
  "Special Education Supervisors", "District Leaders",
];

const PRICING = [
  { registration: "Individual seat", price: "$150 per seat per session" },
  { registration: "Group of more than 5 from one organization", price: "$135 per seat per session" },
  { registration: "Co-Education Lifecycle pair (2-day session)", price: "$300 per pair, one payment" },
  { registration: "Cohort training (15 seats, your staff, your date)", price: "$2,025 per session" },
];

interface Offering {
  title: string;
  blurb: string;
  objectives: string[];
}

const OFFERINGS: Offering[] = [
  {
    title: "High-Quality IEP Writing",
    blurb:
      "The substantive standard first: what a meaningful IEP looks like under the Endrew F. decision, and how to write present levels, goals, and services that hold up. Participants work in redacted sample IEPs, rewriting weak sections against the forty-condition audit standard. Most schools schedule this one first because every other session builds on it.",
    objectives: [
      "Distinguish compliance from substantive quality and explain the Endrew F. standard in plain language.",
      "Write present levels statements that connect evaluation data, classroom evidence, and student strengths to the goals that follow.",
      "Write measurable, ambitious annual goals and repair weak goals against common audit failure patterns.",
      "Align services, minutes, and accommodations to each goal so the IEP delivers what it promises.",
    ],
  },
  {
    title: "Implementing High-Quality IEPs",
    blurb:
      "The IEP after the meeting ends: delivering accommodations and services in the classroom with fidelity a parent and an auditor could both recognize. Participants map a sample IEP to a real instructional week and practice the documentation that proves delivery.",
    objectives: [
      "Distinguish accommodations from modifications and identify the general educator's legal obligations for each.",
      "Translate an IEP's service grid and accommodation list into daily classroom practice.",
      "Implement and document accommodations with fidelity across content areas.",
      "Coordinate delivery among general education, special education, and related services so nothing promised goes undelivered.",
    ],
  },
  {
    title: "Data-Based Learner Profiles for Culturally Responsive Practice",
    blurb:
      "An eligibility category tells a teacher what a student qualifies under, not who the student is. Participants work from complete learner profiles covering strengths, can-do statements, barrier patterns, evaluation data, and family and cultural context, and practice the instructional decisions the profile demands rather than the ones the label suggests.",
    objectives: [
      "Read a full learner profile and connect cognitive scores, rating scales, and informal data to what a teacher sees in class.",
      "Contrast label-driven decisions with profile-driven decisions for the same student and identify where the label misleads.",
      "Apply family and cultural context to instructional planning as data rather than background.",
      "Build a one-page, data-based profile for a student on their own roster.",
    ],
  },
  {
    title: "Progress Monitoring with Rate of Improvement",
    blurb:
      "Collection cadence, the aimline, expected versus attained growth, and progress reports that say something. Best scheduled ahead of a quarterly progress report window so the skills land the week reports are due, and participants practice on real progress data.",
    objectives: [
      "Set a data collection cadence that makes honest quarterly reporting sustainable.",
      "Compute rate of improvement: set the aimline from baseline and compare expected growth to attained growth.",
      "Decide when the trend shows sufficient progress and when the data demands a program change.",
      "Write progress reports that give families and the next teacher evidence rather than a routine mark.",
    ],
  },
  {
    title: "The Co-Education Lifecycle: Plan Together, Teach Together, Assess Together",
    blurb:
      "Co-teaching breaks down when the special educator becomes an extra set of hands instead of an equal partner. Across two full days, co-teaching pairs build the complete cycle: co-planning routines that fit real schedules, instruction models beyond one-teach-one-assist, and shared ownership of assessment and grading.",
    objectives: [
      "Establish a co-planning routine the pair can sustain inside a real master schedule.",
      "Select and rotate co-instruction models matched to lesson purpose rather than habit.",
      "Share assessment and grading ownership across both teachers.",
      "Leave with a pair implementation plan for the first grading period.",
    ],
  },
];

/**
 * Options for the reserve form's session picker. Sessions are scheduled
 * around each school's needs rather than a fixed public calendar, so the
 * picker lists the offerings by name and the date gets worked out together.
 * The first five come from OFFERINGS so the picker can never drift from
 * the descriptions above it.
 */
const SESSION_OPTIONS = [
  ...OFFERINGS.map((offering) => offering.title),
  "Special Ed Summer Summit (summer 2027)",
  "A combination of sessions for our school or district",
];

/** Mirrors the pricing table, so the inquiry arrives with the tier named. */
const REGISTRATION_OPTIONS = PRICING.map(
  (row) => `${row.registration}: ${row.price}`
).concat("Private or customized session: quoted individually");

const CUSTOMIZATIONS = [
  "Which session(s) to run, or combine two half-day topics into one full day",
  "The date and time (including weekends and in-service days)",
  "Delivery format: virtual or in-person/on-site at your district",
  "Content emphasis, drawing on findings from your own IEP audits or district-identified needs where available",
];

export default function TeacherPD() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          title: data.get("title"),
          organization: data.get("organization"),
          email: data.get("email"),
          // The inquiry endpoint takes one message string, so the two
          // pickers travel inside it rather than as new API fields.
          message: [
            `Session: ${data.get("session")}`,
            `Registration: ${data.get("registration")}`,
            "",
            String(data.get("message") ?? ""),
          ].join("\n"),
          // The endpoint requires a subject line for the email it sends
          // Reba. There is no picker on this form, so the page names itself.
          service: "Teacher Professional Development",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(
          typeof json.error === "string"
            ? json.error
            : "Something went wrong. Please email info@edquityatthemargins.org."
        );
        return;
      }
      trackInquirySubmitted("teacher-pd");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email us at info@edquityatthemargins.org.");
    }
  }

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="Teacher Professional Development"
        description="Full-day professional development for educators and districts, built from ongoing audits of real IEPs against a forty-condition standard grounded in IDEA and the Endrew F. substantive standard. Sessions are capped at 40 participants and scheduled around each school's needs, delivered virtually or on-site."
      />

      {/* Hero */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>
            For educators and districts
          </p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,50px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 24px", letterSpacing: "-1.5px" }}>
            Teacher Professional Development
          </h1>
          <p style={{ fontSize: 20, fontWeight: 700, color: GREEN, margin: "0 0 18px" }}>
            Full-day PD built from what real IEPs show
          </p>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 760, margin: "0 auto" }}>
            Every session grows out of our IEP audit practice, a forty-condition standard grounded
            in IDEA and the Endrew F. substantive-benefit standard, applied to real IEPs every
            month.
          </p>
        </div>
      </section>

      {/* Logistics */}
      <section className="sp-lg" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
            {[
              {
                icon: <Laptop size={24} color={GREEN} />,
                title: "Full virtual PD days",
                text: "Sessions run 9:00 a.m. to 3:30 p.m. Central, and registered participants receive fillable worksheet materials ahead of each session.",
              },
              {
                icon: <Users size={24} color={TEAL} />,
                title: "Capped at 40 participants",
                text: "Every session is capped at 40 participants, and every participant receives a certificate of completion.",
              },
              {
                icon: <ClipboardCheck size={24} color={GREEN} />,
                title: "Credit toward PDPs",
                text: "Tennessee educators can submit hours through TNCompass for PDPs (one clock hour equals one PDP under Policy 5.502, subject to district approval). Educators in other states and districts should confirm acceptance with their own licensure or employer policy.",
              },
            ].map((card) => (
              <div key={card.title} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 26 }}>
                <div style={{ marginBottom: 14 }}>{card.icon}</div>
                <h2 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 10px" }}>{card.title}</h2>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why educators and districts choose EDquity */}
      <section className="sp-lg" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
            Why educators and districts choose EDquity at the Margins
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
            {WHY_CHOOSE.map((reason) => (
              <li key={reason} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CheckCircle2 size={20} color={GREEN} style={{ flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontSize: 16.5, color: "#334155", lineHeight: 1.7 }}>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Who should attend */}
      <section className="sp-lg" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
            Who should attend
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {AUDIENCES.map((audience) => (
              <span
                key={audience}
                style={{
                  display: "inline-block", padding: "9px 16px", borderRadius: 999,
                  background: "#f1f5f9", border: "1px solid #e2e8f0",
                  fontSize: 14.5, fontWeight: 600, color: NAVY,
                }}
              >
                {audience}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Scheduling */}
      <section className="sp-lg" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <CalendarClock size={26} color={NAVY} />
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>
              Scheduled around your needs
            </h2>
          </div>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: 0 }}>
            There is no fixed public calendar to wait for. You choose the session or combination
            of sessions your staff needs, and we schedule the day together, on a date that works
            for your school year, delivered virtually or on-site.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="sp-lg" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            Pricing
          </h2>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 24px" }}>
            Registration options for individuals, groups, and district cohorts.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12 }}>
              <thead>
                <tr>
                  <th style={thStyle} scope="col">Registration</th>
                  <th style={thStyle} scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {PRICING.map((row) => (
                  <tr key={row.registration}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: NAVY }}>{row.registration}</td>
                    <td style={tdStyle}>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 15.5, color: "#475569", lineHeight: 1.7, margin: "18px 0 0" }}>
            Individual and group seats are virtual, and we schedule each session once enough
            requests pool for it; nobody pays until a date is set. On-site delivery is available
            for cohort and private bookings. Group and cohort bookings go through{" "}
            <a href="mailto:info@edquityatthemargins.org" style={{ color: NAVY, fontWeight: 700 }}>
              info@edquityatthemargins.org
            </a>.
          </p>

          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "26px 28px", marginTop: 28 }}>
            <p style={{ fontSize: 16.5, color: "#475569", lineHeight: 1.8, margin: 0 }}>
              Ten percent of every registration fee is designated to the Family Audit Fund, which
              keeps EDquity's family-facing audit services free.{" "}
              <Link href="/transparency" style={{ color: NAVY, fontWeight: 700 }}>
                Read our full transparency commitments
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="sp-lg" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            Professional learning offerings
          </h2>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 32px" }}>
            Six sessions, each grounded in real IEP audit findings.
          </p>

          <div style={{ display: "grid", gap: 24 }}>
            {OFFERINGS.map((offering) => (
              <div key={offering.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 30 }}>
                <h3 style={{ fontSize: 21, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.3px" }}>
                  {offering.title}
                </h3>
                <p style={{ fontSize: 15.5, color: "#475569", lineHeight: 1.75, margin: "0 0 18px" }}>
                  {offering.blurb}
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
                  Learning objectives: participants will
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                  {offering.objectives.map((objective) => (
                    <li key={objective} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <CheckCircle2 size={17} color={TEAL} style={{ flexShrink: 0, marginTop: 3 }} />
                      <span style={{ fontSize: 15, color: "#334155", lineHeight: 1.65 }}>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Summit teaser */}
            <div style={{ background: NAVY, borderRadius: 14, padding: 30 }}>
              <h3 style={{ fontSize: 21, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.3px" }}>
                Special Ed Summer Summit
              </h3>
              <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: 0 }}>
                A week-long summer intensive, five full days, summer 2027. Registration opens early,
                and details follow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Private and customized sessions */}
      <section className="sp-lg" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <GraduationCap size={26} color={NAVY} />
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>
              Private and customized sessions for schools and districts
            </h2>
          </div>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 22px" }}>
            Any of the professional learning sessions above, or a combination of them, can be
            scheduled privately for your own staff, on a date that works for your calendar,
            delivered virtually or on-site.
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>
            What districts can customize
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "grid", gap: 12 }}>
            {CUSTOMIZATIONS.map((item) => (
              <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <CheckCircle2 size={19} color={GREEN} style={{ flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontSize: 16, color: "#334155", lineHeight: 1.7 }}>{item}</span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 16.5, color: "#475569", lineHeight: 1.8, margin: "0 0 14px" }}>
            Private district cohort sessions start at $2,025 per session for up to 15 staff, the
            same rate as public cohort training; larger cohorts and multi-session bundles are
            quoted individually.
          </p>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
            This is a fee-for-service purchase of training. It is separate from, and has no effect
            on, any independent IEP audit services EDquity at the Margins may provide to your
            school or district. Schools interested in the audit itself can read about the{" "}
            <Link href="/iep-quality-improvement" style={{ color: NAVY, fontWeight: 700 }}>
              IEP Quality Improvement Program
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Reserve your seat */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.5px", textAlign: "center" }}>
            Reserve your seat
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: "0 0 32px", textAlign: "center" }}>
            Tell us which session you are interested in and how many seats you need, and we will
            reply within two business days. Group registration, district cohort bookings, and
            private or customized sessions can also reach us at{" "}
            <a href="mailto:info@edquityatthemargins.org" style={{ color: GREEN, fontWeight: 700 }}>
              info@edquityatthemargins.org
            </a>{" "}
            or{" "}
            <a href="tel:+17868106178" style={{ color: GREEN, fontWeight: 700 }}>
              (786) 810-6178
            </a>.
          </p>

          {status === "sent" ? (
            <div style={{ background: "rgba(34,197,94,0.12)", border: `1px solid ${GREEN}`, borderRadius: 12, padding: "26px 28px", textAlign: "center" }}>
              <CheckCircle2 size={30} color={GREEN} style={{ margin: "0 auto 12px", display: "block" }} />
              <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Thank you, your request is on its way.</p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>
                We will reply within two business days. A confirmation is in your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="pd-name">Your name *</label>
                <input style={inputStyle} id="pd-name" name="name" required maxLength={200} autoComplete="name" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="pd-role">Your role</label>
                <input style={inputStyle} id="pd-role" name="title" maxLength={200} placeholder="Teacher, instructional coach, special education director" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="pd-org">School or organization *</label>
                <input style={inputStyle} id="pd-org" name="organization" required maxLength={300} autoComplete="organization" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="pd-email">Email *</label>
                <input style={inputStyle} id="pd-email" name="email" type="email" required maxLength={254} autoComplete="email" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="pd-session">Which session? *</label>
                <select style={{ ...inputStyle, appearance: "auto" }} id="pd-session" name="session" required defaultValue="">
                  <option value="" disabled style={{ color: NAVY }}>Choose a session</option>
                  {SESSION_OPTIONS.map((option) => (
                    <option key={option} value={option} style={{ color: NAVY }}>{option}</option>
                  ))}
                </select>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="pd-registration">Registration type *</label>
                <select style={{ ...inputStyle, appearance: "auto" }} id="pd-registration" name="registration" required defaultValue="">
                  <option value="" disabled style={{ color: NAVY }}>Choose a registration type</option>
                  {REGISTRATION_OPTIONS.map((option) => (
                    <option key={option} value={option} style={{ color: NAVY }}>{option}</option>
                  ))}
                </select>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="pd-message">How many seats, and what timing works for you? *</label>
                <textarea style={{ ...inputStyle, minHeight: 130, resize: "vertical" }} id="pd-message" name="message" required maxLength={5000} />
              </div>

              {status === "error" && (
                <p role="alert" style={{ fontSize: 14.5, color: "#FBBF24", lineHeight: 1.6, margin: "0 0 18px" }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  width: "100%", background: GREEN, color: NAVY, padding: "16px 24px",
                  borderRadius: 8, fontWeight: 800, fontSize: 16.5, border: "none",
                  fontFamily: "inherit", cursor: status === "sending" ? "default" : "pointer",
                  opacity: status === "sending" ? 0.7 : 1,
                }}
              >
                {status === "sending" ? "Sending…" : "Send my request"}
              </button>
            </form>
          )}

          <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: "32px 0 0", textAlign: "center" }}>
            Move beyond compliance. Build systems, practices, and IEPs that improve outcomes for
            students with disabilities.
          </p>
        </div>
      </section>
    </div>
  );
}
