/**
 * Static prerender pass.
 *
 * Runs after both Vite builds and turns dist/index.html (an empty shell) into
 * one real HTML file per route, each carrying the page's full markup and its
 * own title, description, canonical and social metadata.
 *
 * Why this exists: Google Ad Grants rejects sites for "insufficient unique
 * content" and slow mobile load, and a client-rendered SPA serves neither
 * content nor a fast first paint to a crawler. The client bundle still hydrates
 * as before, so behaviour in the browser is unchanged.
 */

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");
const templatePath = path.join(distDir, "index.html");

if (!existsSync(templatePath)) {
  throw new Error("dist/index.html is missing. Run the client build first.");
}
if (!existsSync(ssrEntry)) {
  throw new Error("dist-ssr/entry-server.js is missing. Run the SSR build first.");
}

/** Canonical origin. Every absolute URL the build emits is built from this. */
const SITE = "https://www.edquityatthemargins.org";

const template = await readFile(templatePath, "utf8");
const { render, allRoutes, prefetchEvents, prefetchRoles, feedItems } = await import(pathToFileURL(ssrEntry).href);

// Loaded before any route renders so the Events page prerenders with real
// sessions listed rather than an empty calendar and a loading panel.
const events = await prefetchEvents();
console.log(`loaded ${events.length} event(s) for prerender`);

// Loaded before allRoutes() so every published role gets its own page.
const roles = await prefetchRoles();
console.log(`loaded ${roles.roles.length} board role(s) for prerender`);

const escapeAttribute = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeText = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Replaces a meta tag's content attribute, matched on its name or property. */
function setMetaContent(html, selectorAttr, selectorValue, content) {
  const pattern = new RegExp(
    `(<meta\\s+[^>]*${selectorAttr}="${selectorValue}"[^>]*content=")[^"]*(")`,
    "i",
  );
  if (pattern.test(html)) {
    return html.replace(pattern, `$1${escapeAttribute(content)}$2`);
  }
  return html.replace(
    "</head>",
    `    <meta ${selectorAttr}="${selectorValue}" content="${escapeAttribute(content)}" />\n  </head>`,
  );
}

/**
 * Routes that serve the same page under a second URL. Both stay reachable so
 * existing links keep working, and the alias points its canonical at the real
 * one so search engines index a single page rather than a duplicate pair.
 */
const CANONICAL_ALIASES = {};

