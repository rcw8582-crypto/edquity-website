/**
 * Vercel serverless function: GET /api/onet
 *
 * Server-side proxy for O*NET Web Services (API version 2.0).
 *
 * Why a proxy exists rather than calling O*NET straight from the page: the
 * API key travels in an X-API-Key header, and every header the browser sends
 * is readable by anyone who opens the network tab. The key therefore lives in
 * a server environment variable and never reaches the client.
 *
 * The O*NET Web Services Data License requires the information to sit in a
 * free, publicly accessible area that does not require registration, so this
 * endpoint asks nothing of the caller. Responses are cached at the edge
 * because most O*NET sources update quarterly or annually, which is also what
 * O*NET asks of real-time applications in place of a hard rate limit.
 *
 * Only the shapes the explorer needs are reachable, each with its arguments
 * validated, so a crafted query cannot turn this into an open proxy that
 * forwards arbitrary paths under our credentials.
 *
 * Two choices worth recording:
 *
 *   Host. Requests go to api-v2.onetcenter.org. services.onetcenter.org hosts
 *   the developer account pages and the version 1 service, and answers
 *   version 2 paths with 404.
 *
 *   Tree. Everything reads from /mnm/, the My Next Move services, rather than
 *   /online/. Per O*NET's own feature comparison, My Next Move is the only
 *   English tree that carries easy-read content and the only English tree
 *   with the Interest Profiler. /mpp/ has the Profiler too, in Spanish, which
 *   this organisation does not publish.
 *
 * Required environment variable:
 *   ONET_API_KEY  (Vercel project settings, and .env.local for local dev)
 */

const ONET_BASE = "https://api-v2.onetcenter.org";
const API_KEY = process.env.ONET_API_KEY;

/** O*NET-SOC codes look like 29-1141.00. */
const SOC_CODE = /^\d{2}-\d{4}\.\d{2}$/;

/** Career cluster codes are six digits ending in 00, e.g. 010100. */
const CLUSTER_CODE = /^\d{4}00$/;

/**
 * Interest Profiler answers are one digit per question, 1 to 5, for either the
 * 30 or the 60 item form. This is O*NET's own pattern for the parameter.
 */
const ANSWERS = /^[12345]{30}([12345]{30})?$/;

/** Career report sections, as named in a career's own contents list. */
const SECTIONS = new Set([
  "knowledge",
  "skills",
  "abilities",
  "personality",
  "technology",
  "education",
  "job_outlook",
  "explore_more",
]);

/** Largest page the explorer ever asks for, well under O*NET's cap of 2000. */
const MAX_PAGE = 60;

function json(body: unknown, status: number, cache: boolean): Response {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  headers["Cache-Control"] = cache
    ? // A day at the edge, and a week of serving the stale copy while it
      // refreshes, so a slow upstream never shows a visitor an error.
      "public, s-maxage=86400, stale-while-revalidate=604800"
    : "no-store";
  return new Response(JSON.stringify(body), { status, headers });
}

/** Reads start/end, returning a validated pair, nothing, or a rejection. */
function paging(params: URLSearchParams): { start: number; end: number } | null | "invalid" {
  const rawStart = params.get("start");
  const rawEnd = params.get("end");
  if (rawStart === null && rawEnd === null) return null;

  const start = Number(rawStart ?? "1");
  const end = Number(rawEnd ?? String(start + MAX_PAGE - 1));
  if (!Number.isInteger(start) || !Number.isInteger(end)) return "invalid";
  if (start < 1 || end < start) return "invalid";
  if (end - start + 1 > MAX_PAGE) return "invalid";
  return { start, end };
}

