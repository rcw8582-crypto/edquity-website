import { useState, FormEvent } from "react";
import { CheckCircle2, CalendarDays, GraduationCap, HandHeart } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { trackInquirySubmitted } from "@/lib/analytics";

const NAVY = "#122C54";
const TEAL = "#14B8A6";
/** Passes 4.5:1 on white and slate. #14B8A6 measures 2.49 and fails. */
const TEAL_TEXT = "#0F766E";
const GREEN = "#22C55E";

interface FactProps { label: string; value: string; }
function Fact({ label, value }: FactProps) {
  return (
    <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: GREEN, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 8px" }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.35 }}>{value}</p>
    </div>
  );
}

const SESSIONS: Array<[string, string]> = [
  ["July 2027, five days", "Summer intensive. The cohort launches: culture, goal setting, and each Scholar reading their own IEP in plain language."],
  ["September 2027", "Saturday session. What your IEP actually says, and how to name what helps you learn."],
  ["October 2027", "Saturday session. Executive function: systems for time, tasks, and materials."],
  ["November 2027", "Saturday session. Speaking in your own IEP meeting and asking for your accommodations in class."],
  ["December 2027", "Saturday session. Interests, strengths, and the work that fits them."],
  ["January 2028", "Saturday session. Careers and pathways: what the job actually asks of you."],
  ["February 2028", "Saturday session. Rights after high school: IDEA ends, Section 504 and the ADA begin."],
  ["March 2028", "Saturday session and a campus visit to Volunteer State, including the disability services office."],
  ["April 2028", "Saturday session and a campus visit to Tennessee State or Fisk, including the disability services office."],
  ["May 2028", "Family showcase. Every Scholar presents, and every Scholar's IEP is audited a second time."],
];

