import { useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";

/**
 * Seat-request form for the Parent IEP Advocacy Academy and Camp EDquity.
 * Collects interest only; no payment. Cohorts are invoiced
 * once minimum enrollment is reached, and seats confirm in payment order.
 * EDquity Scholars has its own form on /edquity-scholars.
 */

const PROGRAMS = [
  "Parent IEP Advocacy Academy",
  "Camp EDquity (fall break camp, grades 6-10)",
];

const inputStyle: CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
  fontSize: 15, fontFamily: "'Outfit', sans-serif", color: "#1e293b",
  background: "#fff", boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  fontSize: 14, fontWeight: 700, color: "#122C54", display: "block", marginBottom: 6,
};

export default function ReserveSeat() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      program: data.get("program"),
      parentName: data.get("parentName"),
      parentEmail: data.get("parentEmail"),
      parentPhone: data.get("parentPhone"),
      childName: data.get("childName"),
      childAge: data.get("childAge"),
      questions: data.get("questions"),
    };
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(typeof (json as { error?: string }).error === "string" ? (json as { error: string }).error : "Something went wrong. Please email info@edquityatthemargins.org.");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email your request to info@edquityatthemargins.org.");
    }
  }

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: "#122C54", background: "#fff" }}>
      <PageMeta
        title="Reserve a Seat"
        description="Request a seat in the Parent IEP Advocacy Academy or Camp EDquity. No payment now: each cohort is confirmed at minimum enrollment, then seats lock in payment order."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>Programs</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, color: "#fff", margin: "0 0 18px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Reserve a seat
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 640, margin: "0 auto" }}>
            No payment is collected now. Requesting a seat puts your family in line: once a cohort reaches minimum enrollment, we email your invoice, and seats are confirmed in the order payment arrives. If tuition is a barrier, apply for the{" "}
            <Link href="/scholarship" style={{ color: "#22C55E", textDecoration: "underline" }}>Families First Scholarship</Link>.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {status === "sent" ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: 32, textAlign: "center" }}>
              <CheckCircle2 size={36} color="#22C55E" style={{ margin: "0 auto 14px" }} />
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 10px" }}>Seat request received</h2>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Check your inbox for a confirmation. We will email you when your cohort reaches minimum enrollment, with your invoice and the session details. Nothing is due until then.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "30px 28px" }}>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle} htmlFor="rs-program">Which program? *</label>
                <select style={{ ...inputStyle, appearance: "auto" }} id="rs-program" name="program" required defaultValue="">
                  <option value="" disabled>Choose a program</option>
                  {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="rg-2" style={{ marginBottom: 4 }}>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle} htmlFor="rs-name">Your full name *</label>
                  <input style={inputStyle} id="rs-name" name="parentName" required maxLength={200} autoComplete="name" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle} htmlFor="rs-email">Email address *</label>
                  <input style={inputStyle} id="rs-email" name="parentEmail" type="email" required maxLength={254} autoComplete="email" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle} htmlFor="rs-phone">Phone number</label>
                  <input style={inputStyle} id="rs-phone" name="parentPhone" type="tel" maxLength={40} autoComplete="tel" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle} htmlFor="rs-child">Child's first name and age or grade</label>
                  <input style={inputStyle} id="rs-child" name="childName" maxLength={200} placeholder="e.g. Jordan, 7th grade" />
                  <input type="hidden" name="childAge" value="" />
                </div>
              </div>
              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle} htmlFor="rs-questions">Anything we should know?</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} id="rs-questions" name="questions" maxLength={2000} />
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
                {status === "sending" ? "Sending…" : <><ArrowRight size={17} /> Request a Seat</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
