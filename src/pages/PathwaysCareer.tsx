/**
 * /pathways/explore/careers/:code — one career.
 *
 * Reached from the matched list, from a field, from a search, or from another
 * career's related list, so the back link goes to browser history rather than
 * to a fixed destination. Wherever the student came from is where Back returns.
 *
 * Save to my plan is the point of the page. Saving records enough about the
 * career for the printed plan to be built without fetching anything again,
 * which is what lets the plan work offline once a student has their picks.
 */

import { useCallback, useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import {
  ArrowLeft,
  BookmarkCheck,
  BookmarkPlus,
  GraduationCap,
  Loader2,
  Printer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import PathwaysShell from "@/components/pathways/PathwaysShell";
import {
  fetchCareer,
  loadPicks,
  money,
  savePicks,
  educationSentence,
  schoolDots,
  UNAVAILABLE,
  type Career,
  type Pick,
} from "@/lib/pathways";

export default function PathwaysCareer() {
  const [, params] = useRoute("/pathways/explore/careers/:code");
  const code = params?.code ?? "";

  const [career, setCareer] = useState<Career | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [picks, setPicks] = useState<Pick[]>([]);

  useEffect(() => setPicks(loadPicks()), []);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    setCareer(null);

    fetchCareer(code, (patch) => {
      if (cancelled) return;
      setCareer((current) => (current && current.code === code ? { ...current, ...patch } : current));
    })
      .then((base) => {
        if (!cancelled) setCareer(base);
      })
      .catch(() => {
        if (!cancelled) setError(UNAVAILABLE);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  const saved = picks.some((pick) => pick.code === code);

  const toggleSave = useCallback(() => {
    if (!career) return;
    const next = saved
      ? picks.filter((pick) => pick.code !== career.code)
      : [
          ...picks,
          {
            code: career.code,
            title: career.title,
            growing: career.growing,
            pay: career.salary?.median ?? 0,
            payOver: career.salary?.medianOver ?? false,
            education: career.educationNeeded,
            zone: career.jobZone?.code ?? 0,
          },
        ];
    setPicks(next);
    savePicks(next);
  }, [career, picks, saved]);

  const bar = (
    <>
      <button type="button" className="pw-back" onClick={() => window.history.back()}>
        <ArrowLeft size={16} aria-hidden="true" /> Back
      </button>
      <span style={{ flex: 1 }} />
      {picks.length > 0 && (
        <Link href="/pathways/explore/plan" className="pw-back" style={{ textDecoration: "none" }}>
          <Printer size={15} aria-hidden="true" /> My plan ({picks.length})
        </Link>
      )}
    </>
  );

  return (
    <div className="pt-20">
      <PageMeta
        title={career?.title ? `${career.title} as a Career` : "A Career"}
        description="What this job involves, what it pays, how much school or training it needs, and which careers sit next to it. Free career information for students."
      />

      <PathwaysShell bar={bar}>
        {loading && !career && (
          <p className="pw-status" role="status">
            <Loader2 size={16} className="inline animate-spin" style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
            Opening that career.
          </p>
        )}

        {error && (
          <div className="pw-notice">
            <p className="pw-error" role="alert" style={{ margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {career && (
          <>
            <h1>{career.title}</h1>

            <div className="pw-hero-tags">
              {career.salary && (
                <span className="pw-stat">
                  <b>
                    {career.salary.medianOver ? "Over " : ""}
                    {money(career.salary.median)}
                  </b>
                  <span>a year, typical</span>
                </span>
              )}
              {career.outlook?.description &&
                (career.outlook.category.toLowerCase() === "bright" ? (
                  <span className="pw-tag pw-tag-grow" style={{ alignSelf: "center", padding: "10px 15px", fontSize: 14 }}>
                    <TrendingUp size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} aria-hidden="true" />
                    {career.outlook.description}
                  </span>
                ) : (
                  <span className="pw-tag" style={{ alignSelf: "center", padding: "10px 15px", fontSize: 14 }}>
                    <TrendingDown size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} aria-hidden="true" />
                    {career.outlook.description}
                  </span>
                ))}
            </div>

            {career.whatTheyDo && <p className="pw-lede">{career.whatTheyDo}</p>}

            <div className="pw-foot" style={{ paddingTop: 8 }}>
              <button type="button" className="pw-save" aria-pressed={saved} onClick={toggleSave}>
                {saved ? (
                  <>
                    <BookmarkCheck size={17} aria-hidden="true" /> Saved to my plan
                  </>
                ) : (
                  <>
                    <BookmarkPlus size={17} aria-hidden="true" /> Save to my plan
                  </>
                )}
              </button>
              {saved && (
                <Link href="/pathways/explore/plan" className="pw-ghost" style={{ textDecoration: "none" }}>
                  See my plan
                </Link>
              )}
            </div>

            {career.salary && (career.salary.low > 0 || career.salary.high > 0) && (
              <div className="pw-block" style={{ marginTop: 24 }}>
                <h3>What people earn</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
                  {[
                    { label: "Starting out", value: career.salary.low },
                    { label: "Most people", value: career.salary.median },
                    { label: "Highest paid", value: career.salary.high },
                  ]
                    .filter((row) => row.value > 0)
                    .map((row) => (
                      <div key={row.label}>
                        <p className="pw-fine" style={{ margin: 0 }}>
                          {row.label}
                        </p>
                        <p style={{ fontSize: 25, fontWeight: 900, letterSpacing: "-.03em", margin: "2px 0 0" }}>
                          {money(row.value)}
                        </p>
                        <p className="pw-fine" style={{ margin: 0, fontSize: 12 }}>
                          a year
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {career.onTheJob.length > 0 && (
              <div className="pw-block">
                <h3>What you would do</h3>
                <ul className="pw-list">
                  {career.onTheJob.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {(career.jobZone || career.educationNeeded.length > 0) && (
              <div className="pw-block">
                <h3>School and training you need</h3>
                {career.educationNeeded.length > 0 && (
                  <>
                    <p style={{ fontWeight: 800, fontSize: 17, display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 14 }}>
                      <GraduationCap size={20} style={{ flex: "none", marginTop: 3 }} aria-hidden="true" />
                      {educationSentence(career.educationNeeded)}
                    </p>
                    <p className="pw-fine" style={{ marginBottom: 10 }}>
                      How much school, on a scale of one to five:{" "}
                      <span aria-hidden="true">
                        {"●".repeat(schoolDots(career.jobZone?.code ?? 0, career.educationNeeded))}
                        {"○".repeat(5 - schoolDots(career.jobZone?.code ?? 0, career.educationNeeded))}
                      </span>{" "}
                      <span className="sr-only">
                        {schoolDots(career.jobZone?.code ?? 0, career.educationNeeded)} out of 5
                      </span>
                    </p>
                  </>
                )}
                {career.jobZone?.education && <p className="pw-fine">{career.jobZone.education}</p>}
                {career.jobZone?.training && (
                  <p className="pw-fine" style={{ marginBottom: 0 }}>
                    {career.jobZone.training}
                  </p>
                )}
              </div>
            )}

            {career.topInterest && (
              <div className="pw-block">
                <h3>People who like this work</h3>
                <p style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>{career.topInterest.name}</p>
                <p className="pw-fine" style={{ marginBottom: 0 }}>
                  {career.topInterest.description}
                </p>
              </div>
            )}

            {career.skillGroups.length > 0 && (
              <div className="pw-block">
                <h3>Skills you would use</h3>
                {career.skillGroups.map((group) => (
                  <div key={group.name} style={{ marginBottom: 14 }}>
                    <p style={{ fontWeight: 900, marginBottom: 7 }}>{group.name}</p>
                    <ul className="pw-chips">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {career.alsoCalled.length > 0 && (
              <div className="pw-block">
                <h3>Other names for this job</h3>
                <p className="pw-fine">
                  Job postings use different words for the same work. Search for these too.
                </p>
                <ul className="pw-chips">
                  {career.alsoCalled.map((title) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              </div>
            )}

            {career.related.length > 0 && (
              <>
                <h2 style={{ marginTop: 34 }}>Careers close to this one</h2>
                <ul className="pw-cards">
                  {career.related.map((item) => (
                    <li key={item.code}>
                      <Link href={`/pathways/explore/careers/${item.code}`} className="pw-cardbtn">
                        <b>{item.title}</b>
                        {item.growing && (
                          <span className="pw-tags">
                            <span className="pw-tag pw-tag-grow">
                              <TrendingUp size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} aria-hidden="true" />
                              Hiring more
                            </span>
                          </span>
                        )}
                        <em>Open this career</em>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </PathwaysShell>
    </div>
  );
}
