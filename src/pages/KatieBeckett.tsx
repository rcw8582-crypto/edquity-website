import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import PageMeta from "@/components/PageMeta";

import { BOOKING_URL } from "@/lib/booking";

/**
 * Educational resource page on Tennessee's Katie Beckett program and the
 * Family Caregiver Education and Training reimbursement benefit. This page is
 * deliberately informational: it is not an ad landing page and should stay
 * excluded from paid campaigns. Reimbursement language must remain
 * conditional (may, subject to approval) and the non-affiliation disclaimer
 * must remain on the page.
 */

const STEPS = [
  {
    title: "Talk to your support coordinator or MCO first",
    text: "Before enrolling in any training, contact your child's Katie Beckett support coordinator (Part B) or BlueCare care coordinator (Part A) and ask about using the Family Caregiver Education and Training benefit. Approval must happen before the training begins.",
  },
  {
    title: "Request pre-approval for the specific training",
    text: "Your managed care organization must approve the education or training activity in advance. We provide a syllabus, learning objectives, and a cost breakdown you can submit with your request.",
  },
  {
    title: "Enroll and keep your receipt",
    text: "Once your MCO approves the request, enroll and pay as usual. Keep your receipt and enrollment confirmation.",
  },
  {
    title: "Submit for reimbursement",
    text: "Send your receipt and the approval documentation back to your MCO following their instructions. Reimbursement is limited to $500 per calendar year for this benefit.",
  },
];

export default function KatieBeckett() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: "#122C54", background: "#fff" }}>
      <PageMeta
        title="Katie Beckett Program: A Parent's Guide to Funding Training and Support"
        description="A plain-language guide for Tennessee families on the Katie Beckett program, including the Family Caregiver Education and Training benefit that can reimburse up to $500 per year for parent training."
      />

      {/* Hero */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>Family Resource</p>
          <h1 style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 900, lineHeight: 1.1, color: "#fff", margin: "0 0 24px", letterSpacing: "-1px" }}>
            The Katie Beckett Program, Explained for Parents
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, maxWidth: 680, margin: "0 auto" }}>
            Tennessee's Katie Beckett program helps children with disabilities and complex medical needs get services at home, even when their parents earn too much to qualify for Medicaid. This guide explains what the program covers and how one specific benefit can reimburse families for parent training.
          </p>
        </div>
      </section>

      {/* What the program is */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.5px" }}>What the program is</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 16px" }}>
            The program serves Tennessee children under 18 in two main groups. Part A serves children with the most significant needs and provides full TennCare benefits plus up to $15,000 per year in home and community-based services. Part B serves children at risk of institutional care and provides up to $10,000 per year in services without full Medicaid enrollment. In both groups, parental income does not disqualify the child.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 16px" }}>
            Covered services include respite, supportive home care, assistive technology, home and vehicle modifications, community transportation, and several family support services, including one benefit that matters directly to parents who want to become stronger advocates.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: 0 }}>
            Applications and program details live with the state. Start at the{" "}
            <a href="https://www.tn.gov/tenncare/long-term-services-supports/katie-beckett-waiver.html" target="_blank" rel="noopener noreferrer" style={{ color: "#0F766E", textDecoration: "underline" }}>TennCare Katie Beckett page</a>{" "}
            or the{" "}
            <a href="https://www.tn.gov/disability-and-aging/disability-aging-programs/katie-beckett.html" target="_blank" rel="noopener noreferrer" style={{ color: "#0F766E", textDecoration: "underline" }}>Department of Disability and Aging</a>.
          </p>
        </div>
      </section>

      {/* The training benefit */}
      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.5px" }}>The Family Caregiver Education and Training benefit</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 16px" }}>
            Children enrolled in Katie Beckett Part A or Part B have a benefit that reimburses the family up to $500 per calendar year for educational materials, training programs, workshops, and conferences. Under TennCare's rules, qualifying training helps the caregiver understand the child's disability, gain confidence in providing support, access community resources, develop advocacy skills, and support the child's self-advocacy.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 28px" }}>
            Parent training focused on IEP advocacy fits the purposes this benefit names, including our{" "}
            <Link href="/services" style={{ color: "#0F766E", textDecoration: "underline" }}>Parent IEP Advocacy Academy</Link>. Approval is never automatic: the family's managed care organization decides each request, and it must approve the training before the training starts.
          </p>

          <h3 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 20px" }}>How reimbursement works, step by step</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#22C55E", color: "#122C54", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>{step.title}</p>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we provide */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.5px" }}>What we provide for your request</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 20px" }}>
            If you plan to request reimbursement for the Parent IEP Advocacy Academy or any of our training, ask us and we will prepare the paperwork your MCO expects:
          </p>
          {[
            "A syllabus for each workshop with plain-language learning objectives",
            "A statement mapping each objective to the purposes named in TennCare's rule",
            "An itemized invoice and enrollment confirmation",
            "A receipt after payment for your reimbursement submission",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <CheckCircle2 size={18} color="#22C55E" style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: 15, color: "#475569", margin: 0, lineHeight: 1.6 }}>{item}</p>
            </div>
          ))}
          <div style={{ marginTop: 28 }}>
            <a href={BOOKING_URL}
              style={{ display: "inline-block", background: "#22C55E", color: "#122C54", padding: "14px 28px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              Book a Free Call to Ask About This
            </a>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0, textAlign: "center" }}>
            EDquity at the Margins is not affiliated with, endorsed by, or acting on behalf of TennCare, BlueCare Tennessee, the Tennessee Department of Disability and Aging, or the State of Tennessee. This page is educational and is not legal, medical, or benefits advice. Reimbursement decisions rest solely with the family's managed care organization, and program rules can change. Confirm current requirements with your support coordinator or at{" "}
            <a href="https://www.tn.gov/tenncare" target="_blank" rel="noopener noreferrer" style={{ color: "#0F766E", textDecoration: "underline" }}>tn.gov/tenncare</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
