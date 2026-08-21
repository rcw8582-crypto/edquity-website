import { useState, type CSSProperties, type FormEvent } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";

/**
 * IEP Audit usefulness study, waves 1 and 2.
 *
 * Sent by direct link to families who have received an audit report, not
 * linked from navigation, and kept out of the sitemap. Wave 1 goes out a few
 * days after the report lands and asks whether the document was readable and
 * useful. Wave 2 goes out after the family's next IEP meeting and asks what
 * they did with it.
 *
 * The wave can be preselected with ?wave=1 or ?wave=2 so a family never has
 * to choose, since asking a parent which research instrument they are filling
 * in is a good way to lose the response.
 *
 * Every question is optional. A partial answer from a parent in the middle of
 * a dispute is worth more than a complete one that never arrives.
 *
 * The question text lives here rather than in the API so the instrument can
 * be reworded while it is still being refined. Keep it in step with
 * docs/audit-usefulness-study.md.
 */

type Question =
  | { kind: "choice"; text: string; options: string[]; help?: string }
  | { kind: "text"; text: string; help?: string };

const WAVE_ONE = "Wave 1: Report received";
const WAVE_TWO = "Wave 2: After the meeting";

const QUESTIONS: Record<string, Question[]> = {
  [WAVE_ONE]: [
    { kind: "choice", text: "Did you read the whole report, part of it, or none of it yet?", options: ["All of it", "Most of it", "Some of it", "Not yet"] },
    { kind: "text", text: "Was anything in the report confusing or hard to follow?", help: "Be blunt. This is the answer that improves the report most." },
    { kind: "choice", text: "Was there anything in the report you did not already know about your child's IEP?", options: ["Yes, several things", "Yes, one or two things", "No, it confirmed what I already suspected", "No, I already knew all of it"] },
    { kind: "text", text: "What is the one finding you are most likely to raise with the school?" },
    { kind: "choice", text: "After reading it, how prepared do you feel for your next IEP meeting compared to before?", options: ["Much more prepared", "Somewhat more prepared", "About the same", "Less prepared, it raised more questions than it answered"] },
    { kind: "text", text: "Is there anything you wanted the report to tell you that it did not?" },
  ],
  [WAVE_TWO]: [
    { kind: "choice", text: "Did you take the report, or anything from it, into the meeting?", options: ["Yes, I brought the report", "Yes, I brought notes from it", "No, I read it beforehand but brought nothing", "No, I did not use it"] },
    { kind: "choice", text: "Did you raise any of the findings with the team?", options: ["Yes", "No", "The meeting has not happened yet"] },
    { kind: "choice", text: "If you raised something, what happened?", options: ["The team agreed and changed the IEP", "The team agreed to look into it or follow up", "The team disagreed", "The team acknowledged it without committing"] },
    { kind: "text", text: "Tell us what was said." },
    { kind: "text", text: "Did anything change in your child's IEP or services as a result?", help: "Added minutes, a new goal, an evaluation agreed to, a service restored, a placement discussion opened." },
    { kind: "text", text: "Did the report change how you spoke or what you asked for in that room?", help: "Take as much space as you want. This one matters most to us." },
    { kind: "choice", text: "Would you recommend the audit to another parent?", options: ["Yes", "No", "Not sure"] },
    { kind: "text", text: "Why?" },
    { kind: "choice", text: "May we quote you in our reports to funders and on our website?", options: ["Yes, anonymously", "Yes, with my first name", "No"] },
  ],
};

/** SSR-safe read of ?wave=, defaulting to wave 1. */
function initialWave(): string {
  if (typeof window === "undefined") return WAVE_ONE;
  return new URLSearchParams(window.location.search).get("wave") === "2" ? WAVE_TWO : WAVE_ONE;
}

const inputStyle: CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
  fontSize: 15, fontFamily: "'Outfit', sans-serif", color: "#1e293b",
  background: "#fff", boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "#122C54", display: "block", marginBottom: 6,
};

const helpStyle: CSSProperties = {
  fontSize: 13.5, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px",
};

