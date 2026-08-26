/**
 * The dark shell every Pathways page sits inside.
 *
 * This section of the site is deliberately dark while the rest stays light, so
 * a student arriving from the homepage feels they have walked into something
 * built for them. The shell owns three things the pages should not each repeat:
 * the dark or light class, the light-mode toggle, and the O*NET attribution the
 * Data License requires near the information.
 *
 * The light toggle is not decoration. Plenty of readers, commonly people with
 * astigmatism, find dark text on light far easier than the reverse, and a
 * student should not have to leave to get that.
 */

import { useEffect, useState, type ReactNode } from "react";
import { Sun, Moon } from "lucide-react";
import { loadLightMode, saveLightMode } from "@/lib/pathways";

interface Props {
  children: ReactNode;
  /** Widens the container, for pages showing a grid of career cards. */
  wide?: boolean;
  /** Left of the toggle: usually a back link and a progress track. */
  bar?: ReactNode;
}

export default function PathwaysShell({ children, wide, bar }: Props) {
  const [light, setLight] = useState(false);

  // Read on mount rather than during render, so the prerendered markup and the
  // first client render agree and hydration does not warn.
  useEffect(() => setLight(loadLightMode()), []);

  const flip = () => {
    const next = !light;
    setLight(next);
    saveLightMode(next);
  };

  return (
    <div className={`pw${light ? " pw-light" : ""}`} style={{ minHeight: "100vh" }}>
      <div className={wide ? "pw-wide" : "pw-wrap"}>
        <div className="pw-bar pw-noprint">
          {bar}
          <button
            type="button"
            className="pw-toggle"
            onClick={flip}
            aria-pressed={light}
            title={light ? "Switch to dark" : "Switch to light"}
          >
            {light ? <Moon size={15} aria-hidden="true" /> : <Sun size={15} aria-hidden="true" />}
            <span className="sr-only">{light ? "Switch to dark mode" : "Switch to light mode"}</span>
          </button>
        </div>

        {children}

        <div className="pw-attrib pw-noprint">
          <a
            href="https://services.onetcenter.org/"
            title="This site incorporates information from O*NET Web Services. Click to learn more."
            aria-label="O*NET Web Services"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/onet-in-it.svg" alt="O*NET in-it" width={130} height={60} loading="lazy" />
          </a>
          <p>
            This site incorporates information from{" "}
            <a href="https://services.onetcenter.org/" target="_blank" rel="noopener noreferrer">
              O*NET Web Services
            </a>{" "}
            by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA).
            O*NET&reg; is a trademark of USDOL/ETA.
          </p>
        </div>
      </div>
    </div>
  );
}
