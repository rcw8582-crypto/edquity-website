/**
 * Events for the Events page, loaded live from the EDquity portal's
 * database. Reba manages them at edquity360.com/admin/events; published
 * rows appear here with no code changes.
 *
 * `start_local` / `end_local` are wall-clock times at the venue
 * ("YYYY-MM-DDTHH:MM"); `time_zone` names the IANA zone the calendar
 * links attach, so no UTC conversion happens anywhere.
 */

const SUPABASE_URL = "https://erggxchftkpczoshcfii.supabase.co";
// Publishable read-only key. Row-level security limits it to published events.
const SUPABASE_ANON_KEY = "sb_publishable_QKhsSgXSYmlhtOv0vfIJ4Q_c5uau4Yn";

export type EdatmEvent = {
  id: string;
  title: string;
  event_type: string;
  description: string;
  location: string;
  start_local: string;
  end_local: string;
  time_zone: string;
  rsvp_url: string | null;
};

const CARD_COLORS = ["#22C55E", "#14B8A6", "#FBBF24", "#8B5CF6"];

export function eventColor(index: number): string {
  return CARD_COLORS[index % CARD_COLORS.length];
}

async function fetchAdminEvents(): Promise<EdatmEvent[]> {
  const params = new URLSearchParams({
    select: "id,title,event_type,description,location,start_local,end_local,time_zone,rsvp_url",
    is_published: "eq.true",
    order: "start_local.asc",
  });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/events?${params.toString()}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`);
  return (await res.json()) as EdatmEvent[];
}

/**
 * Events from Reba's published Outlook "Events" calendar, proxied
 * through the portal (the Outlook feed itself has no CORS headers).
 */
async function fetchOutlookEvents(): Promise<EdatmEvent[]> {
  const res = await fetch("https://www.edquity360.com/api/outlook-events");
  if (!res.ok) return [];
  return (await res.json()) as EdatmEvent[];
}

/**
 * Teams webinar links arrive from Outlook as
 * teams.microsoft.com/l/virtualevent/<id>, which routes visitors
 * through the Teams app launcher and a sign-in wall. The same id on
 * events.teams.microsoft.com/event/<id> is the public registration
 * page that opens in any browser with no sign-in, so rewrite to that.
 */
function normalizeRsvp(url: string | null): string | null {
  const m = url?.match(/teams\.microsoft\.com\/l\/virtualevent\/([^/?#]+)/i);
  return m ? `https://events.teams.microsoft.com/event/${m[1]}` : url;
}

/**
 * Merges both sources. When the same event exists in both (same title
 * on the same day), the admin version wins because it carries the
 * parent-facing description and RSVP link.
 */
export async function fetchEvents(): Promise<EdatmEvent[]> {
  const [adminResult, outlookResult] = await Promise.allSettled([
    fetchAdminEvents(),
    fetchOutlookEvents(),
  ]);
  const admin = adminResult.status === "fulfilled" ? adminResult.value : [];
  const outlook = outlookResult.status === "fulfilled" ? outlookResult.value : [];
  if (adminResult.status === "rejected" && outlookResult.status === "rejected") {
    throw new Error("Both event sources failed");
  }

  const dayKey = (e: EdatmEvent) =>
    `${e.title.trim().toLowerCase()}|${e.start_local.slice(0, 10)}`;
  const seen = new Set(admin.map(dayKey));
  const merged = [...admin, ...outlook.filter((e) => !seen.has(dayKey(e)))].map(
    (e) => ({ ...e, rsvp_url: normalizeRsvp(e.rsvp_url) })
  );
  merged.sort((a, b) => a.start_local.localeCompare(b.start_local));
  return merged;
}

/** Current wall-clock time in the event's zone, as "YYYY-MM-DDTHH:MM". */
function nowLocal(timeZone: string): string {
  return new Date()
    .toLocaleString("sv-SE", { timeZone })
    .slice(0, 16)
    .replace(" ", "T");
}

export function splitUpcomingPast(events: EdatmEvent[]): {
  upcoming: EdatmEvent[];
  past: EdatmEvent[];
} {
  const upcoming: EdatmEvent[] = [];
  const past: EdatmEvent[] = [];
  for (const e of events) {
    (e.end_local >= nowLocal(e.time_zone) ? upcoming : past).push(e);
  }
  past.reverse(); // most recent past event first
  return { upcoming, past };
}

/** "2026-07-16T17:00"/"...T18:00" → "Wednesday, July 16, 2026 · 5:00–6:00 PM CT". */
export function formatWhen(e: EdatmEvent): string {
  const toDate = (s: string) => new Date(`${s}:00`);
  const day = toDate(e.start_local).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = (s: string) =>
    toDate(s).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const zone = e.time_zone === "America/Chicago" ? " CT" : e.time_zone === "America/New_York" ? " ET" : "";
  return `${day} · ${time(e.start_local)}–${time(e.end_local)}${zone}`;
}

export function formatDay(e: EdatmEvent): string {
  return new Date(`${e.start_local}:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Formats a local time string "YYYY-MM-DDTHH:MM" as "YYYYMMDDTHHMMSS". */
function compact(local: string): string {
  return local.replace(/[-:]/g, "") + "00";
}

/** Google Calendar "add event" link for an event. */
export function googleCalendarUrl(e: EdatmEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${compact(e.start_local)}/${compact(e.end_local)}`,
    ctz: e.time_zone,
    details: e.description,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Builds a downloadable .ics file for an event (Apple/Outlook calendars). */
export function icsFileContents(e: EdatmEvent): string {
  const uid = `${e.id}@edquityatthemargins.org`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EDquity at the Margins//Events//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;TZID=${e.time_zone}:${compact(e.start_local)}`,
    `DTEND;TZID=${e.time_zone}:${compact(e.end_local)}`,
    `SUMMARY:${e.title}`,
    `DESCRIPTION:${e.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${e.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
