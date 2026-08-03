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

/** Every public route that gets its own prerendered HTML file. */
export const STATIC_ROUTES: string[] = [
  "/",
  "/about",
  "/services",
  "/our-methodology",
  "/consulting",
  "/for-schools",
  "/fellowship",
  "/resources",
  "/tools/iep-goal-checker",
  "/tell-us-about-your-child",
  "/events",
  "/news",
  "/donate",
  "/volunteer",
  "/funders",
  "/press",
  "/transparency",
  "/contact",
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
 * Full route list, including one entry per published blog post. Posts are
 * bundled at build time by src/lib/posts.ts, so their slugs are known here.
 */
export function allRoutes(): string[] {
  const posts = getAllPublishedPosts().map((post) => `/news/${post.slug}`);
  return [...STATIC_ROUTES, ...posts];
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
