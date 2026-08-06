/**
 * Board and advisory council position descriptions, loaded from the EDquity
 * portal's database.
 *
 * Reba edits every section at edquity360.com/admin/board-roles. The website
 * renders what she saves as real HTML. Nothing here duplicates the text, and
 * no PDF sits between the reader and the content.
 *
 * This mirrors content/events.ts: a build-time snapshot inlined into the
 * prerendered HTML so the first paint carries real content, plus a live
 * fetch afterwards to pick up anything published since the last deploy.
 */

const SUPABASE_URL = "https://erggxchftkpczoshcfii.supabase.co";
// Publishable read-only key. Row-level security limits it to published roles.
const SUPABASE_ANON_KEY = "sb_publishable_QKhsSgXSYmlhtOv0vfIJ4Q_c5uau4Yn";

export type RoleStatus = "open" | "filled";
export type RoleKind = "director" | "advisory";

export interface BoardRole {
  slug: string;
  title: string;
  kind: RoleKind;
  status: RoleStatus;
  sort_order: number;
  summary: string;
  purpose: string;
  responsibilities: string[];
  required: string[];
  preferred: string[];
  additional_commitment: string | null;
}

export interface RoleShared {
  kind: RoleKind;
  reports_to: string;
  term: string;
  compensation: string;
  time_commitment: string[];
  shared_responsibilities: string[];
  boundary: string;
  provided: string[];
  governance_note: string | null;
}

export interface RolesSnapshot {
  roles: BoardRole[];
  shared: RoleShared[];
}

export const ROLES_SNAPSHOT_KEY = "__EDATM_BOARD_ROLES__";

const EMPTY: RolesSnapshot = { roles: [], shared: [] };

let ssrSnapshot: RolesSnapshot | null = null;

/** Called by the prerender pass before any route renders. */
export function setRolesSnapshot(snapshot: RolesSnapshot): void {
  ssrSnapshot = snapshot;
}

/** Snapshot for the first render: module state on the server, the inlined object in the browser. */
export function initialRoles(): RolesSnapshot | null {
  if (typeof window === "undefined") return ssrSnapshot;
  const inlined = (window as unknown as Record<string, unknown>)[ROLES_SNAPSHOT_KEY];
  if (!inlined || typeof inlined !== "object") return null;
  const snapshot = inlined as RolesSnapshot;
  return Array.isArray(snapshot.roles) ? snapshot : null;
}

async function read<T>(table: string, query: string): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`${table} read failed: ${res.status}`);
  return (await res.json()) as T[];
}

/**
 * Fetches both tables. A failure returns empty rather than throwing, because
 * a page that renders its heading and no roles is recoverable, and a page
 * that throws during prerender fails the whole build.
 */
export async function fetchRoles(): Promise<RolesSnapshot> {
  try {
    const [roles, shared] = await Promise.all([
      read<BoardRole>("board_roles", "select=*&published=eq.true&order=sort_order.asc"),
      read<RoleShared>("board_role_shared", "select=*"),
    ]);
    return { roles, shared };
  } catch (error) {
    console.error("[board-roles] fetch failed:", error);
    return EMPTY;
  }
}

export function sharedFor(snapshot: RolesSnapshot, kind: RoleKind): RoleShared | undefined {
  return snapshot.shared.find((entry) => entry.kind === kind);
}

export function roleBySlug(snapshot: RolesSnapshot, slug: string): BoardRole | undefined {
  return snapshot.roles.find((role) => role.slug === slug);
}
