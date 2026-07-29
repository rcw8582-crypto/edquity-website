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
 * Full-width month calendar for the Events page, fed by the same merged
 * event list as the cards (Outlook "Events" calendar + the portal's
 * events table). Event titles render as colored pills inside their day
 * cell with wrapping text; every cell keeps the same fixed height, so a
 * day that overflows shows "+N more" instead of growing. Clicking a day
 * with events shows full details beneath the grid. Starts on the month
 * of the next upcoming event so the default view is never empty.
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
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ background: "#122C54", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px" }}>
        <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0 }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#94a3b8", padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}>
            {d}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = eventsOn(day);
          const hasEvents = dayEvents.length > 0;
          const inMonth = isSameMonth(day, month);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          const shown = dayEvents.slice(0, 2);
          const extra = dayEvents.length - shown.length;
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
                height: 100,
                overflow: "hidden",
                border: "none",
                borderBottom: "1px solid #f1f5f9",
                borderRight: "1px solid #f1f5f9",
                outline: isSelected ? "2px solid #122C54" : "none",
                outlineOffset: -2,
                background: !inMonth ? "#fafbfc" : "transparent",
                cursor: hasEvents ? "pointer" : "default",
                fontFamily: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                textAlign: "left",
                gap: 3,
                padding: 6,
              }}
            >
              <span
                style={{
                  alignSelf: "flex-start",
                  fontSize: 12,
                  fontWeight: hasEvents ? 800 : 600,
                  color: !inMonth ? "#cbd5e1" : hasEvents ? "#122C54" : "#475569",
                  ...(isToday
                    ? {
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        background: "#FBBF24",
                        color: "#122C54",
                        fontWeight: 800,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }
                    : {}),
                }}
              >
                {format(day, "d")}
              </span>
              {shown.map((e, i) => (
                <span
                  key={e.id}
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    // One event gets four wrapped lines; two share the cell
                    // with two lines each, so every cell stays 100px tall.
                    WebkitLineClamp: shown.length === 1 ? 4 : 2,
                    overflow: "hidden",
                    fontSize: 10.5,
                    fontWeight: 700,
                    lineHeight: 1.25,
                    padding: "2px 6px",
                    borderRadius: 6,
                    color: "#fff",
                    background: eventColor(i),
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                  }}
                >
                  {e.title}
                </span>
              ))}
              {extra > 0 && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>
                  +{extra} more
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ borderTop: "1px solid #e2e8f0", padding: "12px 18px 16px" }}>
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
              : "Click a day with a session to see its details."}
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
  background: "rgba(255,255,255,0.15)",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
};
