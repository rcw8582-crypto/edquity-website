import { useEffect } from "react";
import { useLocation } from "wouter";
import { collectHead } from "@/lib/head";
import { trackPageview } from "@/lib/analytics";

interface PageMetaProps {
  title: string;
  description: string;
  /**
   * Slug of a blog post that has its own generated share card. Passing it
   * points og:image at that card so client-side navigation keeps the same
   * image the prerendered HTML already carries. Omit it elsewhere and the
   * page uses the sitewide card.
   */
  cardSlug?: string;
}

const SITE = "EDquity at the Margins";

/**
 * Canonical origin for the site. The www host is the one Vercel serves, and
 * the apex 308-redirects to it, so every canonical, og:url and sitemap entry
 * points at www to avoid sending crawlers and Google Ads landing-page checks
 * through a redirect hop.
 */
export const BASE_URL = "https://www.edquityatthemargins.org";

export default function PageMeta({ title, description, cardSlug }: PageMetaProps) {
  const [location] = useLocation();
  const fullTitle = `${title} | ${SITE}`;
  const canonical = `${BASE_URL}${location === "/" ? "" : location}`;
  const cardUrl = cardSlug
    ? `${BASE_URL}/images/og/${cardSlug}.jpg`
    : `${BASE_URL}/images/og-card.jpg`;

  // On the server there is no document and no effects, so report the values to
  // the prerender collector instead. See src/lib/head.ts.
  if (import.meta.env.SSR) {
    collectHead({ title: fullTitle, description, path: location });
  }

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const parts = sel.match(/\[(.+?)="(.+?)"\]/);
        if (parts) el.setAttribute(parts[1], parts[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:image"]', "content", cardUrl);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", cardUrl);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    // After the title is set, so GA4 records this page rather than the
    // previous one. The first call is swallowed inside trackPageview,
    // because index.html already counted the initial load.
    trackPageview(location);

    return () => {
      document.title = SITE;
    };
  }, [fullTitle, description, canonical, location, cardUrl]);

  return null;
}
