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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { eventColor, formatWhen, type EdatmEvent } from "@/content/events";

/**
 * Month-grid calendar for the Events page, rendered from the same
 * merged event list as the cards (Outlook "Events" calendar + the
 * portal's events table). Clicking a day with events shows them
 * beneath the grid.
 */
export default function EventsCalendar({ events }: { events: EdatmEvent[] }) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  const eventsOn = (day: Date) =>
    events.filter((e) => isSameDay(new Date(`${e.start_local}:00`), day));

  const selectedEvents = selectedDay ? eventsOn(selectedDay) : [];

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "clamp(16px,3vw,28px)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#122C54", margin: 0 }}>
          {format(month, "MMMM yyyy")}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => { setMonth(addMonths(month, -1)); setSelectedDay(null); }}
            style={navBtn}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => { setMonth(addMonths(month, 1)); setSelectedDay(null); }}
            style={navBtn}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, padding: "4px 0" }}>
            {d}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = eventsOn(day);
          const inMonth = isSameMonth(day, month);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => setSelectedDay(dayEvents.length ? day : null)}
              style={{
                minHeight: 64,
                border: isSelected ? "2px solid #122C54" : "1px solid #e2e8f0",
                borderRadius: 8,
                background: inMonth ? "#fff" : "#f8fafc",
                padding: 4,
                cursor: dayEvents.length ? "pointer" : "default",
                textAlign: "left",
                fontFamily: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: isToday ? 800 : 600,
                  color: inMonth ? "#122C54" : "#94a3b8",
                  background: isToday ? "#22C55E30" : "transparent",
                  borderRadius: 999,
                  padding: "1px 6px",
                  alignSelf: "flex-start",
                }}
              >
                {format(day, "d")}
              </span>
              {dayEvents.slice(0, 2).map((e, i) => (
                <span
                  key={e.id}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#122C54",
                    background: `${eventColor(i)}30`,
                    borderLeft: `3px solid ${eventColor(i)}`,
                    borderRadius: 4,
                    padding: "2px 4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                    maxWidth: "100%",
                  }}
                >
                  {e.title}
                </span>
              ))}
              {dayEvents.length > 2 && (
                <span style={{ fontSize: 10, color: "#64748b" }}>+{dayEvents.length - 2} more</span>
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && selectedEvents.length > 0 && (
        <div style={{ marginTop: 16, borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
          {selectedEvents.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#122C54", margin: "0 0 4px" }}>{e.title}</p>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                {formatWhen(e)}
                {e.location ? ` · ${e.location}` : ""}
              </p>
              {e.description && (
                <p style={{ fontSize: 13, color: "#475569", margin: "4px 0 0", lineHeight: 1.6 }}>{e.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = {
  width: 36,
  height: 36,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  color: "#122C54",
  cursor: "pointer",
};
