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

/**
 * Where every "Start Your Free IEP Audit" button points.
 *
 * These used to point at BOOKING_URL, which sent families to the Microsoft
 * Bookings "New Family Registration" service. Registering in the portal is
 * the real first step, so the audit buttons go straight there and /book is
 * now only for the discovery call.
 *
 * This is a different app on a subdomain, so it needs a plain anchor rather
 * than a wouter Link. TrackBookingClicks in App.tsx matches on this exact
 * string to count the click before the visitor leaves.
 */
export const PORTAL_REGISTER_URL =
  "https://portal.edquityatthemargins.org/auth/register";
