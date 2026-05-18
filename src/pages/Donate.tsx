import PageMeta from "@/components/PageMeta";

export default function Donate() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <PageMeta
        title="Donate"
        description="Support EDquity at the Margins. Your donation helps marginalized families access expert IEP advocacy and fight for their children's federally guaranteed rights."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Support Our Work</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Every dollar closes the gap between what the law promises and what families receive.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0 }}>
            A child's federally guaranteed right to an appropriate education should not depend on whether their family can afford to hire someone who understands the law.
          </p>
        </div>
      </section>

      {/* Social proof quote */}
      <section className="sp" style={{ background: "#0d1f3c" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "#22C55E", lineHeight: 1, fontFamily: "Georgia, serif", opacity: 0.6 }}>"</div>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, margin: "8px 0 20px", fontStyle: "italic" }}>
            We had been told for two years that our daughter was progressing appropriately. The IEP review showed she hadn't met a single measurable goal. That report gave us the language and the evidence to go back in and demand what the law requires, and we got it.
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, fontWeight: 600, letterSpacing: 0.3 }}>FAMILY SUPPORTED BY EDquity · FLORIDA</p>
        </div>
      </section>

      {/* Donorbox Widget */}
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ textAlign: "center", marginBottom: 40, padding: "0 24px" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, color: "#122C54", margin: "0 0 12px", letterSpacing: "-0.5px" }}>Make a Donation</h2>
          <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>100% of donations support direct family services and scholarship access.</p>
        </div>

        <div data-testid="donorbox-widget-container" style={{ maxWidth: 920, margin: "0 auto", padding: "0 16px" }}>
          <iframe
            src="https://donorbox.org/embed/iep-advocacy-at-the-margins?show_content=true"
            name="donorbox"
            allow="payment"
            seamless
            frameBorder={0}
            scrolling="yes"
            style={{ width: "100%", minWidth: 250, height: "100vh", border: "none", borderRadius: 12, display: "block" }}
            title="Donate to EDquity at the Margins"
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 20, padding: "0 24px" }}>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 10px" }}>Prefer to donate directly on Donorbox?</p>
          <a
            href="https://donorbox.org/iep-advocacy-at-the-margins"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#122C54", color: "#fff", padding: "11px 26px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}
          >
            Open Donation Page
          </a>
        </div>

        <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginTop: 20, lineHeight: 1.6, padding: "0 24px" }}>
          EDquity at the Margins is a Tennessee charitable corporation (EIN 42-2295582) with a 501(c)(3) application pending before the IRS. Donations may be tax-deductible once our determination is received. Please consult your tax advisor for your specific situation.
        </p>
      </section>

      {/* What your donation funds */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 40px", textAlign: "center", letterSpacing: "-0.5px" }}>What your donation funds</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {[
              { amount: "$25", label: "covers a resource guide printed and mailed to a family without reliable internet access" },
              { amount: "$75", label: "subsidizes one IEP Document Analysis session for a scholarship family" },
              { amount: "$250", label: "fully funds one family's complete IEP analysis and debrief call" },
              { amount: "$500", label: "supports a full month of Advocacy Coaching for a family in a complex dispute" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px 22px", textAlign: "center" }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: "#22C55E", margin: "0 0 10px", letterSpacing: "-1px" }}>{item.amount}</p>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other ways to support */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#fff", margin: "0 0 16px" }}>Other ways to support our work</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: "0 0 32px" }}>
            Share our resources with families who need them, volunteer your skills, or reach out about partnership opportunities.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/volunteer" style={{ background: "#22C55E", color: "#122C54", padding: "13px 28px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 15 }}>
              Volunteer
            </a>
            <a href="/resources" style={{ background: "transparent", color: "#fff", padding: "13px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15, border: "2px solid rgba(255,255,255,0.35)" }}>
              Share Free Resources
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
