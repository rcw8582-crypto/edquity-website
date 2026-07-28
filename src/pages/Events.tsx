import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, CalendarPlus, Download, ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import EventsCalendar from "@/components/EventsCalendar";
import {
  fetchEvents,
  splitUpcomingPast,
  formatWhen,
  formatDay,
  eventColor,
  googleCalendarUrl,
  icsFileContents,
  type EdatmEvent,
} from "@/content/events";

function downloadIcs(event: EdatmEvent) {
  const blob = new Blob([icsFileContents(event)], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\W+/g, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Events() {
  const [events, setEvents] = useState<EdatmEvent[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setFailed(true));
  }, []);

  const loading = events === null && !failed;
  const { upcoming, past } = splitUpcomingPast(events ?? []);

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <PageMeta
        title="Events & Workshops"
        description="Free parent workshops and community sessions on IEPs and special education rights, hosted by EDquity at the Margins."
      />

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Events & Workshops</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, color: "#fff", margin: "0 0 20px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            Learn with other families.<br />Every session is free.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0 }}>
            Our workshops give parents specific, plain-language knowledge about IEPs and special
            education rights that you can use immediately for your child.
          </p>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#122C54", margin: "0 0 48px", letterSpacing: "-0.5px" }}>Upcoming Events</h2>

          {loading && (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 40, textAlign: "center", color: "#64748b", fontSize: 15 }}>
              Loading events…
            </div>
          )}

          {!loading && upcoming.length === 0 && (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "clamp(24px,5vw,40px)", textAlign: "center" }}>
              <Calendar size={36} color="#122C54" style={{ margin: "0 auto 16px" }} />
              <p style={{ fontSize: 18, fontWeight: 800, color: "#122C54", margin: "0 0 10px" }}>
                The next workshops are being scheduled now.
              </p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 24px" }}>
                New dates are posted here as soon as they are confirmed. If you want to hear about
                the next session directly, reach out and we will make sure you get the details.
              </p>
              <a href="/contact"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#122C54", color: "#fff", padding: "12px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                Ask about the next session <ArrowRight size={14} />
              </a>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {upcoming.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="event-card"
                style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
                  padding: "clamp(20px,4vw,28px) clamp(16px,4vw,32px)",
                  borderLeft: `4px solid ${eventColor(i)}`,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#122C54", margin: 0 }}>{event.title}</h3>
                  <span style={{ fontSize: 11, fontWeight: 700, color: eventColor(i), background: `${eventColor(i)}18`, padding: "3px 12px", borderRadius: 999 }}>{event.event_type}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b" }}>
                    <Clock size={13} /> {formatWhen(event)}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b" }}>
                    <MapPin size={13} /> {event.location}
                  </span>
                </div>
                {event.description && (
                  <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, margin: "0 0 16px" }}>{event.description}</p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <a href={event.rsvp_url ?? "/contact"}
                    target={event.rsvp_url ? "_blank" : undefined}
                    rel={event.rsvp_url ? "noopener noreferrer" : undefined}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#122C54", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    RSVP <ArrowRight size={14} />
                  </a>
                  <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", color: "#122C54", border: "1px solid #cbd5e1", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    <CalendarPlus size={14} /> Add to Google Calendar
                  </a>
                  <button onClick={() => downloadIcs(event)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", color: "#122C54", border: "1px solid #cbd5e1", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    <Download size={14} /> Apple / Outlook (.ics)
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "clamp(40px,6vw,64px) 24px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(24px,4vw,48px)", alignItems: "center", justifyContent: "center" }}>
          <div style={{ flex: "1 1 340px", maxWidth: 440 }}>
            <h2 style={{ fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 900, color: "#122C54", margin: "0 0 12px", letterSpacing: "-0.5px" }}>Browse the calendar</h2>
            <p style={{ fontSize: 15, color: "#475569", margin: "0 0 16px", lineHeight: 1.7 }}>
              Days with a session are highlighted in green. Click one to see the details, and use
              the arrows to look ahead to coming months.
            </p>
            <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.7 }}>
              Want our events on your own calendar? Every session card above has an Add to
              Calendar button for Google, Apple, and Outlook.
            </p>
          </div>
          <EventsCalendar events={events ?? []} />
        </div>
      </section>

      {past.length > 0 && (
        <section className="sp" style={{ background: "#f8fafc" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 900, color: "#122C54", margin: "0 0 32px", letterSpacing: "-0.5px" }}>Past Sessions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {past.map((p) => (
                <div key={p.id} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 24px" }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#122C54", margin: "0 0 8px" }}>{p.title}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{formatDay(p)}</span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>{p.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            Want us to bring a workshop to your community?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: "0 0 36px" }}>
            We partner with libraries, community organizations, schools, and advocacy groups to
            bring free educational sessions directly to the families who need them most.
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
