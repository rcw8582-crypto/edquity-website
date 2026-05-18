/**
 * /tools/iep-goal-checker
 *
 * Interactive seven-part MAG Builder for parents. Parents enter the
 * components of their child's IEP annual goal, and the tool reports
 * which components are present, missing, or vague, plus the exact
 * language they can use at their next IEP meeting to ask for what
 * is missing.
 *
 * Design notes:
 *   - Pure client-side. No data is sent anywhere.
 *   - Form on the left, live analysis on the right (desktop).
 *     Stacked on mobile.
 *   - Vague-language detection flags common weak phrasings.
 *   - "Copy analysis" button puts the full report on the clipboard.
 */

import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, X, AlertTriangle, Copy, RotateCcw, ArrowLeft, CheckCheck } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GoalFields {
  childName: string;
  condition: string;
  skill: string;
  baseline: string;
  target: string;
  frequency: string;
  schedule: string;
  tool: string;
  byDate: string;
}

interface ComponentCheck {
  key: keyof GoalFields;
  label: string;
  value: string;
  present: boolean;
  weak: boolean;
  weakReason?: string;
  prompt: string; // language to ask for at the meeting if missing
}

const EMPTY_GOAL: GoalFields = {
  childName: "",
  condition: "",
  skill: "",
  baseline: "",
  target: "",
  frequency: "",
  schedule: "",
  tool: "",
  byDate: "",
};

// Vague-language patterns that flag a component as weak even when filled.
// Each pattern carries a plain-language explanation the parent can act on.
const WEAK_PATTERNS: Record<string, { pattern: RegExp; reason: string }[]> = {
  skill: [
    {
      pattern: /\b(improve|understand|demonstrate awareness|engage with|appreciate|show interest|be aware|develop)\b/i,
      reason:
        "Verbs like 'improve,' 'understand,' or 'demonstrate awareness' are not observable. Ask for a measurable verb such as solve, write, read, identify, initiate, complete, or produce.",
    },
  ],
  baseline: [
    {
      pattern: /^(below grade level|struggles|significantly below|near grade level|making progress|some difficulty)\b/i,
      reason:
        "Phrases like 'below grade level' or 'struggles' are not measurable. Ask for a current number (a percent, a score, or a count).",
    },
  ],
  target: [
    {
      pattern: /^(grade level|on grade level|appropriate|mastery)\b/i,
      reason:
        "A target like 'grade level' or 'mastery' without a number is not measurable. Ask for a percent, score, or rubric level.",
    },
  ],
  tool: [
    {
      pattern: /^(exit tickets?|classroom observations?|teacher report|teacher observation|informal observation)\.?$/i,
      reason:
        "This tool is too vague. A strong measurement tool names the structure (number of items, scoring criteria) and the setting (for example, 'independent practice level'). Exit tickets in particular reflect what the student did during instruction, not what they have retained.",
    },
  ],
};

function isPresent(value: string): boolean {
  return value.trim().length > 0;
}

function detectWeakness(key: keyof GoalFields, value: string): { weak: boolean; reason?: string } {
  if (!isPresent(value)) return { weak: false };
  const patterns = WEAK_PATTERNS[key as string];
  if (!patterns) return { weak: false };
  for (const { pattern, reason } of patterns) {
    if (pattern.test(value.trim())) return { weak: true, reason };
  }
  return { weak: false };
}

function buildSentence(g: GoalFields): string {
  const parts: string[] = [];
  if (g.condition) parts.push(`Given ${g.condition.replace(/^given\s+/i, "")}`);
  const subject = g.childName.trim() || "the student";
  if (g.skill) {
    const verb = g.baseline && g.target ? "will increase" : "will";
    const action =
      g.baseline && g.target
        ? `${g.skill.replace(/^will\s+/i, "")} from ${g.baseline} to ${g.target}`
        : g.skill.replace(/^will\s+/i, "");
    parts.push(`${subject} ${verb} ${action}`);
  } else if (g.baseline && g.target) {
    parts.push(`${subject} will increase from ${g.baseline} to ${g.target}`);
  }
  if (g.frequency) parts.push(g.frequency.replace(/^,\s*/, ""));
  if (g.schedule) parts.push(g.schedule);
  if (g.tool) parts.push(`evaluated by ${g.tool.replace(/^evaluated by\s+/i, "")}`);
  if (g.byDate) parts.push(`by ${g.byDate.replace(/^by\s+/i, "")}`);
  if (parts.length === 0) return "";
  return parts.join(", ") + ".";
}

