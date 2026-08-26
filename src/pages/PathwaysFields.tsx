/**
 * /pathways/explore/fields and /pathways/explore/fields/:code
 *
 * The second door. Fourteen fields of related work, grouped the way O*NET
 * groups them, then every career inside one. This is the path for a student who
 * will not start a quiz but will happily open "Construction" to see what is in
 * there.
 */

import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Loader2, TrendingUp } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import PathwaysShell from "@/components/pathways/PathwaysShell";
import {
  fetchCluster,
  fetchClusters,
  type CareerList,
  type Cluster,
  UNAVAILABLE,
} from "@/lib/pathways";

export default function PathwaysFields() {
  const [, params] = useRoute("/pathways/explore/fields/:code");
  const code = params?.code ?? "";

  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [field, setField] = useState<{ title: string; overview: string; list: CareerList } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchClusters()
      .then((list) => {
        if (!cancelled) setClusters(list);
      })
      .catch(() => {
        if (!cancelled) setError(UNAVAILABLE);
      })
      .finally(() => {
        if (!cancelled && !code) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  useEffect(() => {
    if (!code) {
      setField(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchCluster(code)
      .then((result) => {
        if (!cancelled) setField(result);
      })
      .catch(() => {
        if (!cancelled) setError(UNAVAILABLE);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const groupings = Array.from(new Set(clusters.map((c) => c.grouping).filter(Boolean)));
  const fallbackTitle = clusters.find((c) => c.code === code)?.title ?? "";

  const bar = code ? (
    <Link href="/pathways/explore/fields" className="pw-back">
      <ArrowLeft size={16} aria-hidden="true" /> All fields
    </Link>
  ) : (
    <Link href="/pathways/explore" className="pw-back">
      <ArrowLeft size={16} aria-hidden="true" /> Start
    </Link>
  );

  return (
    <div className="pt-20">
      <PageMeta
        title={code && (field?.title || fallbackTitle) ? `Careers in ${field?.title || fallbackTitle}` : "Career Fields"}
        description="Browse careers by field. Fourteen groups of related work, from construction and agriculture to healthcare and digital technology, with real pay and training information for every career inside."
      />

      <PathwaysShell wide bar={bar}>
        {error && (
          <div className="pw-notice">
            <p className="pw-error" role="alert" style={{ margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        {!code && (
          <>
            <h1>Browse by field</h1>
            <p className="pw-lede">
              Every career belongs to a field of related work. Open one that sounds interesting and
              see what is inside it.
            </p>

            {loading && clusters.length === 0 && (
              <p className="pw-status" role="status">
                <Loader2 size={16} className="inline animate-spin" style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
                Loading the fields.
              </p>
            )}

            {groupings.map((grouping) => (
              <div key={grouping} style={{ marginTop: 30 }}>
                <p className="pw-eyebrow" style={{ marginBottom: 12 }}>
                  {grouping}
                </p>
                <ul className="pw-cards">
                  {clusters
                    .filter((cluster) => cluster.grouping === grouping)
                    .map((cluster) => (
                      <li key={cluster.code}>
                        <Link href={`/pathways/explore/fields/${cluster.code}`} className="pw-cardbtn">
                          <b>{cluster.title}</b>
                          <em>See the careers</em>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </>
        )}

        {code && (
          <>
            {loading && !field && (
              <p className="pw-status" role="status">
                <Loader2 size={16} className="inline animate-spin" style={{ marginRight: 8, verticalAlign: "-3px" }} aria-hidden="true" />
                Opening that field.
              </p>
            )}

            {field && (
              <>
                <h1>{field.title || fallbackTitle}</h1>
                {field.overview && <p className="pw-lede">{field.overview}</p>}
                <p className="pw-fine" aria-live="polite">
                  {field.list.total > field.list.careers.length
                    ? `Showing ${field.list.careers.length} of ${field.list.total} careers in this field.`
                    : `${field.list.careers.length} career${field.list.careers.length === 1 ? "" : "s"} in this field.`}
                </p>
                <ul className="pw-cards">
                  {field.list.careers.map((item) => (
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
          </>
        )}
      </PathwaysShell>
    </div>
  );
}
