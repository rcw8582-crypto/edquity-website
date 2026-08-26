/**
 * Shared logic for the Pathways career explorer.
 *
 * Every page under /pathways/explore reads O*NET through here, so the request
 * shapes, the response parsing and the browser-stored state each live in one
 * place rather than being repeated per route.
 *
 * Sources of truth. Endpoints, parameters and field names all come from the
 * O*NET Web Services OpenAPI 3.1 description at
 * services.onetcenter.org/reference/openapi.json. The proxy in api/onet.ts
 * reads from the /mnm/ tree, which O*NET's own feature comparison lists as the
 * only English tree carrying easy-read content and the only English tree with
 * the Interest Profiler.
 *
 * What the instrument measures: interests, not aptitude. Every screen that
 * shows a score says so, because a student who is told constantly what they
 * cannot do should not read an interest score as a verdict on their ability.
 */

// =================================================================
// Response readers
// =================================================================

export type Row = Record<string, unknown>;

export const isRow = (v: unknown): v is Row =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

export const int = (v: unknown): number =>
  typeof v === "number" && Number.isFinite(v) ? v : 0;

/** Rows under a documented key, or a bare top-level array where the spec says so. */
export function rows(data: unknown, key: string): Row[] {
  if (Array.isArray(data)) return data.filter(isRow);
  if (!isRow(data)) return [];
  const value = data[key];
  return Array.isArray(value) ? value.filter(isRow) : [];
}

export function strings(data: unknown, key: string): string[] {
  if (!isRow(data)) return [];
  const value = data[key];
  return Array.isArray(value) ? value.map(str).filter(Boolean) : [];
}

const isGrowing = (row: Row): boolean => isRow(row.tags) && row.tags.bright_outlook === true;

// =================================================================
// Types
// =================================================================

export interface Question {
  index: number;
  area: string;
  text: string;
}

export interface AnswerOption {
  value: number;
  name: string;
}

export interface QuestionSet {
  questions: Question[];
  options: AnswerOption[];
}

export interface InterestScore {
  code: string;
  title: string;
  description: string;
  score: number;
}

export interface CareerRef {
  code: string;
  title: string;
  growing: boolean;
  fit: string;
}

export interface CareerList {
  careers: CareerRef[];
  total: number;
}

export interface Cluster {
  code: string;
  title: string;
  grouping: string;
}

export interface JobZone {
  code: number;
  title: string;
  education: string;
  training: string;
}

export interface Salary {
  median: number;
  low: number;
  high: number;
  medianOver: boolean;
}

export interface Career {
  code: string;
  title: string;
  growing: boolean;
  whatTheyDo: string;
  onTheJob: string[];
  alsoCalled: string[];
  sections: string[];
  outlook: { category: string; description: string } | null;
  salary: Salary | null;
  jobZone: { code: number; title: string; education: string; training: string } | null;
  educationNeeded: string[];
  topInterest: { name: string; description: string } | null;
  skillGroups: { name: string; items: string[] }[];
  related: CareerRef[];
}

// =================================================================
// Requests
// =================================================================

export const UNAVAILABLE =
  "Career information is not loading right now. Try again in a few minutes.";

/** Thrown where O*NET has no data for a request, which is an ordinary outcome. */
export class NoData extends Error {}

async function getJson(query: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`/api/onet?${query}`);
  } catch {
    throw new Error(UNAVAILABLE);
  }
  if (!response.ok) {
    // The proxy maps O*NET's 404 and its 422 both to 404. O*NET answers 422
    // for a career that has no data for a section, so this is not a fault.
    if (response.status === 404) throw new NoData();
    throw new Error(UNAVAILABLE);
  }
  try {
    return await response.json();
  } catch {
    throw new Error(UNAVAILABLE);
  }
}

function toCareerList(data: unknown, key: string): CareerList {
  const careers = rows(data, key)
    .map((row) => ({
      code: str(row.code),
      title: str(row.title),
      growing: isGrowing(row),
      fit: str(row.fit),
    }))
    .filter((row) => row.code && row.title);
  return {
    careers,
    total: isRow(data) ? int(data.total) || careers.length : careers.length,
  };
}

