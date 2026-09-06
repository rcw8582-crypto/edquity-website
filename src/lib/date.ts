/**
 * Post date formatting.
 *
 * A date-only string like "2026-09-06" is parsed by `new Date()` as midnight
 * UTC, which is the evening of September 5 anywhere in the Americas, so
 * `toLocaleDateString` renders the day before. Every post on the site showed a
 * date one day early to US readers until this helper existed. Date-only values
 * are therefore split and built as a local date, while full timestamps (which
 * carry a real instant) are parsed normally.
 */

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parsePostDate(value: string): Date {
  const match = value.match(DATE_ONLY);
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  return new Date(value);
}

/** "September 6, 2026". Returns "" for a missing date. */
export function formatPostDate(value: string | null): string {
  if (!value) return "";
  const date = parsePostDate(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
