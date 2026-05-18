import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/news", label: "News" },
    { href: "/donate", label: "Donate" },
    { href: "/volunteer", label: "Get Involved" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-white/95 backdrop-blur-sm py-5"
      }`}
    >
      <div className="site-gutter flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <img
              src="/images/logo-dark.png"
              alt="EDquity at the Margins Logo"
              className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base transition-colors hover:text-accent relative pb-1 ${
                  location === link.href
                    ? "text-accent font-bold border-b-2 border-accent"
                    : "text-primary font-semibold"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/client-portal"
              className={`text-base transition-colors hover:text-accent relative pb-1 ${
                location === "/client-portal"
                  ? "text-accent font-bold border-b-2 border-accent"
                  : "text-primary font-semibold"
              }`}
              data-testid="nav-link-client-portal"
            >
              EDquity360 Portal
            </Link>

            <Link href="/contact" data-testid="nav-cta-consultation">
              <Button className="bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full px-6">
                Book a Free Consultation
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-border shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col py-4 px-6 space-y-4">
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
            <Link
              href="/client-portal"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-medium transition-colors hover:text-accent ${
                location === "/client-portal" ? "text-accent" : "text-primary"
              }`}
            >
              EDquity360 Portal
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} data-testid="mobile-nav-cta-consultation">
              <Button className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full">
                Book a Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
