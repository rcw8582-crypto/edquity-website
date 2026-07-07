import { useState } from "react";
import { Link } from "wouter";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const r = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });
      const data = await r.json();
      setMsg(data.message || (r.ok ? "You're subscribed!" : data.error));
      setStatus(r.ok ? "done" : "error");
    } catch {
      setMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    padding: "14px 16px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.07)",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <div style={{ background: "#0d1f3c", borderRadius: 20, padding: "clamp(32px,5vw,48px) clamp(20px,5vw,40px)", marginBottom: 56, textAlign: "center" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#22C55E", letterSpacing: 2.5, textTransform: "uppercase", margin: "0 0 14px" }}>Stay Connected</p>
      <h3 style={{ fontSize: "clamp(22px,2.5vw,30px)", fontWeight: 900, color: "#fff", margin: "0 auto 10px", lineHeight: 1.2, maxWidth: 520 }}>
        IEP updates, resources, and events, straight to your inbox.
      </h3>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 auto 32px", lineHeight: 1.6, maxWidth: 420 }}>
        Practical advocacy updates and upcoming events. No spam, ever.
      </p>

      {status === "done" ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <CheckCircle2 size={28} color="#22C55E" />
          <p style={{ color: "#fff", fontWeight: 700, fontSize: 17, margin: 0 }}>{msg}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 620, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }} aria-label="Newsletter signup">
          <div className="newsletter-inputs">
            <label htmlFor="newsletter-first-name" className="sr-only">First name (optional)</label>
            <input
              id="newsletter-first-name"
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              style={inputStyle}
            />
            <label htmlFor="newsletter-email" className="sr-only">Email address (required)</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Email address *"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              aria-required="true"
            />
          </div>
          {status === "error" && (
            <p style={{ color: "#fca5a5", fontSize: 13, margin: 0 }}>{msg}</p>
          )}
          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              background: "#22C55E", color: "#122C54", padding: "14px 28px",
              borderRadius: 8, fontWeight: 800, fontSize: 15, border: "none",
              cursor: "pointer", fontFamily: "inherit", width: "100%",
            }}
          >
            {status === "sending" ? "Subscribing…" : "Subscribe →"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="site-gutter" style={{ paddingTop: 64, paddingBottom: 64 }}>

        <NewsletterSignup />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-10">

          <div className="md:col-span-2 lg:col-span-4 xl:col-span-2 space-y-6">
            <img
              src="/images/logo-white.png"
              alt="EDquity at the Margins"
              className="h-12 w-auto"
            />
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              We translate institutional special education practices into plain language so families can engage with schools as true, empowered partners.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/EDQATM" target="_blank" rel="noopener noreferrer" aria-label="EDquity at the Margins on Facebook" className="inline-flex items-center justify-center p-1 text-primary-foreground/80 hover:text-accent transition-colors" data-testid="social-facebook"><Facebook size={20} aria-hidden="true" /></a>
              <a href="https://x.com/edquityatm" target="_blank" rel="noopener noreferrer" aria-label="EDquity at the Margins on X" className="inline-flex items-center justify-center p-1 text-primary-foreground/80 hover:text-accent transition-colors" data-testid="social-twitter"><Twitter size={20} aria-hidden="true" /></a>
              <a href="https://www.instagram.com/edqatm/" target="_blank" rel="noopener noreferrer" aria-label="EDquity at the Margins on Instagram" className="inline-flex items-center justify-center p-1 text-primary-foreground/80 hover:text-accent transition-colors" data-testid="social-instagram"><Instagram size={20} aria-hidden="true" /></a>
              <a href="https://www.linkedin.com/company/edqatm/" target="_blank" rel="noopener noreferrer" aria-label="EDquity at the Margins on LinkedIn" className="inline-flex items-center justify-center p-1 text-primary-foreground/80 hover:text-accent transition-colors" data-testid="social-linkedin"><Linkedin size={20} aria-hidden="true" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Navigate</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-primary-foreground/80 hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/services" className="text-primary-foreground/80 hover:text-accent transition-colors">Our Services</Link></li>
              <li><Link href="/news" className="text-primary-foreground/80 hover:text-accent transition-colors">News & Updates</Link></li>
              <li><Link href="/donate" className="text-primary-foreground/80 hover:text-accent transition-colors">Donate</Link></li>
              <li><Link href="/volunteer" className="text-primary-foreground/80 hover:text-accent transition-colors">Volunteer</Link></li>
              <li><Link href="/resources" className="text-primary-foreground/80 hover:text-accent transition-colors">Free Resources &amp; Tools</Link></li>
              <li><Link href="/events" className="text-primary-foreground/80 hover:text-accent transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Organization</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/transparency" className="text-primary-foreground/80 hover:text-accent transition-colors">Transparency</Link></li>
              <li><Link href="/funders" className="text-primary-foreground/80 hover:text-accent transition-colors">For Funders</Link></li>
              <li><Link href="/press" className="text-primary-foreground/80 hover:text-accent transition-colors">Press & Media</Link></li>
              <li><Link href="/client-portal" className="text-primary-foreground/80 hover:text-accent transition-colors">EDquity360 Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="text-primary-foreground/80 hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-primary-foreground/80 hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="/ferpa-compliance" className="text-primary-foreground/80 hover:text-accent transition-colors">FERPA Compliance</Link></li>
              <li><Link href="/research-data-policy" className="text-primary-foreground/80 hover:text-accent transition-colors">Research Data Use</Link></li>
              <li><Link href="/intake-consent" className="text-primary-foreground/80 hover:text-accent transition-colors">Intake Consent</Link></li>
              <li><Link href="/accessibility" className="text-primary-foreground/80 hover:text-accent transition-colors">Accessibility</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin size={20} className="shrink-0 text-accent" />
                <span>Supporting marginalized families nationwide.</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone size={20} className="shrink-0 text-accent" />
                <a href="tel:+17868106178" className="hover:text-accent transition-colors">(786) 810-6178</a>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail size={20} className="shrink-0 text-accent" />
                <a href="mailto:info@edquityatthemargins.org" className="hover:text-accent transition-colors">info@edquityatthemargins.org</a>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/contact" data-testid="footer-cta-contact">
                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-primary-foreground transition-colors">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-sm text-primary-foreground/60 space-y-2">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <span>&copy; {currentYear} EDquity at the Margins. All rights reserved.</span>
            <span>501(c)(3) Public Charity · EIN 42-2295582</span>
            <span>TN SOS Control #002109529</span>
          </div>
          <div className="text-center text-xs text-primary-foreground/50 pt-1">
            Contributions are tax-deductible to the extent allowed by law.
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/ferpa-compliance" className="hover:text-accent transition-colors">FERPA Compliance</Link>
            <span>·</span>
            <Link href="/transparency" className="hover:text-accent transition-colors">Transparency</Link>
            <span>·</span>
            <Link href="/intake-consent" className="hover:text-accent transition-colors">Intake Consent</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
