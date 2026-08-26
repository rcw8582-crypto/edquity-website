/**
 * /pathways/explore/plan — the printed plan, and the sheet that explains it.
 *
 * This is the piece nothing else on the market produces. A career quiz that
 * ends in a screen is a diversion; a career quiz that ends in a document a
 * family carries into a school meeting is evidence. Under 34 C.F.R.
 * § 300.320(b)(1) the postsecondary goals in a transition plan have to rest on
 * age-appropriate transition assessment, and an interest inventory the student
 * completed themselves is one.
 *
 * Two sheets print together: page one is the student's plan, page two explains
 * to the student and their family what it is, what it is not, and what to do
 * with it. Nobody should have to guess why it is on the table.
 *
 * Everything on both sheets comes from this browser. Interest scores are
 * recomputed from the saved answers, careers come from what the student chose
 * to save, and the name is whatever they typed. Nothing was ever sent to us.
 */

import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Loader2, Printer, Trash2 } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import PathwaysShell from "@/components/pathways/PathwaysShell";
import {
  areaStyle,
  fetchQuestions,
  fetchScores,
  HEXAGON_ORDER,
  isComplete,
  loadAnswers,
  loadIdentity,
  loadPicks,
  maxScore,
  money,
  packAnswers,
  savePicks,
  saveIdentity,
  strongestAreas,
  educationSentence,
  schoolDots,
  type InterestScore,
  type Pick,
  type PlanIdentity,
  UNAVAILABLE,
} from "@/lib/pathways";

/** Supports a student can tick without having to name one from nothing. */
const SUPPORT_CHIPS = [
  "Extra time",
  "Notes given to me",
  "Quiet room",
  "Read aloud",
  "Breaks",
  "Checklists",
  "Directions repeated",
  "Someone to check in with",
];

/** Hexagon geometry. Centre 100,100 in a box wide enough for the labels. */
const HEX_R = 78;
const HEX_ANGLES: Record<string, number> = {
  realistic: -90,
  investigative: -30,
  artistic: 30,
  social: 90,
  enterprising: 150,
  conventional: 210,
};

function hexPoint(area: string, fraction: number): [number, number] {
  const radians = ((HEX_ANGLES[area] ?? 0) * Math.PI) / 180;
  const radius = HEX_R * Math.max(0, Math.min(1, fraction));
  return [100 + radius * Math.cos(radians), 100 + radius * Math.sin(radians)];
}

const ringPoints = (fraction: number) =>
  HEXAGON_ORDER.map((area) => hexPoint(area, fraction).map((n) => n.toFixed(1)).join(","))
    .join(" ");

/**
 * Where each label sits, and which way it runs from that point. Anchoring the
 * side labels outward rather than centring all six is what keeps the longest
 * word, "Organizing", inside the box.
 */
const HEX_LABELS: { area: string; x: number; y: number; anchor: "start" | "middle" | "end" }[] = [
  { area: "realistic", x: 100, y: 9, anchor: "middle" },
  { area: "investigative", x: 176, y: 57, anchor: "start" },
  { area: "artistic", x: 176, y: 151, anchor: "start" },
  { area: "social", x: 100, y: 197, anchor: "middle" },
  { area: "enterprising", x: 24, y: 151, anchor: "end" },
  { area: "conventional", x: 24, y: 57, anchor: "end" },
];

const today = () =>
  new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });

