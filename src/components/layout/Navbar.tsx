import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Respect users who have requested reduced motion in their OS or browser
    // accessibility settings (WCAG 2.1, iOS/Android Reduce Motion).
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", onMotionChange);

    // Threshold of 100px prevents flicker on small touch-scroll movements
    // before the user has committed to scrolling into content.
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  // Kept short enough to fit on a 1024px laptop without collapsing into the
  // hamburger, since a nav that is visible only above 1536px reads as no nav
  // at all on the screens most visitors and reviewers actually use. Volunteer
  // and the portal login live in the footer; the logo covers Home.
  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/resources", label: "Resources" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
    { href: "/news", label: "In the Margins" },
    { href: "/contact", label: "Contact" },
  ];

  /**
   * Shown below a divider in the mobile sheet, smaller than the primary links.
   *
   * The sheet used to hold its own longer list in its own order, so the phone
   * and the desktop header read as two different menus rather than one. The
   * primary links now match the header exactly, and these sit apart as
   * utilities: reached deliberately rather than browsed.
   */
  const utilityLinks = [
    { href: "/volunteer", label: "Get Involved" },
    { href: "/board", label: "Join Our Board" },
    { href: "/client-portal", label: "EDquity360 Portal" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        prefersReducedMotion ? "" : "transition-all duration-300"
      } ${
        isScrolled ? "bg-white shadow-md py-5" : "bg-white/95 backdrop-blur-sm py-5"
      }`}
    >
      <div className="site-gutter flex items-center justify-between gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2 group" data-testid="nav-logo" aria-label="EDquity at the Margins, home">
            <img
              src="/images/logo-dark.png"
              alt=""
              width={400}
              height={129}
              fetchPriority="high"
              className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm xl:text-base whitespace-nowrap transition-colors hover:text-accent relative pb-1 ${
                  location === link.href
                    ? "text-accent font-bold border-b-2 border-accent"
                    : "text-primary font-semibold"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Giving is its own visible action rather than one more text link
                in the row, so the path to support the work is obvious without
                competing with the primary family-facing call. */}
            <Link href="/donate" data-testid="nav-cta-donate">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-full px-4 xl:px-5 text-sm xl:text-base whitespace-nowrap"
              >
                Donate
              </Button>
            </Link>

            <Link href="/book" data-testid="nav-cta-consultation">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full px-5 xl:px-6 text-sm xl:text-base whitespace-nowrap">
                Book a Free Consultation
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden inline-flex items-center justify-center min-h-11 min-w-11 -mr-2 text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div id="mobile-nav" className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-border shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col py-4 px-6">
            {/* The same six links the header shows, in the same order. */}
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors hover:text-accent ${
                    location === link.href ? "text-accent" : "text-primary"
                  }`}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-border flex flex-col space-y-3">
              {utilityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm transition-colors hover:text-accent ${
                    location === link.href ? "text-accent font-medium" : "text-muted-foreground"
                  }`}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Both header buttons, in the header's order, so the phone offers
                the same two actions rather than only one of them. */}
            <div className="mt-5 pt-4 border-t border-border flex flex-col gap-3">
              <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-nav-cta-donate">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-full"
                >
                  Donate
                </Button>
              </Link>
              <Link href="/book" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-nav-cta-consultation">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full">
                  Book a Free Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