const COMPONENT_DEFINITIONS: Array<{
  key: keyof GoalFields;
  label: string;
  helperText: string;
  placeholder: string;
  meetingPrompt: (childName: string) => string;
  weakFallbackPrompt: (childName: string) => string;
}> = [
  {
    key: "condition",
    label: "Condition, setting, or materials",
    helperText:
      "What does your child have access to during instruction or assessment? Examples: a calculator, a graphic organizer, a small group, an audiobook version, sensory tools.",
    placeholder: "a 4-function calculator",
    meetingPrompt: (n) =>
      `What materials, settings, or supports will ${n || "my child"} have access to while working on this goal? That language needs to be in the goal itself.`,
    weakFallbackPrompt: (n) =>
      `What materials, settings, or supports will ${n || "my child"} have access to while working on this goal? The current language is not specific.`,
  },
  {
    key: "skill",
    label: "Observable skill or behavior",
    helperText:
      "Use a measurable verb like 'solve,' 'write,' 'read,' 'identify,' or 'initiate.' Avoid 'understand,' 'engage with,' or 'demonstrate awareness.'",
    placeholder: "solve one-step equations",
    meetingPrompt: (n) =>
      `What is the specific, observable skill this goal targets for ${n || "my child"}? Please rewrite it using a measurable verb.`,
    weakFallbackPrompt: (n) =>
      `The verb in this goal is not observable. What is ${n || "my child"} actually expected to do in a way a substitute teacher could see and measure?`,
  },
  {
    key: "baseline",
    label: "Baseline (current performance)",
    helperText:
      "Your child's current measurable performance, drawn from the Present Levels section of the IEP. Examples: 40%, 4 out of 10, a Level 1 on the rubric, 42 words per minute.",
    placeholder: "40%",
    meetingPrompt: (n) =>
      `I do not see a measurable baseline for this goal. What is ${n || "my child"}'s current performance on this skill, drawn from a current assessment? That number needs to be in Present Levels.`,
    weakFallbackPrompt: (n) =>
      `The baseline for this goal is not measurable. What specific score, percent, or count represents ${n || "my child"}'s current performance?`,
  },
  {
    key: "target",
    label: "Target performance",
    helperText:
      "Where the goal expects your child to land. Examples: 90%, 8 out of 10, a Level 3 on the rubric, 80 words per minute.",
    placeholder: "90%",
    meetingPrompt: (n) =>
      `What is the measurable target this goal expects ${n || "my child"} to reach? Please write it as a percent, score, or rubric level.`,
    weakFallbackPrompt: (n) =>
      `The target for this goal is not measurable. What specific number represents the level of mastery ${n || "my child"} is expected to achieve?`,
  },
  {
    key: "frequency",
    label: "Frequency (how consistently)",
    helperText:
      "How consistently must your child show the skill before it counts as mastered? Examples: in 4 of 5 consecutive sessions, across 3 of 4 trials.",
    placeholder: "in 4 of 5 consecutive sessions",
    meetingPrompt: (n) =>
      `How consistently does ${n || "my child"} need to show this skill before the team considers it mastered? That criterion needs to be in the goal.`,
    weakFallbackPrompt: (n) => "",
  },
  {
    key: "schedule",
    label: "Evaluation schedule",
    helperText:
      "How often is the data checked? Examples: weekly, bi-weekly, every grading period.",
    placeholder: "weekly",
    meetingPrompt: (n) =>
      `How often will the team collect and review data on this goal? Please write the evaluation schedule into the goal itself.`,
    weakFallbackPrompt: (n) => "",
  },
  {
    key: "tool",
    label: "Measurement tool",
    helperText:
      "What does the team use to measure? Strong tools name the structure (number of items, scoring criteria) and the setting. Example: 'a 10-problem one-step equation probe administered at independent practice level.' Avoid bare tools like 'exit tickets' or 'observations.'",
    placeholder: "a 10-problem one-step equation probe administered at independent practice level",
    meetingPrompt: (n) =>
      `What specific measurement tool will the team use to track ${n || "my child"}'s progress? The tool needs to name what is on it, how it is scored, and the setting in which it is administered.`,
    weakFallbackPrompt: (n) =>
      `The measurement tool named in this goal is too vague to track progress reliably. What specific tool, with named structure and administration setting, will the team use?`,
  },
];

