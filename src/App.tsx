import { useEffect, lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import { BOOKING_URL } from "@/lib/booking";
import { trackBookingClick } from "@/lib/analytics";

// Home stays eager-loaded since it is the most common entry point
// and lazy-loading it would delay the first paint for first-time visitors.
import Home from "@/pages/Home";

// Every other page is lazy-loaded so its JavaScript only ships when
// the user navigates to it. This cuts the initial bundle and speeds
// up first-meaningful-paint, especially on mobile.
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const News = lazy(() => import("@/pages/News"));
const Donate = lazy(() => import("@/pages/Donate"));
const Volunteer = lazy(() => import("@/pages/Volunteer"));
const Contact = lazy(() => import("@/pages/Contact"));
const Resources = lazy(() => import("@/pages/Resources"));
const Events = lazy(() => import("@/pages/Events"));
const Transparency = lazy(() => import("@/pages/Transparency"));
const Funders = lazy(() => import("@/pages/Funders"));
const Press = lazy(() => import("@/pages/Press"));
const Accessibility = lazy(() => import("@/pages/Accessibility"));
const IEPGoalChecker = lazy(() => import("@/pages/IEPGoalChecker"));
const Methodology = lazy(() => import("@/pages/Methodology"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const FerpaCompliance = lazy(() => import("@/pages/FerpaCompliance"));
const ResearchDataPolicy = lazy(() => import("@/pages/ResearchDataPolicy"));
const IntakeConsent = lazy(() => import("@/pages/IntakeConsent"));
const ClientPortal = lazy(() => import("@/pages/ClientPortal"));
const NewsPost = lazy(() => import("@/pages/NewsPost"));
const ResourceDetail = lazy(() => import("@/pages/ResourceDetail"));
const Admin = lazy(() => import("@/pages/Admin"));
const Intake = lazy(() => import("@/pages/Intake"));
const ParentQuestions = lazy(() => import("@/pages/ParentQuestions"));
const Fellowship = lazy(() => import("@/pages/Fellowship"));
const Book = lazy(() => import("@/pages/Book"));
const IepQualityImprovement = lazy(() => import("@/pages/IepQualityImprovement"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

/**
 * Counts clicks on the booking link wherever it appears.
 *
 * Booking happens on Microsoft Bookings, off our domain, so this click is
 * the last thing we can observe. One delegated listener beats editing the
 * six pages that link to it, and it cannot be forgotten when a seventh
 * link is added, since it matches on the shared BOOKING_URL constant.
 */
function TrackBookingClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor || anchor.getAttribute("href") !== BOOKING_URL) return;
      trackBookingClick(window.location.pathname);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" aria-hidden="true" />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <TrackBookingClicks />
      <Suspense fallback={<RouteFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/services" component={Services} />
          <Route path="/news" component={News} />
          <Route path="/donate" component={Donate} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/contact" component={Contact} />
          <Route path="/resources" component={Resources} />
          <Route path="/events" component={Events} />
          <Route path="/transparency" component={Transparency} />
          <Route path="/funders" component={Funders} />
          <Route path="/press" component={Press} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/tools/iep-goal-checker" component={IEPGoalChecker} />
          <Route path="/our-methodology" component={Methodology} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/ferpa-compliance" component={FerpaCompliance} />
          <Route path="/research-data-policy" component={ResearchDataPolicy} />
          <Route path="/intake-consent" component={IntakeConsent} />
          <Route path="/client-portal" component={ClientPortal} />
          <Route path="/news/:slug" component={NewsPost} />
          <Route path="/resources/:slug" component={ResourceDetail} />
          <Route path="/admin" component={Admin} />
          <Route path="/intake" component={Intake} />
          <Route path="/tell-us-about-your-child" component={ParentQuestions} />
          <Route path="/fellowship" component={Fellowship} />
          <Route path="/book" component={Book} />
          <Route path="/iep-quality-improvement" component={IepQualityImprovement} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

interface AppProps {
  /**
   * Route to render when the app runs outside a browser. The prerender pass
   * (scripts/prerender.mjs) passes one path per page so wouter resolves the
   * right route without a window.location to read.
   */
  ssrPath?: string;
}

function App({ ssrPath }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* reducedMotion="user" makes every framer-motion animation respect the
            OS/browser "reduce motion" setting (WCAG 2.1 SC 2.3.3). */}
        <MotionConfig reducedMotion="user">
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")} ssrPath={ssrPath}>
            <Router />
          </WouterRouter>
          <Toaster />
          <Analytics />
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
