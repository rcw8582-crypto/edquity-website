import { motion } from "framer-motion";
import { Link } from "wouter";
import { Download, ExternalLink, FileText, BookOpen, MessageSquare, Search, Layers, Target, Newspaper, ArrowRight, ClipboardList } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { RESOURCES } from "@/content/resources";

import { BOOKING_URL } from "@/lib/booking";

const interactiveTools = [
  {
    icon: <Layers size={28} color="#22C55E" />,
    title: "Our Methodology",
    desc: "The six areas we review in every IEP, in plain language. Use it as a guide when you read your child's IEP or prepare for the next meeting.",
    href: "/our-methodology",
    badge: "Methodology",
    badgeColor: "#166534",
  },
  {
    icon: <Target size={28} color="#14B8A6" />,
    title: "IEP Goal Checker",
    desc: "Paste your child's annual goal exactly as written. The tool sorts it into the seven required components, flags vague language, and gives you the exact questions to ask at your next meeting.",
    href: "/tools/iep-goal-checker",
    badge: "Interactive Tool",
    badgeColor: "#14B8A6",
  },
  {
    icon: <Newspaper size={28} color="#8B5CF6" />,
    title: "In the Margins",
    desc: "Plain-language articles on IEP rights, the stranger test, the difference between MTSS, 504, and IEP, and how families can advocate effectively.",
    href: "/news",
    badge: "Articles",
    badgeColor: "#8B5CF6",
  },
];

const externalLinks = [
  {
    label: "IDEA: Individuals with Disabilities Education Act",
    url: "https://sites.ed.gov/idea/",
    note: "U.S. Department of Education",
  },
  {
    label: "Office of Special Education and Rehabilitative Services (OSERS)",
    url: "https://www.ed.gov/about/ed-offices/osers",
    note: "U.S. Department of Education — umbrella office for OSEP and RSA",
  },
  {
    label: "Office of Special Education Programs (OSEP)",
    url: "https://www.ed.gov/about/ed-offices/osers/osep",
    note: "U.S. Department of Education — serves children with disabilities birth through 21",
  },
  {
    label: "Find Your State's Parent Training & Information Center (PTI)",
    url: "https://www.parentcenterhub.org/find-your-center/",
    note: "Parent Center Hub",
  },
  {
    label: "Procedural Safeguards Notice (34 CFR § 300.504)",
    url: "https://www.law.cornell.edu/cfr/text/34/300.504",
    note: "Cornell Law School — Legal Information Institute",
  },
  {
    label: "Wrightslaw: Special Education Law & Advocacy",
    url: "https://www.wrightslaw.com/",
    note: "Wrightslaw",
  },
  {
    label: "Yellow Pages for Kids with Disabilities",
    url: "https://www.yellowpagesforkids.com/",
    note: "State-by-state directory of advocates, evaluators, therapists, and attorneys",
  },
  {
    label: "Defining the Teddy Bear and Stranger Test (Tipsheet)",
    url: "https://wso2-gateway.tnedu.gov/tn-tan/1.0/sites/default/files/tn-tan/documents/2025-01/Defining_Teddy_Bear_and_Stranger_Test%20%281%29%20%281%29.pdf",
    note: "Tennessee Department of Education / Vanderbilt TRIAD",
  },
];

export default function Resources() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <PageMeta
        title="Free IEP Resources"
        description="Free downloadable guides for families navigating special education: IEP rights checklists, meeting preparation templates, complaint letter starters, and more."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Free Resources</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Tools for families who need to know their rights.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0, maxWidth: 600, marginInline: "auto" }}>
            Every guide below was written with one goal: giving you the specific knowledge you need to advocate effectively for your child. Download freely, share widely.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#122C54", margin: "0 0 12px", letterSpacing: "-0.5px" }}>Interactive Tools and Methodology</h2>
          <p style={{ fontSize: 16, color: "#64748b", margin: "0 0 40px", lineHeight: 1.65, maxWidth: 720 }}>
            Use these tools right now to read your child's IEP with sharper eyes. Everything below is free and works on your phone, tablet, or laptop.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {interactiveTools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", gap: 16, position: "relative" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {tool.icon}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: tool.badgeColor, background: `${tool.badgeColor}18`, padding: "4px 12px", borderRadius: 999 }}>
                    {tool.badge}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#122C54", margin: "0 0 10px" }}>{tool.title}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{tool.desc}</p>
                </div>
                <Link
                  href={tool.href}
                  style={{
                    marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "#22C55E", color: "#122C54", padding: "12px 20px", borderRadius: 8,
                    fontWeight: 700, fontSize: 14, textDecoration: "none",
                  }}
                >
                  Open <ArrowRight size={15} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#122C54", margin: "0 0 48px", letterSpacing: "-0.5px" }}>Downloadable Guides</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {RESOURCES.map((guide, i) => (
              <motion.div
                key={guide.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: guide.accent, background: `${guide.accent}18`, padding: "4px 12px", borderRadius: 999 }}>
                    {guide.kind}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#122C54", margin: "0 0 10px" }}>{guide.title}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{guide.summary}</p>
                </div>
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                  <Link
                    href={`/resources/${guide.slug}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: "#122C54", color: "#fff", padding: "12px 20px", borderRadius: 8,
                      fontWeight: 700, fontSize: 14, textDecoration: "none",
                    }}
                  >
                    What's inside <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                  <a
                    href={guide.file}
                    download
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      color: "#122C54", padding: "10px 20px", borderRadius: 8, border: "1px solid #cbd5e1",
                      fontWeight: 700, fontSize: 13.5, textDecoration: "none",
                    }}
                  >
                    <Download size={14} aria-hidden="true" /> Download PDF
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 32, textAlign: "center" }}>
            All guides are free. No email required. Share with any family who needs them.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 12px", letterSpacing: "-0.5px" }}>External Resources</h2>
          <p style={{ fontSize: 16, color: "#64748b", margin: "0 0 40px", lineHeight: 1.65 }}>
            These organizations and databases provide additional authoritative information on special education law and family rights.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {externalLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                  padding: "16px 20px", borderRadius: 10, border: "1px solid #e2e8f0",
                  textDecoration: "none", transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#122C54", margin: 0 }}>{link.label}</p>
                  <p style={{ fontSize: 12, color: "#64748b", margin: "3px 0 0" }}>{link.note}</p>
                </div>
                <ExternalLink size={16} color="#22C55E" style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#22C55E" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 900, color: "#122C54", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            Resources give you a starting point. Expert guidance tells you what a specific IEP means for a specific child.
          </h2>
          <p style={{ fontSize: 17, color: "#122C54", lineHeight: 1.65, margin: "0 0 36px" }}>
            A checklist tells you what to look for. We tell you what it means for your specific child and what to do about it.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/book"
              style={{ display: "inline-block", background: "#122C54", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              Start Your Free IEP Audit
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