export async function fetchQuestions(form: number): Promise<QuestionSet> {
  const data = await getJson(`resource=questions&form=${form}&start=1&end=${form}`);
  const questions = rows(data, "question")
    .map((row) => ({ index: int(row.index), area: str(row.area), text: str(row.text) }))
    .filter((row) => row.index > 0 && row.text)
    .sort((a, b) => a.index - b.index);
  const options = rows(data, "answer_option")
    .map((row) => ({ value: int(row.value), name: str(row.name) }))
    .filter((row) => row.value > 0 && row.name)
    .sort((a, b) => a.value - b.value);
  if (questions.length === 0 || options.length === 0) throw new Error(UNAVAILABLE);
  return { questions, options };
}

export async function fetchScores(answers: string): Promise<InterestScore[]> {
  const data = await getJson(`resource=results&answers=${answers}`);
  return rows(data, "result")
    .map((row) => ({
      code: str(row.code),
      title: str(row.title),
      description: str(row.description),
      score: int(row.score),
    }))
    .filter((row) => row.title)
    .sort((a, b) => b.score - a.score);
}

export async function fetchMatches(answers: string, zone: number | null): Promise<CareerList> {
  const zoneParam = zone === null ? "" : `&zone=${zone}`;
  return toCareerList(
    await getJson(`resource=matches&answers=${answers}${zoneParam}&start=1&end=40`),
    "career",
  );
}

export async function fetchJobZones(): Promise<JobZone[]> {
  const data = await getJson("resource=job_zones");
  return rows(data, "job_zone")
    .map((row) => ({
      code: int(row.code),
      title: str(row.title),
      education: str(row.education),
      training: str(row.training),
    }))
    .filter((row) => row.code > 0)
    .sort((a, b) => a.code - b.code);
}

export async function fetchClusters(): Promise<Cluster[]> {
  const data = await getJson("resource=clusters");
  return rows(data, "career_cluster")
    .map((row) => ({
      code: str(row.code),
      title: str(row.title),
      grouping: str(row.cluster_grouping),
    }))
    .filter((row) => row.code && row.title);
}

export async function fetchCluster(
  code: string,
): Promise<{ title: string; overview: string; list: CareerList }> {
  const data = await getJson(`resource=cluster&code=${encodeURIComponent(code)}&start=1&end=50`);
  const summary = isRow(data) && isRow(data.summary) ? data.summary : null;
  return {
    title: summary ? str(summary.title) : "",
    overview: summary ? str(summary.overview) : "",
    list: toCareerList(data, "career"),
  };
}

export async function searchCareers(keyword: string): Promise<CareerList> {
  return toCareerList(
    await getJson(`resource=search&keyword=${encodeURIComponent(keyword)}&start=1&end=30`),
    "career",
  );
}

/**
 * One career, in two passes.
 *
 * The overview arrives first so the page can paint a title and description
 * immediately, then each extra block resolves on its own through onUpdate. A
 * block that fails or has no data simply never appears, because O*NET answers
 * 422 where a career carries no data for a section.
 */
