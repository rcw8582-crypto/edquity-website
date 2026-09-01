import { useState, FormEvent } from "react";
import { Link } from "wouter";
import { FileSearch, ClipboardCheck, CalendarClock, GraduationCap, CheckCircle2 } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { trackInquirySubmitted } from "@/lib/analytics";

/**
 * The IEP Quality Improvement Program.
 *
 * Replaces the old /consulting page, which read as a vendor listing: it was
 * headed "Consulting Services", it sat in the top navigation, and it ended in
 * an inquiry form with organization-type, service-of-interest, and IEP-volume
 * fields. The work described here is the same, framed as a program schools
 * enroll in rather than a service they buy, which is how a 501(c)(3) should
 * present earned-revenue work in the first place.
 *
 * Deliberately absent: fee figures and engagement terms. The inquiry form asks
 * five plain questions and no qualifying ones. "Partner" is avoided throughout
 * because it already means funders on /funders and community organizations
 * on /events.
 */

const NAVY = "#122C54";
const GREEN = "#22C55E";
const TEAL = "#14B8A6";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)",
  fontSize: 15.5, color: "#fff", background: "rgba(255,255,255,0.07)", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13.5, fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "0 0 7px",
};
const fieldWrap: React.CSSProperties = { marginBottom: 18 };

