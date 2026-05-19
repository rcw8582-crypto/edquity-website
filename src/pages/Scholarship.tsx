import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight, Heart, Shield, Users, Home, BookOpen, AlertCircle, Globe, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import PageMeta from "@/components/PageMeta";

const CRITERIA = [
  { id: "income", label: "Low income", description: "Household income at or below 200% of the Federal Poverty Level." },
  { id: "assistance", label: "Public assistance", description: "Currently receiving SNAP, Medicaid or CHIP, WIC, TANF, or federal housing assistance." },
  { id: "single_parent", label: "Single-parent household", description: "You are the sole parent or legal guardian in your household." },
  { id: "foster", label: "Foster or kinship family", description: "Child is in foster care, was adopted from foster care, or is in a kinship placement." },
  { id: "hardship", label: "Recent hardship", description: "Family has experienced significant hardship in the past 12 months: job loss, medical crisis, natural disaster, or domestic violence." },
  { id: "language", label: "Language barrier", description: "English is not the primary home language and advocacy resources in your language are limited." },
  { id: "rural", label: "Rural or tribal community", description: "Your family lives in a rural or tribal community with few or no local special education advocacy resources." },
  { id: "urgent", label: "Urgent situation", description: "Your child is facing a time-sensitive IEP crisis: an upcoming contested meeting, a contested placement decision, or a district that has stopped responding." },
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia",
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
  fontSize: 15, fontFamily: "'Outfit', sans-serif", color: "#1e293b",
  background: "#fff", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 700, color: "#122C54", display: "block", marginBottom: 6,
};

