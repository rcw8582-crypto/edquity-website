// Single source of truth for the booking links.
// To change booking tools again, update these constants.

/**
 * The Microsoft Bookings shared page, listing both services:
 * "New Family Registration" for families starting a free IEP Audit, and
 * "Partnership and Engagement Inquiry" for schools and organizations.
 *
 * This replaced a personal "Bookings with me" link, which sat behind a
 * "Sign in or continue as guest" interstitial. This page has none: it opens
 * straight on the service list. It can also be framed, which is what /book
 * does.
 */
export const BOOKING_PAGE_URL =
  "https://outlook.office.com/book/EDquityattheMargins1@edquityatthemargins.org/";

/**
 * Where every booking button on the site points.
 *
 * Deliberately our own URL rather than the Microsoft one. /book frames the
 * page above, so a visitor never leaves the domain, and the click becomes a
 * page view we can actually measure instead of an outbound link we lose track
 * of the moment it is followed.
 */
export const BOOKING_URL = "/book";