export default function PathwaysPlan() {
  const [state, setState] = useState<"loading" | "ready" | "nothing" | "error">("loading");
  const [form, setForm] = useState(30);
  const [scores, setScores] = useState<InterestScore[]>([]);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [identity, setIdentity] = useState<PlanIdentity>({ name: "", grade: "", school: "" });
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    setPicks(loadPicks());
    setIdentity(loadIdentity());
    setStamp(today());

    const saved = loadAnswers();
    setForm(saved.form);

    if (Object.keys(saved.answers).length === 0) {
      setState("nothing");
      return;
    }

    fetchQuestions(saved.form)
      .then(async (set) => {
        const packed = packAnswers(set.questions, saved.answers);
        if (!isComplete(packed, saved.form)) {
          setState("nothing");
          return;
        }
        setScores(await fetchScores(packed));
        setState("ready");
      })
      .catch(() => setState("error"));
  }, []);

  const update = (patch: Partial<PlanIdentity>) => {
    const next = { ...identity, ...patch };
    setIdentity(next);
    saveIdentity(next);
  };

  const drop = (code: string) => {
    const next = picks.filter((pick) => pick.code !== code);
    setPicks(next);
    savePicks(next);
  };

  const top = maxScore(form);
  const ranked = useMemo(() => [...scores].sort((a, b) => b.score - a.score), [scores]);
  const strongest = useMemo(() => strongestAreas(scores), [scores]);
  const highestPay = Math.max(1, ...picks.map((pick) => pick.pay));
  const owner = identity.name.trim();

  const bar = (
    <Link href="/pathways/explore/results" className="pw-back">
      <ArrowLeft size={16} aria-hidden="true" /> My results
    </Link>
  );

  return (
    <div className="pt-20">
      <PageMeta
        title="My Career Plan"
        description="Your one-page career plan: what you are interested in, the careers you saved, what they pay, and what school or training each one needs. Print it and take it to a school meeting."
      />

      <PathwaysShell wide bar={bar}>
        {state === "loading" && (
          <p className="pw-status" role="status">
            <Loader2 size={16} className="inline animate-spin" style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
            Building your plan.
          </p>
        )}

        {state === "error" && (
          <div className="pw-notice">
            <p className="pw-error" role="alert" style={{ margin: 0 }}>
              {UNAVAILABLE}
            </p>
          </div>
        )}

        {state === "nothing" && (
          <div className="pw-notice">
            <h3>Answer the questions first</h3>
            <p className="pw-fine" style={{ marginBottom: 14 }}>
              Your plan is built from your answers and the careers you save, so there is nothing to
              print yet.
            </p>
            <Link href="/pathways/explore/questions" className="pw-cta" style={{ textDecoration: "none" }}>
              Answer the questions
            </Link>
          </div>
        )}

        {state === "ready" && (
          <>
            <div className="pw-noprint">
            <h1>My plan</h1>
            <p className="pw-lede">
              Put your name on it, then print. Two pages come out: your plan, and a sheet explaining
              it for whoever reads it with you.
            </p>

            {/* Controls, which never appear on the paper */}
            <div className="pw-block">
              <h3>Your name goes on the plan</h3>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                {(
                  [
                    { key: "name" as const, label: "Your name", placeholder: "" },
                    { key: "grade" as const, label: "Grade", placeholder: "" },
                    { key: "school" as const, label: "School", placeholder: "" },
                  ]
                ).map((row) => (
                  <div key={row.key}>
                    <label
                      htmlFor={`pw-${row.key}`}
                      style={{ display: "block", fontSize: 13, fontWeight: 800, color: "var(--pw-ink-3)", marginBottom: 6 }}
                    >
                      {row.label}
                    </label>
                    <input
                      id={`pw-${row.key}`}
                      value={identity[row.key]}
                      onChange={(event) => update({ [row.key]: event.target.value })}
                      style={{
                        width: "100%",
                        background: "var(--pw-bg-2)",
                        border: "2px solid var(--pw-edge)",
                        borderRadius: 12,
                        color: "var(--pw-ink)",
                        font: "inherit",
                        fontSize: 16,
                        fontWeight: 700,
                        padding: "11px 14px",
                      }}
                    />
                  </div>
                ))}
              </div>
              <p className="pw-fine" style={{ margin: "12px 0 0" }}>
                This stays in your browser. It is only here so your name prints on your plan.
              </p>
            </div>

            <div className="pw-foot">
              <button type="button" className="pw-cta" onClick={() => window.print()}>
                <Printer size={17} style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
                Print my plan
              </button>
              <Link href="/pathways/explore/results" className="pw-ghost" style={{ textDecoration: "none" }}>
                Add more careers
              </Link>
            </div>

            {picks.length > 0 && (
              <div className="pw-block" style={{ marginTop: 22 }}>
                <h3>Careers on your plan</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                  {picks.map((pick) => (
                    <li key={pick.code} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontWeight: 800, flex: 1 }}>{pick.title}</span>
                      <button
                        type="button"
                        className="pw-textlink"
                        onClick={() => drop(pick.code)}
                        aria-label={`Take ${pick.title} off my plan`}
                      >
                        <Trash2 size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} aria-hidden="true" />
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {picks.length === 0 && (
              <div className="pw-notice">
                <h3>No careers saved yet</h3>
                <p className="pw-fine" style={{ marginBottom: 14 }}>
                  Your interests will print, and the careers section will be empty. Open a career and
                  tap Save to my plan to fill it in.
                </p>
                <Link href="/pathways/explore/results" className="pw-cta" style={{ textDecoration: "none" }}>
                  See my matched careers
                </Link>
              </div>
            )}

            {/* ============ PAGE ONE: the plan ============ */}
            <h2 style={{ marginTop: 42 }}>What will print</h2>
            <p className="pw-fine">Two pages. Here they are.</p>
            </div>

            <div className="pw-paper" style={{ marginTop: 18 }}>
              <div className="pp-band">
                <div>
                  <img
                    src="/images/logo-white.png"
                    alt="EDquity at the Margins"
                    style={{ height: 30, width: "auto", display: "block", marginBottom: 12 }}
                  />
                  <p className="pp-org">EDquity Pathways</p>
                  <h2>My Career Plan</h2>
                </div>
                <div className="pp-stamp">
                  Completed
                  <b>{stamp}</b>
                </div>
              </div>

              <div className="pp-id">
                <div>
                  <span>Name</span>
                  {owner ? (
                    <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 800 }}>{owner}</p>
                  ) : (
                    <i />
                  )}
                </div>
                <div className="sm">
                  <span>Grade</span>
                  {identity.grade.trim() ? (
                    <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 800 }}>{identity.grade}</p>
                  ) : (
                    <i />
                  )}
                </div>
                <div>
                  <span>School</span>
                  {identity.school.trim() ? (
                    <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 800 }}>{identity.school}</p>
                  ) : (
                    <i />
                  )}
                </div>
              </div>

              <div className="pp-body">
                {/* 1 — interests */}
                <div className="pp-sec">
                  <div className="pp-h">
                    <b style={{ background: "#8B5CF6", color: "#fff" }}>1</b>
                    <h3>What I am into</h3>
                    <em>
                      O*NET Interest Profiler
                      <br />
                      {form} items
                    </em>
                  </div>

                  <div className="pp-hexrow">
                    <svg
                      viewBox="-44 -6 276 212"
                      width="190"
                      height="146"
                      role="img"
                      aria-label={ranked
                        .map((area) => `${area.title} ${area.score} of ${top}`)
                        .join(", ")}
                    >
                      {[0.25, 0.5, 0.75].map((fraction) => (
                        <polygon
                          key={fraction}
                          points={ringPoints(fraction)}
                          fill="none"
                          stroke="#E6EBF1"
                          strokeWidth="1"
                        />
                      ))}
                      <polygon points={ringPoints(1)} fill="none" stroke="#C9D4DE" strokeWidth="1.2" />
                      <g stroke="#E6EBF1" strokeWidth="1">
                        {HEXAGON_ORDER.map((area) => {
                          const [x, y] = hexPoint(area, 1);
                          return <line key={area} x1="100" y1="100" x2={x} y2={y} />;
                        })}
                      </g>
                      <polygon
                        points={HEXAGON_ORDER.map((area) => {
                          const score = scores.find((row) => row.code === area)?.score ?? 0;
                          return hexPoint(area, score / top).map((n) => n.toFixed(1)).join(",");
                        }).join(" ")}
                        fill="#8B5CF6"
                        fillOpacity="0.22"
                        stroke="#6D28D9"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                      />
                      <g fill="#6D28D9">
                        {HEXAGON_ORDER.map((area) => {
                          const score = scores.find((row) => row.code === area)?.score ?? 0;
                          const [x, y] = hexPoint(area, score / top);
                          return <circle key={area} cx={x} cy={y} r="3.4" />;
                        })}
                      </g>
                      <g
                        fontFamily="Archivo, sans-serif"
                        fontSize="11"
                        fontWeight="800"
                        fill="#4B5663"
                      >
                        {HEX_LABELS.map((label) => (
                          <text
                            key={label.area}
                            x={label.x}
                            y={label.y}
                            textAnchor={label.anchor}
                          >
                            {areaStyle(label.area).plain}
                          </text>
                        ))}
                      </g>
                    </svg>

                    <div className="pp-tiles">
                      {ranked.map((area, position) => {
                        const style = areaStyle(area.code);
                        return (
                          <div key={area.code} className={`pp-tile${strongest.has(area.code) ? " win" : ""}`}>
                            <span className="d" style={{ background: style.ink }}>
                              {style.letter}
                            </span>
                            <span className="n">
                              {area.title}
                              <i>
                                {style.plain} · rank {position + 1}
                              </i>
                            </span>
                            <span className="s">{area.score}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p className="pp-cite">
                    Scores are out of {top}.{" "}
                    {strongest.size > 0
                      ? "My strongest areas have a dark border."
                      : "My answers came out fairly even, so no single area stands out yet."}{" "}
                    This is work I said I would enjoy, and it does not measure what I am good at.
                  </p>
                </div>

                {/* 2 — careers */}
                <div className="pp-sec">
                  <div className="pp-h">
                    <b style={{ background: "#14B8A6", color: "#04302B" }}>2</b>
                    <h3>Careers I want to look into</h3>
                    <em>Pay is the U.S. median</em>
                  </div>

                  {picks.length === 0 ? (
                    <p className="pp-cite" style={{ margin: 0 }}>
                      I have not chosen any careers yet.
                    </p>
                  ) : (
                    <>
                      <div className="pp-cards">
                        {picks.map((pick) => {
                          const dots = schoolDots(pick.zone, pick.education);
                          return (
                            <div key={pick.code} className="pp-card">
                              {pick.growing && <span className="pp-ribbon">Hiring more</span>}
                              <h4>{pick.title}</h4>
                              {pick.pay > 0 ? (
                                <>
                                  <p className="pp-pay">
                                    <b>
                                      {pick.payOver ? "Over " : ""}
                                      {money(pick.pay)}
                                    </b>
                                    <span>/ YR</span>
                                  </p>
                                  <div className="pp-paybar">
                                    <i style={{ width: `${(pick.pay / highestPay) * 100}%` }} />
                                  </div>
                                </>
                              ) : (
                                <p className="pp-pay">
                                  <span>Pay not reported</span>
                                </p>
                              )}
                              <div className="pp-metas">
                                <div>
                                  <p className="pp-school">
                                    {pick.education.length > 0
                                      ? educationSentence(pick.education)
                                      : "School and training not reported"}
                                  </p>
                                  <div className="pp-dots" aria-hidden="true">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                      <i key={n} className={n <= dots ? "on" : ""} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="pp-cite">
                        The five dots are how much school or training the work usually takes. One dot
                        is a high school diploma, five is a master's degree.
                      </p>
                    </>
                  )}
                </div>

                {/* 3 and 4 — the student writes */}
                <div className="pp-sec pp-two">
                  <div className="pp-panel tint">
                    <div className="pp-h" style={{ marginBottom: 10 }}>
                      <b style={{ background: "#22C55E", color: "#06301A" }}>3</b>
                      <h3 style={{ fontSize: 13 }}>My next three steps</h3>
                    </div>
                    <p className="pp-cite" style={{ margin: "0 0 9px" }}>
                      A class to take, a person to talk to, something to try.
                    </p>
                    <div className="pp-steps">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="pp-step">
                          <span className="pp-box" />
                          <span className="pp-line" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pp-panel">
                    <div className="pp-h" style={{ marginBottom: 10 }}>
                      <b style={{ background: "#F59E0B", color: "#3A2503" }}>4</b>
                      <h3 style={{ fontSize: 13 }}>What helps me</h3>
                    </div>
                    <ul className="pp-chips">
                      {SUPPORT_CHIPS.map((chip) => (
                        <li key={chip}>{chip}</li>
                      ))}
                    </ul>
                    <span className="pp-line" />
                    <span className="pp-line" />
                  </div>
                </div>

                {/* 5 — the ask */}
                <div className="pp-sec">
                  <div className="pp-team">
                    <b>For my school support team</b>
                    <p>
                      I filled this out myself. Please use it when we talk about my classes, my
                      goals, and what I want to do after school, and please give me a copy of
                      anything you write down about my plans.
                    </p>
                    <p style={{ marginTop: 8 }}>
                      <strong>If I have an IEP or a 504 plan:</strong> under 34 C.F.R.
                      § 300.320(b)(1), the postsecondary goals in my transition plan have to be based
                      on age-appropriate transition assessment. My interest results above are one of
                      those assessments, and sections 3 and 4 are my own statement of my preferences
                      and interests.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pp-foot">
                <span>
                  This document incorporates information from O*NET Web Services by the U.S.
                  Department of Labor, Employment and Training Administration (USDOL/ETA). O*NET® is
                  a trademark of USDOL/ETA. Interest hexagon after Holland's model of vocational
                  types. Pay figures are national annual medians.
                </span>
                <span style={{ whiteSpace: "nowrap", fontWeight: 900, color: "#122C54" }}>
                  {owner ? (
                    <>
                      This plan belongs
                      <br />
                      to {owner}.
                    </>
                  ) : (
                    <>
                      This plan
                      <br />
                      belongs to me.
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* ============ PAGE TWO: the explainer ============ */}
            <div className="pw-paper" style={{ marginTop: 26 }}>
              <div className="pp-band">
                <div>
                  <img
                    src="/images/logo-white.png"
                    alt="EDquity at the Margins"
                    style={{ height: 30, width: "auto", display: "block", marginBottom: 12 }}
                  />
                  <p className="pp-org">EDquity Pathways</p>
                  <h2>About this plan</h2>
                </div>
                <div className="pp-stamp">
                  For every
                  <b>Student &amp; family</b>
                </div>
              </div>

              <div className="pp-body">
                <div className="pp-sec pp-two">
                  <div className="pp-panel">
                    <div className="pp-h" style={{ marginBottom: 10 }}>
                      <b style={{ background: "#8B5CF6", color: "#fff" }}>?</b>
                      <h3 style={{ fontSize: 13 }}>What this is</h3>
                    </div>
                    <p className="pp-team-note" style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                      A student answered {form} short questions about the kinds of work they would
                      enjoy, using the O*NET Interest Profiler from the U.S. Department of Labor. The
                      six scores on page one describe their interests. They then chose careers to look
                      into, and the pay and training figures come from federal labor data.
                    </p>
                  </div>

                  <div className="pp-panel tint">
                    <div className="pp-h" style={{ marginBottom: 10 }}>
                      <b style={{ background: "#B91C1C", color: "#fff" }}>!</b>
                      <h3 style={{ fontSize: 13 }}>What this is not</h3>
                    </div>
                    <p style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                      It is not a test of ability, intelligence, or how well anyone will do at a job.
                      Interests and aptitude are different things, and plenty of people are good at
                      work they would hate. Nobody passed or failed anything, and there is no score
                      to be worried about.
                    </p>
                  </div>
                </div>

                <div className="pp-sec">
                  <div className="pp-h">
                    <b style={{ background: "#22C55E", color: "#06301A" }}>1</b>
                    <h3>For the student</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 10.5, lineHeight: 1.7, color: "#333C48" }}>
                    <li>Your interests will change, and that is normal. Do this again in a year.</li>
                    <li>
                      A career on this page is a thing to look into, not a promise. Talk to somebody
                      who does it.
                    </li>
                    <li>
                      Fill in sections 3 and 4 in your own words. Those two boxes are the parts
                      nobody can write for you.
                    </li>
                    <li>
                      Show it to whoever helps you at school, whether that is a counsellor, a
                      teacher, or a case manager, and ask for a copy of anything they write down
                      about your plans.
                    </li>
                  </ul>
                </div>

                <div className="pp-sec">
                  <div className="pp-h">
                    <b style={{ background: "#14B8A6", color: "#04302B" }}>2</b>
                    <h3>For families, whatever your child has in place</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 10.5, lineHeight: 1.7, color: "#333C48" }}>
                    <li>
                      Take it to any school conversation about your child's future: course
                      selection, a counsellor appointment, a parent-teacher conference, or a formal
                      meeting. Ask for it to be added to your child's file.
                    </li>
                    <li>
                      Ask who at the school is responsible for career and college planning, and
                      whether your child has ever met them.
                    </li>
                    <li>
                      Planning is not only about college. The school and training line on page one
                      exists because apprenticeships, certificates and on-the-job training are real
                      routes to real pay.
                    </li>
                    <li>
                      Your child wrote sections 3 and 4 themselves. If a school plan sets goals that
                      contradict what they wrote, that is worth a question.
                    </li>
                  </ul>
                </div>

                <div className="pp-sec pp-two">
                  <div className="pp-panel">
                    <div className="pp-h" style={{ marginBottom: 10 }}>
                      <b style={{ background: "#122C54", color: "#fff" }}>A</b>
                      <h3 style={{ fontSize: 13 }}>If your child has an IEP or a 504 plan</h3>
                    </div>
                    <p style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                      Federal rules require the transition goals in an IEP to rest on
                      age-appropriate transition assessment. An interest inventory your child
                      completed is one. If the team has never done one, this page is a reasonable
                      place to start that conversation, and page one asks for exactly that.
                    </p>
                  </div>
                  <div className="pp-panel tint">
                    <div className="pp-h" style={{ marginBottom: 10 }}>
                      <b style={{ background: "#0F766E", color: "#fff" }}>B</b>
                      <h3 style={{ fontSize: 13 }}>If your child has neither, and school is hard</h3>
                    </div>
                    <p style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                      Plenty of students who need support have never been evaluated for it. If
                      school is harder for your child than it looks like it should be, our free
                      Pre-Evaluation Eligibility Checklist walks through whether asking for an
                      evaluation makes sense. It is at
                      edquityatthemargins.org/resources/iep-eligibility-checklist
                    </p>
                  </div>
                </div>

                <div className="pp-sec">
                  <div className="pp-h">
                    <b style={{ background: "#F59E0B", color: "#3A2503" }}>3</b>
                    <h3>Questions worth asking at school</h3>
                    <em>Ask any of these</em>
                  </div>
                  <div className="pp-two">
                    <div className="pp-panel">
                      <p style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                        What courses, work experience, or training does my child need for these
                        careers, and are those courses available here?
                      </p>
                    </div>
                    <div className="pp-panel">
                      <p style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                        Who is responsible for career planning at this school, and can my child meet
                        them?
                      </p>
                    </div>
                    <div className="pp-panel">
                      <p style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                        Does the school have work-based learning, job shadowing, or apprenticeship
                        partners my child could join?
                      </p>
                    </div>
                    <div className="pp-panel">
                      <p style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                        Will this page go in my child's file, and who else will see it?
                      </p>
                    </div>
                    <div className="pp-panel">
                      <p style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                        <strong>IEP or 504 only:</strong> what transition assessments has the team
                        done, and when? May we have copies?
                      </p>
                    </div>
                    <div className="pp-panel">
                      <p style={{ fontSize: 10.5, lineHeight: 1.6, margin: 0, color: "#333C48" }}>
                        <strong>IEP or 504 only:</strong> how do the goals in this Program connect to
                        what my child said they want?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pp-sec">
                  <div className="pp-team">
                    <b>Free help from EDquity at the Margins</b>
                    <p>
                      If your child has an IEP, we review it at no cost and tell you plainly what
                      the document does and does not do. If your child has no IEP or 504 plan and
                      school is still hard, start with our free Pre-Evaluation Eligibility
                      Checklist. Either way it costs nothing, and either way it is what we are here
                      for. edquityatthemargins.org
                    </p>
                  </div>
                </div>
              </div>

              <div className="pp-foot">
                <span>
                  EDquity at the Margins is a Tennessee nonprofit. This sheet is general information
                  about transition planning and it is not legal advice. Career information comes from
                  O*NET Web Services by the U.S. Department of Labor, Employment and Training
                  Administration (USDOL/ETA). O*NET® is a trademark of USDOL/ETA.
                </span>
                <span style={{ whiteSpace: "nowrap", fontWeight: 900, color: "#122C54" }}>
                  Page 2 of 2
                </span>
              </div>
            </div>
          </>
        )}
      </PathwaysShell>
    </div>
  );
}
