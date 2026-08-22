import { useEffect, useRef } from "react";
import { Users, Building2, ExternalLink } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import {
  CALENDLY_PROFILE_URL,
  CALENDLY_FAMILY_CALL,
  CALENDLY_PARTNERSHIP_CALL,
  PORTAL_REGISTER_URL,
} from "@/lib/booking";

/**
 * Booking.
 *
 * The two cards describe the calls, and the Calendly widget below them is
 * where a visitor actually picks a time. The widget is pointed at the
 * Calendly profile, so it lists every public event type and nothing else:
 * the walkthrough and the two monitoring events are secret and stay out.
 *
 * The previous version of this page described a "New Family Registration"
 * and a "Partnership and Engagement Inquiry" that never existed on the
 * Microsoft tenant, and its one button pointed at a calendar that returned
 * 404, so /book showed "Some error occurred" to every visitor.
 *
 * The direct links are kept below the widget on purpose. Two third-party
 * embeds have already failed on this site: the Bookings iframe, and the
 * Zeffy donation form (see Donate.tsx). Both render blank when a browser
 * partitions storage in a frame, and because they are cross-origin nothing
 * here can detect the failure and swap in a fallback. Calendly's widget is
 * far more widely used than either, but a visible link costs one line and
 * means a blank box can never cost us a booking.
 */

const NAVY = "#122C54";
const GREEN = "#22C55E";
const TEAL = "#14B8A6";

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

/** Minimal shape of the global the widget script installs. */
type CalendlyGlobal = {
  initInlineWidget?: (opts: { url: string; parentElement: HTMLElement }) => void;
};

const CALLS = [
  {
    icon: <Users size={26} color={GREEN} />,
    who: "For families",
    name: "New Family Getting Started Call",
    length: "30 minutes · Free",
    body:
      "A first conversation for families who want to talk with a person before sharing their child's records. We go over how the free IEP Audit works, which documents we need, when your written report arrives, and how your child's information is protected. Bring any question about the IEP that worries you. Nothing is owed and nothing is expected.",
    href: CALENDLY_FAMILY_CALL,
    accent: GREEN,
  },
  {
    icon: <Building2 size={26} color={TEAL} />,
    who: "For schools, districts, and organizations",
    name: "Partnership and Professional Development Inquiry",
    length: "45 minutes · Free",
    body:
      "Educator professional development is the most common reason schools book this call. We can also talk through the IEP Quality Improvement Program, which reviews and scores your own IEPs, or the EDquity Leader Fellowship for school leadership teams. Bring what you are working on and you will leave knowing what a working relationship would look like, what it would cost, and what it would take to start.",
    href: CALENDLY_PARTNERSHIP_CALL,
    accent: TEAL,
  },
];

export default function Book() {
  const widgetRef = useRef<HTMLDivElement>(null);

  // A <script> tag written into JSX never executes, so the widget script is
  // injected here. On a client-side route change back to /book the script is
  // already loaded and will not rescan the page, so initInlineWidget is
  // called directly when the global is present.
  useEffect(() => {
    const parentElement = widgetRef.current;
    if (!parentElement) return;

    const calendly = (window as unknown as { Calendly?: CalendlyGlobal }).Calendly;
    if (calendly?.initInlineWidget) {
      calendly.initInlineWidget({ url: CALENDLY_PROFILE_URL, parentElement });
      return;
    }

    if (document.querySelector(`script[src="${CALENDLY_SCRIPT}"]`)) return;

    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="Book a Call"
        description="Book a free call with EDquity at the Margins. Families can talk through the free IEP Audit before sending any records, and schools, districts, and organizations can ask about educator professional development, the IEP Quality Improvement Program, or the Leader Fellowship."
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
            Two kinds of call, both free. Choose the one that fits and pick a time on the calendar below.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff", paddingTop: 44, paddingBottom: 12 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
            {CALLS.map((c) => (
              <div
                key={c.name}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: `4px solid ${c.accent}`, borderRadius: 14, padding: "26px 28px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  {c.icon}
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 1.4, textTransform: "uppercase" }}>
                    {c.who}
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px", color: NAVY, lineHeight: 1.3 }}>{c.name}</h2>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: c.accent, margin: "0 0 14px" }}>{c.length}</p>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.75, margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The calendar itself. */}
      <section className="sp" style={{ background: "#fff", paddingTop: 26, paddingBottom: 30 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div
            ref={widgetRef}
            className="calendly-inline-widget"
            data-url={CALENDLY_PROFILE_URL}
            style={{ minWidth: 320, height: 700 }}
          />
          <p style={{ fontSize: 14, color: "#64748b", textAlign: "center", margin: "18px 0 0", lineHeight: 1.7 }}>
            If the calendar does not load, open it directly:{" "}
            <a href={CALENDLY_FAMILY_CALL} target="_blank" rel="noopener noreferrer" style={{ color: NAVY, fontWeight: 700 }}>
              the family call
            </a>{" "}
            or{" "}
            <a href={CALENDLY_PARTNERSHIP_CALL} target="_blank" rel="noopener noreferrer" style={{ color: NAVY, fontWeight: 700 }}>
              the partnership and PD call
            </a>
            . You can also email{" "}
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
      </section>

      {/* Families who already know what they want should not have to book a
          call first. The audit starts in the portal because that is what
          creates the child record and the folder the documents go into. */}
      <section className="sp" style={{ background: "#f8fafc", paddingTop: 40, paddingBottom: 44 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(21px,2.6vw,28px)", fontWeight: 900, color: NAVY, margin: "0 0 12px", letterSpacing: "-0.4px" }}>
            You do not need a call to start.
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 24px" }}>
            The free IEP Audit begins with registration, which is where you upload your child's documents securely. A call is
            there if you want one first, not a step you have to clear.
          </p>
          <a
            href={PORTAL_REGISTER_URL}
            style={{ display: "inline-flex", alignItems: "center", gap: 9, background: NAVY, color: "#fff", padding: "15px 30px", borderRadius: 8, fontWeight: 800, fontSize: 16, textDecoration: "none" }}
          >
            Start your free IEP Audit
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      </section>

    </div>
  );
}