export default function Scholarship() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    childFirstName: "", childAge: "", school: "", district: "", state: "",
    situation: "", criteriaSelected: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showCriteria, setShowCriteria] = useState(false);

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const toggleCriterion = (id: string) =>
    setForm((p) => ({
      ...p,
      criteriaSelected: p.criteriaSelected.includes(id)
        ? p.criteriaSelected.filter((c) => c !== id)
        : [...p.criteriaSelected, id],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.criteriaSelected.length === 0) {
      setError("Please select at least one eligibility criterion that describes your family's situation.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/scholarship/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const d = await r.json();
        setError(d.error || "Submission failed. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <PageMeta
        title="Families First Scholarship — IEP Document Analysis"
        description="Apply for a full or partial Families First scholarship to receive an EDquity at the Margins IEP Document Analysis at reduced or no cost."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 14px" }}>Families First Scholarship</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#fff", margin: "0 0 18px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Every family deserves to know what is in their child's IEP, regardless of income.
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0 }}>
            The Families First scholarship subsidizes our $250 IEP Document Analysis for families with financial constraints. Our Year 1 goal is to provide 50 families with a complete IEP Document Analysis at no cost. Submit your application below and Dr. Clarke-Wedderburn will review it and respond within 3 business days.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {submitted ? (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "56px 40px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <CheckCircle2 size={32} color="#22C55E" />
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#122C54", margin: "0 0 14px" }}>Application received</h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, maxWidth: 500, margin: "0 auto 12px" }}>
                Dr. Clarke-Wedderburn will review your application and respond to <strong>{form.email}</strong> within 3 business days. Your reply will state whether your application was approved, and if so, whether you have been awarded a full scholarship or a partial scholarship, along with your personal scholarship code.
              </p>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, maxWidth: 460, margin: "0 auto 28px" }}>
                If you do not see a reply in your inbox within 3 business days, please check your spam folder before reaching out.
              </p>
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#22C55E", fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                Return to home <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "clamp(24px,5vw,40px) clamp(20px,5vw,36px)", marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#122C54", margin: "0 0 4px" }}>Your information</h2>
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 28px" }}>This application is confidential. Nothing in it will be shared with your child's school.</p>
                <div className="form-row-2" style={{ gap: 20 }}>
                  <div>
                    <label style={labelStyle}>First name *</label>
                    <input style={inputStyle} required value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Your first name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Last name *</label>
                    <input style={inputStyle} required value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Your last name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Email address *</label>
                    <input style={inputStyle} type="email" required value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone number *</label>
                    <input style={inputStyle} type="tel" required value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 000-0000" />
                  </div>
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "clamp(24px,5vw,40px) clamp(20px,5vw,36px)", marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#122C54", margin: "0 0 28px" }}>Your child's information</h2>
                <div className="form-row-2" style={{ gap: 20 }}>
                  <div>
                    <label style={labelStyle}>Child's first name *</label>
                    <input style={inputStyle} required value={form.childFirstName} onChange={e => set("childFirstName", e.target.value)} placeholder="First name only" />
                  </div>
                  <div>
                    <label style={labelStyle}>Child's age or grade *</label>
                    <input style={inputStyle} required value={form.childAge} onChange={e => set("childAge", e.target.value)} placeholder="e.g. Age 9 or 4th grade" />
                  </div>
                  <div>
                    <label style={labelStyle}>School name *</label>
                    <input style={inputStyle} required value={form.school} onChange={e => set("school", e.target.value)} placeholder="School your child attends" />
                  </div>
                  <div>
                    <label style={labelStyle}>School district *</label>
                    <input style={inputStyle} required value={form.district} onChange={e => set("district", e.target.value)} placeholder="School district name" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>State *</label>
                    <select
                      style={inputStyle}
                      required
                      value={form.state}
                      onChange={e => set("state", e.target.value)}
                    >
                      <option value="">Select state</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "clamp(24px,5vw,40px) clamp(20px,5vw,36px)", marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#122C54", margin: "0 0 6px" }}>Your situation</h2>
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px" }}>Briefly describe what is happening with your child's IEP and why you are seeking support. A sentence or two is enough.</p>
                <textarea
                  style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
                  required
                  value={form.situation}
                  onChange={e => set("situation", e.target.value)}
                  placeholder="e.g. My child's school is proposing a change to her placement that I disagree with. The IEP meeting is in three weeks and I need help understanding my rights before then."
                />
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "clamp(24px,5vw,40px) clamp(20px,5vw,36px)", marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#122C54", margin: "0 0 6px" }}>Eligibility criteria</h2>
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>
                  This scholarship is need-based. Select every criterion that describes your family's situation. You must select at least one. No documentation is required; the standard is honesty, not paperwork.
                </p>

                <p style={{ fontSize: 11, fontWeight: 800, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 10px" }}>Select all that apply</p>
                <div style={{ display: "grid", gap: 12 }}>
                  {CRITERIA.map(c => (
                    <label
                      key={c.id}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px",
                        borderRadius: 10, border: `1px solid ${form.criteriaSelected.includes(c.id) ? "#86efac" : "#e2e8f0"}`,
                        background: form.criteriaSelected.includes(c.id) ? "#f0fdf4" : "#fafafa",
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.criteriaSelected.includes(c.id)}
                        onChange={() => toggleCriterion(c.id)}
                        style={{ marginTop: 3, width: 16, height: 16, accentColor: "#22C55E", flexShrink: 0 }}
                      />
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#122C54", margin: "0 0 3px" }}>{c.label}</p>
                        <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.55 }}>{c.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 10, padding: "14px 18px", marginBottom: 20, fontSize: 14, lineHeight: 1.55 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: submitting ? "#86efac" : "#22C55E", color: "#122C54",
                  padding: "16px 32px", borderRadius: 10, fontWeight: 800, fontSize: 16,
                  border: "none", cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit', sans-serif", width: "100%", justifyContent: "center",
                }}
              >
                {submitting ? "Submitting…" : <><ArrowRight size={17} /> Submit Scholarship Application</>}
              </button>

              <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
                Dr. Clarke-Wedderburn will respond within 3 business days with a decision. No documentation is required.
              </p>
            </form>
          )}
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <button
            onClick={() => setShowCriteria(p => !p)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: showCriteria ? 28 : 0 }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#122C54", margin: 0 }}>What to expect after you apply</h2>
            {showCriteria ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
          </button>
          {showCriteria && (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
                {[
                  { icon: <Shield size={18} color="#22C55E" />, text: "Your application is confidential. No one at your child's school will ever see it." },
                  { icon: <CheckCircle2 size={18} color="#22C55E" />, text: "Dr. Clarke-Wedderburn will respond to your email within 3 business days with a decision." },
                  { icon: <Heart size={18} color="#22C55E" />, text: "If approved, your reply will state whether you have been awarded a full scholarship (no cost) or a partial scholarship (50% off) and will include your scholarship code." },
                  { icon: <Users size={18} color="#22C55E" />, text: "Scholarship families receive the exact same quality of service as full-fee clients." },
                  { icon: <Home size={18} color="#22C55E" />, text: "You will never be asked to provide proof of income or documentation of hardship." },
                  { icon: <BookOpen size={18} color="#22C55E" />, text: "Year 1 capacity is limited to 50 families. If full scholarships are not available, you may be offered a partial scholarship instead." },
                  { icon: <AlertCircle size={18} color="#22C55E" />, text: "If you do not receive a reply within 3 business days, please check your spam folder before contacting us." },
                  { icon: <Globe size={18} color="#22C55E" />, text: "Once you have your code, enter it on the intake form and it will apply automatically." },
                  { icon: <MapPin size={18} color="#22C55E" />, text: "Scholarship codes are issued by name and are not transferable to another family." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ marginTop: 2, flexShrink: 0 }}>{item.icon}</div>
                    <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, margin: 0 }}>{item.text}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8" }}>
                Ready to start without a scholarship?{" "}
                <Link href="/intake" style={{ color: "#22C55E", fontWeight: 600, textDecoration: "none" }}>Submit your intake form here.</Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
