import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight, Shield, CheckCircle2, Lightbulb, Target,
  BookOpen, Users, FileText, Scale, Quote,
} from "lucide-react";
import PageMeta from "@/components/PageMeta";

import { BOOKING_URL } from "@/lib/booking";

/**
 * Facts a parent can use, not credentials the organization is proud of.
 *
 * This row used to lead with years of experience and with the number of
 * families we hoped to reach in year one. The first was a credential that
 * belongs in the founder bio on About, and the second published a goal rather
 * than a result, which told a visitor the organization was small and had not
 * done it yet. Every figure here is verifiable elsewhere on the site and
 * answers a question the reader actually has.
 */
const STATS: Array<{ value: number | string; suffix: string; label: string }> = [
  { value: "$0", suffix: "", label: "What families pay. The audit, the toolkit, and every workshop" },
  { value: 6, suffix: "", label: "Research-grounded domains we review in your child's IEP" },
  { value: "IDEA", suffix: "", label: "The federal law behind every IEP" },
];

const TESTIMONIALS = [
  {
    quote: "I went into our IEP meeting knowing exactly what to ask and what the district was required to do. For the first time in three years, my son's goals actually reflected what he needs. Dr. Clarke-Wedderburn changed how I see my own role in that room.",
    name: "Parent of a 9-year-old",
    location: "Georgia",
    service: "IEP Audit",
  },
  {
    quote: "We had been told for two years that our daughter was 'progressing appropriately.' The review showed us she hadn't met a single measurable goal. That report gave us the language and the evidence to go back in and demand what the law requires.",
    name: "Family of a child with autism",
    location: "Florida",
    service: "IEP Audit",
  },
  {
    quote: "I'm a single father and I had no idea what an IEP was supposed to look like. Dr. Clarke-Wedderburn walked me through every line, explained what was legally required, and helped me understand that I had real power in that meeting. I just didn't know it yet.",
    name: "Single father",
    location: "Kentucky",
    service: "IEP Audit",
  },
];

