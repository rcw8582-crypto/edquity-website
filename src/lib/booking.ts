// Single source of truth for the booking links.
// To change booking tools again, update these constants.

/**
 * Scheduling moved from Microsoft Bookings to Calendly.
 *
 * The Bookings link that used to live here pointed at a calendar that was
 * never created on the tenant, so the API returned 404 and /book rendered
 * "Some error occurred" for every visitor from 2026-08-05 until this change.
 * Every booking button on the site funnels through /book, so the whole
 * funnel was dead that entire time.
 *
 * Calendly also fixes the embed problem. The Bookings iframe rendered blank
 * on most loads, and Donate.tsx records the same failure for the Zeffy form:
 * a third-party widget breaks when a browser partitions its storage, and
 * because the frame is cross-origin nothing here can detect it. Both of those
 * are linked rather than framed for that reason. Calendly's embed is far more
 * widely used, but given this site has now been burned twice, /book links out
 * and keeps a visible fallback rather than trusting a frame.
 */

/** Families who want to talk to a person before sending their child's records. */
export const CALENDLY_FAMILY_CALL =
  "https://calendly.com/edquityatthemargins-info/new-family-getting-started-call";

/** Districts, schools, and organizations. Educator PD is the usual reason. */
export const CALENDLY_PARTNERSHIP_CALL =
  "https://calendly.com/edquityatthemargins-info/partnership-and-professional-development-inquiry";

/**
 * The three remaining Calendly event types are deliberately absent.
 *
 * IEP Audit Findings Walkthrough, IEP Monitoring Kickoff, and IEP Monitoring
 * Check-In are secret event types. Their links go to one family when a report
 * is ready or an enrollment starts, so they must never appear on a public
 * page. Secret only unlists an event, it does not restrict who may book it,
 * so publishing one here would let anyone book an hour of unpaid time.
 */

/**
 * Where every booking button on the site points.
 *
 * Deliberately our own URL rather than a Calendly one. /book describes the
 * two calls and hands off, so the click becomes a page view we can measure
 * instead of an outbound link we lose the moment it is followed.
 * TrackBookingClicks in App.tsx matches this exact string.
 */
export const BOOKING_URL = "/book";

/**
 * Paid family plans, on Zeffy so no processing fee is taken out.
 *
 * One membership campaign carries every plan: IEP Review and Family Support,
 * the Parent IEP Advocacy Academy, and the Complete Family Support bundle,
 * each payable annually or monthly, plus single IEP Meeting Attendance.
 *
 * The slug still says iep-monitoring-and-advocacy because Zeffy kept the
 * original slug when the campaign was renamed. Linked rather than framed,
 * for the storage-partitioning reason described above.
 */
export const ZEFFY_FAMILY_PLANS =
  "https://www.zeffy.com/en-US/ticketing/iep-monitoring-and-advocacy";

/**
 * Where every "Start Your Free IEP Audit" button points.
 *
 * These used to point at BOOKING_URL, which sent families to a booking
 * calendar. Registering in the portal is the real first step, because the
 * portal creates the child record and the Box folder the audit needs, and
 * Calendly cannot accept file uploads at all.
 *
 * This is a different app on a subdomain, so it needs a plain anchor rather
 * than a wouter Link. TrackBookingClicks in App.tsx matches on this exact
 * string to count the click before the visitor leaves.
 */
export const PORTAL_REGISTER_URL =
  "https://portal.edquityatthemargins.org/auth/register";
