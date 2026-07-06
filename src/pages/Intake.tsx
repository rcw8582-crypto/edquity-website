import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","Washington D.C."];

const GRADES = ["Pre-K","Kindergarten","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","Post-Secondary"];

const DISABILITY_CATEGORIES = [
  "Autism Spectrum Disorder (ASD)",
  "Specific Learning Disability (SLD)",
  "Other Health Impairment (OHI)",
  "Speech or Language Impairment",
  "Intellectual Disability",
  "Emotional Disturbance",
  "Developmental Delay",
  "Multiple Disabilities",
  "Orthopedic Impairment",
  "Traumatic Brain Injury",
  "Visual Impairment",
  "Hearing Impairment / Deafness",
  "Deaf-Blindness",
  "Not yet evaluated / Unknown",
  "Other",
];

type FormData = {
  parentName: string;
  email: string;
  phone: string;
  address: string;
  childFirstName: string;
  childDob: string;
  childGrade: string;
  schoolDistrict: string;
  state: string;
  disabilityCategory: string;
  meetingTiming: string;
  situation: string;
  hearAboutUs: string;
  consent1: boolean;
  consent2: boolean;
  consent3Research: boolean;
  consent4Communication: boolean;
};

const EMPTY: FormData = {
  parentName: "", email: "", phone: "", address: "",
  childFirstName: "", childDob: "", childGrade: "", schoolDistrict: "", state: "", disabilityCategory: "",
  meetingTiming: "", situation: "", hearAboutUs: "",
  consent1: false, consent2: false, consent3Research: false, consent4Communication: false,
};

const MEETING_TIMING = [
  "Within the next 7 days",
  "Within the next 2 weeks",
  "Within the next 30 days",
  "More than 30 days away",
  "No meeting scheduled yet",
  "Not sure",
];

const inputStyle = {
  width: "100%", padding: "12px 14px", border: "1.5px solid #e2e8f0",
  borderRadius: 8, fontSize: 15, fontFamily: "'Outfit', sans-serif",
  color: "#122C54", outline: "none", background: "#fff", boxSizing: "border-box" as const,
};
const labelStyle = { display: "block", fontSize: 14, fontWeight: 700, color: "#122C54", marginBottom: 6 } as const;
const fieldWrap = { marginBottom: 20 } as const;
const sectionHead = { fontSize: "clamp(16px,2vw,20px)", fontWeight: 800, color: "#122C54", margin: "0 0 20px", paddingBottom: 10, borderBottom: "2px solid #e2e8f0" } as const;

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>{label}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}</label>
      {hint && <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 6px" }}>{hint}</p>}
      {children}
    </div>
  );
}

