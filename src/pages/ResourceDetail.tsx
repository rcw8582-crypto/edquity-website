import { Link, useParams } from "wouter";
import { Download, ArrowRight, ChevronRight, Check } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import NotFound from "@/pages/not-found";
import { getResource, getRelated } from "@/content/resources";
import { PORTAL_REGISTER_URL } from "@/lib/booking";

/**
 * One page per free resource.
 *
 * Structure follows the pattern used by resource libraries that work: a
 * breadcrumb back to the hub, prose explaining the problem before the download,
 * the contents so a family knows what they are getting, and related cards at the
 * bottom so no resource page is a dead end.
 */

const NAVY = "#122C54";
const GREEN = "#22C55E";

export default function ResourceDetail() {
  const params = useParams<{ slug: string }>();
  const resource = params.slug ? getResource(params.slug) : undefined;
  if (!resource) return <NotFound />;

  const related = getRelated(resource);

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY }}>
      <PageMeta
        title={resource.title}
        description={`${resource.summary} Free to download from EDquity at the Margins, with no email required.`}
      />

      <section className="sp" style={{ background: NAVY, paddingBottom: 48 }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <nav aria-label="Breadcrumb" style={{ marginBottom: 26 }}>
            <ol style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, listStyle: "none", margin: 0, padding: 0, fontSize: 13.5 }}>
              <li>
                <Link href="/resources" style={{ color: GREEN, fontWeight: 700, textDecoration: "none" }}>
                  Free resources
                </Link>
              </li>
              <li aria-hidden="true" style={{ display: "flex", alignItems: "center", color: "rgba(255,255,255,0.4)" }}>
                <ChevronRight size={14} />
              </li>
              <li style={{ color: "rgba(255,255,255,0.65)" }} aria-current="page">
                {resource.title}
              </li>
            </ol>
          </nav>

          <span style={{ display: "inline-block", fontSize: 12, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: resource.accent, background: `${resource.accent}20`, padding: "5px 13px", borderRadius: 999, marginBottom: 18 }}>
            {resource.kind}
          </span>

          <h1 style={{ fontSize: "clamp(30px,4.2vw,46px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.2px", lineHeight: 1.12 }}>
            {resource.title}
          </h1>

          <p style={{ fontSize: 18.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, margin: 0 }}>
            {resource.summary}
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {resource.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} style={{ fontSize: 17.5, color: "#475569", lineHeight: 1.85, margin: "0 0 22px" }}>
              {paragraph}
            </p>
          ))}

          <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 900, margin: "40px 0 20px", letterSpacing: "-0.4px" }}>
            What's inside
          </h2>
          <ul style={{ listStyle: "none", margin: "0 0 40px", padding: 0, display: "flex", flexDirection: "column", gap: 13 }}>
            {resource.inside.map((item) => (
              <li key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Check size={19} color={GREEN} strokeWidth={3} style={{ flexShrink: 0, marginTop: 3 }} aria-hidden="true" />
                <span style={{ fontSize: 16.5, color: "#475569", lineHeight: 1.7 }}>{item}</span>
              </li>
            ))}
          </ul>

          <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.4px" }}>
            How to use it
          </h2>
          <p style={{ fontSize: 17.5, color: "#475569", lineHeight: 1.85, margin: "0 0 40px" }}>
            {resource.howToUse}
          </p>

          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "28px 30px" }}>
            <a
              href={resource.file}
              download
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: NAVY, color: "#fff", padding: "15px 32px", borderRadius: 8, fontWeight: 800, fontSize: 16, textDecoration: "none" }}
            >
              <Download size={17} aria-hidden="true" /> Download the PDF
            </a>
            <p style={{ fontSize: 14, color: "#64748b", margin: "16px 0 0", lineHeight: 1.6 }}>
              Free, with no email required. Print it, copy it, and share it with any family who needs it.
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sp" style={{ background: "#f8fafc" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 900, margin: "0 0 28px", letterSpacing: "-0.4px" }}>
              Use these alongside it
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20 }}>
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/resources/${item.slug}`}
                  style={{ display: "flex", flexDirection: "column", gap: 12, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "24px 26px", textDecoration: "none" }}
                >
                  <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.3, textTransform: "uppercase", color: item.accent }}>
                    {item.kind}
                  </span>
                  <span style={{ fontSize: 17.5, fontWeight: 800, color: NAVY, lineHeight: 1.3 }}>{item.title}</span>
                  <span style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.65 }}>{item.summary}</span>
                  <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14.5, fontWeight: 700, color: NAVY, paddingTop: 6 }}>
                    Read more <ArrowRight size={15} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sp" style={{ background: GREEN }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(23px,2.9vw,34px)", fontWeight: 900, color: NAVY, margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            A worksheet tells you what to look for. An audit tells you what your child's IEP actually says.
          </h2>
          <p style={{ fontSize: 17, color: "#122C54", lineHeight: 1.7, margin: "0 0 32px" }}>
            We review your child's IEP across six research-grounded domains and send you a plain-language
            report with the specific questions to ask. Families pay nothing.
          </p>
          <a
            href={PORTAL_REGISTER_URL}
            style={{ display: "inline-block", background: NAVY, color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 800, fontSize: 16.5, textDecoration: "none" }}
          >
            Start your free IEP Audit
          </a>
        </div>
      </section>
    </div>
  );
}