export async function fetchCareer(
  code: string,
  onUpdate: (patch: Partial<Career>) => void,
): Promise<Career> {
  const data = await getJson(`resource=career&code=${encodeURIComponent(code)}`);
  if (!isRow(data)) throw new Error(UNAVAILABLE);

  const sections = rows(data, "contents")
    .map((row) => str(row.href).replace(/\/+$/, "").split("/").pop() ?? "")
    .filter(Boolean);

  const base: Career = {
    code: str(data.code) || code,
    title: str(data.title),
    growing: isGrowing(data),
    whatTheyDo: str(data.what_they_do),
    onTheJob: strings(data, "on_the_job"),
    alsoCalled: rows(data, "also_called").map((row) => str(row.title)).filter(Boolean).slice(0, 10),
    sections,
    outlook: null,
    salary: null,
    jobZone: null,
    educationNeeded: [],
    topInterest: null,
    skillGroups: [],
    related: [],
  };

  const section = (name: string) =>
    sections.includes(name)
      ? getJson(`resource=report&code=${encodeURIComponent(base.code)}&section=${name}`)
      : Promise.reject(new NoData());

  section("job_outlook")
    .then((body) => {
      if (!isRow(body)) return;
      const outlook = isRow(body.outlook)
        ? { category: str(body.outlook.category), description: str(body.outlook.description) }
        : null;
      let salary: Salary | null = null;
      if (isRow(body.salary)) {
        // The Bureau of Labor Statistics caps its top figures, and O*NET
        // reports a capped value in a parallel "_over" field, so the higher of
        // the two is the number and the flag decides how it is worded.
        const exact = int(body.salary.annual_median);
        const capped = int(body.salary.annual_median_over);
        const median = exact || capped;
        if (median > 0) {
          salary = {
            median,
            low: int(body.salary.annual_10th_percentile),
            high: int(body.salary.annual_90th_percentile),
            medianOver: exact === 0,
          };
        }
      }
      onUpdate({ outlook, salary });
    })
    .catch(() => undefined);

  section("education")
    .then((body) => {
      if (!isRow(body)) return;
      onUpdate({
        jobZone: isRow(body.job_zone)
          ? {
              code: int(body.job_zone.code),
              title: str(body.job_zone.title),
              education: str(body.job_zone.education),
              training: str(body.job_zone.training),
            }
          : null,
        educationNeeded: strings(body, "education_usually_needed"),
      });
    })
    .catch(() => undefined);

  section("personality")
    .then((body) => {
      if (!isRow(body) || !isRow(body.top_interest)) return;
      onUpdate({
        topInterest: {
          name: str(body.top_interest.name),
          description: str(body.top_interest.description),
        },
      });
    })
    .catch(() => undefined);

  section("skills")
    .then((body) =>
      onUpdate({
        skillGroups: (Array.isArray(body) ? body.filter(isRow) : [])
          .map((group) => ({
            name: str(group.name),
            items: rows(group, "element").map((el) => str(el.name)).filter(Boolean),
          }))
          .filter((group) => group.name && group.items.length > 0),
      }),
    )
    .catch(() => undefined);

  section("explore_more")
    .then((body) => onUpdate({ related: toCareerList(body, "careers").careers.slice(0, 6) }))
    .catch(() => undefined);

  return base;
}

// =================================================================
// What the browser remembers
// =================================================================

/**
 * Answers, saved careers and the light-mode preference live in this browser
 * only. Nothing is sent to us, and the pages say exactly that rather than
 * claiming nothing is stored at all.
 *
 * Every read and write is wrapped: a private window, a browser set to block
 * site data, or a full quota all throw, and none of them is a reason for the
 * page to stop working.
 */

const ANSWERS_KEY = "edatm-pathways-answers-v1";
const PICKS_KEY = "edatm-pathways-picks-v1";
const THEME_KEY = "edatm-pathways-light-v1";

export const SHORT_FORM = 30;
export const LONG_FORM = 60;

export interface SavedAnswers {
  form: number;
  answers: Record<number, number>;
}