function AnimatedStat({ value, suffix }: { value: number | string; suffix: string }) {
  // Seeded with the real figure rather than zero so the prerendered HTML
  // carries "21+" and "50" instead of "0+" and "0". The count-up is an
  // enhancement layered on top, never the only way the number appears.
  const [count, setCount] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (typeof value !== "number") return;
    const el = ref.current;
    if (!el) return;
    const numericValue = value;
    // A stat already on screen at mount keeps its real value; resetting it to
    // zero to animate would replace a correct number with a wrong one under
    // someone who is already reading it.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setCount(0);
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(numericValue / 40);
        const interval = setInterval(() => {
          start = Math.min(start + step, numericValue);
          setCount(start);
          if (start >= numericValue) clearInterval(interval);
        }, 35);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  if (typeof value === "string") {
    return <span>{value}{suffix}</span>;
  }
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: "#122C54" }}>
      <PageMeta
        title="IEP Advocacy for Marginalized Families"
        description="EDquity at the Margins helps Black, Brown, economically disadvantaged, and rural families understand and enforce their children's federally guaranteed IEP rights. Book a free discovery call."
      />

      {/* Hero */}
      <section className="rg-hero" style={{ background: "#122C54" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(48px,8vw,80px) clamp(20px,6vw,72px)" }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Says plainly what the organization does, above the headline
                that says why it matters. A visitor who reads nothing else
                still learns that the IEP support here is free and who it is
                for, which is also what an Ad Grants reviewer looks for. */}
            <p style={{ fontSize: 13, fontWeight: 700, color: "#22C55E", letterSpacing: 2.2, textTransform: "uppercase", margin: "0 0 18px" }}>
              {"Free IEP support for marginalized families"}
            </p>
            <h1 style={{ fontSize: "clamp(38px,5vw,58px)", fontWeight: 900, lineHeight: 1.08, margin: "0 0 28px", color: "#fff", letterSpacing: "-1.5px" }}>
              Your child has<br />the right to a<br /><span style={{ color: "#22C55E" }}>meaningful education.</span>
            </h1>
            <p style={{ fontSize: 19, color: "rgba(255,255,255,0.82)", lineHeight: 1.7, maxWidth: 480, margin: "0 0 16px" }}>
              {"Most families walk into IEP meetings unprepared, outnumbered, and without anyone in the room whose job is to represent their child. Dr. Clarke-Wedderburn is that person."}
            </p>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: 460, margin: "0 0 44px" }}>
              {"Your child's IEP meeting is not a formality. The decisions made in that room follow your child through every year of their education."}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/book"
                style={{ background: "#22C55E", color: "#122C54", padding: "15px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
                {"Start Your Free IEP Audit"}
              </Link>
              <a href={BOOKING_URL}
                style={{ background: "transparent", color: "#fff", padding: "15px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16, border: "2px solid rgba(255,255,255,0.45)" }}>
                {"Or Book a Free Discovery Call"}
              </a>
            </div>
          </motion.div>
        </div>
        <div className="rg-hero-img">
          <img src="/images/hero-family.jpg" alt="Family preparing for IEP meeting"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #122C54 0%, rgba(18,44,84,0.15) 35%, transparent 60%)" }} />
        </div>
      </section>

      {/* Impact Stats */}
      <section className="sp" style={{ background: "#22C55E" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 0 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "16px 8px", borderRight: i < STATS.length - 1 ? "1px solid rgba(18,44,84,0.15)" : "none" }}>
                <p style={{ fontSize: "clamp(36px,4vw,52px)", fontWeight: 900, color: "#122C54", margin: "0 0 6px", letterSpacing: "-2px", lineHeight: 1 }}>
                  <AnimatedStat value={s.value} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(18,44,84,0.7)", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Reality */}
      <section className="sp-lg" style={{ background: "#0d1f3c" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "8px 20px", marginBottom: 36 }}>
            <Scale size={16} color="rgba(255,255,255,0.7)" />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
              {"The Reality"}
            </span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 40px", color: "#fff", letterSpacing: "-1px" }}>
            The school district arrives<br />with a team. <span style={{ color: "#22C55E" }}>You arrive alone.</span>
          </motion.h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "0 0 28px" }}>
            {"That is not an accident. IEP processes are designed around institutional convenience, and the families who pay the highest price for that design are Black, Brown, economically disadvantaged, and rural families who lack the technical knowledge to push back."}
          </p>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "0 0 28px" }}>
            {"Federal law already guarantees your child a free and appropriate public education in the least restrictive environment. The gap is not in the law. The gap is between what the law requires and what schools deliver when no one is holding them accountable."}
          </p>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
            {"EDquity at the Margins exists to close that gap, providing marginalized families with the technical knowledge, advocacy preparation, and sustained coaching support they need to enforce the rights federal law already guarantees their children."}
          </p>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="card-pad"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20 }}>
            <div style={{ fontSize: 64, color: "#22C55E", lineHeight: 1, marginBottom: 24, fontFamily: "Georgia, serif", fontWeight: 900 }}>"</div>
            <p style={{ fontSize: 20, color: "#fff", lineHeight: 1.8, margin: "0 0 32px", fontStyle: "italic" }}>
              I want every child to have a "ME" fighting for them.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#122C54" }}>R</span>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Dr. Reba Clarke-Wedderburn</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: "4px 0 0" }}>Founder & Executive Director, EDquity at the Margins</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three Services */}
      <section className="sp-lg" style={{ background: "#f8fafc", color: "#122C54" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#15803D", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>
              {"What We Do"}
            </p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, margin: "0 0 16px", color: "#122C54", letterSpacing: "-1px" }}>
              {"Two free services. One purpose."}
            </h2>
            <p style={{ fontSize: 18, color: "#64748b", maxWidth: 580, margin: "0 auto", lineHeight: 1.65 }}>
              {"Every service targets a specific point where marginalized families lose ground in the IEP process."}
            </p>
          </div>
          <div className="rg-2">
            {[
              { icon: <FileText size={28} color="#22C55E" />, title: "IEP Audit", price: "Free", desc: "We review your child's IEP across six research-grounded domains, identify what is missing or legally inadequate, and deliver a plain-language written report with specific next steps before your next meeting.", tag: "Free", tagColor: "#22C55E", href: "/book" },
              { icon: <BookOpen size={28} color="#14B8A6" />, title: "Advocacy Toolkit", price: "Free", desc: "Our library of free, downloadable resources: plain-language guides to the IDEA, question checklists, template letters, and tools that help you read your child's IEP like an expert and prepare for any meeting.", tag: "Free", tagColor: "#14B8A6", href: "/resources" },
            ].map((service, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 36, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>{service.icon}</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: service.tagColor, background: `${service.tagColor}18`, padding: "4px 12px", borderRadius: 999, letterSpacing: 0.5 }}>{service.tag}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px", color: "#122C54" }}>{service.title}</h3>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#15803D", margin: "0 0 12px" }}>{service.price}</p>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{service.desc}</p>
                </div>
                <Link href={service.href}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#122C54", fontWeight: 600, textDecoration: "none", fontSize: 14, marginTop: "auto" }}>
                  {"Learn more"} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 12px" }}>{"Both services are completely free. Access is the point."}</p>
            {/* Nonprofit status stated on the landing page, not only in the
                footer and on inner pages. Google Ad Grants asks that a
                nonprofit's status be prominently displayed, and this is the
                page a reviewer lands on. */}
            <p style={{ fontSize: 15, color: "#475569", margin: "0 auto 24px", maxWidth: 620, lineHeight: 1.6 }}>
              EDquity at the Margins is a <strong style={{ color: "#122C54" }}>501(c)(3) nonprofit organization</strong> (EIN 42-2295582).
              Our work is funded by donations and by paid engagements with schools, never by the families we serve.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/book"
                style={{ display: "inline-block", background: "#122C54", color: "#fff", padding: "14px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16 }}>
                {"Start Your Free IEP Audit"}
              </Link>
              <a href={BOOKING_URL}
                style={{ display: "inline-block", background: "transparent", color: "#122C54", padding: "14px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16, border: "2px solid rgba(18,44,84,0.4)" }}>
                {"Or Book a Free Discovery Call"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="sp-lg" style={{ background: "#fff", color: "#122C54" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#15803D", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>How It Works</p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, margin: "0 0 16px", color: "#122C54", letterSpacing: "-1px" }}>From your first call to your next meeting</h2>
          </div>
          <div className="rg-steps">
            {[
              { step: "01", title: "Book a free discovery call", desc: "Dr. Clarke-Wedderburn listens to your situation and identifies the right first step for your child. No obligation." },
              { step: "02", title: "Submit your IEP securely", desc: "Upload your redacted IEP through our secure portal. Step-by-step redaction instructions are provided at intake." },
              { step: "03", title: "Receive your written report", desc: "Within 10 business days, you receive a plain-language report identifying compliance gaps and recommended next steps." },
              { step: "04", title: "Walk in prepared", desc: "Dr. Clarke-Wedderburn walks you through every finding on a 30-minute debrief call so you know exactly what to ask, what to contest, and what the school is required to change before you sit down at that table." },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#122C54", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#22C55E" }}>{item.step}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "#122C54", lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="sp-lg" style={{ background: "#0d1f3c" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>
              {"Families We've Served"}
            </p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-1px", lineHeight: 1.1 }}>
              {"What families say."}
            </h2>
          </div>
          <div className="rg-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
                <Quote size={28} color="#22C55E" style={{ opacity: 0.7 }} />
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, margin: 0, fontStyle: "italic", flex: 1 }}>
                  {t.quote}
                </p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0 }}>{t.location} · {t.service}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 32 }}>
            Family details are anonymized to protect privacy. Shared with permission.
          </p>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="sp-lg" style={{ background: "#f8fafc", color: "#122C54" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#15803D", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Who We Serve</p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 900, margin: "0 0 20px", color: "#122C54", letterSpacing: "-1px" }}>Is this for your family?</h2>
            <p style={{ fontSize: 18, color: "#64748b", maxWidth: 600, margin: "0 auto", lineHeight: 1.65 }}>Our service is specifically designed for families navigating the special education system without independent support.</p>
          </div>
          <div className="rg-3" style={{ marginBottom: 20 }}>
            {[
              { icon: <Lightbulb size={22} color="#22C55E" />, title: "Need Clarity", text: "Feel overwhelmed by institutional jargon and want a plain-language translation of what the IEP actually says." },
              { icon: <Target size={22} color="#22C55E" />, title: "Spotting Gaps", text: "Suspect their child's current plan is missing crucial supports or failing to address documented needs." },
              { icon: <Shield size={22} color="#22C55E" />, title: "Independent Eyes", text: "Want an expert, objective opinion outside of the school district's perspective before signing anything." },
            ].map((card, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 36 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 10px", color: "#122C54" }}>{card.title}</h3>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, margin: 0 }}>{card.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="rg-3">
            {[
              { icon: <BookOpen size={22} color="#22C55E" />, title: "Meeting Ready", text: "Need specific, strategic questions to ask the team to prompt necessary changes before their child loses another year." },
              { icon: <Users size={22} color="#22C55E" />, title: "Partnership", text: "Want to transition from passive participants to active, informed advocates for their child throughout the school year." },
            ].map((card, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 36 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 10px", color: "#122C54" }}>{card.title}</h3>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, margin: 0 }}>{card.text}</p>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.16 }}
              style={{ background: "#122C54", borderRadius: 14, padding: 36, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 12px", color: "#fff" }}>Ready to stop guessing?</h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: "0 0 24px" }}>Book a free 30-minute discovery call. No obligation and no pressure.</p>
              <a href={BOOKING_URL}
                style={{ background: "#22C55E", color: "#122C54", padding: "14px 24px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 15, textAlign: "center", display: "block" }}>
                Book a Free Call
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* External Quote */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 72, color: "#22C55E", lineHeight: 1, marginBottom: 16, fontFamily: "Georgia, serif", fontWeight: 900, opacity: 0.6 }}>"</div>
          <p style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, color: "#fff", lineHeight: 1.5, margin: "0 0 32px", fontStyle: "italic", letterSpacing: "-0.3px" }}>
            You don't make progress by standing on the sidelines, whimpering and complaining. You make progress by implementing ideas.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ height: 1, width: 40, background: "#22C55E", opacity: 0.6 }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#22C55E", margin: 0 }}>Shirley Chisholm</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "4px 0 0" }}>First Black congresswoman and presidential candidate</p>
            </div>
            <div style={{ height: 1, width: 40, background: "#22C55E", opacity: 0.6 }} />
          </div>
        </div>
      </section>

      {/* Mission Deep Section */}
      <section className="sp-lg" style={{ background: "#0d1f3c" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 48px", color: "#fff", letterSpacing: "-1.5px" }}>
            Securing what children<br />are <span style={{ color: "#22C55E" }}>already owed.</span>
          </motion.h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "0 0 28px" }}>EDquity at the Margins was founded to address the gap between the federal protections guaranteed to families of children with disabilities and the educational experiences those families actually receive.</p>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "0 0 28px" }}>The Individuals with Disabilities Education Act entitles every eligible child to a free and appropriate public education in the least restrictive environment, yet the families covered by that law frequently lack the position to enforce its provisions, because navigating implementation systems demands levels of knowledge, documentation, and advocacy capacity that race, income, language, and geography distribute unequally.</p>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>The work is grounded in special education because that domain holds the most explicit federal protections and reveals the widest distance between statutory requirement and institutional practice, while the systemic conditions producing that distance extend well beyond any single policy area.</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="sp" style={{ background: "#22C55E" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 900, color: "#122C54", margin: "0 0 16px", letterSpacing: "-1px" }}>Your child's IEP meeting is not a formality.</h2>
          <p style={{ fontSize: 18, color: "rgba(18,44,84,0.75)", lineHeight: 1.65, margin: "0 0 36px" }}>Start your free IEP Audit, or book a free discovery call to talk through your child's situation first. Dr. Clarke-Wedderburn will help you understand your options and identify the right first step.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/book"
              style={{ display: "inline-block", background: "#122C54", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 17 }}>
              Start Your Free IEP Audit
            </Link>
            <a href={BOOKING_URL}
              style={{ display: "inline-block", background: "transparent", color: "#122C54", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, border: "2px solid rgba(18,44,84,0.4)" }}>
              Or Book a Free Discovery Call
            </a>
          </div>
        </div>
      </section>

      {/* Support CTA. Every other action on this page asks a family to start an
          audit or book a call, which left a visitor who wants to fund or share
          the work with nowhere to go. Placed last on purpose, so the family
          path stays the primary one and giving follows it. */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px,3.2vw,38px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.8px" }}>
            {"Support educational equity"}
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: "0 0 36px" }}>
            {"Every child deserves a meaningful education, and federal law already guarantees it. Your tax-deductible contribution keeps the IEP Audit and the Advocacy Toolkit free for the families who need them most."}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/donate"
              style={{ display: "inline-block", background: "#22C55E", color: "#122C54", padding: "16px 36px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 17 }}>
              {"Donate"}
            </Link>
            <Link href="/resources"
              style={{ display: "inline-block", background: "transparent", color: "#fff", padding: "16px 36px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 17, border: "2px solid rgba(255,255,255,0.35)" }}>
              {"Download the Free Toolkit"}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
