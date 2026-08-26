/**
 * /pathways/explore/results
 *
 * The six interest scores, then careers matched to them, filterable by how much
 * school or training the work needs. That filter matters more than any other
 * control on the page: a student who is not going to college needs to see the
 * careers that do not require it, not scroll past twenty that do.
 *
 * Scores are recomputed from the answers held in this browser, so the page is
 * reachable directly and survives a refresh without anything being stored on a
 * server.
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Loader2, Printer, RotateCcw, TrendingUp } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import PathwaysShell from "@/components/pathways/PathwaysShell";
import {
  areaStyle,
  fetchJobZones,
  fetchMatches,
  fetchQuestions,
  fetchScores,
  isComplete,
  loadAnswers,
  loadPicks,
  maxScore,
  packAnswers,
  strongestAreas,
  type CareerList,
  type InterestScore,
  type JobZone,
  UNAVAILABLE,
} from "@/lib/pathways";

export default function PathwaysResults() {
  const [, navigate] = useLocation();

  const [state, setState] = useState<"loading" | "incomplete" | "ready" | "error">("loading");
  const [form, setForm] = useState(30);
  const [packed, setPacked] = useState("");
  const [nextBlank, setNextBlank] = useState(1);

  const [scores, setScores] = useState<InterestScore[]>([]);
  const [matches, setMatches] = useState<CareerList | null>(null);
  const [zones, setZones] = useState<JobZone[]>([]);
  const [zone, setZone] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [picks, setPicks] = useState(0);

  useEffect(() => {
    setPicks(loadPicks().length);
    const saved = loadAnswers();
    setForm(saved.form);

    fetchJobZones()
      .then(setZones)
      .catch(() => setZones([]));

    // The question list is needed to pack the answers in the right order, since
    // the saved answers are keyed by question index rather than by position.
    fetchQuestions(saved.form)
      .then(async (set) => {
        const value = packAnswers(set.questions, saved.answers);
        setPacked(value);
        if (!isComplete(value, saved.form)) {
          const blank = value.indexOf("0");
          setNextBlank(blank === -1 ? 1 : blank + 1);
          setState("incomplete");
          return;
        }
        const [scored, matched] = await Promise.all([fetchScores(value), fetchMatches(value, null)]);
        setScores(scored);
        setMatches(matched);
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const changeZone = async (next: number | null) => {
    if (!packed) return;
    setZone(next);
    setRefreshing(true);
    try {
      setMatches(await fetchMatches(packed, next));
    } catch {
      /* keep the list that is already on screen rather than emptying it */
    } finally {
      setRefreshing(false);
    }
  };

  const top = maxScore(form);
  const strongest = strongestAreas(scores);

  const bar = (
    <>
      <Link href="/pathways/explore" className="pw-back">
        <ArrowLeft size={16} aria-hidden="true" /> Start
      </Link>
      <span className="pw-track-outer">
        <i style={{ width: "100%" }} />
      </span>
      <span className="pw-streak">Done</span>
    </>
  );

  return (
    <div className="pt-20">
      <PageMeta
        title="My Career Results"
        description="Your interest results and the careers that match them, filterable by how much school or training each one needs."
      />

      <PathwaysShell wide bar={bar}>
        {state === "loading" && (
          <p className="pw-status" role="status">
            <Loader2 size={16} className="inline animate-spin" style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
            Working out your results.
          </p>
        )}

        {state === "error" && (
          <div className="pw-notice">
            <p className="pw-error" role="alert" style={{ margin: 0 }}>
              {UNAVAILABLE}
            </p>
          </div>
        )}

        {state === "incomplete" && (
          <div className="pw-notice">
            <h3>A few questions still need answers</h3>
            <p className="pw-fine">
              We need all {form} answered before we can match you to careers. Pick Unsure on any you
              cannot decide.
            </p>
            <Link
              href={`/pathways/explore/questions/${nextBlank}`}
              className="pw-cta"
              style={{ textDecoration: "none" }}
            >
              Keep going
            </Link>
          </div>
        )}

        {state === "ready" && (
          <>
            <h1>Here is what you like</h1>
            <p className="pw-lede">
              {strongest.size > 0
                ? "Your strongest areas are marked. This is about the work you said you would enjoy, and it does not measure how good you are at anything."
                : "Your answers came out fairly even across all six areas, so nothing stands out yet. That is a real result, not a mistake. Look through the careers below, or answer again and say what you actually like rather than what sounds sensible."}
            </p>

            <div className="pw-areas">
              {scores.map((area, position) => {
                const style = areaStyle(area.code);
                const isTop = strongest.has(area.code);
                return (
                  <div key={area.code} className={`pw-area${isTop ? " pw-area-top" : ""}`}>
                    <div className="pw-area-h">
                      <span
                        className="pw-area-ic"
                        style={{ background: `${style.dark}22`, color: style.dark }}
                        aria-hidden="true"
                      >
                        <span style={{ fontSize: 19, fontWeight: 900 }}>{style.letter}</span>
                      </span>
                      <b>
                        {area.title}
                        <span style={{ display: "block", fontSize: 13, fontWeight: 700, opacity: 0.66 }}>
                          {style.plain}
                        </span>
                      </b>
                      {isTop && (
                        <span className="pw-rank">{strongest.size === 1 ? "Strongest" : "One of your strongest"}</span>
                      )}
                    </div>
                    <div
                      className="pw-meter"
                      role="img"
                      aria-label={`${area.title}: ${area.score} out of ${top}`}
                    >
                      <i style={{ width: `${(area.score / top) * 100}%`, background: style.dark }} />
                    </div>
                    <p>{area.description}</p>
                  </div>
                );
              })}
            </div>

            <h2 style={{ marginTop: 42 }}>Careers that fit</h2>
            {zones.length > 0 && (
              <>
                <p className="pw-fine" style={{ marginBottom: 0 }}>
                  How much school or training do you want to do?
                </p>
                <div className="pw-filters">
                  <button
                    type="button"
                    className="pw-filter"
                    aria-pressed={zone === null}
                    onClick={() => changeZone(null)}
                  >
                    Show me everything
                  </button>
                  {zones.map((jz) => (
                    <button
                      key={jz.code}
                      type="button"
                      className="pw-filter"
                      aria-pressed={zone === jz.code}
                      title={jz.training}
                      onClick={() => changeZone(jz.code)}
                    >
                      {jz.education}
                    </button>
                  ))}
                </div>
              </>
            )}

            {refreshing ? (
              <p className="pw-status" role="status">
                <Loader2 size={16} className="inline animate-spin" style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
                Updating your list.
              </p>
            ) : matches && matches.careers.length > 0 ? (
              <>
                <p className="pw-fine" aria-live="polite">
                  {matches.total > matches.careers.length
                    ? `Showing ${matches.careers.length} of ${matches.total} careers that match.`
                    : `${matches.careers.length} career${matches.careers.length === 1 ? "" : "s"} match.`}
                </p>
                <ul className="pw-cards">
                  {matches.careers.map((item) => (
                    <li key={item.code}>
                      <Link href={`/pathways/explore/careers/${item.code}`} className="pw-cardbtn">
                        <b>{item.title}</b>
                        <span className="pw-tags">
                          {item.fit && <span className="pw-tag pw-tag-fit">{item.fit} fit</span>}
                          {item.growing && (
                            <span className="pw-tag pw-tag-grow">
                              <TrendingUp size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} aria-hidden="true" />
                              Hiring more
                            </span>
                          )}
                        </span>
                        <em>Open this career</em>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="pw-fine">
                Nothing matches that amount of training. Try a different option above.
              </p>
            )}

            <div className="pw-foot" style={{ marginTop: 30 }}>
              <Link href="/pathways/explore/plan" className="pw-cta" style={{ textDecoration: "none" }}>
                <Printer size={16} style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
                {picks > 0 ? `My plan (${picks} saved)` : "My plan"}
              </Link>
              <button
                type="button"
                className="pw-ghost"
                onClick={() => navigate("/pathways/explore/questions/1")}
              >
                <RotateCcw size={14} style={{ marginRight: 7, verticalAlign: "-2px" }} aria-hidden="true" />
                Change my answers
              </button>
            </div>
            {picks === 0 && (
              <p className="pw-fine">
                Open a career and tap Save to my plan. Everything you save goes on the printout.
              </p>
            )}
          </>
        )}
      </PathwaysShell>
    </div>
  );
}
