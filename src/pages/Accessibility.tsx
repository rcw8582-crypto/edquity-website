import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import PageMeta from "@/components/PageMeta";

export default function Accessibility() {
  return (
    <div className="pt-20">
      <PageMeta
        title="Accessibility Statement"
        description="EDquity at the Margins is committed to WCAG 2.1 AA accessibility. Learn how our website supports keyboard, screen reader, and reduced-motion users, and how to report any barriers."
      />
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Accessibility Statement</h1>
          <p className="text-sm text-muted-foreground mt-2">Last updated: May 2026</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl space-y-8 text-foreground leading-relaxed">

          <div>
            <h2 className="text-2xl font-bold text-primary mb-3">Our Commitment</h2>
            <p>
              EDquity at the Margins serves families navigating the special education system, including families whose children rely on assistive technology and accommodations every day. Our own website should never be a barrier to the support those families need. We commit to maintaining this site to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA, and we treat accessibility as ongoing work rather than a one-time audit.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary mb-3">What We Currently Support</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Full keyboard navigation across every page, including a visible skip-to-content link as the first interactive element on each page.</li>
              <li>Visible focus indicators on all interactive elements.</li>
              <li>Semantic HTML and ARIA labels on forms, navigation menus, and interactive components.</li>
              <li>Descriptive alt text on all content images. Decorative images carry empty alt attributes so screen readers skip them.</li>
              <li>Color contrast that meets or exceeds WCAG 2.1 AA for body text and most interface elements.</li>
              <li>Respect for the operating-system preference to reduce motion. Animations and transitions are minimized or disabled for users who have requested reduced motion.</li>
              <li>Responsive layout that works at 200% browser zoom and on small mobile viewports without loss of content or functionality.</li>
              <li>A bilingual interface offering English and Spanish content where available.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary mb-3">Areas of Ongoing Work</h2>
            <p>We are actively improving in the following areas:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Comprehensive screen-reader testing across NVDA, JAWS, and VoiceOver.</li>
              <li>Full color-contrast audit on all custom-styled components.</li>
              <li>Expansion of Spanish-language coverage to all pages.</li>
              <li>Captions and transcripts for video content as it is added.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary mb-3">Compatibility</h2>
            <p>
              This website is designed to work with current versions of major browsers (Chrome, Safari, Firefox, Edge) on desktop and mobile, and with the screen readers and assistive technologies that integrate with those browsers. If you encounter a feature that does not work with your specific configuration, please let us know.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary mb-3">Reporting an Accessibility Issue</h2>
            <p>
              If any part of this website creates a barrier for you, please contact us. We will respond within five business days, work with you to find an immediate workaround, and prioritize a fix in our next site update.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Email: <a href="mailto:info@edquityatthemargins.org" className="text-accent hover:underline">info@edquityatthemargins.org</a></li>
              <li>Phone: <a href="tel:+17868106178" className="text-accent hover:underline">(786) 810-6178</a></li>
              <li>Contact form: <Link href="/contact" className="text-accent hover:underline">/contact</Link></li>
            </ul>
            <p className="mt-3">
              In your report, please include the page URL, your browser and assistive technology if relevant, and a description of the barrier you encountered. We use that information to fix the specific issue and to improve our broader accessibility work.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary mb-3">Standards Conformance</h2>
            <p>
              This website is designed to conform to WCAG 2.1 Level AA. Where any page or feature falls short, we treat the gap as a bug to be fixed, not as the acceptable end state. Conformance is a moving target as content is added, and we audit on an ongoing basis.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary mb-3">Legal Note</h2>
            <p>
              EDquity at the Margins is committed to digital accessibility consistent with Title III of the Americans with Disabilities Act and Section 504 of the Rehabilitation Act of 1973. This statement does not waive any rights you have under those laws.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
