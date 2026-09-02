/**
 * Server entry used only by the build-time prerender pass.
 *
 * Renders one route at a time to an HTML string so every page ships real
 * markup instead of an empty <div id="root">. renderToPipeableStream is the
 * renderer here rather than renderToString because App code-splits its pages
 * with React.lazy, and only the streaming renderer waits for those Suspense
 * boundaries to resolve before it reports the tree complete.
 */

import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";
import { takeCollectedHead, type CollectedHead } from "./lib/head";
import { getAllPublishedPosts } from "./lib/posts";
import { RESOURCES } from "./content/resources";
import { fetchRoles, setRolesSnapshot, type RolesSnapshot } from "./content/board-roles";
import { fetchEvents, setEventsSnapshot, type EdatmEvent } from "./content/events";

/** Every public route that gets its own prerendered HTML file. */
export const STATIC_ROUTES: string[] = [
  "/",
  "/about",
  "/services",
  "/edquity",
  "/our-methodology",
  "/fellowship",
  "/edquity-scholars",
  "/institutional-services",
  "/iep-quality-improvement",
  "/audit-feedback",
  "/professional-development",
  "/resources",
  "/tools/iep-goal-checker",
  "/pathways/explore",
  "/pathways/explore/questions",
  "/pathways/explore/fields",
  "/pathways/explore/search",
  "/pathways/explore/results",
  "/pathways/explore/plan",
  "/tell-us-about-your-child",
  "/events",
  "/news",
  "/donate",
  "/volunteer",
  "/board",
  "/board/roles",
  "/funders",
  "/partners",
  "/press",
  "/transparency",
  "/contact",
  "/book",
  "/intake",
  "/client-portal",
  "/accessibility",
  "/privacy-policy",
  "/terms-of-service",
  "/ferpa-compliance",
  "/research-data-policy",
  "/intake-consent",
];

/**
 * Full route list, including one entry per published blog post and one per free
 * resource. Both sets are bundled at build time, so their slugs are known here
 * and neither the sitemap nor the prerender pass can drift from the content.
 */
let roleRoutes: string[] = [];

/** Called by the prerender pass before allRoutes(), so role pages exist. */
export async function prefetchRoles(): Promise<RolesSnapshot> {
  const snapshot = await fetchRoles();
  setRolesSnapshot(snapshot);
  roleRoutes = snapshot.roles.map((role) => `/board/roles/${role.slug}`);
  return snapshot;
}

export function allRoutes(): string[] {
  const posts = getAllPublishedPosts().map((post) => `/news/${post.slug}`);
  const resources = RESOURCES.map((resource) => `/resources/${resource.slug}`);
  return [...STATIC_ROUTES, ...roleRoutes, ...posts, ...resources];
}

export interface FeedItem {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  publishedAt: string | null;
  publishedTime: string | null;
}

/**
 * The published posts, for the RSS feed the prerender pass writes.
 *
 * Read from the same loader the pages use, so the feed can never advertise a
 * post that does not exist or miss one that does.
 */
export function feedItems(): FeedItem[] {
  return getAllPublishedPosts().map(
    ({ title, slug, excerpt, category, publishedAt, publishedTime }) => ({
      title,
      slug,
      excerpt,
      category,
      publishedAt,
      publishedTime,
    }),
  );
}

/**
 * Loads the event schedule once and hands it to the renderer, so the Events
 * page prerenders with real sessions in it. A source outage must not break a
 * deploy, so a failure here degrades to an empty schedule and the page falls
 * back to fetching on the client exactly as it did before.
 */
export async function prefetchEvents(): Promise<EdatmEvent[]> {
  try {
    const events = await fetchEvents();
    setEventsSnapshot(events);
    return events;
  } catch {
    setEventsSnapshot([]);
    return [];
  }
}

export interface RenderResult {
  html: string;
  head: CollectedHead | null;
}

export function render(url: string): Promise<RenderResult> {
  return new Promise((resolve, reject) => {
    let body = "";
    const sink = new Writable({
      write(chunk, _encoding, done) {
        body += chunk.toString();
        done();
      },
    });

    sink.on("finish", () => resolve({ html: body, head: takeCollectedHead() }));

    const { pipe, abort } = renderToPipeableStream(<App ssrPath={url} />, {
      onAllReady() {
        pipe(sink);
      },
      onError(error) {
        reject(error);
      },
    });

    // A route that never settles would otherwise hang the whole build.
    const timeout = setTimeout(() => {
      abort();
      reject(new Error(`Timed out rendering ${url}`));
    }, 30_000);
    sink.on("finish", () => clearTimeout(timeout));
  });
}
