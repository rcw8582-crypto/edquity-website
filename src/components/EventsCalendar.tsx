import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { eventColor, formatWhen, type EdatmEvent } from "@/content/events";

/**
 * Compact month calendar for the Events page, fed by the same merged
 * event list as the cards (Outlook "Events" calendar + the portal's
 * events table). Event days get a dot and a tinted fill; clicking one
 * shows that day's details beneath the grid. Starts on the month of
 * the next upcoming event so the default view is never empty.
 */
export default function EventsCalendar({ events }: { events: EdatmEvent[] }) {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    const next = events.find((e) => new Date(`${e.start_local}:00`) >= today);
    return startOfMonth(next ? new Date(`${next.start_local}:00`) : today);
  });
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  const eventsOn = (day: Date) =>
    events.filter((e) => isSameDay(new Date(`${e.start_local}:00`), day));

  const monthEvents = events.filter((e) =>
    isSameMonth(new Date(`${e.start_local}:00`), month)
  );
  const selectedEvents = selectedDay ? eventsOn(selectedDay) : [];

  return (
    <div style={{ maxWidth: 480, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ fontSize: 16, fontWeight: 800, color: "#122C54", margin: 0 }}>
          {format(month, "MMMM yyyy")}
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => { setMonth(addMonths(month, -1)); setSelectedDay(null); }}
            style={navBtn}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => { setMonth(addMonths(month, 1)); setSelectedDay(null); }}
            style={navBtn}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#94a3b8", padding: "2px 0" }}>
            {d}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = eventsOn(day);
          const hasEvents = dayEvents.length > 0;
          const inMonth = isSameMonth(day, month);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => setSelectedDay(hasEvents ? day : null)}
              aria-label={
                hasEvents
                  ? `${format(day, "MMMM d")}: ${dayEvents.map((e) => e.title).join(", ")}`
                  : undefined
              }
              style={{
                aspectRatio: "1",
                border: isSelected ? "2px solid #122C54" : "1px solid transparent",
                borderRadius: 8,
                background: hasEvents ? "#22C55E22" : "transparent",
                cursor: hasEvents ? "pointer" : "default",
                fontFamily: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                padding: 0,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: isToday || hasEvents ? 800 : 500,
                  color: !inMonth ? "#cbd5e1" : hasEvents ? "#122C54" : "#475569",
                  textDecoration: isToday ? "underline" : "none",
                  textUnderlineOffset: 3,
                }}
              >
                {format(day, "d")}
              </span>
              {hasEvents && (
                <span style={{ display: "flex", gap: 2 }}>
                  {dayEvents.slice(0, 3).map((e, i) => (
                    <span key={e.id} style={{ width: 5, height: 5, borderRadius: 999, background: eventColor(i) }} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 12, paddingTop: 12 }}>
        {selectedEvents.length > 0 ? (
          selectedEvents.map((e) => (
            <div key={e.id} style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#122C54", margin: "0 0 4px" }}>{e.title}</p>
              <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b", margin: 0 }}>
                <Clock size={12} /> {formatWhen(e)}
              </p>
              {e.location && (
                <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
                  <MapPin size={12} /> {e.location}
                </p>
              )}
            </div>
          ))
        ) : (
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            {monthEvents.length === 0
              ? `No sessions in ${format(month, "MMMM")} yet.`
              : "Click a highlighted day to see session details."}
          </p>
        )}
      </div>
    </div>
  );
}

const navBtn: React.CSSProperties = {
  width: 30,
  height: 30,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  color: "#122C54",
  cursor: "pointer",
};
