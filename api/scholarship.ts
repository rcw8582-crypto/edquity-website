/**
 * Retired endpoint. The Families First Scholarship application flow was removed when the tuition programs
 * merged into the sponsor-funded EDquity Scholars program (no family ever
 * pays). Kept as a stub so stale forms and old links get a clear answer
 * instead of a crash, and so no acknowledgment email is ever sent again.
 */

export default async function handler(): Promise<Response> {
  return new Response(
    JSON.stringify({
      error:
        "This program has been retired. EDquity Scholars seats are sponsor-funded and free to every family. Please visit edquityatthemargins.org/edquity-scholars or email info@edquityatthemargins.org.",
    }),
    { status: 410, headers: { "Content-Type": "application/json" } },
  );
}