export default function IEPGoalChecker() {
  const [goal, setGoal] = useState<GoalFields>(EMPTY_GOAL);
  const [copied, setCopied] = useState(false);

  const checks: ComponentCheck[] = useMemo(() => {
    return COMPONENT_DEFINITIONS.map((def) => {
      const value = goal[def.key];
      const present = isPresent(value);
      const weakness = detectWeakness(def.key, value);
      return {
        key: def.key,
        label: def.label,
        value,
        present,
        weak: weakness.weak,
        weakReason: weakness.reason,
        prompt: present
          ? weakness.weak
            ? def.weakFallbackPrompt(goal.childName.trim())
            : ""
          : def.meetingPrompt(goal.childName.trim()),
      };
    });
  }, [goal]);

  const sentence = useMemo(() => buildSentence(goal), [goal]);
  const presentCount = checks.filter((c) => c.present).length;
  const missingCount = checks.filter((c) => !c.present).length;
  const weakCount = checks.filter((c) => c.weak).length;
  const totalParts = checks.length;

  const handleChange =
    (key: keyof GoalFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setGoal((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleReset = () => {
    setGoal(EMPTY_GOAL);
    setCopied(false);
  };

  const buildReport = (): string => {
    const child = goal.childName.trim() || "[child's name]";
    const lines: string[] = [];
    lines.push(`IEP Goal Analysis for ${child}`);
    lines.push("");
    lines.push("Components present:");
    for (const c of checks) {
      const tag = c.present ? (c.weak ? "[weak]" : "[present]") : "[missing]";
      lines.push(`  ${tag} ${c.label}${c.present ? `: ${c.value}` : ""}`);
    }
    lines.push("");
    if (sentence) {
      lines.push("Auto-generated goal sentence:");
      lines.push(`  ${sentence}`);
      lines.push("");
    }
    const prompts = checks.filter((c) => c.prompt).map((c) => c.prompt);
    if (prompts.length > 0) {
      lines.push("Language to ask for at the IEP meeting:");
      for (const p of prompts) lines.push(`  - ${p}`);
    } else {
      lines.push("This goal has all seven parts and no obvious weak language. Ask the team to confirm the baseline is current and the measurement tool is used consistently across data points.");
    }
    lines.push("");
    lines.push("Generated by EDquity at the Margins IEP Goal Checker");
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

  return (
    <div className="pt-20">
      <PageMeta
        title="IEP Goal Checker for Families"
        description="Free interactive tool for families. Enter the components of your child's IEP annual goal and instantly see which of the seven parts are present, missing, or vague, plus the exact language to ask for at your next IEP meeting."
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
            Paste the components of your child's annual goal from the IEP. We will show you
            which of the seven parts are present, which are missing, which are too vague to
            measure, and the exact language to ask for at your next meeting.
          </p>
          <p className="text-sm text-primary-foreground/60 mt-3">
            Everything you type stays on this device. Nothing is sent to us or to anyone else.
          </p>
        </div>
      </section>

      {/* Tool body */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Input panel */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Enter the goal</h2>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="child-name" className="text-sm font-semibold">
                    Child's first name (optional)
                  </Label>
                  <Input
                    id="child-name"
                    value={goal.childName}
                    onChange={handleChange("childName")}
                    placeholder="Used in the generated questions, never sent anywhere."
                    className="mt-1"
                  />
                </div>

                {COMPONENT_DEFINITIONS.map((def, idx) => {
                  const useTextarea = def.key === "tool" || def.key === "skill";
                  return (
                    <div key={def.key}>
                      <Label htmlFor={`field-${def.key}`} className="text-sm font-semibold">
                        {idx + 1}. {def.label}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1 mb-2 leading-relaxed">
                        {def.helperText}
                      </p>
                      {useTextarea ? (
                        <Textarea
                          id={`field-${def.key}`}
                          value={goal[def.key]}
                          onChange={handleChange(def.key)}
                          placeholder={def.placeholder}
                          rows={2}
                        />
                      ) : (
                        <Input
                          id={`field-${def.key}`}
                          value={goal[def.key]}
                          onChange={handleChange(def.key)}
                          placeholder={def.placeholder}
                        />
                      )}
                    </div>
                  );
                })}

                <div>
                  <Label htmlFor="by-date" className="text-sm font-semibold">
                    By when (optional but recommended)
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-2 leading-relaxed">
                    The annual review date the goal is targeting. Example: April 2027.
                  </p>
                  <Input
                    id="by-date"
                    value={goal.byDate}
                    onChange={handleChange("byDate")}
                    placeholder="April 2027"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="rounded-full"
                  >
                    <RotateCcw size={14} className="mr-2" aria-hidden="true" /> Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Analysis panel */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Live analysis</h2>

              {/* Score summary */}
              <div className="rounded-2xl border border-border bg-muted/30 p-6 mb-6">
                <div className="flex flex-wrap gap-6 items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary">
                      {presentCount} <span className="text-base font-normal text-muted-foreground">of {totalParts} parts present</span>
                    </p>
                    {weakCount > 0 && (
                      <p className="text-sm text-amber-700 mt-1">
                        {weakCount} component{weakCount === 1 ? "" : "s"} flagged as vague
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={handleCopy}
                    className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full"
                    disabled={presentCount === 0}
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

              {/* Generated sentence */}
              {sentence && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-accent/40 bg-accent/5 p-5 mb-6"
                >
                  <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Auto-generated goal sentence</p>
                  <p className="text-base text-primary leading-relaxed italic">{sentence}</p>
                </motion.div>
              )}

              {/* Component checklist */}
              <div className="space-y-3 mb-6">
                {checks.map((c) => (
                  <div
                    key={c.key}
                    className={`flex items-start gap-3 p-4 rounded-xl border ${
                      !c.present
                        ? "border-red-200 bg-red-50"
                        : c.weak
                          ? "border-amber-200 bg-amber-50"
                          : "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {!c.present ? (
                        <X size={18} className="text-red-600" aria-hidden="true" />
                      ) : c.weak ? (
                        <AlertTriangle size={18} className="text-amber-600" aria-hidden="true" />
                      ) : (
                        <Check size={18} className="text-green-600" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary text-sm">{c.label}</p>
                      {c.present && (
                        <p className="text-sm text-foreground mt-1 break-words">"{c.value}"</p>
                      )}
                      {c.weak && c.weakReason && (
                        <p className="text-xs text-amber-800 mt-2 leading-relaxed">{c.weakReason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Meeting questions */}
              {checks.some((c) => c.prompt) && (
                <div className="rounded-2xl border border-border bg-white p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">Take these questions to your meeting</h3>
                  <ul className="space-y-3 list-disc pl-5">
                    {checks
                      .filter((c) => c.prompt)
                      .map((c) => (
                        <li key={c.key} className="text-sm text-foreground leading-relaxed">
                          {c.prompt}
                        </li>
                      ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-5">
                    Print this page, or use the Copy Analysis button to put the report on your clipboard so you can paste it into an email, notes app, or document.
                  </p>
                </div>
              )}

              {presentCount === totalParts && weakCount === 0 && (
                <div className="rounded-2xl border border-green-300 bg-green-50 p-6 text-sm text-green-900 leading-relaxed">
                  <p className="font-bold mb-2">All seven parts are present and none are flagged.</p>
                  <p>
                    Ask the team to confirm that the baseline is current (drawn from an assessment administered in the last six months) and that the measurement tool is used consistently across data points. If they cannot confirm both, the goal still needs work.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-muted/30 border-t border-border py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-primary mb-3">Want a professional audit of your child's IEP?</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Our IEP Document Analysis reviews every annual goal against the seven-part framework, scores Present Levels for measurable baselines, and identifies which procedural safeguards the district may have skipped. The full report and 30-minute debrief call costs $250, with scholarship-funded access for families with financial constraints.
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