const LEARN = [
  "What their own IEP says, in plain language, and how to name what helps them learn",
  "How to speak in their own IEP meeting and ask for their accommodations in class",
  "Executive function systems for time, tasks, materials, and asking for help early",
  "Their own interests and strengths, and the careers and pathways that fit them",
  "How their rights change the day they graduate, when IDEA ends and Section 504 and the ADA begin",
  "How to register with a college disability services office and what documentation it asks for",
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
  fontSize: 15, color: NAVY, background: "#fff", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 6px" };
const fieldWrap: React.CSSProperties = { marginBottom: 18 };

export default function EdquityScholars() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      parentName: data.get("parentName"),
      parentEmail: data.get("parentEmail"),
      parentPhone: data.get("parentPhone"),
      studentName: data.get("studentName"),
      gradeLevel: data.get("gradeLevel"),
      schoolName: data.get("schoolName"),
      county: data.get("county"),
      state: data.get("state"),
      accessNeeds: data.get("accessNeeds"),
      questions: data.get("questions"),
      eligibilityConfirmed: data.get("eligibilityConfirmed") === "on",
    };
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/edquity-scholars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(typeof json.error === "string" ? json.error : "Something went wrong. Please email info@edquityatthemargins.org.");
        return;
      }
      trackInquirySubmitted("edquity-scholars");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email your enrollment request to info@edquityatthemargins.org.");
    }
  }

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="EDquity Scholars: A Year-Long Program for Students in Grades 8 to 12"
        description="EDquity Scholars is a year-long program for students in grades 8 through 12 with an IEP or a 504 plan. Scholars build executive function and self-advocacy alongside career and college readiness, their parents attend workshops on the same days, and each student's IEP is audited at intake and again in May. A seat is $1,000, funded by a sponsor rather than by the family, and the first cohort begins July 2027."
      />

      {/* Hero */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>For Students and Families</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 24px", letterSpacing: "-1.5px" }}>
            EDquity Scholars
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 720, margin: "0 auto 12px" }}>
            A year-long program for students in grades 8 through 12 with an Individualized Education Program (IEP) or a Section 504 plan. Scholars learn to read their own document, speak in their own meeting, and run the systems the IEP keeps writing goals about, because sooner or later the student carries the file.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 36px" }}>
            In person in Gallatin. Parents attend their own workshops on the same days.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <a href="#enroll" style={{ background: GREEN, color: NAVY, padding: "15px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              Reserve a Seat
            </a>
            <a href="#sponsor" style={{ background: "transparent", color: "#fff", padding: "15px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16, border: "2px solid rgba(255,255,255,0.4)" }}>
              Sponsor a Student
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, maxWidth: 920, margin: "0 auto" }}>
            <Fact label="First cohort" value="July 2027 through May 2028" />
            <Fact label="Format" value="A five-day July intensive, then nine monthly Saturdays" />
            <Fact label="Seats" value="Thirty, across grades 8 through 12" />
            <Fact label="A seat" value="$1,000, funded by a sponsor" />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Why This Program Exists</p>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 18px" }}>
            The system writes goals about skills it never teaches.
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px" }}>
            Year after year, IEPs set goals for organization, planning, and self-advocacy, and almost none of them say who will teach those skills or how. Students sit through meetings about their own education without ever being shown what the document says or how to speak in the room. Scholars teaches both, directly, across a full year rather than in a single workshop.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: 0 }}>
            The other gap opens at graduation. The Individuals with Disabilities Education Act ends, college runs on Section 504 and the ADA, and under those laws nobody is required to find the student, evaluate the student, or write a program for them. Most students are never told the rules change, and their families find out after the first bad semester. Scholars teaches it years ahead of graduation, while the high school team can still help.
          </p>
        </div>
      </section>

      {/* What students learn */}
      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <GraduationCap size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>What students leave with</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16 }}>
            {LEARN.map((t) => (
              <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "18px 20px" }}>
                <CheckCircle2 size={20} color={TEAL_TEXT} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, margin: "26px auto 0", maxWidth: 760 }}>
            Every Scholar builds a portfolio across the year: their documentation, their accommodation requests, the words they use to ask, and their plan, in one place they own. Each Scholar's IEP is audited when they enroll and again in May, so the year closes with evidence of whether the document itself improved.
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <CalendarDays size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>The program year</h2>
          </div>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 22px" }}>
            The year opens with a five-day intensive in July that makes the cohort, then runs one Saturday a month from September through May, nine to one. Two of those months add a campus visit, and the year closes with a family showcase. Seats are limited to thirty, and requests are confirmed by email on a first-come, first-served basis.
          </p>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            {SESSIONS.map(([date, session], i) => (
              <div key={date} style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "13px 18px", background: i % 2 ? "#f8fafc" : "#fff", borderTop: i ? "1px solid #eef2f7" : "none" }}>
                <span style={{ fontWeight: 800, fontSize: 14, width: 230, flexShrink: 0 }}>{date}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#475569", flex: 1, minWidth: 220, lineHeight: 1.55 }}>{session}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seats and sponsorship */}
      <section id="sponsor" className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <HandHeart size={22} color={GREEN} />
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: "#fff", margin: 0 }}>How seats are funded</h2>
          </div>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, margin: "0 0 14px" }}>
            A seat is $1,000, which covers the cost of delivering a full year to one student: the summer intensive, nine Saturdays, two campus visits, materials, food, transportation, and two IEP audits. Every seat is funded by a sponsor and is free to the family it serves; no family ever pays for a seat, and no documentation is ever required. Seats open as sponsorships are secured, which is exactly what sponsoring a Scholar funds. Requesting a seat costs nothing and carries no obligation.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, margin: 0 }}>
            Individuals, businesses, and funders can sponsor an EDquity Scholar for $1,000, covering one student's full year, or sponsor several Scholars at once. Email <a href="mailto:info@edquityatthemargins.org" style={{ color: GREEN, fontWeight: 700 }}>info@edquityatthemargins.org</a> to sponsor, or give through our <a href="/donate" style={{ color: GREEN, fontWeight: 700 }}>donation page</a> and note "EDquity Scholars" with your gift.
          </p>
        </div>
      </section>

      {/* Enrollment form */}
      <section id="enroll" className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px" }}>Reserve a seat</h2>
          <p style={{ fontSize: 15, color: "#475569", textAlign: "center", lineHeight: 1.7, margin: "0 0 30px" }}>
            Seats are limited and confirmed on a first-come, first-served basis. Submitting this form requests a seat in the next available cohort; no payment is collected, and no family ever pays for a seat. We confirm every seat by email as sponsor funding allows, and each cohort is confirmed once minimum enrollment is reached.
          </p>

          {status === "sent" ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <CheckCircle2 size={34} color={GREEN} style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px" }}>Seat request received.</p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Check your inbox for a confirmation with the cohort dates. We will follow up by email to confirm your student's seat. Seats are sponsor-funded and free to your family; nothing is ever due.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 26px" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px" }}>Parent or guardian</p>
              <div className="rg-2">
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="parentName">Your full name *</label>
                  <input style={inputStyle} id="parentName" name="parentName" required maxLength={200} autoComplete="name" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="parentEmail">Email address *</label>
                  <input style={inputStyle} id="parentEmail" name="parentEmail" type="email" required maxLength={254} autoComplete="email" />
                </div>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="parentPhone">Phone</label>
                <input style={inputStyle} id="parentPhone" name="parentPhone" maxLength={60} autoComplete="tel" />
              </div>

              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1, margin: "26px 0 16px" }}>Your student</p>
              <div className="rg-2">
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="studentName">Student's first name *</label>
                  <input style={inputStyle} id="studentName" name="studentName" required maxLength={200} />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="gradeLevel">Grade level, 2026-27 school year *</label>
                  <select style={inputStyle} id="gradeLevel" name="gradeLevel" required defaultValue="">
                    <option value="" disabled>Select one</option>
                    <option>High school senior (12th grade)</option>
                  </select>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="schoolName">High school *</label>
                  <input style={inputStyle} id="schoolName" name="schoolName" required maxLength={300} />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="county">County *</label>
                  <input style={inputStyle} id="county" name="county" required maxLength={120} />
                </div>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="state">State *</label>
                <input style={inputStyle} id="state" name="state" required maxLength={60} defaultValue="Tennessee" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="accessNeeds">Access needs</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} id="accessNeeds" name="accessNeeds" maxLength={2000} placeholder="Tell us anything that helps your student participate fully: captions, materials in advance, breaks, or anything else." />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="questions">Questions for us</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} id="questions" name="questions" maxLength={2000} />
              </div>

              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 20, cursor: "pointer" }}>
                <input type="checkbox" name="eligibilityConfirmed" required style={{ marginTop: 3 }} />
                My student is a college-bound high school senior with a current Individualized Education Program (IEP) or Section 504 plan. *
              </label>

              {status === "error" && (
                <p style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 8, padding: "12px 14px", fontSize: 14, marginBottom: 16 }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{ background: status === "sending" ? "#94a3b8" : GREEN, color: NAVY, padding: "15px 34px", borderRadius: 8, fontWeight: 800, fontSize: 16, border: "none", cursor: status === "sending" ? "wait" : "pointer", width: "100%" }}
              >
                {status === "sending" ? "Submitting..." : "Request a Seat"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
