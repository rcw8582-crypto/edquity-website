/**
 * /pathways/explore/questions and /pathways/explore/questions/:n
 *
 * One question per screen. Every question is its own URL, so the browser back
 * button walks backwards through the questions, a student can bookmark where
 * they stopped, and nothing is lost by closing the tab.
 *
 * Answering advances automatically. A student who taps "Like" has said what
 * they think, and making them then hunt for a Next button is friction with no
 * purpose. Back and Skip stay visible the whole time.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowLeft, Loader2, RotateCcw, Sparkles } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import PathwaysShell from "@/components/pathways/PathwaysShell";
import {
  SHORT_FORM,
  LONG_FORM,
  areaStyle,
  clearAnswers,
  fetchQuestions,
  loadAnswers,
  packAnswers,
  saveAnswers,
  type AnswerOption,
  type Question,
  UNAVAILABLE,
} from "@/lib/pathways";

/** Emoji per answer value, matching the instrument's fixed 1 to 5 scale. */
const FACES: Record<number, string> = { 1: "👎", 2: "🙁", 3: "🤔", 4: "👍", 5: "❤️" };

export default function PathwaysQuestions() {
  const [, params] = useRoute("/pathways/explore/questions/:n");
  const [, navigate] = useLocation();

  const [form, setForm] = useState(SHORT_FORM);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<AnswerOption[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const heading = useRef<HTMLHeadingElement | null>(null);
  const restored = useRef(false);

  const position = Math.max(1, Number(params?.n ?? "1") || 1);

  // Saved answers come back first, so the form length is known before the
  // questions are fetched and a student who chose the long version keeps it.
  useEffect(() => {
    const saved = loadAnswers();
    setForm(saved.form);
    setAnswers(saved.answers);
    restored.current = true;
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    let cancelled = false;
    setLoading(true);
    fetchQuestions(form)
      .then((set) => {
        if (cancelled) return;
        setQuestions(set.questions);
        setOptions(set.options);
        setError("");
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
  }, [form]);

  const answeredCount = Object.keys(answers).length;
  const question = questions[position - 1];
  const total = questions.length;

  // Focus the question text on every change, so a screen reader announces the
  // new question rather than leaving the user on the button they just pressed.
  useEffect(() => {
    if (question) heading.current?.focus({ preventScroll: true });
  }, [question]);

  const record = useCallback(
    (value: number) => {
      if (!question) return;
      const next = { ...answers, [question.index]: value };
      setAnswers(next);
      saveAnswers({ form, answers: next });

      if (position < total) {
        navigate(`/pathways/explore/questions/${position + 1}`);
        return;
      }
      // Last question. Only leave for the results once every question has an
      // answer, otherwise send them to the first one still blank.
      const packed = packAnswers(questions, next);
      const firstBlank = packed.indexOf("0");
      navigate(
        firstBlank === -1
          ? "/pathways/explore/results"
          : `/pathways/explore/questions/${firstBlank + 1}`,
      );
    },
    [answers, form, navigate, position, question, questions, total],
  );

  const skip = () => {
    if (position < total) navigate(`/pathways/explore/questions/${position + 1}`);
  };

  const startOver = () => {
    clearAnswers();
    setAnswers({});
    navigate("/pathways/explore/questions/1");
  };

  const switchForm = (which: number) => {
    setForm(which);
    saveAnswers({ form: which, answers });
    navigate("/pathways/explore/questions/1");
  };

  const bar = (
    <>
      {position > 1 ? (
        <Link href={`/pathways/explore/questions/${position - 1}`} className="pw-back">
          <ArrowLeft size={16} aria-hidden="true" /> Back
        </Link>
      ) : (
        <Link href="/pathways/explore" className="pw-back">
          <ArrowLeft size={16} aria-hidden="true" /> Start
        </Link>
      )}
      <span className="pw-track-outer">
        <i style={{ width: `${total > 0 ? (answeredCount / total) * 100 : 0}%` }} />
      </span>
      <span className="pw-streak" aria-label={`${answeredCount} of ${total} answered`}>
        {answeredCount}
        <span style={{ opacity: 0.55, fontSize: 13 }}>/{total || form}</span>
      </span>
    </>
  );

  return (
    <div className="pt-20">
      <PageMeta
        title="Career Questions"
        description="Answer short questions about the kinds of work you would enjoy, then see careers that match. Free, nothing timed, and no account needed."
      />

      <PathwaysShell bar={bar}>
        {loading && (
          <p className="pw-status" role="status">
            <Loader2 size={16} className="inline animate-spin" style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
            Loading the questions.
          </p>
        )}

        {error && !loading && (
          <div className="pw-notice">
            <p className="pw-error" role="alert" style={{ margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {!loading && !error && !question && total > 0 && (
          <div className="pw-notice">
            <h3>That question does not exist</h3>
            <p className="pw-fine">There are {total} questions in this set.</p>
            <Link href="/pathways/explore/questions/1" className="pw-cta" style={{ textDecoration: "none" }}>
              Go to the first one
            </Link>
          </div>
        )}

        {!loading && !error && question && (
          <>
            <div className="pw-stage">
              <span className="pw-blob" aria-hidden="true">
                <span style={{ fontSize: 40, color: areaStyle(question.area).dark }}>
                  {areaStyle(question.area).letter}
                </span>
              </span>
              <p className="pw-qnum">
                Question {position} of {total}
              </p>
              <h1 className="pw-qtext" tabIndex={-1} ref={heading}>
                {question.text}
              </h1>
              <p className="pw-fine" style={{ margin: 0 }}>
                How much would you like doing this?
              </p>
            </div>

            <div className="pw-opts" role="group" aria-label="How much would you like doing this">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="pw-opt"
                  aria-pressed={answers[question.index] === option.value}
                  onClick={() => record(option.value)}
                >
                  <span className="pw-opt-mark" aria-hidden="true">
                    {FACES[option.value] ?? ""}
                  </span>
                  {option.name}
                </button>
              ))}
            </div>

            <div className="pw-foot">
              {position < total && (
                <button type="button" className="pw-ghost" onClick={skip}>
                  Skip this one
                </button>
              )}
              {position === total && (
                <Link href="/pathways/explore/results" className="pw-cta" style={{ textDecoration: "none" }}>
                  <Sparkles size={16} style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
                  See my careers
                </Link>
              )}
              <button type="button" className="pw-textlink" onClick={startOver}>
                <RotateCcw size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} aria-hidden="true" />
                Start over
              </button>
            </div>

            <p className="pw-fine" style={{ marginTop: 22 }}>
              {form === SHORT_FORM ? (
                <>
                  This is the short set.{" "}
                  <button type="button" className="pw-textlink" onClick={() => switchForm(LONG_FORM)}>
                    Use the longer {LONG_FORM} question version
                  </button>{" "}
                  for a more detailed result.
                </>
              ) : (
                <>
                  This is the long set.{" "}
                  <button type="button" className="pw-textlink" onClick={() => switchForm(SHORT_FORM)}>
                    Switch to the shorter {SHORT_FORM} question version
                  </button>
                  .
                </>
              )}
            </p>
          </>
        )}
      </PathwaysShell>
    </div>
  );
}
