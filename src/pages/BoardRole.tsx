import { useRoute, Link } from "wouter";
import { ArrowLeft, Download, FileText } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import NotFound from "@/pages/not-found";
import { roleBySlug, rolePdf } from "@/content/board-roles";

/**
 * One position description, rendered as the PDF itself.
 *
 * The page deliberately holds no copy of the description. Reba maintains the
 * Word document, saves it as a PDF over public/board-roles/<slug>.pdf, and
 * this page shows the new version with nothing else to update. Repeating the
 * text in JSX would mean every edit had to happen twice, and the second one
 * would eventually get missed.
 */
export default function BoardRole() {
  const [, params] = useRoute("/board/roles/:slug");
  const role = params?.slug ? roleBySlug(params.slug) : undefined;

  if (!role) return <NotFound />;

  const pdf = rolePdf(role);
  const kind = role.kind === "director" ? "Board of Directors" : "Advisory Council";

  return (
    <div className="pt-20">
      <PageMeta
        title={`${role.title} | Position Description`}
        description={`${role.summary} A volunteer ${role.kind === "director" ? "board" : "advisory council"} position with EDquity at the Margins, open to candidates across the United States.`}
      />

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl">
            <Link
              href="/board/roles"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
              data-testid="back-to-roles"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              All position descriptions
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">{kind}</span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  role.status === "open"
                    ? "bg-accent/15 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid="role-status"
              >
                {role.status === "open" ? "Recruiting now" : "Seat filled"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{role.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">{role.summary}</p>

            <div className="flex flex-wrap gap-3">
              <a
                href={pdf}
                download
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold rounded-full px-6 py-3 text-sm hover:bg-primary/90 transition-colors"
                data-testid="download-pdf"
              >
                <Download size={16} aria-hidden="true" />
                Download the position description
              </a>
              {role.status === "open" && (
                <Link
                  href="/board"
                  className="inline-flex items-center gap-2 bg-accent text-primary-foreground font-semibold rounded-full px-6 py-3 text-sm hover:bg-accent/90 transition-colors"
                  data-testid="apply-cta"
                >
                  Apply for this position
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* An <iframe> rather than an <object>. Chrome renders a PDF inside
              an object as an empty black rectangle, which is what shipped the
              first time. The iframe hands the file to the browser's own PDF
              viewer instead.

              Phones mostly refuse to render an embedded PDF at all, so the
              frame is hidden below the medium breakpoint and those visitors
              get the download card underneath. An iframe cannot carry
              fallback children the way an object can, so the fallback is a
              real element rather than nested content. */}
          {/* The link comes first and always renders. Browsers disagree about
              embedded PDFs, and a phone usually refuses outright, so a page
              that depends on the frame is a page that shows some visitors a
              blank rectangle. The frame below is an enhancement. */}
          <div className="bg-white border border-border rounded-xl p-8 text-center mb-6">
            <p className="text-muted-foreground mb-5">
              The full position description for {role.title} opens as a PDF.
            </p>
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold rounded-full px-7 py-3.5 text-sm hover:bg-primary/90 transition-colors"
              data-testid="open-pdf"
            >
              <FileText size={16} aria-hidden="true" />
              Open the position description
            </a>
          </div>

          <iframe
            src={`${pdf}#view=FitH`}
            title={`${role.title} position description`}
            className="hidden md:block w-full rounded-xl border border-border bg-white"
            style={{ height: "min(1100px, 130vh)" }}
            data-testid="pdf-embed"
          />

          <p className="text-sm text-muted-foreground mt-4">
            Prefer to read it offline?{" "}
            <a href={pdf} download className="text-accent font-semibold underline">
              Download the PDF
            </a>
            . Questions go to{" "}
            <a href="mailto:info@edquityatthemargins.org" className="text-accent font-semibold underline">
              info@edquityatthemargins.org
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
