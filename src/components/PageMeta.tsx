import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description: string;
}

const SITE = "EDquity at the Margins";
const BASE_URL = "https://edquityatthemargins.org";

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE}`;
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
    setMeta('meta[property="og:url"]', "content", BASE_URL);
    setMeta('meta[property="og:image"]', "content", `${BASE_URL}/images/og-card.png`);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", `${BASE_URL}/images/og-card.png`);

    return () => {
      document.title = SITE;
    };
  }, [title, description]);

  return null;
}
