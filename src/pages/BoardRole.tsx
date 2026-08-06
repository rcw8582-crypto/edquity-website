import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import NotFound from "@/pages/not-found";
import {
  initialRoles, fetchRoles, roleBySlug, sharedFor,
  type RolesSnapshot, type BoardRole, type RoleShared,
} from "@/content/board-roles";

/**
 * One position description, rendered as HTML.
 *
 * Every word comes from the portal, where Reba edits each section. The page
 * previously embedded a PDF, which showed some visitors a black rectangle and
 * gave a phone nothing worth reading. Real markup also means a search engine
 * and a screen reader get the content instead of a binary attachment.
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-8 mt-8">
      <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
          <CheckCircle2 size={19} className="text-accent shrink-0 mt-1" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RoleBody({ role, shared }: { role: BoardRole; shared?: RoleShared }) {
  const who = role.kind === "director" ? "director" : "council member";
  return (
    <>
      <Section title="Purpose of the position">
        <p className="text-muted-foreground text-lg leading-relaxed">{role.purpose}</p>
      </Section>

      <Section title="Responsibilities of this position">
        <Bullets items={role.responsibilities} />
      </Section>

      {shared && shared.shared_responsibilities.length > 0 && (
        <Section title={`Responsibilities shared by every ${who}`}>
          <Bullets items={shared.shared_responsibilities} />
        </Section>
      )}

      <Section title="Required qualifications">
        <Bullets items={role.required} />
      </Section>

      {role.preferred.length > 0 && (
        <Section title="Preferred qualifications">
          <Bullets items={role.preferred} />
        </Section>
      )}

      {shared && (
        <Section title="Time commitment">
          <Bullets items={shared.time_commitment} />
          {role.additional_commitment && (
            <p className="text-muted-foreground leading-relaxed mt-5">{role.additional_commitment}</p>
          )}
        </Section>
      )}

      {shared && (
        <Section title="Reports to">
          <p className="text-muted-foreground leading-relaxed">{shared.reports_to}</p>
        </Section>
      )}

      {shared && (
        <Section title="Term">
          <p className="text-muted-foreground leading-relaxed">{shared.term}</p>
        </Section>
      )}

      {shared && (
        <Section title="Scope of the role">
          <p className="text-muted-foreground leading-relaxed">{shared.boundary}</p>
          {shared.governance_note && (
            <p className="text-muted-foreground leading-relaxed mt-4">{shared.governance_note}</p>
          )}
        </Section>
      )}

      {shared && (
        <Section title="Compensation">
          <p className="text-muted-foreground leading-relaxed">{shared.compensation}</p>
        </Section>
      )}

      {shared && shared.provided.length > 0 && (
        <Section title="What we provide">
          <Bullets items={shared.provided} />
        </Section>
      )}
    </>
  );
}

export default function BoardRole() {
  const [, params] = useRoute("/board/roles/:slug");
  const [snapshot, setSnapshot] = useState<RolesSnapshot | null>(initialRoles());

  useEffect(() => {
    let live = true;
    fetchRoles().then((fresh) => {
      if (live && fresh.roles.length > 0) setSnapshot(fresh);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!params?.slug) return <NotFound />;

  const role = snapshot ? roleBySlug(snapshot, params.slug) : undefined;

  // Nothing loaded yet on a cold client navigation. A spinner beats a 404 the
  // reader has to back out of.
  if (!snapshot) {
    return (
      <div className="pt-20 min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
        <span className="sr-only">Loading the position description</span>
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (!role) return <NotFound />;

  const shared = sharedFor(snapshot, role.kind);
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
                  role.status === "open" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                }`}
                data-testid="role-status"
              >
                {role.status === "open" ? "Recruiting now" : "Seat filled"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{role.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">{role.summary}</p>

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
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <article className="max-w-3xl" data-testid="role-body">
            <p className="text-muted-foreground leading-relaxed">
              EDquity at the Margins is a Tennessee nonprofit corporation and an IRS-recognized 501(c)(3) public charity, EIN 42-2295582. We review IEPs for families who cannot afford an advocate and we deliver free workshops on parent rights. Every family service is free.
            </p>

            <RoleBody role={role} shared={shared} />

            <Section title="How to apply">
              <p className="text-muted-foreground leading-relaxed mb-5">
                One application covers the board and the advisory council. Questions go to{" "}
                <a href="mailto:info@edquityatthemargins.org" className="text-accent font-semibold underline">
                  info@edquityatthemargins.org
                </a>
                .
              </p>
              <Link
                href="/board"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold rounded-full px-6 py-3 text-sm hover:bg-primary/90 transition-colors"
              >
                Go to the application
              </Link>
            </Section>
          </article>
        </div>
      </section>
    </div>
  );
}
