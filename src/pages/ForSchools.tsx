import { useState, FormEvent } from "react";
import { Link } from "wouter";
import { CheckCircle2, FileSearch, GraduationCap, Users } from "lucide-react";
import PageMeta from "@/components/PageMeta";

const NAVY = "#122C54";
const TEAL = "#14B8A6";
const GREEN = "#22C55E";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
  fontSize: 15, color: NAVY, background: "#fff", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 6px" };
const fieldWrap: React.CSSProperties = { marginBottom: 18 };

export default function ForSchools() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      title: data.get("title"),
      organization: data.get("organization"),
      email: data.get("email"),
      phone: data.get("phone"),
      orgType: data.get("orgType"),
      service: data.get("service"),
      iepVolume: data.get("iepVolume"),
      message: data.get("message"),
    };
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/inquiry", {
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
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email us at info@edquityatthemargins.org.");
    }
  }

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="Consulting Services for Schools and LEAs"
        description="Independent blind IEP quality audits, the EDquity Leader Fellowship, and educator professional development for private schools, charter schools, and small to mid-size LEAs. Request information to begin."
      />

      {/* Hero */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>Consulting Services</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,50px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 24px", letterSpacing: "-1.5px" }}>
            Independent IEP Quality Services for Schools and Systems
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 700, margin: "0 auto 14px" }}>
            Rubric-based, independent review of your IEPs, leadership development for the people who sign them, and professional development built from your own data. Delivered entirely remotely, with IDEA-compliant and FERPA-protected data handling in every engagement.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 36px" }}>
            We are a family-first organization. Every consulting engagement supports meaningful outcomes for students at the margins and helps sustain our free family services.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#inquire" style={{ background: GREEN, color: NAVY, padding: "15px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              Request Information
            </a>
            <Link href="/fellowship" style={{ background: "transparent", color: "#fff", padding: "15px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16, border: "2px solid rgba(255,255,255,0.4)" }}>
              Explore the Leader Fellowship
            </Link>
          </div>
        </div>
      </section>

      {/* Blind audits */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <FileSearch size={22} color={TEAL} />
            <p style={{ fontSize: 12, fontWeight: 700, color: TEAL, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>Independent Blind IEP Quality Audits</p>
          </div>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 18px" }}>
            An independent answer to a question no one inside the building can ask.
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px" }}>
            Teachers write IEPs and administrators sign them, yet gaps in compliance and substance stay invisible until a complaint, a due process filing, or a monitoring review makes them visible. Each month, EDquity conducts a blind, rubric-based audit of a fixed sample of your redacted IEPs, scoring every document against 38 research-grounded conditions drawn from IDEA (34 CFR Part 300) and the peer-reviewed literature on IEP quality.
          </p>
          <div className="rg-2" style={{ margin: "26px 0" }}>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>Monthly Audit Report</p>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>
                For the administrator or instructional leader: compliance and substantive quality rates for the full sample, a domain scorecard, month-over-month trends, and ranked priority recommendations.
              </p>
            </div>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>IEP Quality Summary, one per document</p>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>
                Identifies which conditions each IEP met and missed, with plain-language notes on student impact and prioritized next steps for the IEP author.
              </p>
            </div>
          </div>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 8px" }}>
            Engagements run as semester or school-year terms and are designed for organizations where a monthly sample represents a meaningful share of the IEP population: private and faith-based schools, single-site charters, and small to mid-size local education agencies. Many organizations fund audits through IDEA Part B professional development allocations or Title II-A.
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: NAVY, lineHeight: 1.7, margin: 0 }}>
            Every engagement is scoped to your IEP population, so we share engagement details and investment after a short conversation. <a href="#inquire" style={{ color: TEAL }}>Request information below.</a>
          </p>
        </div>
      </section>

      {/* Fellowship + PD cards */}
      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div className="rg-2" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <GraduationCap size={20} color={TEAL} />
              <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>The EDquity Leader Fellowship</p>
            </div>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: "0 0 14px" }}>
              A selective, year-long program that develops your SPED leader into a Certified IEP Quality Improvement Leader, pairing monthly blind evaluations of your school's own IEPs with data-driven strategy seminars and a leadership impact project. Founding cohort applications close September 4, 2026.
            </p>
            <Link href="/fellowship" style={{ color: TEAL, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
              Learn more and apply
            </Link>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Users size={20} color={TEAL} />
              <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>Educator Professional Development</p>
            </div>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: "0 0 14px" }}>
              Research-grounded professional development for educator teams on the conditions that make IEPs legally compliant and substantively strong, most powerful when built from your own audit data.
            </p>
            <a href="#inquire" style={{ color: TEAL, fontWeight: 800, fontSize: 14, textDecoration: "none" }}>
              Request information
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquire" className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px" }}>Request information</h2>
          <p style={{ fontSize: 15, color: "#475569", textAlign: "center", lineHeight: 1.7, margin: "0 0 30px" }}>
            Tell us about your program and we will follow up within two business days with engagement details tailored to your organization.
          </p>

          {status === "sent" ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <CheckCircle2 size={34} color={GREEN} style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px" }}>Inquiry received.</p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Check your inbox for a confirmation. We will follow up within two business days.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 26px" }}>
              <div className="rg-2">
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="inq-name">Your name *</label>
                  <input style={inputStyle} id="inq-name" name="name" required maxLength={200} autoComplete="name" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="inq-title">Title or role</label>
                  <input style={inputStyle} id="inq-title" name="title" maxLength={200} autoComplete="organization-title" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="inq-org">School or organization *</label>
                  <input style={inputStyle} id="inq-org" name="organization" required maxLength={300} autoComplete="organization" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="inq-orgType">Organization type</label>
                  <select style={inputStyle} id="inq-orgType" name="orgType" defaultValue="">
                    <option value="">Select one</option>
                    <option>Private or independent school</option>
                    <option>Faith-based school</option>
                    <option>Public charter school</option>
                    <option>School district / LEA</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="inq-email">Email *</label>
                  <input style={inputStyle} id="inq-email" name="email" type="email" required maxLength={254} autoComplete="email" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="inq-phone">Phone</label>
                  <input style={inputStyle} id="inq-phone" name="phone" maxLength={60} autoComplete="tel" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="inq-service">Service of interest *</label>
                  <select style={inputStyle} id="inq-service" name="service" required defaultValue="">
                    <option value="" disabled>Select one</option>
                    <option>Blind IEP Quality Audit engagement</option>
                    <option>The EDquity Leader Fellowship</option>
                    <option>Educator professional development</option>
                    <option>Not sure yet</option>
                  </select>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="inq-volume">IEPs in your program (approximate)</label>
                  <input style={inputStyle} id="inq-volume" name="iepVolume" type="number" min={0} max={99999} />
                </div>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="inq-message">What would you like to know? *</label>
                <textarea style={{ ...inputStyle, minHeight: 110, resize: "vertical" }} id="inq-message" name="message" required maxLength={5000} />
              </div>

              {status === "error" && (
                <p style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 8, padding: "12px 14px", fontSize: 14, marginBottom: 16 }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{ background: status === "sending" ? "#94a3b8" : GREEN, color: NAVY, padding: "15px 34px", borderRadius: 8, fontWeight: 800, fontSize: 16, border: "none", cursor: status === "sending" ? "wait" : "pointer", width: "100%" }}
              >
                {status === "sending" ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
