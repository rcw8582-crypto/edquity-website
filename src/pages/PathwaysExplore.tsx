/**
 * /pathways/explore — the landing page, and the three doors.
 *
 * A student who already knows the word "phlebotomist" can search for it. Most
 * students arriving here do not know what to type at all, which is why the
 * questions are the first door rather than a search box. A student who refuses
 * to take a quiz still has two other ways in.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ClipboardList, Compass, Search, ArrowRight, Printer } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import PathwaysShell from "@/components/pathways/PathwaysShell";
import { loadAnswers, loadPicks } from "@/lib/pathways";

export default function PathwaysExplore() {
  const [answered, setAnswered] = useState(0);
  const [picks, setPicks] = useState(0);

  // Read after mount so the prerendered page and the first client render match.
  useEffect(() => {
    setAnswered(Object.keys(loadAnswers().answers).length);
    setPicks(loadPicks().length);
  }, []);

  return (
    <div className="pt-20">
      <PageMeta
        title="Career Explorer"
        description="Free career exploration for students. Answer short questions about what you like, then see real careers that fit, what they pay, and how much school or training each one needs. No account needed. Built on O*NET data from the U.S. Department of Labor."
      />

      <PathwaysShell>
        <p className="pw-eyebrow">EDquity Pathways</p>
        <h1>Career Explorer</h1>
        <p className="pw-lede">
          You do not need an answer yet. Tell us what you like doing, and we will show you real jobs
          that match, what they pay, and how much school each one takes.
        </p>
        <p className="pw-fine">
          Nothing is timed and there are no wrong answers. Everything you type stays in this browser
          and never comes to us.
        </p>

        {(answered > 0 || picks > 0) && (
          <div className="pw-notice">
            <h3>Pick up where you left off</h3>
            <p className="pw-fine" style={{ marginBottom: 14 }}>
              {answered > 0 && `You have answered ${answered} question${answered === 1 ? "" : "s"}. `}
              {picks > 0 && `You have saved ${picks} career${picks === 1 ? "" : "s"} to your plan.`}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {answered > 0 && (
                <Link href="/pathways/explore/questions" className="pw-cta" style={{ textDecoration: "none" }}>
                  Keep answering
                </Link>
              )}
              {picks > 0 && (
                <Link href="/pathways/explore/plan" className="pw-ghost" style={{ textDecoration: "none" }}>
                  <Printer size={15} style={{ marginRight: 7, verticalAlign: "-2px" }} aria-hidden="true" />
                  See my plan
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="pw-doors">
          <Link href="/pathways/explore/questions" className="pw-door">
            <span className="pw-door-ic">
              <ClipboardList size={22} aria-hidden="true" />
            </span>
            <b>Answer some questions</b>
            <span>
              Thirty short questions about things people do at work. Takes about five minutes, and
              we match you to careers at the end.
            </span>
            <em>
              Start <ArrowRight size={14} style={{ verticalAlign: "-2px" }} aria-hidden="true" />
            </em>
          </Link>

          <Link href="/pathways/explore/fields" className="pw-door">
            <span className="pw-door-ic">
              <Compass size={22} aria-hidden="true" />
            </span>
            <b>Browse by field</b>
            <span>
              Fourteen groups of related work, from construction to healthcare. Open one and see
              everything inside it.
            </span>
            <em>
              Browse <ArrowRight size={14} style={{ verticalAlign: "-2px" }} aria-hidden="true" />
            </em>
          </Link>

          <Link href="/pathways/explore/search" className="pw-door">
            <span className="pw-door-ic">
              <Search size={22} aria-hidden="true" />
            </span>
            <b>Search a job</b>
            <span>
              Already have something in mind? Type it and see what the work involves, what it pays,
              and what it takes to get there.
            </span>
            <em>
              Search <ArrowRight size={14} style={{ verticalAlign: "-2px" }} aria-hidden="true" />
            </em>
          </Link>
        </div>

        <div className="pw-notice" style={{ marginTop: 26 }}>
          <h3>What you get at the end</h3>
          <p className="pw-fine" style={{ margin: 0 }}>
            A one-page plan you can print: what you are interested in, the careers you picked, what
            they pay, and what school or training each one needs. It comes with a sheet explaining
            it for your family, and there is a place on it for what you want to do next and what
            helps you learn. You can take it to a school meeting.
          </p>
        </div>
      </PathwaysShell>
    </div>
  );
}
