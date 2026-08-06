/**
 * Build-time consistency checks.
 *
 * Runs against dist/ after the prerender pass and fails the build when the
 * site contradicts itself. Every rule here exists because the corresponding
 * mistake actually shipped:
 *
 *   - Two buttons side by side pointing at the same URL, offering a choice
 *     that was not one.
 *   - A link whose words promised a booking and went to a contact form.
 *   - A "Learn more" link swept along with real CTAs onto a booking calendar.
 *   - An internal link to a route that had been removed, returning 404.
 *   - A page prerendering empty, so a crawler and a visitor with slow
 *     JavaScript both saw nothing.
 *   - A URL disallowed in robots.txt while still listed in the sitemap.
 *
 * None of these are type errors and none of them break a build on their own,
 * which is exactly why they reached production.
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const publicDir = path.join(root, "public");

const failures = [];
const warnings = [];
const fail = (rule, detail) => failures.push({ rule, detail });
const warn = (rule, detail) => warnings.push({ rule, detail });

/**
 * Routes deliberately reachable only by a link we send someone directly.
 * /intake is the exception path for families who skip a registration call, so
 * it must resolve while staying unlinked and out of the sitemap.
 */
const INTENTIONALLY_UNLINKED = new Set([
  "/intake",
  "/admin",
  "/donor",
  // Linked from the intake confirmation screen, which only exists after a form
  // submission and so never appears in prerendered markup. Reached by a direct
  // link rather than by browsing.
  "/tell-us-about-your-child",
]);

/** Link text that describes an action, mapped to where it may legitimately go. */
const LABEL_RULES = [
  { test: /\b(book|schedule)\b/i, allow: ["/book"], name: "booking" },
  { test: /^donate\b|\bdonate (now|today)\b/i, allow: ["/donate"], name: "donation" },
  { test: /\blearn more\b|\bread more\b/i, deny: ["/book", "/donate"], name: "informational" },
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const files = (await walk(distDir)).filter((f) => f.endsWith("index.html"));

/** dist/about/index.html -> /about ; dist/index.html -> / */
const routeOf = (file) => {
  const rel = path.relative(distDir, file).replace(/index\.html$/, "").replace(/\/$/, "");
  return rel === "" ? "/" : `/${rel}`;
};

const routes = new Set(files.map(routeOf));

const vercel = JSON.parse(await readFile(path.join(root, "vercel.json"), "utf8"));
const redirectSources = new Set((vercel.redirects ?? []).map((r) => r.source));

const publicFiles = existsSync(publicDir)
  ? new Set((await walk(publicDir)).map((f) => `/${path.relative(publicDir, f)}`))
  : new Set();

const stripTags = (html) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const decode = (s) =>
  s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, " ");

/** The prerendered markup only, so head metadata never counts as page content. */
function rootHtml(html) {
  const i = html.indexOf('<div id="root">');
  if (i < 0) return "";
  return html.slice(i + '<div id="root">'.length);
}

/** Anchors as {href, label, index}. */
function anchorsIn(html) {
  const out = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(html))) {
    const href = /href="([^"]*)"/.exec(m[1])?.[1];
    if (!href) continue;
    // An icon link labels itself with aria-label rather than text, which is
    // the accessible pattern, so that counts as a label here.
    const aria = /aria-label="([^"]*)"/.exec(m[1])?.[1] ?? "";
    out.push({ href, label: decode(stripTags(m[2])) || decode(aria), index: m.index });
  }
  return out;
}

/**
 * Slices of markup that are one horizontal button row, found by matching a
 * flex container to its closing tag with depth counting rather than a regex,
 * which cannot balance nesting.
 */
function flexRows(html) {
  const rows = [];
  const opens = /<div\b[^>]*style="[^"]*display:\s*flex[^"]*"[^>]*>/g;
  let m;
  while ((m = opens.exec(html))) {
    let depth = 1;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = m.index + m[0].length;
    let t;
    while (depth > 0 && (t = tag.exec(html))) {
      depth += t[0].startsWith("</") ? -1 : 1;
      if (depth === 0) rows.push(html.slice(m.index, t.index));
    }
  }
  return rows;
}

