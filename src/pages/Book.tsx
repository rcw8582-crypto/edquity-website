import { Link } from "wouter";
import { Users, Building2, ExternalLink } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { BOOKING_PAGE_URL } from "@/lib/booking";

/**
 * Booking.
 *
 * The Microsoft Bookings page is framed below, but it is never the only way
 * through. The frame renders blank on some loads and fine on the next, which
 * is what a third-party booking app does when a browser partitions or blocks
 * its storage, and it cannot be detected from here because the frame is
 * cross-origin and its failure looks identical to its success from the
 * outside. So the two services are described in our own markup and the direct
 * link sits above the frame rather than beneath it. A visitor who sees a blank
 * box has already passed a button that works.
 *
 * Describing the services here also means the page carries real content of its
 * own instead of being a wrapper around someone else's iframe, which is what
 * gets a page indexed.
 */

const NAVY = "#122C54";
const GREEN = "#22C55E";
const TEAL = "#14B8A6";

const SERVICES = [
  {
    icon: <Users size={26} color={GREEN} />,
    name: "New Family Registration",
    who: "For families",
    length: "30 minutes · Free",
    body:
      "Register your family for a free IEP Audit. We walk through how the audit works, which documents to send, when your written report arrives, and how your child's information is protected. Bring any question about the IEP that worries you.",
    accent: GREEN,
  },
  {
    icon: <Building2 size={26} color={TEAL} />,
    name: "Partnership and Engagement Inquiry",
    who: "For schools and organizations",
    length: "45 minutes",
    body:
      "A call for organizations serving families of students with disabilities. Bring what you are working on and we will talk through whether the IEP Quality Improvement Program, the EDquity Leader Fellowship, or a partnership fits. You will leave knowing what a working relationship would look like and what it would take to start.",
    accent: TEAL,
  },
];

export default function Book() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="Book a Call"
        description="Book a free call with Dr. Reba Clarke-Wedderburn. Families can register for a free IEP Audit, and schools and organizations can ask about the IEP Quality Improvement Program or the Leader Fellowship."
      />

      <section className="sp" style={{ background: NAVY, paddingBottom: 44 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>
            Book a call
          </p>
          <h1 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 900, color: "#fff", margin: "0 0 18px", letterSpacing: "-1.2px", lineHeight: 1.1 }}>
            Pick a time that works for you.
          </h1>
          <p style={{ fontSize: 17.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
            Two kinds of call, both free. Choose the one that fits and pick a time on the calendar.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff", paddingTop: 44, paddingBottom: 12 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
            {SERVICES.map((s) => (
              <div
                key={s.name}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: `4px solid ${s.accent}`, borderRadius: 14, padding: "26px 28px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {s.icon}
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 1.4, textTransform: "uppercase" }}>
                    {s.who}
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px", color: NAVY, lineHeight: 1.3 }}>{s.name}</h2>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: s.accent, margin: "0 0 14px" }}>{s.length}</p>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.75, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* Above the frame on purpose: this is the route that always works. */}
          <div style={{ textAlign: "center", marginTop: 34 }}>
            <a
              href={BOOKING_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: GREEN, color: NAVY, padding: "16px 36px", borderRadius: 8, fontWeight: 800, fontSize: 17, textDecoration: "none" }}
            >
              Open the booking calendar
              <ExternalLink size={17} aria-hidden="true" />
            </a>
            <p style={{ fontSize: 14, color: "#64748b", margin: "14px 0 0" }}>
              Opens in a new tab. You can also use the calendar below, email{" "}
              <a href="mailto:info@edquityatthemargins.org" style={{ color: NAVY, fontWeight: 700 }}>
                info@edquityatthemargins.org
              </a>
              , or call or text{" "}
              <a href="tel:+17868106178" style={{ color: NAVY, fontWeight: 700 }}>
                (786) 810-6178
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#f8fafc", padding: "28px 16px 56px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <iframe
            src={`${BOOKING_PAGE_URL}?ismsaljsauthenabled`}
            title="Booking calendar for EDquity at the Margins"
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
    </div>
  );
}
