/**
 * GA4 helpers.
 *
 * The gtag snippet in index.html sends one page_view when the document
 * loads and nothing after that. Because the site routes on the client,
 * every navigation after the first was going uncounted, and there were no
 * events at all, so Google Ads had nothing it could import as a conversion.
 *
 * Google Ad Grants requires at least one conversion recorded per month, so
 * the two events here are not analytics nice-to-haves: they are the signals
 * the grant is measured on. Keep their names stable, because renaming one
 * silently breaks the conversion import on the Ads side.
 */

type GtagArgs =
  | ['event', string, Record<string, unknown>?]
  | ['config', string, Record<string, unknown>?]
  | ['js', Date];

declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
  }
}

const MEASUREMENT_ID = 'G-QC92GW0HZD';

/** No-ops when gtag is blocked or has not loaded, rather than throwing. */
function gtag(...args: GtagArgs): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag(...args);
}

/**
 * The gtag snippet in index.html sends a page_view for the first load, so
 * the first call here is swallowed to avoid counting the landing page
 * twice. Every client-side navigation after that is counted.
 */
let initialLoadCounted = false;

/**
 * Records a page_view for a client-side route change.
 *
 * Called from PageMeta rather than from the router, because PageMeta sets
 * document.title first; firing from the router sent GA4 the previous
 * page's title alongside the new path.
 */
export function trackPageview(path: string): void {
  if (!initialLoadCounted) {
    initialLoadCounted = true;
    return;
  }
  gtag('config', MEASUREMENT_ID, {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
}

/**
 * A parent completed the free IEP Audit intake. This is the primary
 * conversion: mark it as one in Google Ads.
 */
export function trackIntakeSubmitted(referenceCode?: string): void {
  gtag('event', 'intake_submitted', {
    event_category: 'family_services',
    has_reference_code: Boolean(referenceCode),
  });
}

/**
 * A visitor clicked through to book a free discovery call. The booking
 * itself happens on Microsoft Bookings, off our domain, so the click is
 * the last thing we can observe. Mark it as a secondary conversion.
 */
export function trackBookingClick(source: string): void {
  gtag('event', 'booking_click', {
    event_category: 'family_services',
    source,
  });
}

/**
 * A visitor clicked an audit button and is on their way to create a portal
 * account. Registration completes in the portal app, which reports the
 * finish separately, so this counts the intent and that counts the outcome.
 */
export function trackPortalRegistrationStart(source: string): void {
  gtag('event', 'portal_registration_start', {
    event_category: 'family_services',
    source,
  });
}

/**
 * A parent clicked through to claim a seat at a free workshop. The RSVP
 * itself happens off our domain, so the click is the last thing we see.
 */
export function trackSeatClaimed(eventTitle: string): void {
  gtag('event', 'workshop_seat_claimed', {
    event_category: 'family_services',
    event_title: eventTitle,
  });
}

/**
 * A parent pasted a goal into the IEP Goal Checker and got a real analysis
 * back. Fired once per visit, because the results recompute on every
 * keystroke and one event per character would be meaningless.
 */
export function trackGoalCheckCompleted(): void {
  gtag('event', 'goal_check_completed', { event_category: 'family_services' });
}

/**
 * A parent copied the questions the checker generated, which means they are
 * taking them into a meeting. The strongest signal the tool produces.
 */
export function trackGoalQuestionsCopied(): void {
  gtag('event', 'goal_questions_copied', { event_category: 'family_services' });
}

/** A family submitted the written intake questions instead of a call. */
export function trackQuestionsSubmitted(): void {
  gtag('event', 'parent_questions_submitted', { event_category: 'family_services' });
}

/** A school or district asked about the Program or the Fellowship. */
export function trackInquirySubmitted(kind: 'program' | 'fellowship'): void {
  gtag('event', 'institutional_inquiry', { event_category: 'institutional', kind });
}