export default function IepQualityImprovement() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          title: data.get("title"),
          organization: data.get("organization"),
          email: data.get("email"),
          message: data.get("message"),
          // The endpoint still requires a subject line for the email it sends
          // Reba. There is no picker on this form, so the page names itself.
          service: "IEP Quality Improvement Program",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(
          typeof json.error === "string"
            ? json.error
            : "Something went wrong. Please email info@edquityatthemargins.org."
        );
        return;
      }
      trackInquirySubmitted("program");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email us at info@edquityatthemargins.org.");
    }
  }

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="The IEP Quality Improvement Program"
        description="A year-long program for schools and systems: independent blind review of your own IEPs against forty research-grounded conditions drawn from IDEA 34 CFR Part 300, with monthly reports that show where quality is improving and where it is not."
      />

      {/* Hero */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>
            For schools and systems
          </p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,50px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 24px", letterSpacing: "-1.5px" }}>
            The IEP Quality Improvement Program
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 760, margin: "0 auto" }}>
            Rubric-based independent review of a fixed sample of individualized education programs,
            scored against forty research-grounded conditions drawn from IDEA 34 CFR Part 300 and
            the peer-reviewed literature on IEP quality.
          </p>
        </div>
      </section>

      {/* What the review covers */}
      <section className="sp-lg" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, margin: "0 0 20px", letterSpacing: "-0.5px" }}>
            Monthly IEP Quality Audits
          </h2>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 32px" }}>
            Twenty-one of the forty are compliance conditions, the requirements IDEA places on what
            an IEP must contain. The remaining nineteen are substantive conditions, holding the
            document to the standard the Supreme Court set in Endrew F. v. Douglas County School
            District RE-1 (2017): an IEP must be reasonably calculated to enable a child to make
            progress appropriate in light of the child's circumstances, and its goals must be
            appropriately ambitious rather than merely more than de minimis. Reviewers
            never know which school or which author produced a document, and the sample size holds
            steady month to month, so the scores are comparable across the year. All handling is
            remote and FERPA-protected.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              {
                icon: <ClipboardCheck size={24} color={GREEN} />,
                audience: "For the instructional leader",
                title: "Monthly quality report",
                text: "Compliance and substantive quality rates for the full sample, a domain scorecard, month-over-month trends, and ranked priority recommendations.",
              },
              {
                icon: <FileSearch size={24} color={TEAL} />,
                audience: "For the IEP author",
                title: "Per-document summary",
                text: "Which conditions each IEP met and missed, with plain-language notes on student impact and prioritized next steps for the person who wrote it.",
              },
            ].map((card) => (
              <div key={card.title} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 26 }}>
                <div style={{ marginBottom: 14 }}>{card.icon}</div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>
                  {card.audience}
                </p>
                <h3 style={{ fontSize: 19, fontWeight: 800, margin: "0 0 10px" }}>{card.title}</h3>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How participation works */}
      <section className="sp-lg" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <CalendarClock size={26} color={NAVY} />
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>
              How participation works
            </h2>
          </div>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 20px" }}>
            Participating schools enroll for the school year and submit a sample of redacted IEPs
            each month from September through May. A single review tells you where one document
            stands. A year of them tells you whether your practice is actually changing, which is
            the point of the Program.
          </p>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: 0 }}>
            The Program is built for organizations where a monthly sample represents a meaningful
            share of the IEP population: private and faith-based schools, single-site charters, and
            small to mid-size local education agencies.
          </p>
        </div>
      </section>

      {/* Funding the free family services */}
      <section className="sp-lg" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "30px 32px" }}>
            <h2 style={{ fontSize: "clamp(21px,2.5vw,28px)", fontWeight: 900, margin: "0 0 16px", letterSpacing: "-0.4px" }}>
              How this funds free services for families
            </h2>
            <p style={{ fontSize: 16.5, color: "#475569", lineHeight: 1.8, margin: "0 0 14px" }}>
              Ten percent of every school engagement fee is designated to the Family Audit Fund,
              which keeps the family IEP Audit, the Advocacy Toolkit, and every parent workshop free.
              Families never pay us anything.
            </p>
            <p style={{ fontSize: 16.5, color: "#475569", lineHeight: 1.8, margin: 0 }}>
              We never accept payment from a school or district in connection with an individual
              child's case. Schools that enroll are purchasing a review of their own IEP quality
              across their system, never a position on any one student.{" "}
              <Link href="/transparency" style={{ color: NAVY, fontWeight: 700 }}>
                Read our full transparency commitments
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Fellowship */}
      <section className="sp-lg" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <GraduationCap size={26} color={NAVY} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 900, margin: 0, letterSpacing: "-0.4px" }}>
              Developing the leader, not just the documents
            </h2>
          </div>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 22px" }}>
            Schools that want the review paired with leadership development can look at the EDquity
            Leader Fellowship, a year-long program that develops your special education leader into a
            Certified IEP Quality Improvement Leader through monthly blind evaluations of your own
            IEPs, data-driven strategy seminars, and a leadership impact project.
          </p>
          <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.8, margin: "0 0 22px" }}>
            Schools that want to develop the whole staff can send teachers to our full-day
            professional development sessions, built from the same 54-condition audit standard
            and open to individuals, groups, and private district cohorts.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Link
              href="/fellowship"
              style={{ display: "inline-block", background: NAVY, color: "#fff", padding: "14px 30px", borderRadius: 8, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}
            >
              Learn about the Fellowship
            </Link>
            <Link
              href="/professional-development"
              style={{ display: "inline-block", background: "#fff", color: NAVY, border: `2px solid ${NAVY}`, padding: "12px 30px", borderRadius: 8, fontWeight: 700, fontSize: 15.5, textDecoration: "none" }}
            >
              See the PD sessions
            </Link>
          </div>
        </div>
      </section>

      {/* Inquiry. Deliberately five plain fields. The consulting page this
          replaced asked for organization type, service tier, and how many IEPs
          were in the program, which is how a vendor qualifies a lead rather
          than how a nonprofit answers a question. Anyone who wants to know
          more can ask without being sorted first. */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.5px", textAlign: "center" }}>
            Ask us about the Program
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: "0 0 32px", textAlign: "center" }}>
            Tell us what you would like to know and we will reply within two business days. You can
            also email us at{" "}
            <a href="mailto:info@edquityatthemargins.org" style={{ color: GREEN, fontWeight: 700 }}>
              info@edquityatthemargins.org
            </a>.
          </p>

          {status === "sent" ? (
            <div style={{ background: "rgba(34,197,94,0.12)", border: `1px solid ${GREEN}`, borderRadius: 12, padding: "26px 28px", textAlign: "center" }}>
              <CheckCircle2 size={30} color={GREEN} style={{ margin: "0 auto 12px", display: "block" }} />
              <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Thank you, your question is on its way.</p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>
                We will reply within two business days. A confirmation is in your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="iq-name">Your name *</label>
                <input style={inputStyle} id="iq-name" name="name" required maxLength={200} autoComplete="name" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="iq-role">Your role</label>
                <input style={inputStyle} id="iq-role" name="title" maxLength={200} placeholder="Special education director, principal, coordinator" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="iq-org">School or organization *</label>
                <input style={inputStyle} id="iq-org" name="organization" required maxLength={300} autoComplete="organization" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="iq-email">Email *</label>
                <input style={inputStyle} id="iq-email" name="email" type="email" required maxLength={254} autoComplete="email" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="iq-message">What would you like to know? *</label>
                <textarea style={{ ...inputStyle, minHeight: 130, resize: "vertical" }} id="iq-message" name="message" required maxLength={5000} />
              </div>

              {status === "error" && (
                <p role="alert" style={{ fontSize: 14.5, color: "#FBBF24", lineHeight: 1.6, margin: "0 0 18px" }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  width: "100%", background: GREEN, color: NAVY, padding: "16px 24px",
                  borderRadius: 8, fontWeight: 800, fontSize: 16.5, border: "none",
                  fontFamily: "inherit", cursor: status === "sending" ? "default" : "pointer",
                  opacity: status === "sending" ? 0.7 : 1,
                }}
              >
                {status === "sending" ? "Sending…" : "Send my question"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
