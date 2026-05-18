import { useEffect, lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";

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
const Scholarship = lazy(() => import("@/pages/Scholarship"));
const Accessibility = lazy(() => import("@/pages/Accessibility"));
const IEPGoalChecker = lazy(() => import("@/pages/IEPGoalChecker"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const FerpaCompliance = lazy(() => import("@/pages/FerpaCompliance"));
const ResearchDataPolicy = lazy(() => import("@/pages/ResearchDataPolicy"));
const IntakeConsent = lazy(() => import("@/pages/IntakeConsent"));
const DonorPortal = lazy(() => import("@/pages/DonorPortal"));
const ClientPortal = lazy(() => import("@/pages/ClientPortal"));
const NewsPost = lazy(() => import("@/pages/NewsPost"));
const Admin = lazy(() => import("@/pages/Admin"));
const Intake = lazy(() => import("@/pages/Intake"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
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
          <Route path="/scholarship" component={Scholarship} />
          <Route path="/accessibility" component={Accessibility} />
          <Route path="/tools/iep-goal-checker" component={IEPGoalChecker} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/ferpa-compliance" component={FerpaCompliance} />
          <Route path="/research-data-policy" component={ResearchDataPolicy} />
          <Route path="/intake-consent" component={IntakeConsent} />
          <Route path="/donor" component={DonorPortal} />
          <Route path="/client-portal" component={ClientPortal} />
          <Route path="/news/:slug" component={NewsPost} />
          <Route path="/admin" component={Admin} />
          <Route path="/intake" component={Intake} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </LanguageProvider>
        <Toaster />
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