/** Builds the upstream path for a request, or returns an error message. */
function resolvePath(params: URLSearchParams): { path: string } | { error: string } {
  const resource = params.get("resource") ?? "";
  const page = paging(params);
  if (page === "invalid") {
    return { error: `start and end must be whole numbers, ascending, and at most ${MAX_PAGE} apart.` };
  }
  const range = page ? `start=${page.start}&end=${page.end}` : "";
  const withRange = (path: string) =>
    range ? `${path}${path.includes("?") ? "&" : "?"}${range}` : path;

  switch (resource) {
    // ---- Interest Profiler ----

    case "questions": {
      // The 30 item short form is the default the page offers, so it is also
      // the default here; the long form is opt-in.
      const form = params.get("form") ?? "30";
      if (form !== "30" && form !== "60") return { error: "form must be 30 or 60." };
      const endpoint = form === "30" ? "questions_30" : "questions";
      return { path: withRange(`/mnm/interestprofiler/${endpoint}`) };
    }

    case "results": {
      const answers = params.get("answers") ?? "";
      if (!ANSWERS.test(answers)) return { error: "answers must be 30 or 60 digits, each 1 to 5." };
      return { path: `/mnm/interestprofiler/results?answers=${answers}` };
    }

    case "matches": {
      // Careers accepts the answer string directly, so the page never has to
      // pass six separate scores back and forth.
      const answers = params.get("answers") ?? "";
      if (!ANSWERS.test(answers)) return { error: "answers must be 30 or 60 digits, each 1 to 5." };
      const zone = params.get("zone");
      let query = `answers=${answers}`;
      if (zone !== null) {
        const value = Number(zone);
        if (!Number.isInteger(value) || value < 1 || value > 5) {
          return { error: "zone must be a whole number from 1 to 5." };
        }
        query += `&zone=${value}`;
      }
      return { path: withRange(`/mnm/interestprofiler/careers?${query}`) };
    }

    case "job_zones":
      return { path: "/mnm/interestprofiler/job_zones" };

    // ---- Browsing and search ----

    case "clusters":
      return { path: "/mnm/career_clusters/" };

    case "cluster": {
      const code = params.get("code") ?? "";
      if (!CLUSTER_CODE.test(code)) return { error: "code is not a valid career cluster code." };
      return { path: withRange(`/mnm/career_clusters/${code}`) };
    }

    case "search": {
      const keyword = (params.get("keyword") ?? "").trim();
      if (keyword.length < 2 || keyword.length > 100) {
        return { error: "keyword must be between 2 and 100 characters." };
      }
      return { path: withRange(`/mnm/search?keyword=${encodeURIComponent(keyword)}`) };
    }

    // ---- One career ----

    case "career": {
      const code = params.get("code") ?? "";
      if (!SOC_CODE.test(code)) return { error: "code is not a valid O*NET-SOC code." };
      return { path: `/mnm/careers/${code}/` };
    }

    case "report": {
      const code = params.get("code") ?? "";
      const section = params.get("section") ?? "";
      if (!SOC_CODE.test(code)) return { error: "code is not a valid O*NET-SOC code." };
      if (!SECTIONS.has(section)) return { error: "section is not a career report section." };
      return { path: `/mnm/careers/${code}/${section}` };
    }

    default:
      return { error: "resource is not one this endpoint serves." };
  }
}

/**
 * Fetches once, and retries a 429 a single time.
 *
 * O*NET publishes no hard rate limit and asks that a 429 be followed by at
 * least a 200 millisecond delay before retrying. One retry is enough here:
 * responses are cached at the edge for a day, so sustained pressure on any
 * one path does not arise in the first place.
 */
async function fetchOnet(path: string): Promise<Response> {
  const request = () =>
    fetch(`${ONET_BASE}${path}`, {
      headers: {
        "X-API-Key": API_KEY as string,
        Accept: "application/json",
        "User-Agent": "EDquity at the Margins career explorer (edquityatthemargins.org)",
      },
    });

  const first = await request();
  if (first.status !== 429) return first;
  await new Promise((resolve) => setTimeout(resolve, 250));
  return request();
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return json({ error: "Method not allowed." }, 405, false);
  }

  if (!API_KEY) {
    // A configuration problem rather than a caller problem, and worth saying
    // plainly in the log so a missing Vercel variable is not mistaken for an
    // O*NET outage.
    console.error("ONET_API_KEY is not set; /api/onet cannot reach O*NET Web Services.");
    return json({ error: "Career information is unavailable." }, 503, false);
  }

  // A base is supplied because req.url is a full URL on the edge runtime and a
  // bare path on the Node runtime, and new URL() throws on the latter. Parsing
  // it this way works under either, so a runtime change cannot break it again.
  const params = new URL(req.url, "http://localhost").searchParams;
  const resolved = resolvePath(params);
  if ("error" in resolved) return json({ error: resolved.error }, 400, false);

  let upstream: Response;
  try {
    upstream = await fetchOnet(resolved.path);
  } catch (error) {
    console.error("O*NET request failed:", error);
    return json({ error: "Career information is unavailable." }, 502, false);
  }

  if (!upstream.ok) {
    // O*NET returns 422 both for a malformed request and for a career that
    // simply has no data for that section, which is an ordinary outcome. Both
    // reach the page as 404 so it can leave the section out quietly instead
    // of reporting a fault, and neither is logged as an error.
    if (upstream.status === 404 || upstream.status === 422) {
      return json({ error: "No data." }, 404, true);
    }
    console.error(`O*NET responded ${upstream.status} for ${resolved.path}`);
    return json({ error: "Career information is unavailable." }, 502, false);
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    console.error(`O*NET returned a non-JSON body for ${resolved.path}`);
    return json({ error: "Career information is unavailable." }, 502, false);
  }

  return json(data, 200, true);
}

/**
 * Every other function in this directory runs on the edge runtime, and this one
 * has no reason to differ. Without this it deployed as a Node function, where
 * req.url arrives as a bare path, and every request failed with an invalid URL.
 */
export const config = { runtime: "edge" };
