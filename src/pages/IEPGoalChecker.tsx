/**
 * /tools/iep-goal-checker
 *
 * Paste-and-parse MAG analyzer. A parent pastes their child's IEP
 * annual goal exactly as written. The tool extracts each of the
 * seven MAG components using regex heuristics, flags weak language,
 * scores the goal, and outputs the exact questions to take to the
 * next IEP meeting.
 *
 * Design notes:
 *   - Pure client-side. No data sent anywhere.
 *   - When the parser cannot find a component, that itself is a
 *     signal: if a reasonable reader cannot extract the component
 *     from the goal as written, neither can a substitute teacher.
 *     The feedback frames missing components as "the goal is
 *     unclear about this," not "you typed it wrong."
 *   - Weak-language detection runs on whatever the parser extracts.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, X, AlertTriangle, Copy, RotateCcw, ArrowLeft, CheckCheck, ClipboardPaste } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ParsedGoal {
  condition: string | null;
  studentName: string | null;
  skill: string | null;
  baseline: string | null;
  target: string | null;
  frequency: string | null;
  schedule: string | null;
  tool: string | null;
  byDate: string | null;
}

interface ComponentResult {
  key: keyof ParsedGoal;
  label: string;
  value: string | null;
  weak: boolean;
  weakReason?: string;
  prompt: string;
}

// =================================================================
// Parsing helpers
// =================================================================

function clean(text: string): string {
  // Normalize quotes, collapse whitespace, drop trailing periods.
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCondition(text: string): string | null {
  // Pattern A: "Given X," at start.
  const a = text.match(/^Given\s+([^,]+?),/i);
  if (a) return a[1].trim();

  // Pattern B: "using X" before "will".
  const b = text.match(/\busing\s+([^,]+?)(?:,|\s+(?:will|and)\b)/i);
  if (b) return `using ${b[1].trim()}`;

  // Pattern C: "with [tool/support/accommodation]".
  const c = text.match(/\bwith\s+(?:access\s+to\s+)?([^,]+?)\s+(?:support|access|accommodations?|prompts?|assistance)\b/i);
  if (c) return c[0].trim();

  return null;
}

function extractStudent(text: string): string | null {
  // Pattern A: "[Name] will" — capture first capitalized word before "will".
  const a = text.match(/\b([A-Z][a-z]+)\s+will\b/);
  if (a && a[1] !== "Given") return a[1];

  // Pattern B: "the student" generic reference.
  if (/\bthe student\s+will\b/i.test(text)) return "the student";

  return null;
}

function extractSkill(text: string): string | null {
  // Capture everything between "will" (optionally followed by "increase his/her/their accuracy in")
  // and the next major component marker.
  const stopWord = /\s+(?:from\s|to\s+\d|to\s+a\s+Level|with\s+\d|in\s+\d+\s+of\s+\d|across\s+\d+\s+of|on\s+\d+\s+of|by\s+\d|by\s+(?:Spring|Fall|Winter|Summer|January|February|March|April|May|June|July|August|September|October|November|December|the\s+end)|evaluated\s+by|as\s+measured\s+by|measured\s+by|assessed\s+by|scored\s+by|weekly|daily|bi-?weekly|monthly|quarterly|every\s+\w+)/i;
  const m = text.match(/\bwill\s+(?:increase\s+(?:his|her|their)?\s*(?:accuracy\s+in\s+)?)?([^,]+?)(?=\s+from\s|\s+to\s+\d|\s+to\s+a\s+Level|\s+with\s+\d|\s+in\s+\d+\s+of\s+\d|\s+across\s+\d+\s+of|\s+on\s+\d+\s+of|\s+by\s+\d|\s+by\s+(?:Spring|Fall|Winter|Summer|January|February|March|April|May|June|July|August|September|October|November|December|the\s+end)|\s+evaluated\s+by|\s+as\s+measured\s+by|\s+measured\s+by|\s+assessed\s+by|\s+scored\s+by|\s+weekly|\s+daily|\s+bi-?weekly|\s+monthly|\s+quarterly|\s+every\s+\w+|,|\.|$)/i);
  if (m) return m[1].trim();
  // Fallback: capture until end of sentence
  const fallback = text.match(/\bwill\s+(.+?)(?:[\.,]|$)/i);
  if (fallback) return fallback[1].trim();
  return null;
}

function extractBaseline(text: string): string | null {
  // "from X%" or "from N" or "from Level N" or "from N out of M"
  const a = text.match(/\bfrom\s+(?:a\s+)?(?:Level\s+\d+|\d+(?:\.\d+)?%?(?:\s+out\s+of\s+\d+)?)/i);
  if (a) return a[0].replace(/^from\s+/i, "").trim();

  // "currently X" or "current performance of X"
  const b = text.match(/\bcurrent(?:ly)?\s+(?:performance\s+(?:of\s+|at\s+))?(?:a\s+)?(?:Level\s+\d+|\d+(?:\.\d+)?%?)/i);
  if (b) return b[0].replace(/^current(?:ly)?\s+(?:performance\s+(?:of\s+|at\s+))?/i, "").trim();

  // Vague phrase fallback: "below grade level," "near grade level"
  const c = text.match(/\b(below grade level|near grade level|significantly below|some difficulty|struggles)\b/i);
  if (c) return c[1];

  return null;
}

function extractTarget(text: string): string | null {
  // "to X%" or "to Level N" — but only after a "from X" so we know it's a range, not a destination
  const range = text.match(/\bfrom\s+[^,]+?\s+to\s+(?:a\s+)?(?:Level\s+\d+|\d+(?:\.\d+)?%?(?:\s+out\s+of\s+\d+)?)/i);
  if (range) {
    const inner = range[0].match(/\bto\s+(?:a\s+)?(.+)$/i);
    if (inner) return inner[1].trim();
  }

  // "with X% accuracy"
  const a = text.match(/\bwith\s+(\d+(?:\.\d+)?%?)\s+accuracy/i);
  if (a) return a[1].trim();

  // "at X% accuracy" or "at Level N"
  const b = text.match(/\bat\s+(?:a\s+)?(?:Level\s+\d+|\d+(?:\.\d+)?%?)/i);
  if (b) return b[0].replace(/^at\s+(?:a\s+)?/i, "").trim();

  // Vague target fallback
  const c = text.match(/\b(at\s+grade\s+level|grade\s+level|appropriate\s+for\s+grade|mastery)\b/i);
  if (c) return c[1];

  return null;
}

function extractFrequency(text: string): string | null {
  // "in N of M sessions/trials/etc"
  const a = text.match(/\b(?:in|across|on|during|over)\s+(\d+\s+of\s+\d+\s+(?:consecutive\s+)?(?:sessions|trials|opportunities|attempts|weeks|days|observations|probes|chances))/i);
  if (a) return a[1].trim();

  // "X% of trials/opportunities"
  const b = text.match(/\b(\d+%\s+of\s+(?:trials|opportunities|sessions|attempts))/i);
  if (b) return b[1].trim();

  return null;
}

function extractSchedule(text: string): string | null {
  const m = text.match(/\b(daily|weekly|bi-?weekly|monthly|quarterly|annually|every\s+(?:other\s+)?(?:week|day|month|grading\s+period|two\s+weeks))/i);
  if (m) return m[1].trim();
  return null;
}

function extractTool(text: string): string | null {
  // "evaluated/measured/assessed/scored by X"
  const m = text.match(/(?:evaluated|measured|assessed|scored)\s+by\s+([^.,]+?)(?=\s+by\s+[A-Z]|\.|,(?:\s+by\s+)|$)/i);
  if (m) return m[1].trim();

  // "as measured by X"
  const a = text.match(/\bas\s+measured\s+by\s+([^.,]+?)(?=\.|,|$)/i);
  if (a) return a[1].trim();

  return null;
}

function extractByDate(text: string): string | null {
  // "by Month Year" or "by Year" or "by the end of [year/term]"
  const a = text.match(/\bby\s+(the\s+end\s+of\s+(?:Spring\s+|Fall\s+|Winter\s+|Summer\s+)?\d{4})/i);
  if (a) return a[1].trim();

  const b = text.match(/\bby\s+([A-Z][a-z]+\s+\d{4})/);
  if (b) return b[1].trim();

  const c = text.match(/\bby\s+(\d{4})\b/);
  if (c) return c[1].trim();

  return null;
}

function parseGoal(raw: string): ParsedGoal {
  const text = clean(raw);
  if (!text) {
    return {
      condition: null,
      studentName: null,
      skill: null,
      baseline: null,
      target: null,
      frequency: null,
      schedule: null,
      tool: null,
      byDate: null,
    };
  }
  return {
    condition: extractCondition(text),
    studentName: extractStudent(text),
    skill: extractSkill(text),
    baseline: extractBaseline(text),
    target: extractTarget(text),
    frequency: extractFrequency(text),
    schedule: extractSchedule(text),
    tool: extractTool(text),
    byDate: extractByDate(text),
  };
}

// =================================================================
// Weak-language detection
// =================================================================

const WEAK_PATTERNS: Partial<Record<keyof ParsedGoal, { pattern: RegExp; reason: string }[]>> = {
  skill: [
    {
      pattern: /\b(improve|understand|demonstrate awareness|engage with|appreciate|show interest|be aware|develop)\b/i,
      reason:
        "Verbs like 'improve,' 'understand,' or 'demonstrate awareness' are not observable. Ask the team to rewrite the goal using a measurable verb such as solve, write, read, identify, initiate, complete, or produce.",
    },
  ],
  baseline: [
    {
      pattern: /^(below grade level|struggles|significantly below|near grade level|making progress|some difficulty)\b/i,
      reason:
        "Phrases like 'below grade level' or 'struggles' are not measurable. Ask the team to update Present Levels with a current number (percent, score, or count).",
    },
  ],
  target: [
    {
      pattern: /^(at\s+)?(grade level|on grade level|appropriate for grade|mastery)\b/i,
      reason:
        "A target like 'grade level' or 'mastery' without a number is not measurable. Ask the team to specify a percent, score, or rubric level.",
    },
  ],
  tool: [
    {
      pattern: /^(exit tickets?|classroom observations?|teacher report|teacher observation|informal observation|observation)\.?$/i,
      reason:
        "This tool is too vague. A strong measurement tool names the structure (number of items, scoring criteria) and the setting (for example, 'independent practice level'). Exit tickets in particular reflect what the student did during the lesson, not what they have retained.",
    },
  ],
};

function detectWeakness(key: keyof ParsedGoal, value: string | null): { weak: boolean; reason?: string } {
  if (!value) return { weak: false };
  const patterns = WEAK_PATTERNS[key];
  if (!patterns) return { weak: false };
  for (const { pattern, reason } of patterns) {
    if (pattern.test(value)) return { weak: true, reason };
  }
  return { weak: false };
}

// =================================================================
// Component definitions
// =================================================================

const COMPONENTS: Array<{
  key: keyof ParsedGoal;
  label: string;
  description: string;
  missingPrompt: (name: string) => string;
  weakPrompt: (name: string) => string;
}> = [
  {
    key: "condition",
    label: "Condition, setting, or materials",
    description: "What the student has access to while working on the goal (calculator, graphic organizer, small group, audiobook, etc.).",
    missingPrompt: (n) =>
      `The goal does not name a condition, setting, or materials. What will ${n || "my child"} have access to while working on this goal? That language needs to be in the goal itself.`,
    weakPrompt: (n) =>
      `The condition language is vague. Please name the specific materials, setting, or supports ${n || "my child"} will use.`,
  },
  {
    key: "studentName",
    label: "Student name",
    description: "The specific child the goal is written for.",
    missingPrompt: () =>
      `The goal does not name the student. A measurable goal should name the specific child it applies to.`,
    weakPrompt: () => "",
  },
  {
    key: "skill",
    label: "Observable skill or behavior",
    description: "The specific skill the goal targets, using a measurable verb (solve, write, read, identify, initiate).",
    missingPrompt: (n) =>
      `The goal does not name a specific observable skill or behavior. What is ${n || "my child"} actually expected to do?`,
    weakPrompt: (n) =>
      `The verb in this goal is not observable. What is ${n || "my child"} expected to do in a way a substitute teacher could see and measure?`,
  },
  {
    key: "baseline",
    label: "Baseline (current performance)",
    description: "Where the child is starting from, drawn from Present Levels. Examples: 40%, 4 out of 10, Level 1, 42 words per minute.",
    missingPrompt: (n) =>
      `I do not see a measurable baseline for this goal. What is ${n || "my child"}'s current performance on this skill, based on a current assessment? That number belongs in Present Levels.`,
    weakPrompt: (n) =>
      `The baseline is not measurable. What specific score, percent, or count represents ${n || "my child"}'s current performance?`,
  },
  {
    key: "target",
    label: "Target (level of mastery)",
    description: "Where the goal expects the child to land. Examples: 90%, 8 out of 10, Level 3, 80 words per minute.",
    missingPrompt: (n) =>
      `The goal does not name a measurable target. What is ${n || "my child"} expected to achieve, written as a percent, score, or rubric level?`,
    weakPrompt: (n) =>
      `The target is not measurable. What specific number represents the level of mastery ${n || "my child"} is expected to reach?`,
  },
  {
    key: "frequency",
    label: "Frequency (how consistently)",
    description: "How consistently the skill must be shown. Examples: in 4 of 5 consecutive sessions, across 3 of 4 trials.",
    missingPrompt: (n) =>
      `The goal does not say how consistently ${n || "my child"} must show the skill before the team calls it mastered. Please add that criterion to the goal.`,
    weakPrompt: () => "",
  },
  {
    key: "schedule",
    label: "Evaluation schedule",
    description: "How often the data is checked. Examples: weekly, bi-weekly, every grading period.",
    missingPrompt: () =>
      `The goal does not name an evaluation schedule. How often will the team collect and review data on this goal?`,
    weakPrompt: () => "",
  },
  {
    key: "tool",
    label: "Measurement tool",
    description: "What the team uses to measure. Strong tools name structure (number of items, scoring criteria) and administration setting.",
    missingPrompt: (n) =>
      `The goal does not name a measurement tool. What specific tool will the team use to track ${n || "my child"}'s progress? It should name what is on it, how it is scored, and the setting in which it is administered.`,
    weakPrompt: (n) =>
      `The measurement tool is too vague. What specific tool, with named structure and administration setting, will the team use to track ${n || "my child"}'s progress?`,
  },
];

// =================================================================
// Component
// =================================================================

const SAMPLE_GOAL =
  "Given a 4-function calculator, Luis will increase his accuracy in solving one-step equations from 40% to 90%, across 4 of 5 consecutive sessions, weekly, evaluated by a 10-problem one-step equation probe administered at independent practice level, by April 2027.";

export default function IEPGoalChecker() {
  const [goalText, setGoalText] = useState("");
  const [overrideName, setOverrideName] = useState("");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseGoal(goalText), [goalText]);

  const childName = useMemo(() => {
    const fromOverride = overrideName.trim();
    if (fromOverride) return fromOverride;
    const fromParse = parsed.studentName;
    if (fromParse && fromParse !== "the student") return fromParse;
    return "";
  }, [overrideName, parsed.studentName]);

  const results: ComponentResult[] = useMemo(() => {
    return COMPONENTS.map((def) => {
      const value = parsed[def.key];
      const weakness = detectWeakness(def.key, value);
      const present = !!value;
      let prompt = "";
      if (!present) prompt = def.missingPrompt(childName);
      else if (weakness.weak) prompt = def.weakPrompt(childName);

      return {
        key: def.key,
        label: def.label,
        value,
        weak: weakness.weak,
        weakReason: weakness.reason,
        prompt,
      };
    });
  }, [parsed, childName]);

  const presentCount = results.filter((r) => !!r.value).length;
  const weakCount = results.filter((r) => r.weak).length;
  const strongCount = results.filter((r) => r.value && !r.weak).length;
  const totalParts = results.length;

  const handleLoadSample = () => {
    setGoalText(SAMPLE_GOAL);
  };

  const handleReset = () => {
    setGoalText("");
    setOverrideName("");
    setCopied(false);
  };

  const buildReport = (): string => {
    const child = childName || "[child's name]";
    const lines: string[] = [];
    lines.push(`IEP Goal Analysis for ${child}`);
    lines.push(`Generated by EDquity at the Margins IEP Goal Checker`);
    lines.push("");
    lines.push("Goal as entered:");
    lines.push(`  ${goalText.trim() || "(none)"}`);
    lines.push("");
    lines.push("Components detected:");
    for (const r of results) {
      const tag = !r.value ? "[missing]" : r.weak ? "[vague]" : "[present]";
      lines.push(`  ${tag} ${r.label}${r.value ? `: ${r.value}` : ""}`);
      if (r.weakReason) lines.push(`      ${r.weakReason}`);
    }
    lines.push("");
    lines.push(`Score: ${strongCount} of ${totalParts} parts present and clearly written.`);
    if (weakCount > 0) lines.push(`       ${weakCount} additional part${weakCount === 1 ? "" : "s"} present but vague.`);
    lines.push("");
    const prompts = results.filter((r) => r.prompt).map((r) => r.prompt);
    if (prompts.length > 0) {
      lines.push("Language to ask for at the IEP meeting:");
      for (const p of prompts) lines.push(`  - ${p}`);
    } else {
      lines.push("All seven parts are present and clearly written. Ask the team to confirm the baseline is drawn from a recent assessment and the measurement tool is used consistently across data points.");
    }
    lines.push("");
    lines.push("https://edquityatthemargins.org/tools/iep-goal-checker");
    return lines.join("\n");
  };

  const handleCopy = async () => {
    const report = buildReport();
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = report;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        // give up silently
      }
      document.body.removeChild(ta);
    }
  };

  const showResults = goalText.trim().length > 0;

  return (
    <div className="pt-20">
      <PageMeta
        title="IEP Goal Checker for Families"
        description="Free interactive tool for families. Paste your child's IEP annual goal as written and instantly see which of the seven parts are present, missing, or vague, plus the exact language to ask for at your next IEP meeting."
      />

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <Link
            href="/news/the-stranger-test-strong-iep-goals"
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Read the background article
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            IEP Goal Checker
          </h1>
          <p className="text-lg text-primary-foreground/85 leading-relaxed max-w-3xl">
            Paste your child's annual goal exactly as written in the IEP. We will sort it into
            the seven Measurable Annual Goal components, flag what is missing or too vague to
            measure, and give you the exact language to ask for at your next meeting.
          </p>
          <p className="text-sm text-primary-foreground/60 mt-3">
            Everything you paste stays on this device. Nothing is sent to us or to anyone else.
          </p>
        </div>
      </section>

      {/* Tool body */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          {/* Input */}
          <div className="mb-10">
            <Label htmlFor="goal-text" className="text-base font-semibold text-primary">
              Paste your child's IEP annual goal
            </Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              One goal at a time. Copy the full sentence directly from the IEP document.
            </p>
            <Textarea
              id="goal-text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="Example: Given a 4-function calculator, Luis will increase his accuracy in solving one-step equations from 40% to 90%, across 4 of 5 consecutive sessions, weekly, evaluated by a 10-problem one-step equation probe administered at independent practice level, by April 2027."
              rows={5}
              className="text-base leading-relaxed"
            />

            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <Button
                type="button"
                variant="outline"
                onClick={handleLoadSample}
                className="rounded-full"
              >
                <ClipboardPaste size={14} className="mr-2" aria-hidden="true" /> Load sample goal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="rounded-full"
                disabled={!goalText && !overrideName}
              >
                <RotateCcw size={14} className="mr-2" aria-hidden="true" /> Reset
              </Button>
            </div>

            {/* Optional name override */}
            {showResults && !parsed.studentName && (
              <div className="mt-6 p-4 bg-muted/30 border border-border rounded-xl">
                <Label htmlFor="override-name" className="text-sm font-semibold">
                  Optional: enter your child's first name
                </Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  The tool could not detect a student name in the goal. Adding a name here personalizes the meeting questions. Never sent anywhere.
                </p>
                <Input
                  id="override-name"
                  value={overrideName}
                  onChange={(e) => setOverrideName(e.target.value)}
                  placeholder="Luis"
                />
              </div>
            )}
          </div>

          {!showResults && (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-12 text-center">
              <p className="text-muted-foreground">
                Paste a goal above to see the analysis. Or click <strong>Load sample goal</strong> to see what a complete seven-part goal looks like.
              </p>
            </div>
          )}

          {showResults && (
            <>
              {/* Score summary */}
              <div className="rounded-2xl border border-border bg-muted/30 p-6 mb-8">
                <div className="flex flex-wrap gap-6 items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      {strongCount}
                      <span className="text-base font-normal text-muted-foreground"> of {totalParts} parts clearly written</span>
                    </p>
                    {weakCount > 0 && (
                      <p className="text-sm text-amber-700 mt-1">
                        {weakCount} additional part{weakCount === 1 ? "" : "s"} present but vague
                      </p>
                    )}
                    {presentCount < totalParts && (
                      <p className="text-sm text-red-700 mt-1">
                        {totalParts - presentCount} part{totalParts - presentCount === 1 ? "" : "s"} not detected in the goal
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleCopy}
                    className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full"
                    aria-label={copied ? "Analysis copied to clipboard" : "Copy analysis to clipboard"}
                  >
                    {copied ? (
                      <><CheckCheck size={14} className="mr-2" aria-hidden="true" /> Copied!</>
                    ) : (
                      <><Copy size={14} className="mr-2" aria-hidden="true" /> Copy analysis</>
                    )}
                  </Button>
                </div>
              </div>

              {/* Component checklist */}
              <h2 className="text-xl font-bold text-primary mb-4">What we found in your goal</h2>
              <div className="space-y-3 mb-8">
                {results.map((r) => (
                  <motion.div
                    key={r.key}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-3 p-4 rounded-xl border ${
                      !r.value
                        ? "border-red-200 bg-red-50"
                        : r.weak
                          ? "border-amber-200 bg-amber-50"
                          : "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {!r.value ? (
                        <X size={18} className="text-red-600" aria-hidden="true" />
                      ) : r.weak ? (
                        <AlertTriangle size={18} className="text-amber-600" aria-hidden="true" />
                      ) : (
                        <Check size={18} className="text-green-600" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p className="font-semibold text-primary text-sm">{r.label}</p>
                        {!r.value && (
                          <span className="text-xs text-red-700 font-medium">Not detected</span>
                        )}
                        {r.value && r.weak && (
                          <span className="text-xs text-amber-800 font-medium">Present but vague</span>
                        )}
                        {r.value && !r.weak && (
                          <span className="text-xs text-green-700 font-medium">Present</span>
                        )}
                      </div>
                      {r.value && (
                        <p className="text-sm text-foreground mt-1 break-words italic">"{r.value}"</p>
                      )}
                      {!r.value && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {COMPONENTS.find((c) => c.key === r.key)?.description}
                        </p>
                      )}
                      {r.weakReason && (
                        <p className="text-xs text-amber-800 mt-2 leading-relaxed">{r.weakReason}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Meeting questions */}
              {results.some((r) => r.prompt) && (
                <div className="rounded-2xl border border-border bg-white p-6 mb-8 shadow-sm">
                  <h2 className="text-xl font-bold text-primary mb-2">Take these questions to your meeting</h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    For each missing or vague component, here is the exact language you can use at the IEP meeting.
                  </p>
                  <ul className="space-y-3 list-disc pl-5">
                    {results
                      .filter((r) => r.prompt)
                      .map((r) => (
                        <li key={r.key} className="text-sm text-foreground leading-relaxed">
                          {r.prompt}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {presentCount === totalParts && weakCount === 0 && (
                <div className="rounded-2xl border border-green-300 bg-green-50 p-6 text-sm text-green-900 leading-relaxed mb-8">
                  <p className="font-bold mb-2">All seven parts are present and clearly written.</p>
                  <p>
                    Ask the team to confirm two things on the spot: that the baseline number was drawn from an assessment administered within the last six months, and that the measurement tool will be used consistently across every data point. If they cannot confirm both, the goal still needs work.
                  </p>
                </div>
              )}

              {/* If parser failed to detect anything, show a hint */}
              {presentCount === 0 && goalText.trim().length > 20 && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 leading-relaxed mb-8">
                  <p className="font-bold mb-2">We could not detect any of the seven components in this text.</p>
                  <p>
                    If a reasonable reader cannot extract these components from the goal as written, a substitute teacher cannot either. That itself is a reason to ask the team to rewrite the goal. Take the questions above to your meeting and ask for each component to be written explicitly.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-primary mb-3">Want a professional audit of your child's IEP?</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Our free IEP Audit reviews every annual goal against the seven-part framework, scores Present Levels for measurable baselines, and identifies which procedural safeguards the district may have skipped. The full report and 30-minute debrief call are provided at no cost to your family.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/services">
              <Button className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full px-6">
                See all services
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="rounded-full px-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Book a free discovery call
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
