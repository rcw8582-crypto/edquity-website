import { useState, type CSSProperties } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";

/**
 * Families First Scholarship application, restored from the original
 * program and expanded to cover all three tuition programs. The low-income
 * criterion is computed automatically from household size and income
 * against the current HHS federal poverty guidelines; the standard for
 * every criterion is honesty, not paperwork.
 */

/**
 * 2026 HHS federal poverty guidelines, 48 contiguous states and DC.
 * Index 0 = household of 1. Update each January when HHS republishes:
 * https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
 */
const FPL_2026 = [15960, 21640, 27320, 33000, 38680, 44360, 50040, 55720];
const FPL_ADDITIONAL_PERSON = 5680;
const FPL_QUALIFY_PERCENT = 200;

function povertyGuideline(householdSize: number): number {
  if (householdSize <= 8) return FPL_2026[householdSize - 1];
  return FPL_2026[7] + (householdSize - 8) * FPL_ADDITIONAL_PERSON;
}

const PROGRAMS = [
  "Parent IEP Advocacy Academy",
  "Camp EDquity (student, grades 6-10)",
  "EDquity Scholars (high school senior)",
  "A paid parent workshop",
];

const CRITERIA = [
  { id: "income", label: "Low income", description: "Household income at or below 200% of the federal poverty guidelines. This one is calculated automatically from your answers above." },
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

const inputStyle: CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
  fontSize: 15, fontFamily: "'Outfit', sans-serif", color: "#1e293b",
  background: "#fff", boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  fontSize: 14, fontWeight: 700, color: "#122C54", display: "block", marginBottom: 6,
};

