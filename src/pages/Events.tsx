import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CalendarPlus, Download, ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import EventsCalendar from "@/components/EventsCalendar";
import {
  fetchEvents,
  splitUpcomingPast,
  formatDay,
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

  // Agenda list: every upcoming session is a slim row, grouped by
  // month. Any event on the calendar, this series or a one-off,
  // slots in by date automatically.
  const monthLabel = (e: EdatmEvent) =>
    new Date(`${e.start_local}:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const months: { label: string; rows: EdatmEvent[] }[] = [];
  for (const e of upcoming) {
    const label = monthLabel(e);
    const last = months[months.length - 1];
    if (last && last.label === label) last.rows.push(e);
    else months.push({ label, rows: [e] });
  }

  const timeRange = (e: EdatmEvent) => {
    const t = (s: string) =>
      new Date(`${s}:00`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const zone = e.time_zone === "America/Chicago" ? " CT" : e.time_zone === "America/New_York" ? " ET" : "";
    return `${t(e.start_local)}–${t(e.end_local)}${zone}`;
  };

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
          <h2 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 900, color: "#122C54", margin: "0 0 32px", letterSpacing: "-0.5px" }}>Upcoming Events</h2>

          <div>
            <div style={{ marginBottom: 32 }}>
              <EventsCalendar events={events ?? []} />
            </div>

            <div>
              {loading && (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 40, textAlign: "center", color: "#64748b", fontSize: 15 }}>
                  Loading events…
                </div>
              )}

              {!loading && upcoming.length === 0 && (
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                  The next workshops are being scheduled now, and new dates appear here as soon as
                  they are confirmed. Want to hear about the next session directly?{" "}
                  <a href="/contact" style={{ color: "#122C54", fontWeight: 700 }}>
                    Reach out
                  </a>{" "}
                  and we will make sure you get the details.
                </p>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {months.map((month, mi) => (
                  <div key={month.label}>
                    <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", color: "#64748b", margin: `${mi === 0 ? 0 : 18}px 0 8px` }}>
                      {month.label}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {month.rows.map((event) => {
                        const isNext = event.id === upcoming[0].id;
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            style={{
                              display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
                              padding: "14px 18px",
                              boxShadow: isNext ? "0 0 0 2px #22C55E55" : "none",
                            }}
                          >
                            <div style={{ flex: "0 0 56px", textAlign: "center", background: "#122C54", color: "#fff", borderRadius: 10, padding: "8px 0" }}>
                              <span style={{ display: "block", fontSize: 10, letterSpacing: 1.5, fontWeight: 800, color: "#22C55E" }}>
                                {new Date(`${event.start_local}:00`).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
                              </span>
                              <span style={{ display: "block", fontSize: 20, fontWeight: 900, lineHeight: 1.15 }}>
                                {new Date(`${event.start_local}:00`).getDate()}
                              </span>
                            </div>
                            <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                              <p style={{ fontSize: 16, fontWeight: 800, color: "#122C54", margin: 0 }}>{event.title}</p>
                              <p style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", margin: "3px 0 0" }}>
                                <Clock size={12} /> {timeRange(event)} · {event.location || "Online"} · Free
                              </p>
                              {isNext && (
                                <p style={{ display: "flex", flexWrap: "wrap", gap: 14, margin: "6px 0 0", fontSize: 12.5 }}>
                                  <a href={googleCalendarUrl(event)} target="_blank" rel="noopener noreferrer"
                                    style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#122C54", fontWeight: 700 }}>
                                    <CalendarPlus size={12} /> Add to Google Calendar
                                  </a>
                                  <button onClick={() => downloadIcs(event)}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#122C54", fontWeight: 700, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 12.5 }}>
                                    <Download size={12} /> Apple / Outlook (.ics)
                                  </button>
                                </p>
                              )}
                            </div>
                            <a href={event.rsvp_url ?? "/contact"}
                              target={event.rsvp_url ? "_blank" : undefined}
                              rel={event.rsvp_url ? "noopener noreferrer" : undefined}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 6,
                                background: isNext ? "#122C54" : "#fff",
                                color: isNext ? "#fff" : "#122C54",
                                border: isNext ? "none" : "1px solid #cbd5e1",
                                padding: "9px 18px", borderRadius: 8, fontWeight: 700, fontSize: 13.5, textDecoration: "none",
                              }}>
                              {isNext ? "Save my seat" : "RSVP"} <ArrowRight size={13} />
                            </a>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
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