function buildPage(route, head, appHtml) {
  const canonicalRoute = CANONICAL_ALIASES[route] ?? route;
  const canonical = `${SITE}${canonicalRoute === "/" ? "/" : canonicalRoute}`;
  let html = template;

  if (head?.title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(head.title)}</title>`);
    html = setMetaContent(html, "property", "og:title", head.title);
    html = setMetaContent(html, "name", "twitter:title", head.title);
  }
  if (head?.description) {
    html = setMetaContent(html, "name", "description", head.description);
    html = setMetaContent(html, "property", "og:description", head.description);
    html = setMetaContent(html, "name", "twitter:description", head.description);
  }

  html = setMetaContent(html, "property", "og:url", canonical);
  html = html.replace(
    "</head>",
    `    <link rel="canonical" href="${escapeAttribute(canonical)}" />\n  </head>`,
  );

  // Only the homepage shows the hero, so only the homepage preloads it, and
  // the media query matches the stylesheet: .rg-hero-img is display:none below
  // 768px, so a phone never displays this image and must not be told to fetch
  // it early. Above that width it is the Largest Contentful Paint element.
  if (route === "/") {
    html = html.replace(
      "</head>",
      '    <link rel="preload" as="image" href="/images/hero-family.jpg" ' +
        'media="(min-width: 768px)" fetchpriority="high" />\n  </head>',
    );
  }

  // The Events page is the only route that reads the schedule, so only it
  // carries the inlined copy. Hydration reads the same array the server
  // rendered from, which keeps the client from replacing a populated calendar
  // with an empty one on mount.
  if (route === "/board" || route.startsWith("/board/roles")) {
    const payload = JSON.stringify(roles).replace(/</g, "\\u003c");
    html = html.replace(
      "</head>",
      `    <script>window.__EDATM_BOARD_ROLES__=${payload}</script>\n  </head>`,
    );
  }

  if (route === "/events") {
    const payload = JSON.stringify(events).replace(/</g, "\\u003c");
    html = html.replace(
      "</head>",
      `    <script>window.__EDATM_EVENTS__=${payload}</script>\n  </head>`,
    );
  }

  return html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
}

async function writeRoute(route, html) {
  const target =
    route === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, route.replace(/^\//, ""), "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
}

/**
 * Sitemap weighting. Anything not listed falls back to the default, so adding
 * a route to STATIC_ROUTES is enough to get it indexed.
 */
const SITEMAP_WEIGHTS = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/services": { changefreq: "monthly", priority: "0.9" },
  "/about": { changefreq: "monthly", priority: "0.9" },
  "/resources": { changefreq: "monthly", priority: "0.9" },
  "/edquity": { changefreq: "monthly", priority: "0.9" },
  "/our-methodology": { changefreq: "monthly", priority: "0.8" },
  "/news": { changefreq: "weekly", priority: "0.8" },
  "/events": { changefreq: "weekly", priority: "0.8" },
  "/donate": { changefreq: "monthly", priority: "0.8" },
  "/tools/iep-goal-checker": { changefreq: "monthly", priority: "0.7" },
  "/pathways/explore": { changefreq: "monthly", priority: "0.7" },
  "/pathways/explore/questions": { changefreq: "monthly", priority: "0.6" },
  "/pathways/explore/fields": { changefreq: "monthly", priority: "0.6" },
  "/pathways/explore/search": { changefreq: "monthly", priority: "0.5" },
  "/tell-us-about-your-child": { changefreq: "monthly", priority: "0.7" },
  "/fellowship": { changefreq: "monthly", priority: "0.7" },
  "/edquity-scholars": { changefreq: "monthly", priority: "0.7" },
  "/iep-quality-improvement": { changefreq: "monthly", priority: "0.7" },
  "/volunteer": { changefreq: "monthly", priority: "0.7" },
  "/board": { changefreq: "monthly", priority: "0.7" },
  "/board/roles": { changefreq: "monthly", priority: "0.6" },
  "/funders": { changefreq: "monthly", priority: "0.7" },
  "/partners": { changefreq: "monthly", priority: "0.6" },
  "/contact": { changefreq: "monthly", priority: "0.7" },
  "/book": { changefreq: "monthly", priority: "0.8" },
  "/press": { changefreq: "monthly", priority: "0.6" },
  "/transparency": { changefreq: "monthly", priority: "0.6" },
  "/accessibility": { changefreq: "yearly", priority: "0.3" },
  "/privacy-policy": { changefreq: "yearly", priority: "0.3" },
  "/terms-of-service": { changefreq: "yearly", priority: "0.3" },
  "/ferpa-compliance": { changefreq: "yearly", priority: "0.3" },
  "/research-data-policy": { changefreq: "yearly", priority: "0.3" },
  "/intake-consent": { changefreq: "yearly", priority: "0.3" },
};

const SITEMAP_DEFAULT = { changefreq: "monthly", priority: "0.6" };

/** Every /resources/<slug> page carries the same weight as the hub's siblings. */
const SITEMAP_PREFIX_WEIGHTS = [
  { prefix: "/resources/", weight: { changefreq: "monthly", priority: "0.8" } },
  { prefix: "/board/roles/", weight: { changefreq: "yearly", priority: "0.5" } },
];

/**
 * Prerendered so the URL resolves, but kept out of the sitemap because both are
 * disallowed in robots.txt and listing them would contradict that.
 *
 * /client-portal is a sign-in gate with nothing to index. /intake is the
 * exception path for families who do not do a registration call, so it has to
 * keep working when Reba sends it directly, without being something a visitor
 * or a crawler finds on its own. /audit-feedback is the usefulness study,
 * sent by link to families who already hold a report, and it would only
 * confuse a visitor who had never seen one.
 */
const SITEMAP_EXCLUDE = new Set([
  "/client-portal",
  "/intake",
  "/audit-feedback",
  // Both are built from answers held in the visitor's own browser, so they have
  // nothing in them for a crawler and nothing worth landing on cold.
  "/pathways/explore/results",
  "/pathways/explore/plan",
]);

function buildSitemap(routeList) {
  const entries = routeList
    .filter((route) => !SITEMAP_EXCLUDE.has(route))
    .map((route) => {
      const weight =
        SITEMAP_WEIGHTS[route] ??
        SITEMAP_PREFIX_WEIGHTS.find((entry) => route.startsWith(entry.prefix))?.weight ??
        SITEMAP_DEFAULT;
      const loc = `${SITE}${route === "/" ? "/" : route}`;
      return `  <url><loc>${loc}</loc><changefreq>${weight.changefreq}</changefreq><priority>${weight.priority}</priority></url>`;
    });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

const routes = allRoutes();
const failures = [];

for (const route of routes) {
  try {
    const { html, head } = await render(route);
    if (!head) {
      failures.push(`${route} rendered without a PageMeta title or description`);
    }
    await writeRoute(route, buildPage(route, head, html));
    const label = head?.title ?? "(no PageMeta)";
    console.log(`prerendered ${route.padEnd(28)} ${label}`);
  } catch (error) {
    failures.push(`${route}: ${error.message}`);
  }
}

// The sitemap is generated from the same route list the pages come from, so it
// can never list a URL that does not exist or miss one that does.
await writeFile(path.join(distDir, "sitemap.xml"), buildSitemap(routes), "utf8");
console.log(`wrote sitemap.xml with ${routes.length - SITEMAP_EXCLUDE.size} URLs`);

/**
 * RSS 2.0 feed of the blog.
 *
 * Exists so posts can be pushed to social accounts automatically rather than
 * copied by hand. Built from the same post loader the pages use, so the feed
 * cannot advertise a post that does not exist.
 *
 * pubDate must be RFC 822 for readers to sort correctly. Post dates carry no
 * time, so each is pinned to noon UTC: any fixed hour works, and midnight is
 * the one to avoid, since a reader in a negative UTC offset would show the
 * post on the previous day.
 */
function buildFeed(items) {
  const rfc822 = (date) =>
    date ? new Date(`${date}T12:00:00Z`).toUTCString() : new Date().toUTCString();

  const entries = items.map((item) => {
    const url = `${SITE}/news/${item.slug}`;
    return `    <item>
      <title>${escapeText(item.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(item.publishedAt)}</pubDate>
      <category>${escapeText(item.category)}</category>
      <description>${escapeText(item.excerpt)}</description>
    </item>`;
  });

  const latest = items.find((item) => item.publishedAt)?.publishedAt ?? null;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>In the Margins</title>
    <link>${SITE}/news</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Plain-language guidance on IEPs and special education rights for families who deserve a seat at the table.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
${entries.join("\n")}
  </channel>
</rss>
`;
}

const feed = feedItems();
await writeFile(path.join(distDir, "rss.xml"), buildFeed(feed), "utf8");
console.log(`wrote rss.xml with ${feed.length} post(s)`);

// The SSR bundle is a build artifact, not something to deploy.
await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`\nPrerender failed for ${failures.length} route(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`\nPrerendered ${routes.length} routes.`);
