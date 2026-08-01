import { useState, FormEvent } from "react";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";
import PageMeta from "@/components/PageMeta";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const NAVY = "#122C54";
const GREEN = "#22C55E";

/**
 * The twelve questions Dr. Clarke-Wedderburn asks on an intake call.
 * Families who cannot get on a call answer them here instead. Order and
 * wording match the call script so the two paths produce the same record.
 */
const QUESTIONS: { key: string; label: string; hint?: string }[] = [
  { key: "strengths", label: "What is your child good at, at home and outside school?", hint: "Interests, talents, what they are proud of, what comes easily." },
  { key: "biggestConcern", label: "What is your biggest concern about school right now?" },
  { key: "schoolVsHome", label: "What does the school say about your child, and what do you see at home that matches or does not?" },
  { key: "settingAndChanges", label: "What classroom setting is your child in now, and is any change coming?", hint: "For example a new school, a new grade, or a move." },
  { key: "diagnoses", label: "What disability categories or diagnoses does your child have, as you understand them?", hint: "Also tell us about any outside evaluations done or scheduled, and when." },
  { key: "services", label: "What services and supports do you believe your child receives each week, and do you see them actually happening?" },
  { key: "behavior", label: "Any behavior incidents, calls home, suspensions, or removals this year?" },
  { key: "language", label: "What language does your family speak at home? Do you need documents or meetings in another language?" },
  { key: "health", label: "Any health needs the school should plan for?", hint: "Allergies, medication, medical conditions." },
  { key: "schoolChanges", label: "Has your child changed schools, districts, or states recently?" },
  { key: "successfulMeeting", label: "What would a successful next IEP meeting look like for you?" },
  { key: "verbalPromises", label: "Has the school promised anything verbally that is not in writing?" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
  fontSize: 16, color: NAVY, background: "#fff", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 6, lineHeight: 1.45 };

export default function ParentQuestions() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = {
      parentName: data.get("parentName"),
      email: data.get("email"),
      childFirstName: data.get("childFirstName"),
      confirmed: data.get("confirmed") === "on",
    };
    QUESTIONS.forEach((q) => { payload[q.key] = data.get(q.key); });

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch(`${BASE}/api/parent-questions`, {
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email us at info@edquityatthemargins.org.");
    }
  }

  if (status === "sent") {
    return (
      <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
        <PageMeta title="Thank you" description="Your answers were received by EDquity at the Margins." />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <CheckCircle size={56} color={GREEN} style={{ marginBottom: 24 }} />
          <h1 style={{ fontSize: 32, fontWeight: 900, color: NAVY, margin: "0 0 16px" }}>Thank you. We have your answers.</h1>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.7, margin: "0 0 12px" }}>
            Dr. Clarke-Wedderburn will read through everything you shared and follow up by email. What you wrote here goes straight into preparing for your child's audit and your next IEP meeting.
          </p>
          <Link href="/" style={{ background: GREEN, color: NAVY, padding: "14px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16, display: "inline-block", marginTop: 20 }}>
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <PageMeta
        title="Tell Us About Your Child"
        description="Answer the questions Dr. Clarke-Wedderburn would ask on an intake call, in your own time and your own words."
      />

      <section style={{ background: NAVY, padding: "48px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
            Tell us about your child
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.82)", lineHeight: 1.7, margin: 0 }}>
            These are the same questions we would ask on a call. Answering them here means you can take your time, in your own words, whenever it works for you. There are no wrong answers, and you can skip anything you would rather talk through instead.
          </p>
        </div>
      </section>

      <section style={{ padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <form onSubmit={onSubmit}>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "26px 24px", marginBottom: 22 }}>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle} htmlFor="pq-parent">Your name *</label>
                <input style={inputStyle} id="pq-parent" name="parentName" required maxLength={200} autoComplete="name" />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle} htmlFor="pq-email">Your email *</label>
                <input style={inputStyle} id="pq-email" name="email" type="email" required maxLength={254} autoComplete="email" />
              </div>
              <div>
                <label style={labelStyle} htmlFor="pq-child">Your child's first name *</label>
                <input style={inputStyle} id="pq-child" name="childFirstName" required maxLength={100} />
              </div>
            </div>

            {QUESTIONS.map((q, i) => (
              <div key={q.key} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "22px 24px", marginBottom: 16 }}>
                <label style={labelStyle} htmlFor={`pq-${q.key}`}>
                  <span style={{ color: GREEN, fontWeight: 900, marginRight: 8 }}>{i + 1}.</span>
                  {q.label}
                </label>
                {q.hint && <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 8px", lineHeight: 1.55 }}>{q.hint}</p>}
                <textarea
                  style={{ ...inputStyle, minHeight: 96, resize: "vertical", lineHeight: 1.6 }}
                  id={`pq-${q.key}`}
                  name={q.key}
                  maxLength={4000}
                />
              </div>
            ))}

            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "22px 24px", marginBottom: 22 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input type="checkbox" name="confirmed" required style={{ marginTop: 4, width: 18, height: 18, flexShrink: 0 }} />
                <span style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.6 }}>
                  I am the parent or legal guardian of this child, and I have completed EDquity at the Margins' intake form and consents. What I share here is covered by those same consents and our{" "}
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#14B8A6", fontWeight: 600 }}>Privacy Policy</a>.
                </span>
              </label>
            </div>

            {status === "error" && (
              <p style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 8, padding: "12px 14px", fontSize: 14, marginBottom: 16 }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              style={{ background: status === "sending" ? "#94a3b8" : GREEN, color: NAVY, padding: "16px 34px", borderRadius: 8, fontWeight: 800, fontSize: 17, border: "none", cursor: status === "sending" ? "wait" : "pointer", width: "100%" }}
            >
              {status === "sending" ? "Sending..." : "Send My Answers"}
            </button>
            <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", margin: "14px 0 0", lineHeight: 1.6 }}>
              Prefer to talk it through? Email <a href="mailto:info@edquityatthemargins.org" style={{ color: "#14B8A6" }}>info@edquityatthemargins.org</a> and we will set up a call instead.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