export default function Scholarship() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    childFirstName: "", childAge: "", school: "", district: "", state: "",
    program: "", householdSize: "", householdIncome: "",
    situation: "", criteriaSelected: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const toggleCriterion = (id: string) =>
    setForm((p) => ({
      ...p,
      criteriaSelected: p.criteriaSelected.includes(id)
        ? p.criteriaSelected.filter((c) => c !== id)
        : [...p.criteriaSelected, id],
    }));

  // Automatic low-income determination from household size + income.
  const size = parseInt(form.householdSize, 10);
  const income = parseFloat(form.householdIncome.replace(/[$,\s]/g, ""));
  const hasIncomeAnswers = Number.isFinite(size) && size >= 1 && Number.isFinite(income) && income >= 0;
  const fplPercent = hasIncomeAnswers ? Math.round((income / povertyGuideline(size)) * 100) : null;
  const incomeQualifies = fplPercent !== null && fplPercent <= FPL_QUALIFY_PERCENT;

  const effectiveCriteria = incomeQualifies && !form.criteriaSelected.includes("income")
    ? [...form.criteriaSelected, "income"]
    : form.criteriaSelected.filter((c) => c !== "income" || incomeQualifies);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveCriteria.length === 0) {
      setError("Please select at least one criterion that describes your family's situation, or enter your household details above so income can be checked automatically.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/scholarship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          criteriaSelected: effectiveCriteria,
          fplPercent: fplPercent === null ? "" : String(fplPercent),
        }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setError((d as { error?: string }).error || "Submission failed. Please try again.");
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
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: "#122C54", background: "#fff" }}>
      <PageMeta
        title="Families First Scholarship"
        description="Apply for the Families First Scholarship to attend the Parent IEP Advocacy Academy, Camp EDquity, or EDquity Scholars at no cost. Low-income eligibility is checked automatically; no documentation is ever required."
      />

      {/* Hero */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>Families First</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#fff", margin: "0 0 18px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            The Families First Scholarship
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 680, margin: "0 auto" }}>
            Cost should never decide which families learn to advocate. The Families First Scholarship covers tuition, in full or in part, for the Parent IEP Advocacy Academy, Camp EDquity, EDquity Scholars, and paid workshops. The application takes about five minutes, low-income eligibility is checked automatically from two questions, and no documentation is ever required. The standard is honesty, not paperwork. Scholarship seats are limited in each cohort and awarded in application order as donor funding allows, so applying early helps.
          </p>
        </div>
      </section>

      {/* Award schedule */}
      <section className="sp" style={{ background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 900, margin: "0 0 10px" }}>How awards are decided</h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 20px" }}>
            The same schedule applies to every family, using the answers in the application. Every award, full or half, is funded by donations: awards are granted in application order as funding allows, and when no scholarship funding is available, qualified applications wait in line until a gift opens the next seat.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "16px 20px" }}>
              <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px" }}>Full award: tuition covered completely</p>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>
                Household income at or below 200% of the federal poverty guidelines (checked automatically), or receiving public assistance, or a foster or kinship placement, or an urgent IEP situation.
              </p>
            </div>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px" }}>
              <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px" }}>Half award: tuition reduced by half</p>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>
                Household income between 200% and 400% of the guidelines, or any other qualifying situation: a single-parent household, recent hardship, a language barrier, or a rural community.
              </p>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "16px 20px" }}>
              <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px" }}>Full tuition</p>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>
                Household income above 400% of the guidelines with no qualifying situations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application */}
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {submitted ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: 32, textAlign: "center" }}>
              <CheckCircle2 size={36} color="#22C55E" style={{ margin: "0 auto 14px" }} />
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 10px" }}>Application received</h2>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Thank you. We review applications within five business days and reply by email. Nothing is due from your family while you wait.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "30px 28px" }}>
              {/* Program */}
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 14px" }}>Which program is this for?</h2>
              <div style={{ marginBottom: 28 }}>
                <select style={{ ...inputStyle, appearance: "auto" }} required value={form.program} onChange={(e) => set("program", e.target.value)}>
                  <option value="" disabled>Choose a program</option>
                  {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Contact */}
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 14px" }}>Your information</h2>
              <div className="rg-2" style={{ marginBottom: 28 }}>
                <div>
                  <label style={labelStyle} htmlFor="ff-first">First name *</label>
                  <input style={inputStyle} id="ff-first" required maxLength={100} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ff-last">Last name *</label>
                  <input style={inputStyle} id="ff-last" required maxLength={100} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ff-email">Email address *</label>
                  <input style={inputStyle} id="ff-email" type="email" required maxLength={254} value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ff-phone">Phone number</label>
                  <input style={inputStyle} id="ff-phone" type="tel" maxLength={40} value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
                </div>
              </div>

              {/* Child */}
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 14px" }}>Your child's information</h2>
              <div className="rg-2" style={{ marginBottom: 28 }}>
                <div>
                  <label style={labelStyle} htmlFor="ff-child">Child's first name *</label>
                  <input style={inputStyle} id="ff-child" required maxLength={100} value={form.childFirstName} onChange={(e) => set("childFirstName", e.target.value)} placeholder="First name only" />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ff-age">Child's age or grade *</label>
                  <input style={inputStyle} id="ff-age" required maxLength={40} value={form.childAge} onChange={(e) => set("childAge", e.target.value)} placeholder="e.g. Age 9 or 4th grade" />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ff-school">School name *</label>
                  <input style={inputStyle} id="ff-school" required maxLength={200} value={form.school} onChange={(e) => set("school", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ff-district">School district *</label>
                  <input style={inputStyle} id="ff-district" required maxLength={200} value={form.district} onChange={(e) => set("district", e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ff-state">State *</label>
                  <select style={{ ...inputStyle, appearance: "auto" }} id="ff-state" required value={form.state} onChange={(e) => set("state", e.target.value)}>
                    <option value="" disabled>Select your state</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Household: automatic income check */}
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>Your household</h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: "0 0 16px" }}>
                Two questions, checked automatically against the current federal poverty guidelines. No documents, no proof, no follow-up questions.
              </p>
              <div className="rg-2" style={{ marginBottom: 12 }}>
                <div>
                  <label style={labelStyle} htmlFor="ff-size">People in your household *</label>
                  <select style={{ ...inputStyle, appearance: "auto" }} id="ff-size" required value={form.householdSize} onChange={(e) => set("householdSize", e.target.value)}>
                    <option value="" disabled>Select</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={String(n)}>{n === 12 ? "12 or more" : n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="ff-income">Annual household income (before taxes) *</label>
                  <input style={inputStyle} id="ff-income" required inputMode="numeric" maxLength={12} value={form.householdIncome} onChange={(e) => set("householdIncome", e.target.value)} placeholder="e.g. 42,000" />
                </div>
              </div>
              {hasIncomeAnswers && (
                <div style={{
                  background: incomeQualifies ? "#f0fdf4" : "#f8fafc",
                  border: `1px solid ${incomeQualifies ? "#bbf7d0" : "#e2e8f0"}`,
                  borderRadius: 10, padding: "12px 16px", marginBottom: 28,
                }}>
                  <p style={{ fontSize: 14, color: incomeQualifies ? "#15803D" : "#475569", lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
                    {incomeQualifies
                      ? "Based on your answers, your household qualifies on income automatically. You can submit without checking anything below."
                      : "Your household is above the automatic income threshold, and that's okay: the criteria below are equally valid paths to the scholarship. Select any that describe your family."}
                  </p>
                </div>
              )}
              {!hasIncomeAnswers && <div style={{ marginBottom: 28 }} />}

              {/* Criteria */}
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>Eligibility criteria</h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: "0 0 16px" }}>
                Select every criterion that describes your family's situation. No documentation is required; the standard is honesty, not paperwork.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {CRITERIA.map((c) => {
                  const isIncome = c.id === "income";
                  const checked = isIncome ? incomeQualifies || form.criteriaSelected.includes("income") : form.criteriaSelected.includes(c.id);
                  return (
                    <label key={c.id} style={{
                      display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px",
                      border: `1px solid ${checked ? "#22C55E" : "#e2e8f0"}`, borderRadius: 10,
                      background: checked ? "#f0fdf4" : "#fff",
                      cursor: isIncome ? "default" : "pointer",
                      opacity: isIncome && !incomeQualifies ? 0.6 : 1,
                    }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isIncome}
                        onChange={() => !isIncome && toggleCriterion(c.id)}
                        style={{ marginTop: 3 }}
                      />
                      <span>
                        <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#122C54", marginBottom: 2 }}>{c.label}</span>
                        <span style={{ display: "block", fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>{c.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Situation */}
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px" }}>Anything you want us to know?</h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: "0 0 12px" }}>Optional. A sentence or two is plenty.</p>
              <textarea
                style={{ ...inputStyle, minHeight: 110, resize: "vertical", marginBottom: 24 }}
                maxLength={2000}
                value={form.situation}
                onChange={(e) => set("situation", e.target.value)}
              />

              {error && (
                <p style={{ fontSize: 14, color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", margin: "0 0 18px" }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: submitting ? "#86efac" : "#22C55E", color: "#122C54",
                  padding: "14px 30px", borderRadius: 8, fontWeight: 800, fontSize: 16,
                  border: "none", cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {submitting ? "Submitting…" : <><ArrowRight size={17} /> Submit Scholarship Application</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
