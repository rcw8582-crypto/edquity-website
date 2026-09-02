/**
 * Every deploy renames the hashed page chunks and removes the previous
 * build's files, so a tab opened before the deploy 404s the moment it
 * lazy-loads its next page. Without intervention React unmounts the whole
 * tree and the visitor sees a blank screen. The remedy is a single hard
 * reload: the browser fetches the new index.html, which points at chunks
 * that exist.
 */

const RELOAD_STAMP_KEY = "edatm:stale-chunk-reload";

/** How each browser words a failed dynamic import (Chrome / Safari /
 *  Firefox), plus Vite's own message for a CSS preload failure. */
const STALE_CHUNK_PATTERN =
  /failed to fetch dynamically imported module|importing a module script failed|error loading dynamically imported module|unable to preload css/i;

export function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return STALE_CHUNK_PATTERN.test(message);
}

/**
 * Reload the page to pick up the current build, at most once per
 * half-minute. The time guard matters: if the chunk is missing for some
 * other reason (offline, a genuinely broken deploy), reloading forever
 * would trap the visitor in a refresh loop.
 *
 * Returns true when a reload was started, false when one already ran
 * recently and the caller should fall back to an error message instead.
 */
export function reloadForStaleChunk(): boolean {
  try {
    const lastAttempt = Number(sessionStorage.getItem(RELOAD_STAMP_KEY) ?? 0);
    if (Date.now() - lastAttempt < 30_000) return false;
    sessionStorage.setItem(RELOAD_STAMP_KEY, String(Date.now()));
  } catch {
    // Private browsing can block sessionStorage; a single unguarded reload
    // is still better than a blank page, so proceed.
  }
  window.location.reload();
  return true;
}
