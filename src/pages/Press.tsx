import { motion } from "framer-motion";
import { Mail, Download, Mic, BookOpen } from "lucide-react";
import PageMeta from "@/components/PageMeta";

const topics = [
  "Special education law and the rights of marginalized families",
  "Disparities in IEP quality across racial and socioeconomic lines",
  "How families can advocate effectively without hiring a lawyer",
  "The gap between what IDEA promises and what schools deliver",
  "Building advocacy capacity in under-resourced communities",
  "The intersection of race, income, and special education outcomes",
];

export default function Press() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <PageMeta
        title="Press & Media"
        description="Media inquiries, Dr. Clarke-Wedderburn's bio and speaking topics, and press kit for EDquity at the Margins."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Press & Media</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            For journalists,<br />podcasters, and speakers.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>
            Dr. Clarke-Wedderburn brings deep expertise in special education law, racial equity in schools, and family advocacy. We welcome media inquiries and speaking invitations.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="md-grid-split" style={{ gap: 56 }}>

            <div>
              <div style={{ background: "#122C54", borderRadius: 20, aspectRatio: "4/5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", marginInline: "auto", marginBottom: 16 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: "#122C54" }}>R</span>
                  </div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: 0 }}>Dr. Reba Clarke-Wedderburn</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "6px 0 0" }}>Photo available upon request</p>
                </div>
              </div>
              <a href="mailto:info@edquityatthemargins.org?subject=Press Kit Request"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#122C54", color: "#fff", padding: "13px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                <Download size={15} /> Request Press Kit
              </a>
            </div>

            <div>
              <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 20px", letterSpacing: "-0.5px" }}>
                Dr. Reba Clarke-Wedderburn, Ed.D.
              </h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, margin: "0 0 20px" }}>
                Dr. Reba Clarke-Wedderburn is the Founder and Executive Director of EDquity at the Margins and a nationally recognized voice on special education equity. She holds a doctorate in education and brings 21 years of experience as a special education professional, IEP advocate, and teacher preparation program developer.
              </p>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, margin: "0 0 20px" }}>
                Dr. Clarke-Wedderburn's work sits at the intersection of law, race, and educational practice. She translates technical special education policy into plain language that gives marginalized families the power to hold schools accountable to the rights already guaranteed by federal law.
              </p>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, margin: 0 }}>
                She has worked with families across more than eight states and is available for interviews, panel discussions, podcast appearances, and keynote presentations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="md-grid-split">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <Mic size={22} color="#22C55E" />
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "#122C54", margin: 0 }}>Speaking Topics</h2>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {topics.map((t, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: "#475569", lineHeight: 1.5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0, marginTop: 7 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <BookOpen size={22} color="#14B8A6" />
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "#122C54", margin: 0 }}>Media Inquiries</h2>
              </div>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 28px" }}>
                For interview requests, background commentary, and speaking inquiries, please reach out by email. We typically respond within two business days.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href="mailto:info@edquityatthemargins.org?subject=Media Inquiry"
                  style={{ display: "flex", alignItems: "center", gap: 10, background: "#122C54", color: "#fff", padding: "14px 20px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
                  <Mail size={16} /> info@edquityatthemargins.org
                </a>
                <a href="tel:+17868106178"
                  style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", color: "#122C54", padding: "14px 20px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15, border: "1px solid #e2e8f0" }}>
                  (786) 810-6178
                </a>
              </div>

              <div style={{ marginTop: 32, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 12, padding: "18px 20px" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#15803d", margin: "0 0 4px" }}>Deadline-sensitive?</p>
                <p style={{ fontSize: 13, color: "#166534", margin: 0, lineHeight: 1.55 }}>
                  Note "URGENT" in your subject line and we will prioritize your request within the same business day whenever possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#0d1f3c" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, fontStyle: "italic", margin: "0 0 32px" }}>
            "Every story about a family fighting for their child's IEP is ultimately a story about whether the law applies equally to everyone. It does not, yet, but it can."
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#22C55E", margin: 0 }}>Dr. Reba Clarke-Wedderburn</p>
        </div>
      </section>
    </div>
  );
}
