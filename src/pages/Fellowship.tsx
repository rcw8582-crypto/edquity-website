import { useState, FormEvent } from "react";
import { CheckCircle2, Download, CalendarDays, ShieldCheck } from "lucide-react";
import PageMeta from "@/components/PageMeta";

const NAVY = "#122C54";
const TEAL = "#14B8A6";
const GREEN = "#22C55E";

interface FactProps { label: string; value: string; }
function Fact({ label, value }: FactProps) {
  return (
    <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "16px 20px", minWidth: 190 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: GREEN, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 6px" }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.4 }}>{value}</p>
    </div>
  );
}

interface StepProps { n: string; title: string; text: string; }
function Step({ n, title, text }: StepProps) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
      <p style={{ fontSize: 12, fontWeight: 800, color: TEAL, margin: "0 0 8px" }}>STEP {n}</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: NAVY, margin: "0 0 8px" }}>{title}</p>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>{text}</p>
    </div>
  );
}

const CALENDAR: Array<[string, string]> = [
  ["September", "The year opens with the full-day virtual Launch Institute."],
  ["December", "The full-day virtual Data Summit turns your fall data into your school's professional development plan."],
  ["January to May", "Your fellow leads the plan in your building while the independent blind evaluation continues."],
  ["June", "Fellows present their measured results at the in-person Impact Expo, location to be determined, and the credential is conferred."],
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
  fontSize: 15, color: NAVY, background: "#fff", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 6px" };
const fieldWrap: React.CSSProperties = { marginBottom: 18 };

const NEED_OPTIONS = [
  "Title I school status",
  "High-poverty campus profile (over 50% free or reduced lunch)",
  "Serves a high concentration of multilingual or English Learner families",
  "Serves a high concentration of students of color with disabilities",
];

export default function Fellowship() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const toggleNeed = (n: string) =>
    setNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      fullName: data.get("fullName"),
      title: data.get("title"),
      email: data.get("email"),
      phone: data.get("phone"),
      experience: data.get("experience"),
      schoolName: data.get("schoolName"),
      district: data.get("district"),
      schoolType: data.get("schoolType"),
      needIndicators: needs,
      spedEnrollment: data.get("spedEnrollment"),
      iepsReviewed: data.get("iepsReviewed"),
      missionCase: data.get("missionCase"),
      operationalCase: data.get("operationalCase"),
      institutionalSignOff: data.get("institutionalSignOff") === "on",
      dataAgreement: data.get("dataAgreement") === "on",
    };
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/fellowship", {
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
      setStatus("sent");
      form.reset();
      setNeeds([]);
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email your application to info@edquityatthemargins.org.");
    }
  }

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="The EDquity Leader Fellowship for School SPED Leaders"
        description="A selective, year-long virtual fellowship that develops special education coordinators into Certified IEP Quality Improvement Leaders, powered by monthly blind IEP evaluations. Founding cohort applications close September 4, 2026."
      />

      {/* Hero */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>For Schools</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 24px", letterSpacing: "-1.5px" }}>
            The EDquity Leader Fellowship
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 720, margin: "0 auto 12px" }}>
            A selective, year-long program that develops the leader who manages your special education programming into a Certified IEP Quality Improvement Leader, powered by monthly blind evaluations of your school's own IEPs.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 36px" }}>
            All sessions are virtual. The June Impact Expo will be in person, location to be determined.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <a href="#apply" style={{ background: GREEN, color: NAVY, padding: "15px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              Apply for the Founding Cohort
            </a>
            <a href="/fellowship/EDquity-Leader-Fellowship-Commitment-Letter.docx" style={{ background: "transparent", color: "#fff", padding: "15px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16, border: "2px solid rgba(255,255,255,0.4)" }}>
              Download the Commitment Letter
            </a>
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Fact label="Application window" value="August 1 to September 4, 2026" />
            <Fact label="Founding cohort" value="Capped at 3 to 4 schools" />
            <Fact label="Investment" value="$6,500 per seat" />
            <Fact label="Eligible funding" value="Title II-A and IDEA Part B" />
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: TEAL, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>The Problem</p>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 18px" }}>
            A signed IEP is not a compliant IEP.
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px" }}>
            Teachers write IEPs and administrators sign them, yet no one inside the building has the time, training, or independent perspective to know whether those documents are legally defensible or written to move students forward. Gaps stay invisible until a state complaint, a due process filing, or a monitoring review makes them visible, and by then students have lost time they will not recover.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: 0 }}>
            Traditional professional development does not fix this, because one-off workshops carry no ongoing accountability and produce no objective data. The fellowship replaces guesswork with a year of independent measurement of your own documents.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: TEAL, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px", textAlign: "center" }}>How It Works</p>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, textAlign: "center", margin: "0 0 14px" }}>The monthly diagnostic loop</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, textAlign: "center", maxWidth: 760, margin: "0 auto 34px" }}>
            Every month from September through May, your school submits five redacted IEPs and EDquity blind-evaluates them against our proprietary 38-condition master rubric. That is 45 independent evaluations across the year, a diagnostic service valued at $29,385 on our standard rate card, donated in full to fellowship schools.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 40 }}>
            <Step n="1" title="Blind submission" text="By the fifth business day of each month, your school submits 5 redacted IEPs following our secure, FERPA-protected Redaction Guidance." />
            <Step n="2" title="Objective evaluation" text="EDquity blind-evaluates the documents against the 38-condition master rubric to surface systemic, school-wide trends." />
            <Step n="3" title="Real-time reporting" text="Your fellow receives the reports before that month's working session, so the case material is always your school's current reality." />
          </div>
          <div className="rg-2" style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Fall: Training and Diagnosis</p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Your fellow learns the federal law behind every condition, anchored in Endrew F. v. Douglas County (2017), and trains hands-on with the EDquity Leader Rubric. By December, four months of blind trend data show exactly which conditions your school's documents consistently miss, and the December Data Summit converts that trend into a targeted professional development plan, presented to you the same day.
              </p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 1 }}>Spring: Execution and Impact</p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                From January, your fellow executes the plan: training staff, running pre-signature rubric checks on draft IEPs, and coaching teams, while the blind evaluation continues uninterrupted. Because every score all year is EDquity's independent blind score, the June fall-versus-spring comparison is objective by construction. Your school sees exactly how much IEP quality moved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <CalendarDays size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>The year at a glance</h2>
          </div>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 22px" }}>
            Four anchors carry the year. Between them, fellows meet virtually and receive individual coaching, and selected fellows receive the full session calendar at onboarding.
          </p>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            {CALENDAR.map(([month, session], i) => (
              <div key={month} style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "13px 18px", background: i % 2 ? "#f8fafc" : "#fff", borderTop: i ? "1px solid #eef2f7" : "none" }}>
                <span style={{ fontWeight: 800, fontSize: 14, width: 170, flexShrink: 0 }}>{month}</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: TEAL, flex: 1, minWidth: 220 }}>{session}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What the school gets */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: "#fff", textAlign: "center", margin: "0 0 30px" }}>
            What your school receives
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 16 }}>
            {[
              "45 of your own IEPs blind-evaluated across the year with full reports, a donated service valued at $29,385",
              "A leader trained on federal special education law and the EDquity Leader Rubric",
              "A data-driven professional development plan in December, built from your school's own trend data",
              "Measured, independently scored quality improvement by June",
              "A credentialed Certified IEP Quality Improvement Leader on staff",
              "Eligibility to license the EDquity scoring platform, which requires a credentialed leader",
            ].map((t) => (
              <div key={t} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "18px 20px" }}>
                <CheckCircle2 size={20} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.88)", lineHeight: 1.6, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", textAlign: "center", margin: "30px auto 0", maxWidth: 720, lineHeight: 1.7 }}>
            The investment is $6,500 per seat, typically funded through PD budgets, Title II-A, or IDEA Part B professional development allocations, so it never needs to touch local operating funds. Confirm allowability with your special education finance coordinator or state education agency.
          </p>
        </div>
      </section>

      {/* Eligibility */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <ShieldCheck size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>Who should apply</h2>
          </div>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 16px" }}>
            The fellowship is for the people who manage and sign off on IEPs: special education coordinators and directors, department chairs, case management leads, and instructional coaches with SPED oversight, at private schools, charter schools, and small to mid-size local education agencies.
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>Selection criteria, applied uniformly:</p>
          <ul style={{ margin: "0 0 18px", paddingLeft: 22, color: "#475569", fontSize: 15, lineHeight: 1.9 }}>
            <li>Current responsibility for school-wide IEP oversight</li>
            <li>At least two years of special education experience</li>
            <li>A written statement on why IEP quality matters for your students</li>
            <li>A signed School Leader Commitment Letter (download above, upload nothing here; email the signed copy to info@edquityatthemargins.org)</li>
            <li>Priority for Title I schools, high-poverty charters, and settings serving multilingual families and students of color with disabilities</li>
          </ul>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
            The fellowship runs one year per school and is non-renewable, and the founding cohort is capped at 3 to 4 schools. Schools that want continued independent evaluation afterward engage our standard audit service, and schools that want internal evaluation capacity license the platform.
          </p>
        </div>
      </section>

      {/* Application */}
      <section id="apply" className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px" }}>Apply for the founding cohort</h2>
          <p style={{ fontSize: 15, color: "#475569", textAlign: "center", lineHeight: 1.7, margin: "0 0 30px" }}>
            Applications close September 4, 2026. Cohort announcements follow in mid-September.
          </p>

          {status === "sent" ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <CheckCircle2 size={34} color={GREEN} style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px" }}>Application received.</p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Check your inbox for a confirmation with key dates. One required step remains: email your signed School Leader Commitment Letter to info@edquityatthemargins.org. Your application is complete once we receive it.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 26px" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px" }}>Part 1: Applicant profile</p>
              <div className="rg-2">
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="fullName">Full name *</label>
                  <input style={inputStyle} id="fullName" name="fullName" required maxLength={200} autoComplete="name" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="title">Professional title *</label>
                  <input style={inputStyle} id="title" name="title" required maxLength={200} autoComplete="organization-title" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="email">Email address *</label>
                  <input style={inputStyle} id="email" name="email" type="email" required maxLength={254} autoComplete="email" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="phone">Direct phone</label>
                  <input style={inputStyle} id="phone" name="phone" maxLength={60} autoComplete="tel" />
                </div>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="experience">Years of special education experience * (minimum two)</label>
                <select style={inputStyle} id="experience" name="experience" required defaultValue="">
                  <option value="" disabled>Select one</option>
                  <option value="2-5 years">2 to 5 years</option>
                  <option value="6-10 years">6 to 10 years</option>
                  <option value="11+ years">11 or more years</option>
                </select>
              </div>

              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: 1, margin: "26px 0 16px" }}>Part 2: Institutional information</p>
              <div className="rg-2">
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="schoolName">School or LEA name *</label>
                  <input style={inputStyle} id="schoolName" name="schoolName" required maxLength={300} />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="district">District or charter network</label>
                  <input style={inputStyle} id="district" name="district" maxLength={300} />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="schoolType">School type *</label>
                  <select style={inputStyle} id="schoolType" name="schoolType" required defaultValue="">
                    <option value="" disabled>Select one</option>
                    <option>Traditional public school</option>
                    <option>Public charter school</option>
                    <option>Private or independent school</option>
                  </select>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="spedEnrollment">Total SPED enrollment on campus</label>
                  <input style={inputStyle} id="spedEnrollment" name="spedEnrollment" type="number" min={0} max={99999} />
                </div>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="iepsReviewed">IEPs you personally review each year</label>
                <input style={inputStyle} id="iepsReviewed" name="iepsReviewed" type="number" min={0} max={99999} />
              </div>
              <div style={fieldWrap}>
                <span style={labelStyle}>Need indicators (select all that apply)</span>
                {NEED_OPTIONS.map((n) => (
                  <label key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#475569", lineHeight: 1.5, marginBottom: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={needs.includes(n)} onChange={() => toggleNeed(n)} style={{ marginTop: 3 }} />
                    {n}
                  </label>
                ))}
              </div>

              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: 1, margin: "26px 0 16px" }}>Part 3: Short answers (250 words each)</p>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="missionCase">The mission case: why does IEP quality matter for the specific student population your campus serves? *</label>
                <textarea style={{ ...inputStyle, minHeight: 130, resize: "vertical" }} id="missionCase" name="missionCase" required maxLength={4000} />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="operationalCase">The operational case: how will becoming a Certified IEP Quality Improvement Leader shift daily document practice across your building? *</label>
                <textarea style={{ ...inputStyle, minHeight: 130, resize: "vertical" }} id="operationalCase" name="operationalCase" required maxLength={4000} />
              </div>

              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL, textTransform: "uppercase", letterSpacing: 1, margin: "26px 0 16px" }}>Part 4: Required certifications</p>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 12, cursor: "pointer" }}>
                <input type="checkbox" name="institutionalSignOff" required style={{ marginTop: 3 }} />
                I certify that my school leadership understands the $6,500 seat fee, agrees to release time for the program's contact hours, and consents to the presentation of anonymized campus findings at the June Impact Expo. *
              </label>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 20, cursor: "pointer" }}>
                <input type="checkbox" name="dataAgreement" required style={{ marginTop: 3 }} />
                I certify that my campus will follow EDquity's FERPA-compliant Redaction Guidance and submit our five-IEP sample by the fifth business day of each month. *
              </label>

              <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 10, padding: "14px 16px", marginBottom: 22, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Download size={18} color={TEAL} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  Required attachment: <a href="/fellowship/EDquity-Leader-Fellowship-Commitment-Letter.docx" style={{ color: TEAL, fontWeight: 700 }}>download the School Leader Commitment Letter</a>, have your principal or authorizing official sign it, and email the signed copy to info@edquityatthemargins.org. Your application is complete once we receive it.
                </p>
              </div>

              {status === "error" && (
                <p style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 8, padding: "12px 14px", fontSize: 14, marginBottom: 16 }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{ background: status === "sending" ? "#94a3b8" : GREEN, color: NAVY, padding: "15px 34px", borderRadius: 8, fontWeight: 800, fontSize: 16, border: "none", cursor: status === "sending" ? "wait" : "pointer", width: "100%" }}
              >
                {status === "sending" ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
