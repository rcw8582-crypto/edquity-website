/**
 * Head collector for the static prerender pass.
 *
 * During `node scripts/prerender.mjs` the app renders on the server, where
 * PageMeta's useEffect never fires and so the browser-side title/description
 * writes never happen. PageMeta instead reports its values here while
 * rendering, and the prerender script reads them back to stamp real per-page
 * metadata into each generated index.html.
 *
 * Page metadata therefore has exactly one source of truth, the PageMeta call
 * inside each page component, rather than a separate route table that would
 * drift out of sync.
 */

export interface CollectedHead {
  title: string;
  description: string;
  path: string;
}

let collected: CollectedHead | null = null;

export function collectHead(head: CollectedHead): void {
  collected = head;
}

/** Returns the head reported by the last render and clears it for the next route. */
export function takeCollectedHead(): CollectedHead | null {
  const head = collected;
  collected = null;
  return head;
}
