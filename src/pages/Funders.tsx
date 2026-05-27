import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Users, Shield } from "lucide-react";
import PageMeta from "@/components/PageMeta";

const outcomes = [
  { stat: "50", label: "families to serve free in Year 1 through our scholarship program" },
  { stat: "$0", label: "charged to scholarship families. Access is the model, not a marketing phrase." },
  { stat: "21+", label: "years of Dr. Clarke-Wedderburn's special education expertise" },
  { stat: "100%", label: "of scholarship recipients pay nothing, regardless of service level" },
];

const tiers = [
  {
    title: "Community Funder",
    range: "$1,000 – $4,999",
    color: "#22C55E",
    includes: [
      "Funds 4–20 IEP Document Analysis sessions for scholarship families",
      "Named acknowledgment in annual report",
      "Impact update letter at year's end",
    ],
  },
  {
    title: "Program Sponsor",
    range: "$5,000 – $24,999",
    color: "#14B8A6",
    featured: true,
    includes: [
      "Funds 20–100 IEP Document Analysis scholarships for families who cannot pay",
      "Co-branded acknowledgment on website",
      "Quarterly impact reports with de-identified outcome data",
      "Invitation to community education events",
    ],
  },
  {
    title: "Founding Partner",
    range: "$25,000+",
    color: "#122C54",
    includes: [
      "Funds organizational capacity and scholarship program for an entire year",
      "Named sponsorship of a specific program or cohort",
      "Annual site visit or program briefing with Dr. Clarke-Wedderburn",
      "Full outcome report with case-level narrative summaries",
      "Input on program evaluation design",
    ],
  },
];

export default function Funders() {
  const [form, setForm] = useState({ name: "", org: "", email: "", interest: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.name} (${form.org})`,
          email: form.email,
          subject: `Funder Inquiry: ${form.interest}`,
          message: form.message,
        }),
      });
      if (r.ok) {
        setStatus("sent");
        setForm({ name: "", org: "", email: "", interest: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <PageMeta
        title="Partner With Us: For Funders"
        description="Foundation and funder information for EDquity at the Margins. Outcomes data, program model, and letter of inquiry submission."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>For Funders & Partners</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Funding us funds families<br />at the most critical moment.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>
            EDquity at the Margins operates at the intersection of special education law, racial equity, and family empowerment. Every dollar we receive goes directly to closing a documented gap in who gets advocacy.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#122C54", margin: "0 0 48px", textAlign: "center" }}>The Problem We Solve</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginBottom: 48 }}>
            {[
              { icon: <TrendingUp size={24} color="#22C55E" />, title: "A documented disparity", text: "Research consistently shows that Black, Brown, economically disadvantaged, and rural families receive fewer and less appropriate special education services than their white, higher-income peers, despite identical legal protections." },
              { icon: <Shield size={24} color="#14B8A6" />, title: "A legal solution that exists", text: "The Individuals with Disabilities Education Act already guarantees every eligible child a free and appropriate public education. The gap is enforcement capacity, not law." },
              { icon: <Users size={24} color="#FBbf24" />, title: "A market that fails families", text: "Private special education advocates charge $100–$300/hour nationally. The families who most need advocacy are the least able to pay market rates." },
            ].map((card, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#122C54", margin: "0 0 10px" }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{card.text}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 32px" }}>Our Outcomes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 64 }}>
            {outcomes.map((o, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 36, fontWeight: 900, color: "#22C55E", margin: "0 0 8px", letterSpacing: "-1px" }}>{o.stat}</p>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{o.label}</p>
              </motion.div>
            ))}
          </div>

          <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 40px" }}>Partnership Levels</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {tiers.map((tier, i) => (
              <div key={i} style={{
                background: tier.featured ? "#122C54" : "#fff",
                border: `2px solid ${tier.color}`,
                borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", gap: 16,
                position: "relative",
              }}>
                {tier.featured && (
                  <span style={{ position: "absolute", top: -14, left: 24, background: tier.color, color: "#fff", padding: "3px 16px", borderRadius: 999, fontSize: 12, fontWeight: 800 }}>
                    Most Impactful
                  </span>
                )}
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: tier.color, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 6px" }}>{tier.title}</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: tier.featured ? "#fff" : "#122C54", margin: 0 }}>{tier.range}</p>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {tier.includes.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: tier.featured ? "rgba(255,255,255,0.8)" : "#475569" }}>
                      <CheckCircle2 size={15} color={tier.color} style={{ marginTop: 2, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#122C54", margin: "0 0 12px", letterSpacing: "-0.5px" }}>Letter of Inquiry</h2>
          <p style={{ fontSize: 16, color: "#64748b", margin: "0 0 40px", lineHeight: 1.65 }}>
            Interested in supporting our work? Submit a brief letter of inquiry below and Dr. Clarke-Wedderburn will respond within 5 business days.
          </p>

          {status === "sent" ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 14, padding: 32, textAlign: "center" }}>
              <CheckCircle2 size={40} color="#22C55E" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 18, fontWeight: 700, color: "#122C54", margin: "0 0 8px" }}>Inquiry received. Thank you.</p>
              <p style={{ fontSize: 15, color: "#475569", margin: 0 }}>We will respond within 5 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="form-row-2">
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#122C54", display: "block", marginBottom: 6 }}>Your Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#122C54", display: "block", marginBottom: 6 }}>Organization *</label>
                  <input required value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
                    style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#122C54", display: "block", marginBottom: 6 }}>Email Address *</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#122C54", display: "block", marginBottom: 6 }}>Funding Interest *</label>
                <select required value={form.interest} onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                  style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 15, outline: "none", background: "#fff", boxSizing: "border-box" }}>
                  <option value="">Select a level…</option>
                  <option value="Community Funder ($1,000–$4,999)">Community Funder ($1,000–$4,999)</option>
                  <option value="Program Sponsor ($5,000–$24,999)">Program Sponsor ($5,000–$24,999)</option>
                  <option value="Founding Partner ($25,000+)">Founding Partner ($25,000+)</option>
                  <option value="General / Other">General / Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#122C54", display: "block", marginBottom: 6 }}>Tell us about your interest *</label>
                <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={5} placeholder="Describe your organization, your giving priorities, and what draws you to this work…"
                  style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 14px", fontSize: 15, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              {status === "error" && (
                <p style={{ color: "#ef4444", fontSize: 14 }}>Something went wrong. Please try emailing us directly at info@edquityatthemargins.org.</p>
              )}
              <button type="submit" disabled={status === "sending"}
                style={{ background: "#122C54", color: "#fff", padding: "14px 32px", borderRadius: 8, fontWeight: 800, fontSize: 16, border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
                {status === "sending" ? "Sending…" : "Submit Inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
