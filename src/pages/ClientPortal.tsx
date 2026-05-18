import { Link } from "wouter";
import { ExternalLink, Mail, Phone, Calendar } from "lucide-react";

const PORTAL_URL = "https://portal.edquityatthemargins.org/";
const CALENDLY = "https://calendly.com/dr-reba/discovery";

export default function ClientPortal() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", background: "#fff", color: "#122C54", minHeight: "100vh" }}>

      {/* Header */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>EDquity360 Portal</p>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Welcome back.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px" }}>
            Access your documents, session notes, and reports through the secure client portal.
          </p>

          {/* Primary CTA */}
          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#22C55E",
              color: "#122C54",
              padding: "18px 36px",
              borderRadius: 10,
              fontWeight: 900,
              textDecoration: "none",
              fontSize: 18,
              letterSpacing: "-0.3px",
              boxShadow: "0 4px 24px rgba(34,197,94,0.35)",
            }}
          >
            <ExternalLink size={20} />
            Open EDquity360 Portal
          </a>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "14px 0 0" }}>
            Opens in a new tab: portal.edquityatthemargins.org
          </p>
        </div>
      </section>

      {/* Support options */}
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 800, textAlign: "center", margin: "0 0 36px", color: "#122C54" }}>
            Need help? Reach out directly.
          </h2>

          <div className="rg-3">
            {[
              {
                icon: <Mail size={24} color="#22C55E" />,
                title: "Email",
                body: "For document requests or questions about your report, email Dr. Clarke-Wedderburn directly.",
                cta: { label: "info@edquityatthemargins.org", href: "mailto:info@edquityatthemargins.org" },
              },
              {
                icon: <Phone size={24} color="#FBbf24" />,
                title: "Call or text",
                body: "For urgent questions about an upcoming IEP meeting or session.",
                cta: { label: "(786) 810-6178", href: "tel:7868106178" },
              },
              {
                icon: <Calendar size={24} color="#14B8A6" />,
                title: "Schedule a session",
                body: "Book a debrief call, prep session, or follow-up appointment.",
                cta: { label: "Open Calendly", href: CALENDLY, external: true },
              },
            ].map((card, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 10, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {card.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px", color: "#122C54" }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>{card.body}</p>
                </div>
                <a
                  href={card.cta.href}
                  target={card.cta.external ? "_blank" : undefined}
                  rel={card.cta.external ? "noopener noreferrer" : undefined}
                  style={{ display: "block", background: "#122C54", color: "#fff", padding: "10px 18px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 13, marginTop: "auto", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {card.cta.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not a client yet */}
      <section className="sp" style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 800, margin: "0 0 12px", color: "#122C54" }}>Not a client yet?</h2>
          <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.7, margin: "0 0 28px" }}>
            Start with a free 30-minute discovery call. Dr. Clarke-Wedderburn will review your child's situation and recommend the right next step.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
              style={{ background: "#22C55E", color: "#122C54", padding: "13px 28px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 15 }}>
              Book a Free Discovery Call
            </a>
            <Link href="/services"
              style={{ background: "transparent", color: "#122C54", padding: "13px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15, border: "2px solid #e2e8f0" }}>
              See Services
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
