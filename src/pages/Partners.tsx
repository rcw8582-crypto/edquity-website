import { ExternalLink, MapPin } from "lucide-react";
import PageMeta from "@/components/PageMeta";

/**
 * One entry per partner organization. The page renders whatever is in this
 * array, so adding a partner is adding an object here and dropping its logo
 * into public/images/partners/.
 */
const partners = [
  {
    name: "Black in Rehab Foundation",
    location: "Florida",
    website: "https://www.blackinrehab.com/",
    websiteLabel: "blackinrehab.com",
    logo: "/images/partners/black-in-rehab-foundation.png",
    description:
      "The Black in Rehab Foundation is a Florida-based nonprofit that builds community among Black occupational therapists, physical therapists, speech-language pathologists, assistants, and students. Through retreats, workshops, and mentorship, the foundation grows Black representation across the rehabilitation professions, the same professions that deliver many of the related services written into children's IEPs.",
  },
];

export default function Partners() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <PageMeta
        title="Our Partners"
        description="The organizations that work alongside EDquity at the Margins to reach marginalized families of children with disabilities."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Our Partners</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            No organization reaches<br />every family alone.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>
            EDquity at the Margins partners with organizations that already hold the trust of the communities we serve. Each partnership puts free, independent IEP advocacy in front of families who might never have found us on their own.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {partners.map((partner) => (
              <div
                key={partner.name}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 16,
                  padding: 32,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 32,
                  alignItems: "center",
                }}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={160}
                  height={160}
                  loading="lazy"
                  style={{ width: 160, height: 160, objectFit: "contain", flexShrink: 0, margin: "0 auto" }}
                />
                <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: "#122C54", margin: "0 0 8px", letterSpacing: "-0.5px" }}>{partner.name}</h2>
                  <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#64748b", margin: "0 0 14px" }}>
                    <MapPin size={14} color="#14B8A6" aria-hidden="true" />
                    {partner.location}
                  </p>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.75, margin: "0 0 16px" }}>{partner.description}</p>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#122C54", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
                  >
                    Visit {partner.websiteLabel}
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 28, marginTop: 40 }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#122C54", margin: "0 0 10px" }}>Why representation in rehabilitation matters here</h2>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
              Many of the children we serve receive occupational therapy, physical therapy, or speech-language services through their IEPs. The professionals who deliver those services sit at the IEP table, and families are better served when the people across that table reflect and understand their communities.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#122C54", margin: "0 0 12px", letterSpacing: "-0.5px" }}>Partner With Us</h2>
          <p style={{ fontSize: 16, color: "#64748b", margin: "0 0 32px", lineHeight: 1.65 }}>
            If your organization serves families of children with disabilities and you see a way we can reach them together, we want to hear from you.
          </p>
          <a
            href="/contact"
            style={{ display: "inline-block", background: "#122C54", color: "#fff", padding: "14px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 15 }}
          >
            Start the Conversation
          </a>
        </div>
      </section>
    </div>
  );
}
