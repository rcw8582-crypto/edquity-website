/**
 * Vercel serverless function: POST /api/board-upload
 *
 * Mints a one-time signed upload URL for a board applicant's resume, so the
 * file goes straight from the browser into the private board-resumes bucket
 * and never passes through the application handler. That keeps a five
 * megabyte document out of a JSON request body, and it keeps the service
 * role key on the server.
 *
 * The signed URL is scoped to a single object path that this function
 * chooses, so a caller cannot pick where the file lands or overwrite
 * anything already stored.
 *
 * Required environment variable:
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional environment variable:
 *   SUPABASE_URL  (defaults to the portal project)
 */

const SUPABASE_URL = process.env.SUPABASE_URL || "https://erggxchftkpczoshcfii.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BUCKET = "board-resumes";
const MAX_BYTES = 5 * 1024 * 1024;

/** Mirrors allowed_mime_types on the bucket, so the rejection is friendly. */
const ALLOWED = new Map<string, string>([
  ["application/pdf", "pdf"],
  ["application/msword", "doc"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
]);

/**
 * Reduces an uploaded filename to something safe for an object key while
 * keeping it recognisable in the bucket listing. Everything outside the
 * allowlist collapses to a hyphen, so path traversal and unicode tricks
 * cannot survive.
 */
function safeName(name: string, fallbackExt: string): string {
  const trimmed = name.slice(-120);
  const dot = trimmed.lastIndexOf(".");
  const base = (dot > 0 ? trimmed.slice(0, dot) : trimmed)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "resume"}.${fallbackExt}`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[board-upload] SUPABASE_SERVICE_ROLE_KEY not configured");
    return Response.json(
      { error: "Resume upload is not configured yet. Please email your resume to info@edquityatthemargins.org." },
      { status: 500 }
    );
  }

  let body: { filename?: unknown; contentType?: unknown; size?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { filename, contentType, size } = body;

  if (typeof contentType !== "string" || !ALLOWED.has(contentType)) {
    return Response.json(
      { error: "Please upload a PDF or Word document." },
      { status: 400 }
    );
  }
  if (typeof size !== "number" || !Number.isFinite(size) || size <= 0 || size > MAX_BYTES) {
    return Response.json(
      { error: "Your resume must be smaller than 5 MB." },
      { status: 400 }
    );
  }
  if (typeof filename !== "string" || filename.trim().length === 0) {
    return Response.json({ error: "Missing filename." }, { status: 400 });
  }

  const path = `${crypto.randomUUID()}/${safeName(filename, ALLOWED.get(contentType)!)}`;

  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    console.error("[board-upload] signed upload URL failed:", res.status, await res.text());
    return Response.json(
      { error: "We could not start the upload. Please try again in a moment." },
      { status: 502 }
    );
  }

  // Supabase returns a relative signed path; the browser needs the origin.
  const data = (await res.json()) as { url?: string };
  if (!data.url) {
    console.error("[board-upload] signed upload response missing url");
    return Response.json({ error: "We could not start the upload." }, { status: 502 });
  }

  return Response.json({
    path,
    uploadUrl: `${SUPABASE_URL}/storage/v1${data.url.startsWith("/") ? "" : "/"}${data.url}`,
  });
}

export const config = { runtime: "edge" };
