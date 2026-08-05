import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";

/**
 * Public 404.
 *
 * This page used to read "Did you forget to add the page to the router?", which
 * is a note to a developer sitting on a page that any mistyped URL reaches. A
 * family who lands here is usually looking for one of four things, so the page
 * offers those rather than an apology.
 */

const NAVY = "#122C54";
const GREEN = "#22C55E";

const DESTINATIONS = [
  { href: "/services", label: "Free family services", note: "The IEP Audit and the Advocacy Toolkit, both free" },
  { href: "/resources", label: "Free resources", note: "Worksheets, reference cards, and templates to download" },
  { href: "/events", label: "Events and workshops", note: "Free monthly sessions on IEP and 504 rights" },
  { href: "/contact", label: "Contact us", note: "Ask a question and we will reply within two business days" },
];

export default function NotFound() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY }}>
      <PageMeta
        title="Page not found"
        description="That page does not exist. Find our free family services, downloadable IEP resources, upcoming workshops, or contact us directly."
      />

      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>
            Page not found
          </p>
          <h1 style={{ fontSize: "clamp(30px,4.2vw,46px)", fontWeight: 900, color: "#fff", margin: "0 0 18px", letterSpacing: "-1.2px", lineHeight: 1.15 }}>
            That page has moved or never existed.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0 }}>
            Nothing you were looking for is gone. Here is where most families are headed.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {DESTINATIONS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ display: "flex", flexDirection: "column", gap: 8, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px 26px", textDecoration: "none" }}
              >
                <span style={{ fontSize: 17.5, fontWeight: 800, color: NAVY }}>{item.label}</span>
                <span style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.65 }}>{item.note}</span>
              </Link>
            ))}
          </div>

          <p style={{ fontSize: 15.5, color: "#64748b", lineHeight: 1.7, margin: "32px 0 0", textAlign: "center" }}>
            If you followed a link here from somewhere on this site, please{" "}
            <Link href="/contact" style={{ color: NAVY, fontWeight: 700 }}>
              tell us
            </Link>{" "}
            so we can fix it.
          </p>
        </div>
      </section>
    </div>
  );
}
