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

const template = await readFile(templatePath, "utf8");
const { render, allRoutes } = await import(pathToFileURL(ssrEntry).href);

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
const CANONICAL_ALIASES = {
  "/for-schools": "/consulting",
};

function buildPage(route, head, appHtml) {
  const canonicalRoute = CANONICAL_ALIASES[route] ?? route;
  const canonical = `https://www.edquityatthemargins.org${canonicalRoute === "/" ? "/" : canonicalRoute}`;
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
  "/resources": { changefreq: "monthly", priority: "0.8" },
  "/our-methodology": { changefreq: "monthly", priority: "0.8" },
  "/intake": { changefreq: "monthly", priority: "0.8" },
  "/news": { changefreq: "weekly", priority: "0.8" },
  "/events": { changefreq: "weekly", priority: "0.8" },
  "/donate": { changefreq: "monthly", priority: "0.8" },
  "/tools/iep-goal-checker": { changefreq: "monthly", priority: "0.7" },
  "/tell-us-about-your-child": { changefreq: "monthly", priority: "0.7" },
  "/consulting": { changefreq: "monthly", priority: "0.7" },
  "/fellowship": { changefreq: "monthly", priority: "0.7" },
  "/volunteer": { changefreq: "monthly", priority: "0.7" },
  "/funders": { changefreq: "monthly", priority: "0.7" },
  "/contact": { changefreq: "monthly", priority: "0.7" },
  "/press": { changefreq: "monthly", priority: "0.6" },
  "/transparency": { changefreq: "monthly", priority: "0.6" },
  "/client-portal": { changefreq: "monthly", priority: "0.5" },
  "/accessibility": { changefreq: "yearly", priority: "0.3" },
  "/privacy-policy": { changefreq: "yearly", priority: "0.3" },
  "/terms-of-service": { changefreq: "yearly", priority: "0.3" },
  "/ferpa-compliance": { changefreq: "yearly", priority: "0.3" },
  "/research-data-policy": { changefreq: "yearly", priority: "0.3" },
  "/intake-consent": { changefreq: "yearly", priority: "0.3" },
};

const SITEMAP_DEFAULT = { changefreq: "monthly", priority: "0.6" };

/** /for-schools is an alias of /consulting, so only the canonical one is listed. */
const SITEMAP_EXCLUDE = new Set(["/for-schools"]);

function buildSitemap(routeList) {
  const entries = routeList
    .filter((route) => !SITEMAP_EXCLUDE.has(route))
    .map((route) => {
      const weight = SITEMAP_WEIGHTS[route] ?? SITEMAP_DEFAULT;
      const loc = `https://www.edquityatthemargins.org${route === "/" ? "/" : route}`;
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

// The SSR bundle is a build artifact, not something to deploy.
await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`\nPrerender failed for ${failures.length} route(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`\nPrerendered ${routes.length} routes.`);
