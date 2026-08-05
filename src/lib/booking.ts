// Single source of truth for the booking links.
// To change booking tools again, update these constants.

const BOOKINGS_USER =
  "https://outlook.office.com/bookwithme/user/42aef0dba4314fce8ba5e03a5331578d@edquityatthemargins.org";

/**
 * The parent-facing link: Microsoft Bookings "New Families Getting Started
 * Call" (30 min, free). Deep-links straight to that one meeting type, so a
 * family never has to choose. Verified working as a guest.
 */
export const BOOKING_URL = `${BOOKINGS_USER}/meetingtype/i1PD01VF5E6o5zC7O08JjA2?anonymous&ismsaljsauthenabled&ep=mlink`;

/**
 * The whole booking page, listing every meeting type.
 *
 * Used where the right meeting type depends on who is asking. The client
 * portal's "Schedule a session" card previously pointed at the new-families
 * call, so an existing family booking a debrief landed on the intake call for
 * people who are not clients yet. Sending them to the chooser lets them pick
 * the right one. When a purpose-built session type exists in Bookings, give
 * that one its own deep link here and point the portal at it instead.
 */
export const BOOKING_PAGE_URL = `${BOOKINGS_USER}/?anonymous&ismsaljsauthenabled&ep=mlink`;
