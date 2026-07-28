/**
 * Event listings for the Events page.
 *
 * To add an event, copy one of the objects below into the `upcoming`
 * array. When an event has passed, move it to the `past` array (only
 * title, dateLabel, and location are shown for past events).
 *
 * Times are local to the venue (Central Time for Gallatin/Nashville).
 * `start` and `end` use "YYYY-MM-DDTHH:MM" with no timezone suffix;
 * the calendar links attach the timeZone below.
 */

export type EdatmEvent = {
  title: string;
  /** Short label shown as the colored chip, e.g. "Workshop" */
  type: string;
  /** Human-readable date line, e.g. "Wednesday, July 16, 2026 · 5:00–6:00 PM CT" */
  dateLabel: string;
  /** Local start time, "YYYY-MM-DDTHH:MM" */
  start: string;
  /** Local end time, "YYYY-MM-DDTHH:MM" */
  end: string;
  timeZone: string;
  location: string;
  description: string;
  /** Where to RSVP. Defaults to the contact page if omitted. */
  rsvpUrl?: string;
  /** Brand accent for the card. */
  color: string;
};

export type PastEvent = {
  title: string;
  dateLabel: string;
  location: string;
};

export const upcoming: EdatmEvent[] = [
  // No events are on the calendar right now. When the next workshop is
  // scheduled, add it here — the page updates automatically.
];

export const past: PastEvent[] = [
  {
    title: "Know Your Rights: IEP Basics for Parents",
    dateLabel: "July 16, 2026",
    location: "Gallatin Public Library, Gallatin, TN",
  },
];

/** Formats a local time string "YYYY-MM-DDTHH:MM" as "YYYYMMDDTHHMMSS". */
function compact(local: string): string {
  return local.replace(/[-:]/g, "") + "00";
}

/** Google Calendar "add event" link for an event. */
export function googleCalendarUrl(e: EdatmEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${compact(e.start)}/${compact(e.end)}`,
    ctz: e.timeZone,
    details: e.description,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Builds a downloadable .ics file for an event (Apple/Outlook calendars). */
export function icsFileContents(e: EdatmEvent): string {
  const uid = `${compact(e.start)}-${e.title.replace(/\W+/g, "-").toLowerCase()}@edquityatthemargins.org`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EDquity at the Margins//Events//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;TZID=${e.timeZone}:${compact(e.start)}`,
    `DTEND;TZID=${e.timeZone}:${compact(e.end)}`,
    `SUMMARY:${e.title}`,
    `DESCRIPTION:${e.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${e.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