export default function AuditFeedback() {
  const [wave, setWave] = useState<string>(initialWave);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const questions = QUESTIONS[wave];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const responses = questions
      .map((q, i) => ({ question: q.text, answer: String(fd.get(`q${i}`) ?? "").trim() }))
      .filter((pair) => pair.answer !== "");

    if (responses.length === 0) {
      setStatus("error");
      setErrorMsg("Please answer at least one question before sending.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/audit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wave,
          respondentName: String(fd.get("respondentName") ?? "").trim(),
          respondentEmail: String(fd.get("respondentEmail") ?? "").trim(),
          responses,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(data?.error ?? "Something went wrong. Please email info@edquityatthemargins.org.");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email info@edquityatthemargins.org.");
    }
  }

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: "#122C54", background: "#fff" }}>
      <PageMeta
        title="How Did Your IEP Audit Report Work?"
        description="A short set of questions for families who have received an EDquity IEP Audit report, so we can make the next version better."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>For families we have served</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, color: "#fff", margin: "0 0 18px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            How did the report work for you?
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 640, margin: "0 auto" }}>
            You are one of the first families to receive an EDquity IEP Audit, and your answers
            decide what the next version of this report looks like. Nothing here is required, a
            few sentences help, and honest criticism helps most of all.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {status === "sent" ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: 32, textAlign: "center" }}>
              <CheckCircle2 size={36} color="#22C55E" style={{ margin: "0 auto 14px" }} />
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 10px" }}>Thank you</h2>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Your answers go straight into the next version of the report. If you would rather
                talk it through than type it, email info@edquityatthemargins.org and we will find
                fifteen minutes that suit you.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "30px 28px" }}>
              <div style={{ marginBottom: 26 }}>
                <label style={labelStyle} htmlFor="af-wave">Which are you answering?</label>
                <select
                  style={{ ...inputStyle, appearance: "auto" }}
                  id="af-wave"
                  value={wave}
                  onChange={(e) => setWave(e.target.value)}
                >
                  <option value={WAVE_ONE}>I have read the report, my meeting has not happened yet</option>
                  <option value={WAVE_TWO}>My IEP meeting has now happened</option>
                </select>
              </div>

              {questions.map((q, i) => (
                <div key={`${wave}-${i}`} style={{ marginBottom: 26 }}>
                  {q.kind === "choice" ? (
                    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                      <legend style={{ ...labelStyle, padding: 0 }}>{q.text}</legend>
                      {q.help && <p style={helpStyle}>{q.help}</p>}
                      {q.options.map((opt) => (
                        <label
                          key={opt}
                          style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#334155", lineHeight: 1.6, marginBottom: 8, cursor: "pointer" }}
                        >
                          <input type="radio" name={`q${i}`} value={opt} style={{ marginTop: 5, flexShrink: 0 }} />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </fieldset>
                  ) : (
                    <>
                      <label style={labelStyle} htmlFor={`af-q${i}`}>{q.text}</label>
                      {q.help && <p style={helpStyle}>{q.help}</p>}
                      <textarea
                        style={{ ...inputStyle, minHeight: 96, resize: "vertical" }}
                        id={`af-q${i}`}
                        name={`q${i}`}
                        maxLength={5000}
                      />
                    </>
                  )}
                </div>
              ))}

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 24, marginBottom: 4 }}>
                <p style={{ ...helpStyle, marginBottom: 16 }}>
                  Both fields below are optional. Leave them blank to answer anonymously.
                </p>
                <div className="rg-2">
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle} htmlFor="af-name">Your name</label>
                    <input style={inputStyle} id="af-name" name="respondentName" maxLength={200} autoComplete="name" />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle} htmlFor="af-email">Email address</label>
                    <input style={inputStyle} id="af-email" name="respondentEmail" type="email" maxLength={254} autoComplete="email" />
                  </div>
                </div>
              </div>

              {status === "error" && (
                <p style={{ fontSize: 14, color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", margin: "0 0 18px" }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: status === "sending" ? "#86efac" : "#22C55E", color: "#122C54",
                  padding: "14px 30px", borderRadius: 8, fontWeight: 800, fontSize: 16,
                  border: "none", cursor: status === "sending" ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {status === "sending" ? "Sending…" : <><ArrowRight size={17} /> Send my answers</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
