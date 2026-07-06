import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import PageMeta from "@/components/PageMeta";

const CALENDLY = "https://calendly.com/dr-reba/discovery";

interface LawBoxProps { citation: string; title: string; text: string; }
function LawBox({ citation, title, text }: LawBoxProps) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#14B8A6", letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 6px" }}>{citation}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#122C54", margin: "0 0 8px" }}>{title}</p>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>{text}</p>
    </div>
  );
}

export default function Services() {
  const [lawsOpen, setLawsOpen] = useState(false);

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: "#122C54", background: "#fff" }}>
      <PageMeta
        title="Free IEP Audit and Advocacy Toolkit for Families"
        description="Two free services for families of children with disabilities: an independent IEP Audit and a downloadable Advocacy Toolkit. Delivered virtually nationwide by Dr. Reba Clarke-Wedderburn."
      />

      {/* Hero */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>Services</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 24px", letterSpacing: "-1.5px" }}>
            Independent IEP Support for Families Who Deserve More Than a Form Letter
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: 680, margin: "0 auto 16px" }}>
            We offer two services, and both are free. Every service is delivered virtually by Dr. Reba Clarke-Wedderburn, Founder and Executive Director of EDquity at the Margins. Access is the point, so families never pay to understand or enforce their child's rights.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 40px" }}>
            Serving families across the greater Metro Nashville area and, through our virtual delivery model, anywhere in the country.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
              style={{ background: "#22C55E", color: "#122C54", padding: "15px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              Book a Free Discovery Call
            </a>
            <a href="#track-two"
              style={{ background: "transparent", color: "#fff", padding: "15px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16, border: "2px solid rgba(255,255,255,0.4)" }}>
              No IEP Yet? Start Here
            </a>
          </div>
        </div>
      </section>

      {/* Free Discovery Call */}
      <section className="sp" style={{ background: "#f0fdf4", borderBottom: "1px solid #bbf7d0" }}>
        <div className="rg-2" style={{ maxWidth: 900, margin: "0 auto", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Start Here</p>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, margin: "0 0 16px", color: "#122C54", letterSpacing: "-0.5px" }}>Free 30-Minute Discovery Call</h2>
            <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 28px" }}>
              Not sure where to begin? Book a free discovery call with Dr. Clarke-Wedderburn. She will listen to your situation, answer your first questions, and identify what your child needs right now, with no obligation to continue.
            </p>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#22C55E", color: "#122C54", padding: "14px 28px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              Schedule Your Free Call
            </a>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: 36, border: "1px solid #bbf7d0" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#122C54", margin: "0 0 16px" }}>On the call, Dr. Clarke-Wedderburn will:</p>
            {[
              "Listen to your child's specific situation without judgment",
              "Explain how the free IEP Audit addresses your most immediate need",
              "Answer your first questions about the IEP process and your rights",
              "Tell you exactly what to do next, whether you work with us or not",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <CheckCircle2 size={18} color="#22C55E" style={{ marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 15, color: "#475569", margin: 0, lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Two Free Services */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>What We Offer</p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 900, margin: "0 0 16px", color: "#122C54", letterSpacing: "-1px" }}>Two free services. One purpose.</h2>
            <p style={{ fontSize: 18, color: "#64748b", maxWidth: 680, lineHeight: 1.65, margin: 0 }}>
              The school district arrives at that meeting with a full professional team. These services exist because you should not have to sit across from that team without independent support, and you should never have to pay for it.
            </p>
          </div>

          {/* IEP Audit: featured card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rg-featured featured-pad"
            style={{ background: "#122C54", borderRadius: 20, marginBottom: 32 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.15)", borderRadius: 8, padding: "6px 14px", marginBottom: 24 }}>
                <FileText size={16} color="#22C55E" />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 1, textTransform: "uppercase" }}>Free Service</span>
              </div>
              <h3 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px" }}>IEP Audit</h3>
              <p style={{ fontSize: 24, fontWeight: 900, color: "#22C55E", margin: "0 0 6px" }}>Free</p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: "0 0 24px" }}>Written report delivered within 10 business days</p>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", lineHeight: 1.75, margin: "0 0 32px" }}>
                Most families receive their child's IEP with no independent guidance on whether it meets the legal standard of a free and appropriate public education. This service closes that gap. Dr. Clarke-Wedderburn reviews your child's IEP across six research-grounded domains, identifies missing or inadequate services, and delivers a plain-language written report with specific recommended next steps before your next meeting.
              </p>
              <Link href="/intake"
                style={{ display: "inline-block", background: "#22C55E", color: "#122C54", padding: "15px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
                Start Your Free IEP Audit
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 28 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#22C55E", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 14px" }}>The Six Review Domains</p>
                {[
                  "Present Levels of Academic Achievement and Functional Performance",
                  "Measurable Annual Goals",
                  "Accommodations and Supports",
                  "Special Education and Related Services",
                  "Transition Planning (where applicable)",
                  "Overall IEP Quality",
                ].map((domain, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", marginTop: 7, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.5 }}>{domain}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 28 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#FBbf24", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 14px" }}>What You Receive</p>
                {[
                  "A written Family IEP Review Report in plain language",
                  "A documented list of compliance gaps and concerns",
                  "Recommended questions and requests to bring to the school team",
                  "A 30-minute debrief call included",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <CheckCircle2 size={15} color="#FBbf24" style={{ marginTop: 2, flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Advocacy Toolkit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 20, padding: "clamp(28px,4vw,44px)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,184,166,0.12)", borderRadius: 8, padding: "6px 14px", marginBottom: 20 }}>
              <BookOpen size={16} color="#14B8A6" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#14B8A6", letterSpacing: 1, textTransform: "uppercase" }}>Free Service</span>
            </div>
            <h3 style={{ fontSize: "clamp(22px,2.8vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 8px", letterSpacing: "-0.5px" }}>Advocacy Toolkit</h3>
            <p style={{ fontSize: 24, fontWeight: 900, color: "#22C55E", margin: "0 0 20px" }}>Free</p>
            <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 24px", maxWidth: 760 }}>
              Every family deserves the tools to prepare on their own terms. The Advocacy Toolkit is our library of free, downloadable resources: plain-language guides to the IDEA, an IEP meeting notecatcher, question checklists, template letters, and tools that help you read your child's IEP like an expert and walk into any meeting ready. Download whatever you need, whenever you need it, at no cost.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/resources"
                style={{ display: "inline-block", background: "#14B8A6", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
                Explore the Advocacy Toolkit
              </Link>
              <Link href="/tools/iep-goal-checker"
                style={{ display: "inline-block", background: "transparent", color: "#122C54", padding: "14px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16, border: "2px solid #e2e8f0" }}>
                Try the IEP Goal Checker
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Track 2: No IEP — free educational context */}
      <section id="track-two" className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#14B8A6", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>No IEP Yet?</p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 900, margin: "0 0 16px", color: "#122C54", letterSpacing: "-1px" }}>Your Child Does Not Need an IEP for the School to Have Legal Obligations</h2>
            <p style={{ fontSize: 18, color: "#64748b", maxWidth: 720, lineHeight: 1.65, margin: 0 }}>
              Federal law requires schools to identify children with suspected disabilities, provide appropriate support at every tier, and intensify intervention when a student is not making progress, regardless of whether a formal disability designation is in place. If your child does not yet have an IEP, start with a free discovery call, and use the free Advocacy Toolkit to understand your rights.
            </p>
          </div>

          {/* Accordion: Federal Law */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", marginBottom: 8, overflow: "hidden" }}>
            <button
              onClick={() => setLawsOpen(!lawsOpen)}
              aria-expanded={lawsOpen}
              aria-controls="federal-law-panel"
              style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "20px 28px", background: "none", border: "none", cursor: "pointer",
                fontSize: 15, fontWeight: 700, color: "#122C54", textAlign: "left",
              }}
            >
              <span>The federal law behind your child's rights</span>
              {lawsOpen ? <ChevronUp size={20} color="#122C54" aria-hidden="true" /> : <ChevronDown size={20} color="#122C54" aria-hidden="true" />}
            </button>
            {lawsOpen && (
              <div id="federal-law-panel" className="rg-4" style={{ padding: "0 28px 28px" }}>
                <LawBox citation="20 U.S.C. § 7801(33): ESSA" title="Every Student Succeeds Act" text="Defines Multi-Tiered System of Supports and requires schools to use evidence-based interventions for all students, funded through Title I." />
                <LawBox citation="34 C.F.R. § 300.226: IDEA" title="Early Intervening Services" text="Allows schools to use up to 15% of special education funds to provide coordinated support for students not yet identified as needing special education who need additional academic or behavioral help." />
                <LawBox citation="34 C.F.R. § 104.33: Section 504" title="Rehabilitation Act of 1973" text="Requires schools to provide a Free Appropriate Public Education to students with disabilities, including those who do not qualify for an IEP." />
                <LawBox citation="34 C.F.R. § 300.111: IDEA" title="Child Find Obligation" text="Schools must actively identify, locate, and evaluate all children with suspected disabilities, including those who have never been referred for special education." />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Your Advocate */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="rg-sidebar">
            <div style={{ background: "#122C54", borderRadius: 20, padding: 40, textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: "#122C54" }}>R</span>
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>Dr. Reba Clarke-Wedderburn</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "0 0 20px" }}>Founder & Executive Director</p>
              <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", background: "#22C55E", color: "#122C54", padding: "12px 20px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
                Book a Free Call
              </a>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>About Your Advocate</p>
              <h2 style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 900, color: "#122C54", margin: "0 0 20px", letterSpacing: "-0.5px" }}>Every service is delivered personally by Dr. Clarke-Wedderburn.</h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 16px" }}>
                Dr. Reba Clarke-Wedderburn holds a doctorate in education and brings years of experience as a special education professional, teacher preparation program developer, and parent of a child with a disability. She founded EDquity at the Margins after years of watching families navigate a system that was not designed to include them, and after navigating it herself.
              </p>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: 0 }}>
                Families are not handed off to staff or routed through a general intake queue. You work directly with the person whose name is on the door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: "#0d1f3c", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Families We've Served</p>
            <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>What families say about working with us.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24 }}>
            {[
              { quote: "The IEP Audit alone changed everything. We had been told for two years our daughter was 'progressing appropriately.' The report showed she hadn't met a single measurable goal. We went back in knowing exactly what to ask.", attribution: "Parent, Florida · IEP Audit" },
              { quote: "Dr. Clarke-Wedderburn walked me through every line of the IEP, explained what was legally required, and helped me understand I had real power in that meeting. I just didn't know it yet.", attribution: "Single father, Kentucky · IEP Audit" },
              { quote: "My son's goals finally reflect what he actually needs. For the first time in three years, the team heard us. Dr. Clarke-Wedderburn changed how I see my role in that room.", attribution: "Parent, Georgia · IEP Audit" },
            ].map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 32 }}>
                <div style={{ fontSize: 40, color: "#22C55E", lineHeight: 1, marginBottom: 16, fontFamily: "Georgia, serif", opacity: 0.6 }}>"</div>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, margin: "0 0 20px", fontStyle: "italic" }}>{t.quote}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0, fontWeight: 600, letterSpacing: 0.3 }}>{t.attribution}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 28 }}>Details anonymized. Shared with permission.</p>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="sp" style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0, textAlign: "center" }}>
            EDquity at the Margins provides independent educational expertise, not legal advice. Dr. Clarke-Wedderburn is not an attorney and does not provide legal representation. Families who believe their child's rights have been violated under IDEA are encouraged to consult a special education attorney or contact their state's Parent Training and Information Center at{" "}
            <a href="https://parentcenterhub.org" target="_blank" rel="noopener noreferrer" style={{ color: "#14B8A6", textDecoration: "none" }}>parentcenterhub.org</a>.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="sp-lg" style={{ background: "#22C55E" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,3vw,38px)", fontWeight: 900, color: "#122C54", margin: "0 0 16px", letterSpacing: "-0.5px" }}>Ready to get started?</h2>
          <p style={{ fontSize: 18, color: "rgba(18,44,84,0.75)", lineHeight: 1.65, margin: "0 0 36px" }}>
            Book a free 30-minute discovery call. Dr. Clarke-Wedderburn will help you understand your options and identify the right first step for your child.
          </p>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#122C54", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 17 }}>
            Book Your Free Discovery Call
          </a>
        </div>
      </section>

    </div>
  );
}