for (const file of files) {
  const route = routeOf(file);
  const html = await readFile(file, "utf8");
  const body = rootHtml(html);

  // 1. The page actually rendered something.
  const text = stripTags(body);
  if (text.length < 200) {
    fail("empty-page", `${route} prerendered with ${text.length} characters of content`);
  }

  const anchors = anchorsIn(body);

  // 2. No two buttons in one row share a destination.
  for (const row of flexRows(body)) {
    const inRow = anchorsIn(row).filter((a) => a.label);
    const byHref = new Map();
    for (const a of inRow) {
      if (!byHref.has(a.href)) byHref.set(a.href, []);
      byHref.get(a.href).push(a.label);
    }
    for (const [href, labels] of byHref) {
      if (labels.length > 1) {
        fail("duplicate-cta", `${route} has ${labels.length} buttons to ${href} in one row: ${labels.join(" | ")}`);
      }
    }
  }

  for (const a of anchors) {
    const { href, label } = a;
    if (!href || href.startsWith("#") || /^(mailto|tel|https?):/.test(href)) {
      // 3. External and protocol links are out of scope, except empty labels.
      if (!label && !href.startsWith("#")) {
        warn("unlabelled-link", `${route} has a link to ${href} with no text`);
      }
      continue;
    }

    // 4. Internal links resolve to a page, a redirect, or a real file.
    const clean = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    const resolves =
      routes.has(clean) || redirectSources.has(clean) || publicFiles.has(href) || publicFiles.has(clean);
    if (!resolves) {
      fail("dead-link", `${route} links to ${href}, which is not a page, a redirect, or a file`);
    }

    // 5. A link's words match where it goes.
    for (const rule of LABEL_RULES) {
      if (!label || !rule.test.test(label)) continue;
      if (rule.allow && !rule.allow.includes(clean) && !redirectSources.has(clean)) {
        fail("label-mismatch", `${route}: "${label}" reads as ${rule.name} but goes to ${href}`);
      }
      if (rule.deny && rule.deny.includes(clean)) {
        fail("label-mismatch", `${route}: "${label}" is ${rule.name} but goes to ${href}`);
      }
    }
  }
}

// 6. Every page is reachable from another page.
const linked = new Set();
for (const file of files) {
  const body = rootHtml(await readFile(file, "utf8"));
  for (const a of anchorsIn(body)) {
    const clean = a.href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (clean.startsWith("/")) linked.add(clean);
  }
}
for (const route of routes) {
  if (route === "/" || linked.has(route) || INTENTIONALLY_UNLINKED.has(route)) continue;
  fail("orphan-page", `${route} exists but nothing links to it`);
}

// 7. robots.txt and sitemap.xml do not contradict each other.
const robotsPath = path.join(distDir, "robots.txt");
const sitemapPath = path.join(distDir, "sitemap.xml");
if (existsSync(robotsPath) && existsSync(sitemapPath)) {
  const robots = await readFile(robotsPath, "utf8");
  const sitemap = await readFile(sitemapPath, "utf8");
  for (const m of robots.matchAll(/^Disallow:\s*(\S+)/gm)) {
    const blocked = m[1].replace(/\/$/, "");
    if (sitemap.includes(`${blocked}<`) || sitemap.includes(`${blocked}/<`)) {
      fail("robots-sitemap-conflict", `${blocked} is disallowed in robots.txt but listed in sitemap.xml`);
    }
  }
}

for (const w of warnings) console.warn(`  warn  [${w.rule}] ${w.detail}`);

if (failures.length > 0) {
  const byRule = new Map();
  for (const f of failures) {
    if (!byRule.has(f.rule)) byRule.set(f.rule, []);
    byRule.get(f.rule).push(f.detail);
  }
  console.error(`\nSite checks failed (${failures.length} problem${failures.length === 1 ? "" : "s"}):\n`);
  for (const [rule, details] of byRule) {
    console.error(`  ${rule}`);
    for (const d of details) console.error(`    - ${d}`);
    console.error("");
  }
  process.exit(1);
}

console.log(`Site checks passed: ${files.length} pages, ${routes.size} routes.`);
