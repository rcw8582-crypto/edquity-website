import { motion } from "framer-motion";
import { Calendar, Clock, Video, Users, ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";

const CALENDLY = "https://calendly.com/dr-reba/discovery";

const upcoming = [
  {
    title: "IEP Rights Bootcamp",
    type: "Webinar",
    date: "Monthly, First Tuesday, 7:00 PM ET",
    duration: "90 minutes",
    desc: "A deep-dive into what the IDEA requires, how to read your child's IEP like an expert, and how to identify what's missing before your next meeting.",
    spots: "Limited to 20 families",
    color: "#22C55E",
    register: CALENDLY,
  },
  {
    title: "Ask Dr. Reba: Live Q&A",
    type: "Live Session",
    date: "Monthly, Third Thursday, 6:30 PM ET",
    duration: "60 minutes",
    desc: "Bring your real IEP questions and get direct answers grounded in the specific situation in front of you, not scripted overviews or generic guidance.",
    spots: "Open to all",
    color: "#14B8A6",
    register: CALENDLY,
  },
  {
    title: "Parent Advocacy Workshop",
    type: "Workshop",
    date: "Quarterly, see calendar for next date",
    duration: "Half-day (4 hours)",
    desc: "Hands-on training in IEP documentation, meeting strategy, and dispute resolution. Participants leave with a personal advocacy plan for their child.",
    spots: "Limited to 15 families",
    color: "#FBbf24",
    register: CALENDLY,
  },
  {
    title: "Community Education Series",
    type: "Community",
    date: "Bi-monthly, varies by community",
    duration: "2 hours",
    desc: "Free educational sessions for school communities, community organizations, and parent groups on special education rights and the IEP process.",
    spots: "Free & open enrollment",
    color: "#8B5CF6",
    register: CALENDLY,
  },
];

const past = [
  { title: "IEP 101: What Every Parent Must Know", date: "April 2026", attendees: "18 families" },
  { title: "When Districts Don't Comply: Your Options", date: "March 2026", attendees: "12 families" },
  { title: "Transition Planning: Setting Your Child Up for Success", date: "February 2026", attendees: "22 families" },
  { title: "Reading Evaluations Without a Psychology Degree", date: "January 2026", attendees: "16 families" },
];

export default function Events() {
  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <PageMeta
        title="Events & Workshops"
        description="Free workshops, webinars, and live Q&A sessions for families navigating special education, hosted by Dr. Reba Clarke-Wedderburn."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Events & Workshops</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Learn with other families.<br />Get answers in real time.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0 }}>
            Every session is designed to give you specific, actionable knowledge you can use immediately for your child.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#122C54", margin: "0 0 48px", letterSpacing: "-0.5px" }}>Upcoming & Recurring Sessions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {upcoming.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="event-card"
                style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
                  padding: "clamp(20px,4vw,28px) clamp(16px,4vw,32px)",
                  borderLeft: `4px solid ${event.color}`,
                }}
              >
                <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 12, background: `${event.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {event.type === "Webinar" ? <Video size={24} color={event.color} /> :
                   event.type === "Live Session" ? <Users size={24} color={event.color} /> :
                   <Calendar size={24} color={event.color} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#122C54", margin: 0 }}>{event.title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, color: event.color, background: `${event.color}18`, padding: "3px 12px", borderRadius: 999 }}>{event.type}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b" }}>
                      <Calendar size={13} /> {event.date}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b" }}>
                      <Clock size={13} /> {event.duration}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b" }}>
                      <Users size={13} /> {event.spots}
                    </span>
                  </div>
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, margin: "0 0 16px" }}>{event.desc}</p>
                  <a href={event.register} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#122C54", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    Register <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 900, color: "#122C54", margin: "0 0 32px", letterSpacing: "-0.5px" }}>Past Sessions</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {past.map((p, i) => (
              <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 24px" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#122C54", margin: "0 0 8px" }}>{p.title}</p>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{p.date}</span>
                  <span style={{ fontSize: 12, color: "#22C55E", fontWeight: 600 }}>{p.attendees}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 24 }}>
            Can't make a live session? Many recordings are available to clients and subscribers.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            Want us to bring a workshop to your community?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: "0 0 36px" }}>
            We partner with community organizations, schools, and advocacy groups to bring free educational sessions directly to the families who need them most.
          </p>
          <a href="/contact"
            style={{ display: "inline-block", background: "#22C55E", color: "#122C54", padding: "16px 36px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
            Contact Us to Partner
          </a>
        </div>
      </section>
    </div>
  );
}
