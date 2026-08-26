/**
 * /pathways/explore/search — the third door.
 *
 * The search term lives in the URL as ?q=, so a result page can be bookmarked,
 * shared with a parent, and reached again by the back button after a student
 * opens a career and returns.
 */

import { useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ArrowLeft, Loader2, Search, TrendingUp } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import PathwaysShell from "@/components/pathways/PathwaysShell";
import { NoData, searchCareers, type CareerList, UNAVAILABLE } from "@/lib/pathways";

export default function PathwaysSearch() {
  const search = useSearch();
  const [, navigate] = useLocation();

  const query = new URLSearchParams(search).get("q") ?? "";
  const [field, setField] = useState(query);
  const [results, setResults] = useState<CareerList | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setField(query), [query]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults(null);
      setError("");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    searchCareers(term)
      .then((list) => {
        if (!cancelled) setResults(list);
      })
      .catch((reason) => {
        if (cancelled) return;
        // No hits is an answer, not a failure.
        if (reason instanceof NoData) setResults({ careers: [], total: 0 });
        else setError(UNAVAILABLE);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const term = field.trim();
    if (term.length < 2) {
      setError("Type at least two letters.");
      return;
    }
    navigate(`/pathways/explore/search?q=${encodeURIComponent(term)}`);
  };

  const bar = (
    <Link href="/pathways/explore" className="pw-back">
      <ArrowLeft size={16} aria-hidden="true" /> Start
    </Link>
  );

  return (
    <div className="pt-20">
      <PageMeta
        title="Search Careers"
        description="Search hundreds of careers by job title or by something you are good at, and see what the work involves, what it pays, and how much school or training it needs."
      />

      <PathwaysShell wide bar={bar}>
        <h1>Search a job</h1>
        <p className="pw-lede">
          Type a job title, a subject you like, or something you are good at. Nurse, animals,
          building things, video games, helping people.
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "20px 0 8px" }}>
          <label htmlFor="pw-q" className="sr-only">
            Search careers
          </label>
          <input
            id="pw-q"
            value={field}
            onChange={(event) => setField(event.target.value)}
            placeholder="veterinarian"
            autoComplete="off"
            style={{
              flex: "1 1 260px",
              minWidth: 0,
              background: "var(--pw-card)",
              border: "2px solid var(--pw-edge)",
              borderRadius: 999,
              color: "var(--pw-ink)",
              font: "inherit",
              fontSize: 16.5,
              fontWeight: 700,
              padding: "13px 20px",
            }}
          />
          <button type="submit" className="pw-cta" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="inline animate-spin" style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
                Searching
              </>
            ) : (
              <>
                <Search size={16} style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
                Search
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="pw-error" role="alert">
            {error}
          </p>
        )}

        {results && (
          <>
            <p className="pw-fine" aria-live="polite" style={{ marginTop: 18 }}>
              {results.careers.length === 0
                ? `Nothing found for "${query}". Try a different word.`
                : results.total > results.careers.length
                  ? `Showing ${results.careers.length} of ${results.total} careers for "${query}".`
                  : `${results.careers.length} career${results.careers.length === 1 ? "" : "s"} for "${query}".`}
            </p>
            <ul className="pw-cards">
              {results.careers.map((item) => (
                <li key={item.code}>
                  <Link href={`/pathways/explore/careers/${item.code}`} className="pw-cardbtn">
                    <b>{item.title}</b>
                    {item.growing && (
                      <span className="pw-tags">
                        <span className="pw-tag pw-tag-grow">
                          <TrendingUp size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} aria-hidden="true" />
                          Hiring more
                        </span>
                      </span>
                    )}
                    <em>Open this career</em>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {!results && !loading && (
          <div className="pw-notice">
            <h3>Not sure what to type?</h3>
            <p className="pw-fine" style={{ marginBottom: 14 }}>
              Two other ways in: answer some questions about what you like, or open a field of work
              and look around.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link href="/pathways/explore/questions" className="pw-cta" style={{ textDecoration: "none" }}>
                Answer some questions
              </Link>
              <Link href="/pathways/explore/fields" className="pw-ghost" style={{ textDecoration: "none" }}>
                Browse by field
              </Link>
            </div>
          </div>
        )}
      </PathwaysShell>
    </div>
  );
}
