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
  ["Tuesday, January 12, 2027", "Parent and student orientation: how the course works and what changes after high school."],
  ["Tuesday, January 19, 2027", "Session 1. Your rights change at graduation: IDEA ends, and college runs on Section 504 and the ADA."],
  ["Tuesday, January 26, 2027", "Session 2. Your paper trail: the Summary of Performance for students with IEPs, and the records students with 504 plans should gather before graduation."],
  ["Tuesday, February 2, 2027", "Session 3. Registering with a college disability services office, step by step."],
  ["Tuesday, February 9, 2027", "Session 4. Talking about your disability: disclosure scripts for professors, advisors, and roommates."],
  ["Tuesday, February 16, 2027", "Session 5. Executive function for college: systems for time, tasks, and asking for help early."],
  ["Tuesday, February 23, 2027", "Session 6. Capstone: each student presents their transition portfolio and leaves with a plan."],
];

const LEARN = [
  "How their rights and supports change the day they graduate",
  "What to request from their IEP or 504 team before graduation",
  "How to register with a college disability services office and what documentation it will ask for",
  "How to talk about their disability and request accommodations in their own words",
  "Executive function systems that hold up without a case manager checking in",
  "A one-to-one review of their own IEP transition file with our reviewer",
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
        title="EDquity Scholars: A College Transition Course"
        description="EDquity Scholars is a six-week virtual course that teaches college-bound high school seniors with an IEP or a 504 plan how their rights change after graduation and how to advocate for themselves in college. Tuition is $697, the Families First Scholarship covers tuition for families who qualify, and the inaugural cohort begins January 2027."
      />

      {/* Hero */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>For Students and Families</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 24px", letterSpacing: "-1.5px" }}>
            EDquity Scholars
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 720, margin: "0 auto 12px" }}>
            A six-week virtual course for college-bound high school seniors with an Individualized Education Program (IEP) or a Section 504 plan. Scholars learn how their rights change after graduation and how to advocate for themselves in college, because in college, the student carries the file.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 36px" }}>
            All sessions are virtual and live. A parent orientation opens the course.
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
            <Fact label="Inaugural cohort" value="January 12 to February 23, 2027" />
            <Fact label="Format" value="Six weekly 75-minute virtual sessions" />
            <Fact label="Seats" value="Limited, first come, first served" />
            <Fact label="Tuition" value="$697 · Families First Scholarship available" />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Why This Course Exists</p>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 18px" }}>
            The IEP does not go to college.
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px" }}>
            The Individuals with Disabilities Education Act ends at high school graduation. College runs on different laws, Section 504 and the ADA, and under those laws no one is required to find the student, evaluate the student, or write a program for the student. The student must disclose their disability, provide documentation, and request accommodations themselves.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: 0 }}>
            The same shift catches students with 504 plans, whose high school plan does not follow them to campus either. Most students are never taught that the rules change, and their families find out after the first bad semester. This course teaches it before graduation, while the high school team can still help.
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
            Every student builds a capstone transition portfolio across the six weeks: their documentation, their accommodation requests, their disclosure script, and their plan, in one place they own.
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <CalendarDays size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>The inaugural cohort schedule</h2>
          </div>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 22px" }}>
            The inaugural cohort begins in January and meets live on Tuesday evenings. Additional cohorts open during the year, so a request that arrives after the inaugural cohort fills is confirmed for the next cohort. Seats are limited, and requests are confirmed by email on a first-come, first-served basis.
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
            Tuition is $697, which covers the roughly $600 cost of delivering a seat and helps fund Families First Scholarship seats for other students. The <a href="/scholarship" style={{ color: GREEN, fontWeight: 700 }}>Families First Scholarship</a> covers tuition for families who qualify through low income (checked automatically from two questions), public assistance, single-parent households, foster or kinship care, recent hardship, language barriers, rural communities, or an urgent IEP situation. No documentation is required; the standard is honesty, not paperwork. Cost is never the reason a student misses this course, and requesting a seat costs nothing and carries no obligation.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, margin: 0 }}>
            Individuals, businesses, and funders can sponsor an EDquity Scholar for $697, covering one student's full tuition, or sponsor several Scholars at once. Email <a href="mailto:info@edquityatthemargins.org" style={{ color: GREEN, fontWeight: 700 }}>info@edquityatthemargins.org</a> to sponsor, or give through our <a href="/donate" style={{ color: GREEN, fontWeight: 700 }}>donation page</a> and note "EDquity Scholars" with your gift.
          </p>
        </div>
      </section>

      {/* Enrollment form */}
      <section id="enroll" className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px" }}>Reserve a seat</h2>
          <p style={{ fontSize: 15, color: "#475569", textAlign: "center", lineHeight: 1.7, margin: "0 0 30px" }}>
            Seats are limited and confirmed on a first-come, first-served basis. Submitting this form requests a seat in the next available cohort; no payment is collected with this form. We confirm every seat by email. If tuition is a barrier, apply for the Families First Scholarship, which covers tuition for families who qualify, with no documentation ever required.
          </p>

          {status === "sent" ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <CheckCircle2 size={34} color={GREEN} style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px" }}>Seat request received.</p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Check your inbox for a confirmation with the cohort dates. We will follow up by email to confirm your student's seat and walk through tuition and funding options. Nothing is due now.
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
                    <option>Senior</option>
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
