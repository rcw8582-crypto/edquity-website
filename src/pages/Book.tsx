import PageMeta from "@/components/PageMeta";
import { BOOKING_PAGE_URL } from "@/lib/booking";

/**
 * Booking, embedded rather than linked out.
 *
 * Every booking button on the site used to leave for outlook.office.com,
 * which meant two things: the visitor landed on a Microsoft page carrying
 * none of our own context, and measurement stopped at the click, so we could
 * count who set off to book and never who arrived. Framing the same page here
 * keeps the visitor on the domain and makes the step measurable.
 *
 * The direct link stays visible below the frame. Some browsers block
 * third-party frames outright when a visitor has tightened their privacy
 * settings, and a booking page that silently renders blank is worse than one
 * extra click.
 */

const NAVY = "#122C54";
const GREEN = "#22C55E";

export default function Book() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="Book a Call"
        description="Book a free call with Dr. Reba Clarke-Wedderburn. Families can register for a free IEP Audit, and schools and organizations can ask about the IEP Quality Improvement Program."
      />

      <section className="sp" style={{ background: NAVY, paddingBottom: 40 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>
            Book a call
          </p>
          <h1 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 900, color: "#fff", margin: "0 0 18px", letterSpacing: "-1.2px", lineHeight: 1.1 }}>
            Pick a time that works for you.
          </h1>
          <p style={{ fontSize: 17.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
            Families, choose New Family Registration to start a free IEP Audit. Schools and
            organizations, choose Partnership and Engagement Inquiry. Every call is free and there is
            nothing to prepare.
          </p>
        </div>
      </section>

      <section style={{ background: "#f8fafc", padding: "32px 16px 8px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <iframe
            src={`${BOOKING_PAGE_URL}?ismsaljsauthenabled`}
            title="Book a call with EDquity at the Margins"
            scrolling="yes"
            style={{
              width: "100%",
              height: "clamp(1150px, 165vh, 1800px)",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              background: "#fff",
              display: "block",
            }}
          />
        </div>
      </section>

      <section style={{ background: "#f8fafc", padding: "12px 24px 56px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 12px" }}>
            Calendar not loading? Open it in a new tab instead.
          </p>
          <a
            href={BOOKING_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", background: NAVY, color: "#fff", padding: "12px 26px", borderRadius: 8, fontWeight: 700, fontSize: 14.5, textDecoration: "none" }}
          >
            Open the booking page
          </a>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: "22px 0 0" }}>
            You can also email{" "}
            <a href="mailto:info@edquityatthemargins.org" style={{ color: NAVY, fontWeight: 700 }}>
              info@edquityatthemargins.org
            </a>{" "}
            or call{" "}
            <a href="tel:+17868106178" style={{ color: NAVY, fontWeight: 700 }}>
              (786) 810-6178
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
