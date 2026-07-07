import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink } from "lucide-react";
import PageMeta from "@/components/PageMeta";

const milestones = [
  { year: "2026", text: "EDquity at the Margins founded by Dr. Reba Clarke-Wedderburn" },
  { year: "2026", text: "Incorporated as a Tennessee charitable corporation" },
  { year: "2026", text: "Filed for 501(c)(3) tax-exempt status with the IRS (determination pending)" },
  { year: "2026", text: "Launched the free IEP Audit service and online intake portal" },
  { year: "2026", text: "Year 1 goal: serve 50 families at no cost" },
];

const spending = [
  { label: "Direct Family Services", pct: 82, color: "#22C55E" },
  { label: "Community Education", pct: 10, color: "#14B8A6" },
  { label: "Operations & Admin", pct: 8, color: "#94a3b8" },
];

const principles = [
  "We do not charge families for our services. Both the IEP Audit and the Advocacy Toolkit are free.",
  "We do not receive funding from school districts or state education agencies. Our only loyalty is to families.",
  "We publish our EIN and organizational filings so anyone can verify our nonprofit status.",
  "We will never sell subscriber data or family information to any third party.",
];

export default function Transparency() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <PageMeta
        title="Transparency & Accountability"
        description="Our organizational finances, milestones, and commitments to the families we serve. EIN 42-2295582."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Accountability</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            You deserve to know<br />how your donation is used.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>
            We operate on the belief that transparency is a form of respect. Here is everything you need to know about how EDquity at the Margins is organized and how resources are deployed.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 64 }}>
            {[
              { label: "EIN", value: "42-2295582" },
              { label: "SOS Control #", value: "002109529" },
              { label: "IRS Status", value: "501(c)(3) Pending" },
              { label: "Founded", value: "2026" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px 28px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#15803D", textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>{item.label}</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#122C54", margin: 0, fontFamily: "monospace" }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="md-grid-split">
            <div>
              <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 32px", letterSpacing: "-0.5px" }}>How We Spend</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {spending.map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>{s.label}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "#122C54" }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: 10, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        style={{ height: "100%", background: s.color, borderRadius: 999 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 24, lineHeight: 1.6 }}>
                Percentages reflect projected Year 1 program allocations. As a newly founded organization, actual spending will be reported annually. Full financial statements will be posted with each annual 990 filing.
              </p>
              <div style={{ marginTop: 24 }}>
                <a href="https://apps.irs.gov/app/eos/" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#15803D", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                  Verify our IRS status <ExternalLink size={13} />
                </a>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 32px", letterSpacing: "-0.5px" }}>Milestones</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {milestones.map((m, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{ display: "flex", gap: 16, paddingBottom: i < milestones.length - 1 ? 24 : 0, position: "relative" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#122C54", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: "#22C55E" }}>{m.year}</span>
                      </div>
                      {i < milestones.length - 1 && (
                        <div style={{ width: 2, flex: 1, background: "#e2e8f0", marginTop: 6 }} />
                      )}
                    </div>
                    <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, marginTop: 6 }}>{m.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 32px", letterSpacing: "-0.5px" }}>Our Commitments</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {principles.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <CheckCircle2 size={20} color="#22C55E" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.65, margin: 0 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px,2.8vw,34px)", fontWeight: 900, color: "#fff", margin: "0 0 16px" }}>Have a question about our finances?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", margin: "0 0 32px", lineHeight: 1.65 }}>
            We are happy to answer any questions from donors, funders, or community members about how we use resources.
          </p>
          <a href="mailto:info@edquityatthemargins.org"
            style={{ display: "inline-block", background: "#22C55E", color: "#122C54", padding: "14px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 15 }}>
            Email Us
          </a>
        </div>
      </section>
    </div>
  );
}