export function loadAnswers(): SavedAnswers {
  const empty: SavedAnswers = { form: SHORT_FORM, answers: {} };
  try {
    const raw = localStorage.getItem(ANSWERS_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as { form?: number; answers?: Record<string, number> };
    const answers: Record<number, number> = {};
    for (const [key, value] of Object.entries(parsed.answers ?? {})) {
      const index = Number(key);
      if (Number.isInteger(index) && index > 0 && value >= 1 && value <= 5) {
        answers[index] = value;
      }
    }
    return { form: parsed.form === LONG_FORM ? LONG_FORM : SHORT_FORM, answers };
  } catch {
    return empty;
  }
}

export function saveAnswers(saved: SavedAnswers): void {
  try {
    localStorage.setItem(ANSWERS_KEY, JSON.stringify(saved));
  } catch {
    /* nothing to do */
  }
}

export function clearAnswers(): void {
  try {
    localStorage.removeItem(ANSWERS_KEY);
  } catch {
    /* nothing to do */
  }
}

/** A career the student kept for their plan. */
export interface Pick {
  code: string;
  title: string;
  growing: boolean;
  pay: number;
  payOver: boolean;
  education: string[];
  zone: number;
}

export function loadPicks(): Pick[] {
  try {
    const raw = localStorage.getItem(PICKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isRow)
      .map((row) => ({
        code: str(row.code),
        title: str(row.title),
        growing: row.growing === true,
        pay: int(row.pay),
        payOver: row.payOver === true,
        education: Array.isArray(row.education) ? row.education.map(str).filter(Boolean) : [],
        zone: int(row.zone),
      }))
      .filter((row) => row.code && row.title);
  } catch {
    return [];
  }
}

export function savePicks(picks: Pick[]): void {
  try {
    localStorage.setItem(PICKS_KEY, JSON.stringify(picks));
  } catch {
    /* nothing to do */
  }
}

/**
 * What the student types about themselves for the printed plan.
 *
 * Optional in every field. A student who does not want to type their name gets
 * a plan that still prints correctly, and the footer falls back to "belongs to
 * me" rather than leaving a gap.
 */
export interface PlanIdentity {
  name: string;
  grade: string;
  school: string;
}

const IDENTITY_KEY = "edatm-pathways-identity-v1";

export function loadIdentity(): PlanIdentity {
  const empty: PlanIdentity = { name: "", grade: "", school: "" };
  try {
    const raw = localStorage.getItem(IDENTITY_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    if (!isRow(parsed)) return empty;
    return {
      name: str(parsed.name).slice(0, 60),
      grade: str(parsed.grade).slice(0, 20),
      school: str(parsed.school).slice(0, 80),
    };
  } catch {
    return empty;
  }
}

export function saveIdentity(identity: PlanIdentity): void {
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  } catch {
    /* nothing to do */
  }
}

export function loadLightMode(): boolean {
  try {
    return localStorage.getItem(THEME_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveLightMode(on: boolean): void {
  try {
    localStorage.setItem(THEME_KEY, on ? "1" : "0");
  } catch {
    /* nothing to do */
  }
}

/** Packs answers into the digit string O*NET's answers parameter expects. */
export function packAnswers(questions: Question[], answers: Record<number, number>): string {
  return questions.map((question) => answers[question.index] ?? 0).join("");
}

export const isComplete = (packed: string, form: number) =>
  packed.length === form && !packed.includes("0");

// =================================================================
// Presentation tables
// =================================================================

/**
 * One colour, one letter and one plain-language label per interest area.
 *
 * The plain labels are what the chart is annotated with, because "Hands-on"
 * and "Organizing" tell a fifteen-year-old more than "Realistic" and
 * "Conventional" do. The formal names stay alongside, since those are the words
 * an IEP team and every other career tool will use.
 *
 * The six areas are fixed by the instrument, so this table cannot drift out of
 * step with the data.
 */
export interface AreaStyle {
  letter: string;
  plain: string;
  ink: string;
  tint: string;
  dark: string;
}

const AREA_STYLES: Record<string, AreaStyle> = {
  realistic: { letter: "R", plain: "Hands-on", ink: "#92400E", tint: "#FEF3C7", dark: "#F59E0B" },
  investigative: { letter: "I", plain: "Ideas", ink: "#0F766E", tint: "#CCFBF1", dark: "#2DD4BF" },
  artistic: { letter: "A", plain: "Creative", ink: "#5B21B6", tint: "#EDE9FE", dark: "#A78BFA" },
  social: { letter: "S", plain: "Helping", ink: "#166534", tint: "#DCFCE7", dark: "#4ADE80" },
  enterprising: { letter: "E", plain: "Leading", ink: "#9A3412", tint: "#FFEDD5", dark: "#FB923C" },
  conventional: { letter: "C", plain: "Organizing", ink: "#1E40AF", tint: "#DBEAFE", dark: "#60A5FA" },
};

const AREA_FALLBACK: AreaStyle = {
  letter: "?",
  plain: "Other",
  ink: "#122C54",
  tint: "#E2E8F0",
  dark: "#94A3B8",
};

export const areaStyle = (code: string): AreaStyle =>
  AREA_STYLES[code.toLowerCase()] ?? AREA_FALLBACK;

/** Hexagon order, which is Holland's: neighbouring types really are more alike. */
export const HEXAGON_ORDER = [
  "realistic",
  "investigative",
  "artistic",
  "social",
  "enterprising",
  "conventional",
] as const;

/** Highest score one area can reach: five questions per area on the short form. */
export const maxScore = (form: number) => (form / 6) * 4;

/**
 * Which areas are genuinely the student's strongest.
 *
 * Answering everything the same way scores all six areas equally, and calling
 * two of those six "Top 1" and "Top 2" would be an accident of sort order
 * presented as a finding. So: the areas sharing the highest score are the
 * strongest, at most three of them, and a flat profile returns none. A student
 * whose interests really are even deserves to be told that, not handed a
 * ranking that means nothing.
 */
export function strongestAreas(scores: InterestScore[]): Set<string> {
  if (scores.length === 0) return new Set();
  const best = Math.max(...scores.map((row) => row.score));
  const worst = Math.min(...scores.map((row) => row.score));
  if (best === worst) return new Set();
  const tied = scores.filter((row) => row.score === best);
  return new Set(tied.length > 3 ? [] : tied.map((row) => row.code));
}

/** How much school, on a one to five scale, for the training-level dots. */
export function schoolDots(zone: number, education: string[]): number {
  if (zone >= 1 && zone <= 5) return zone === 1 ? 1 : zone;
  const text = education.join(" ").toLowerCase();
  if (text.includes("doctor") || text.includes("professional degree")) return 5;
  if (text.includes("master")) return 5;
  if (text.includes("bachelor")) return 4;
  if (text.includes("associate")) return 3;
  if (text.includes("certificate")) return 2;
  return 1;
}

export const fitStars = (fit: string): number =>
  ({ best: 3, great: 2, good: 1 })[fit.toLowerCase()] ?? 0;

export const money = (value: number): string => `$${value.toLocaleString("en-US")}`;

/**
 * How much school a career needs, said the way a student asks it.
 *
 * O*NET returns education as a short list of lower-case phrases, most common
 * first, from a fixed vocabulary. Two facts, both checked against the
 * underlying percentage data rather than assumed:
 *
 *   The first phrase is the most common level people in that job have. It
 *   matched the highest percentage of respondents in every career sampled.
 *
 *   The remaining phrases are NOT reliably in rank order. Floral Designers
 *   lists "no high school diploma/GED" second while the percentages put "some
 *   college" ahead of it. So nothing here claims a rank for anything past the
 *   first item.
 *
 * The ranks below are O*NET's own education category codes, taken from the
 * details/education reports, not an ordering invented here. That matters for
 * one counterintuitive pair: a post-secondary certificate ranks BELOW "some
 * college, no degree" on their scale.
 */
const EDUCATION_LEVELS: Record<string, { rank: number; plain: string }> = {
  "no high school diploma/ged": { rank: 1, plain: "no diploma" },
  "high school diploma/ged": { rank: 2, plain: "a high school diploma or GED" },
  "certificate after high school": { rank: 3, plain: "a certificate after high school" },
  "some college": { rank: 4, plain: "some college" },
  "associate's degree or other 2-year degree": { rank: 5, plain: "a 2-year degree" },
  "bachelor's degree": { rank: 6, plain: "a 4-year degree" },
  "certificate after college": { rank: 7, plain: "a certificate after college" },
  "master's degree": { rank: 8, plain: "a master's degree" },
  "certificate after master's": { rank: 9, plain: "a certificate after a master's" },
  "professional degree": { rank: 10, plain: "a professional degree, like law or medicine" },
  "doctoral degree": { rank: 11, plain: "a doctoral degree" },
  "post-doctoral training": { rank: 12, plain: "training after a doctorate" },
};

const sentenceCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Leads with the lowest level anyone in the job reported, then says what is
 * typical. A student who is not college-bound is asking what the floor is, and
 * burying it under the average answers the wrong question.
 *
 * Deliberately never says "required". O*NET reports the education people in a
 * job have, which is not the same as what an employer demands, and the wording
 * stays inside what the data supports.
 */
export function educationSentence(items: string[]): string {
  const known = items
    .map((item) => ({ raw: item, level: EDUCATION_LEVELS[item.trim().toLowerCase()] }))
    .filter((entry): entry is { raw: string; level: { rank: number; plain: string } } =>
      Boolean(entry.level),
    );

  // An unrecognised phrase is shown rather than dropped, so a new O*NET value
  // degrades to plain text instead of vanishing off a student's plan.
  if (known.length === 0) {
    return items.length > 0 ? `${sentenceCase(items.join(", "))}.` : "";
  }

  const typical = known[0].level;
  const lowest = known.reduce((a, b) => (b.level.rank < a.level.rank ? b : a)).level;
  const highest = known.reduce((a, b) => (b.level.rank > a.level.rank ? b : a)).level;

  if (known.length === 1) return `Most have ${typical.plain}.`;

  if (lowest.rank < typical.rank) {
    return `Some get in with ${lowest.plain}. Most have ${typical.plain}.`;
  }

  if (highest.rank > typical.rank) {
    return `${sentenceCase(typical.plain)} is typical. Some go further, up to ${highest.plain}.`;
  }

  return `Most have ${typical.plain}.`;
}
