/**
 * Build-time blog post loader.
 *
 * Reads every .md file under /content/posts at build time using
 * Vite's import.meta.glob, parses the YAML frontmatter, and renders
 * the markdown body to HTML with marked. Posts are bundled into the
 * static site — no API endpoint needed at runtime.
 *
 * To add a new post, create a file named YYYY-MM-DD-slug.md in
 * /content/posts and Vite picks it up on the next build.
 */

import { marked } from "marked";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // rendered HTML
  category: string;
  readTime: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

type Frontmatter = {
  title: string;
  slug?: string;
  excerpt: string;
  category: string;
  readTime?: string;
  published?: boolean;
  publishedAt?: string;
  createdAt?: string;
};

/**
 * Minimal YAML-ish frontmatter parser. Supports:
 *   key: "string value"
 *   key: 'string value'
 *   key: bareword
 *   key: true / false
 *   key: 2026-05-18
 *
 * Frontmatter is delimited by lines containing only `---`.
 */
function parseFrontmatter(raw: string): { data: Record<string, string | boolean>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const [, fmRaw, body] = match;
  const data: Record<string, string | boolean> = {};

  for (const line of fmRaw.split(/\r?\n/)) {
    const lineMatch = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!lineMatch) continue;
    const [, key, rawValue] = lineMatch;
    let value: string | boolean = rawValue.trim();
    if (value === "true") value = true;
    else if (value === "false") value = false;
    else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, body };
}

function slugFromPath(path: string): string {
  // Path looks like /content/posts/2026-05-18-some-slug.md
  // Extract the part after the date prefix.
  const file = path.split("/").pop() ?? "";
  const name = file.replace(/\.md$/, "");
  return name.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

function dateFromPath(path: string): string | null {
  const file = path.split("/").pop() ?? "";
  const m = file.match(/^(\d{4}-\d{2}-\d{2})-/);
  return m ? m[1] : null;
}

function estimateReadTime(markdown: string): string {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min read`;
}

// Configure marked: GitHub-flavored markdown defaults, no header IDs.
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Eager-load all markdown files. ?raw imports them as strings.
const modules = import.meta.glob("/content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const ALL_POSTS: BlogPost[] = Object.entries(modules)
  .map(([path, raw], index) => {
    const { data, body } = parseFrontmatter(raw);
    const fm = data as unknown as Frontmatter;
    const fallbackDate = dateFromPath(path);
    const slug = (fm.slug && String(fm.slug)) || slugFromPath(path);
    const renderedHtml = marked.parse(body) as string;

    return {
      id: index + 1,
      title: String(fm.title ?? "Untitled"),
      slug,
      excerpt: String(fm.excerpt ?? ""),
      content: renderedHtml,
      category: String(fm.category ?? "Community"),
      readTime: String(fm.readTime ?? estimateReadTime(body)),
      published: fm.published !== false,
      publishedAt: fm.publishedAt ? String(fm.publishedAt) : fallbackDate,
      createdAt: fm.createdAt ? String(fm.createdAt) : (fallbackDate ?? new Date().toISOString()),
    } satisfies BlogPost;
  })
  // Sort newest first by publishedAt, falling back to createdAt
  .sort((a, b) => {
    const ad = a.publishedAt ?? a.createdAt;
    const bd = b.publishedAt ?? b.createdAt;
    return bd.localeCompare(ad);
  });

export function getAllPublishedPosts(): BlogPost[] {
  return ALL_POSTS.filter((p) => p.published);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL_POSTS.find((p) => p.slug === slug && p.published);
}

/**
 * Returns up to `count` posts related to `currentSlug`.
 *
 * Selection order:
 *   1. Other posts in the same category, newest first.
 *   2. If fewer than `count` same-category matches exist, fall back
 *      to the most recent posts across all categories to fill the
 *      remaining slots.
 *
 * Always excludes the current post. Returns an empty array when no
 * other published posts exist (e.g., the blog has only one post).
 */
export function getRelatedPosts(currentSlug: string, count: number = 3): BlogPost[] {
  const published = getAllPublishedPosts();
  const current = published.find((p) => p.slug === currentSlug);
  const others = published.filter((p) => p.slug !== currentSlug);
  if (others.length === 0) return [];

  const sameCategory = current
    ? others.filter((p) => p.category === current.category)
    : [];

  const picks: BlogPost[] = [...sameCategory];
  for (const post of others) {
    if (picks.length >= count) break;
    if (!picks.some((p) => p.slug === post.slug)) picks.push(post);
  }

  return picks.slice(0, count);
}
