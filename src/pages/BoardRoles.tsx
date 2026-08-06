import { Link } from "wouter";
import { FileText } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { useState, useEffect } from "react";
import { initialRoles, fetchRoles, type BoardRole, type RolesSnapshot } from "@/content/board-roles";

/**
 * The permanent index of every position description.
 *
 * Filled roles stay listed. A description that disappears the moment a seat
 * is taken has to be written again the next time the seat turns over, which
 * is the thing this bank exists to prevent.
 */
function RoleCard({ role }: { role: BoardRole }) {
  return (
    <Link
      href={`/board/roles/${role.slug}`}
      className="block bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-accent/40 transition-all"
      data-testid={`role-card-${role.slug}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="bg-muted w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
          <FileText size={22} className="text-accent" aria-hidden="true" />
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
            role.status === "open"
              ? "bg-accent/15 text-accent-ink"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {role.status === "open" ? "Recruiting now" : "Seat filled"}
        </span>
      </div>
      <h3 className="text-lg font-bold text-primary mb-2 leading-snug">{role.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{role.summary}</p>
    </Link>
  );
}

export default function BoardRoles() {
  const [snapshot, setSnapshot] = useState<RolesSnapshot | null>(initialRoles());

  useEffect(() => {
    let live = true;
    fetchRoles().then((fresh) => {
      if (live && fresh.roles.length > 0) setSnapshot(fresh);
    });
    return () => { live = false; };
  }, []);

  const roles = snapshot?.roles ?? [];
  const directors = roles.filter((role) => role.kind === "director");
  const advisors = roles.filter((role) => role.kind === "advisory");

  return (
    <div className="pt-20">
      <PageMeta
        title="Board and Advisory Council Position Descriptions"
        description="Position descriptions for every board and advisory council role at EDquity at the Margins, covering purpose, responsibilities, qualifications, and time commitment."
      />

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Position Descriptions</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-4">
              Every board and advisory council role carries a written position description. Each one states the purpose of the seat, the responsibilities, the qualifications, and the time commitment.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Descriptions stay published whether or not the seat is open.{" "}
              <Link href="/board" className="text-accent-ink font-semibold underline">
                See which seats we are recruiting for now
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 className="text-2xl font-bold text-primary mb-6">Board of Directors</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {directors.map((role) => (
              <RoleCard key={role.slug} role={role} />
            ))}
          </div>

          <h2 className="text-2xl font-bold text-primary mb-6">Advisory Council</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {advisors.map((role) => (
              <RoleCard key={role.slug} role={role} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
