import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import News from "@/pages/News";
import Donate from "@/pages/Donate";
import Volunteer from "@/pages/Volunteer";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import FerpaCompliance from "@/pages/FerpaCompliance";
import ResearchDataPolicy from "@/pages/ResearchDataPolicy";
import IntakeConsent from "@/pages/IntakeConsent";
import DonorPortal from "@/pages/DonorPortal";
import ClientPortal from "@/pages/ClientPortal";
import NewsPost from "@/pages/NewsPost";
import Admin from "@/pages/Admin";
import Intake from "@/pages/Intake";
import Resources from "@/pages/Resources";
import Events from "@/pages/Events";
import Transparency from "@/pages/Transparency";
import Funders from "@/pages/Funders";
import Press from "@/pages/Press";
import Scholarship from "@/pages/Scholarship";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Layout>
      <ScrollToTop />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