export default function Intake() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormData, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const step1Valid = form.parentName && form.email && form.phone;
  const step2Valid = form.childFirstName && form.childDob && form.childGrade && form.schoolDistrict && form.state && form.disabilityCategory;
  const step3Valid = form.meetingTiming && form.situation.length >= 20;
  const step4Valid = form.consent1 && form.consent2 && form.consent4Communication;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/intake`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or email us directly at info@edquityatthemargins.org.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <CheckCircle size={56} color="#22C55E" style={{ marginBottom: 24 }} />
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#122C54", margin: "0 0 16px" }}>Intake form received.</h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.7, margin: "0 0 12px" }}>
            Thank you for trusting EDquity at the Margins with your child's education. Dr. Clarke-Wedderburn will review your submission and confirm your appointment by email within 48 hours.
          </p>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.6, margin: "0 0 36px" }}>
            Once you receive that confirmation, please reply with your child's IEP document attached. Do not send the document before receiving confirmation.
          </p>
          <Link href="/" style={{ background: "#22C55E", color: "#122C54", padding: "14px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const steps = ["Parent Info", "Child Info", "Your Situation", "Consents"];

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ background: "#122C54", padding: "48px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Free IEP Audit Intake</p>
          <h1 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            Start your free IEP Audit.
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
            This form takes about 5 minutes to complete, and the IEP Audit is free. Dr. Clarke-Wedderburn will review your submission and respond within 48 hours. Families with an imminent IEP meeting are prioritized.
          </p>
        </div>
      </section>

      {/* Step indicator */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex" }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, padding: "16px 0", textAlign: "center", borderBottom: step === i + 1 ? "3px solid #22C55E" : "3px solid transparent", cursor: "default" }}>
              <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 800 : 500, color: step === i + 1 ? "#122C54" : step > i + 1 ? "#22C55E" : "#94a3b8" }}>
                {step > i + 1 ? "✓ " : ""}{s}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "36px 32px" }}>

            {/* Step 1: Parent Info */}
            {step === 1 && (
              <div>
                <h2 style={sectionHead}>Parent / Guardian Information</h2>
                <Field label="Full name" required>
                  <input style={inputStyle} value={form.parentName} onChange={e => set("parentName", e.target.value)} placeholder="Your full name" required />
                </Field>
                <Field label="Email address" required>
                  <input style={inputStyle} type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" required />
                </Field>
                <Field label="Phone number" required>
                  <input style={inputStyle} type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 000-0000" required />
                </Field>
                <Field label="Mailing address" hint="Optional, only used if physical documents need to be returned.">
                  <input style={inputStyle} value={form.address} onChange={e => set("address", e.target.value)} placeholder="123 Main St, City, State ZIP" />
                </Field>
              </div>
            )}

            {/* Step 2: Child Info */}
            {step === 2 && (
              <div>
                <h2 style={sectionHead}>Child Information</h2>
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.6 }}>
                  For privacy, we only collect your child's first name. All information is handled in accordance with FERPA.
                </p>
                <div className="form-row-2">
                  <Field label="Child's first name" required>
                    <input style={inputStyle} value={form.childFirstName} onChange={e => set("childFirstName", e.target.value)} placeholder="First name only" required />
                  </Field>
                  <Field label="Date of birth" required>
                    <input style={inputStyle} type="date" value={form.childDob} onChange={e => set("childDob", e.target.value)} required />
                  </Field>
                </div>
                <div className="form-row-2">
                  <Field label="Current grade" required>
                    <select style={inputStyle} value={form.childGrade} onChange={e => set("childGrade", e.target.value)} required>
                      <option value="">Select grade</option>
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="State" required>
                    <select style={inputStyle} value={form.state} onChange={e => set("state", e.target.value)} required>
                      <option value="">Select state</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="School district" required>
                  <input style={inputStyle} value={form.schoolDistrict} onChange={e => set("schoolDistrict", e.target.value)} placeholder="e.g. Nashville Metro Schools" required />
                </Field>
                <Field label="Disability category / diagnosis" required>
                  <select style={inputStyle} value={form.disabilityCategory} onChange={e => set("disabilityCategory", e.target.value)} required>
                    <option value="">Select category</option>
                    {DISABILITY_CATEGORIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
              </div>
            )}

            {/* Step 3: Your Situation */}
            {step === 3 && (
              <div>
                <h2 style={sectionHead}>Your Situation</h2>
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px", lineHeight: 1.6 }}>
                  Your free IEP Audit includes a written report across six review domains and a 30-minute debrief call. Tell us how soon your next meeting is so we can prioritize families with imminent meetings.
                </p>
                <Field label="When is your next IEP meeting?" required hint="If a meeting is coming up soon, we do our best to prioritize your audit.">
                  <select style={inputStyle} value={form.meetingTiming} onChange={e => set("meetingTiming", e.target.value)} required>
                    <option value="">Select timing</option>
                    {MEETING_TIMING.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Briefly describe your child's situation" required hint="What's happening at school? What do you need help with? The more specific you are, the better Dr. Clarke-Wedderburn can prepare. (Minimum 20 characters)">
                  <textarea
                    style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
                    value={form.situation}
                    onChange={e => set("situation", e.target.value)}
                    placeholder="e.g. My son has autism and the school wants to remove his 1:1 aide. His last IEP meeting was contentious and I left feeling like no one was listening..."
                    required
                  />
                  <p style={{ fontSize: 12, color: form.situation.length < 20 ? "#ef4444" : "#22C55E", margin: "4px 0 0", textAlign: "right" }}>
                    {form.situation.length} characters {form.situation.length < 20 ? `(${20 - form.situation.length} more needed)` : "✓"}
                  </p>
                </Field>
                <Field label="How did you hear about EDquity at the Margins?">
                  <input style={inputStyle} value={form.hearAboutUs} onChange={e => set("hearAboutUs", e.target.value)} placeholder="e.g. Social media, referral, Google search..." />
                </Field>
              </div>
            )}

            {/* Step 4: Consents */}
            {step === 4 && (
              <div>
                <h2 style={sectionHead}>Consent and Authorization</h2>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 24px" }}>
                  Please read each statement carefully. Consents 1, 2, and 4 are required to proceed. Consent 3 is optional and has no effect on your access to services.
                </p>

                {[
                  {
                    key: "consent1" as const,
                    label: "Consent 1: Identity and Authorization",
                    text: "I confirm that I am the parent or legal guardian of the child named in this form and that I am legally authorized to share my child's educational records and make decisions regarding their educational services.",
                    required: true,
                  },
                  {
                    key: "consent2" as const,
                    label: "Consent 2: Document Review and Service Authorization",
                    text: "By submitting this form, I authorize Edquity at the Margins and its staff to receive, review, and retain my child's Individualized Education Program and any related educational documents I provide for the purpose of the IEP Audit and related educational equity services. I understand that these documents will not be shared with any third party without my explicit written consent.",
                    required: true,
                  },
                  {
                    key: "consent3Research" as const,
                    label: "Consent 3: Research, Case Study, and Impact Reporting (Optional)",
                    text: "I consent to the use of fully de-identified, aggregate data derived from my child's IEP document review for organizational program evaluation, policy advocacy materials, case studies, and peer-reviewed research. No information that could identify my child, my family, or our school district will appear in any published material. I understand this is entirely voluntary and does not affect my access to services.",
                    required: false,
                  },
                  {
                    key: "consent4Communication" as const,
                    label: "Consent 4: Communication Authorization",
                    text: "I give Edquity at the Margins permission to contact me at the phone number and email address provided in this form regarding my child's case, service updates, scheduling, and any follow-up related to services I have requested.",
                    required: true,
                  },
                ].map(consent => (
                  <div key={consent.key} style={{ marginBottom: 24, padding: 20, borderRadius: 10, border: `1.5px solid ${form[consent.key] ? "#22C55E" : "#e2e8f0"}`, background: form[consent.key] ? "#f0fdf4" : "#fff", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <input
                        type="checkbox"
                        id={consent.key}
                        checked={form[consent.key]}
                        onChange={e => set(consent.key, e.target.checked)}
                        style={{ width: 18, height: 18, marginTop: 3, flexShrink: 0, accentColor: "#22C55E", cursor: "pointer" }}
                      />
                      <div>
                        <label htmlFor={consent.key} style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#122C54", marginBottom: 8, cursor: "pointer" }}>
                          {consent.label}
                          {!consent.required && <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b", marginLeft: 8 }}>(optional)</span>}
                          {consent.required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
                        </label>
                        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>{consent.text}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {error && (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 16, marginTop: 8 }}>
                    <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: 14, color: "#dc2626", margin: 0 }}>{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, gap: 16 }}>
            <div>
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "2px solid #e2e8f0", color: "#122C54", padding: "12px 22px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: "'Outfit', sans-serif" }}>
                  <ChevronLeft size={16} /> Back
                </button>
              )}
            </div>
            <div>
              {step < 4 ? (
                <button type="button"
                  onClick={() => { if ((step === 1 && step1Valid) || (step === 2 && step2Valid) || (step === 3 && step3Valid)) setStep(s => s + 1); }}
                  disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid) || (step === 3 && !step3Valid)}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#22C55E", color: "#122C54", padding: "13px 28px", borderRadius: 8, fontWeight: 800, cursor: "pointer", fontSize: 15, fontFamily: "'Outfit', sans-serif", border: "none", opacity: ((step === 1 && !step1Valid) || (step === 2 && !step2Valid) || (step === 3 && !step3Valid)) ? 0.45 : 1 }}>
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={!step4Valid || submitting}
                  style={{ background: "#22C55E", color: "#122C54", padding: "13px 32px", borderRadius: 8, fontWeight: 800, cursor: step4Valid ? "pointer" : "not-allowed", fontSize: 16, fontFamily: "'Outfit', sans-serif", border: "none", opacity: step4Valid && !submitting ? 1 : 0.45 }}>
                  {submitting ? "Submitting…" : "Submit Intake Form"}
                </button>
              )}
            </div>
          </div>

          <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 20 }}>
            Your information is protected under FERPA. We never share your data without your explicit written consent. &nbsp;
            <Link href="/privacy-policy" style={{ color: "#14B8A6" }}>Privacy Policy</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
