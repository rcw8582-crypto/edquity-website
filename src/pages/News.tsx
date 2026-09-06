import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";
import { Calendar, ArrowRight, Tag, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllPublishedPosts, type BlogPost } from "@/lib/posts";
import { formatPostDate } from "@/lib/date";

const categoryColors: Record<string, string> = {
  Education: "bg-blue-100 text-blue-800",
  Advocacy: "bg-green-100 text-green-800",
  Policy: "bg-purple-100 text-purple-800",
  Community: "bg-orange-100 text-orange-800",
  Events: "bg-pink-100 text-pink-800",
};

const NEWS_IMAGES = [
  "/images/news-1.png",
  "/images/news-2.png",
  "/images/news-3.png",
  "/images/news-4.png",
  "/images/news-5.png",
  "/images/news-6.png",
];

export default function News() {
  const posts: BlogPost[] = getAllPublishedPosts();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  // Categories that actually appear in published posts, so the filter row
  // never offers an empty result.
  const categories = useMemo(() => {
    const seen = new Set<string>();
    posts.forEach((p) => seen.add(p.category));
    return ["All", ...Array.from(seen).sort()];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeCategory !== "All" && post.category !== activeCategory) return false;
      if (q && !`${post.title} ${post.excerpt}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, activeCategory, query]);

  const isFiltering = activeCategory !== "All" || query.trim() !== "";

  return (
    <div className="pt-20">
      <PageMeta
        title="In the Margins"
        description="Resources, advocacy guidance, and updates from EDquity at the Margins on special education law, IEP rights, and the families doing this work."
      />
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">In the Margins</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Resources, advocacy guidance, and updates from our team on special education law, IEP rights, and the families doing this work.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-2">No posts published yet.</p>
              <p className="text-muted-foreground text-sm">Check back soon for updates, resources, and advocacy guidance.</p>
            </div>
          ) : (
            <>
              {/* Search and category filters, above the cards so they govern
                  the whole list as it grows. */}
              <div className="flex flex-col gap-4 mb-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts by category">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white text-primary border-border hover:border-primary"
                      }`}
                      aria-pressed={activeCategory === cat}
                      data-testid={`news-filter-${cat.toLowerCase()}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full lg:w-72">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <label htmlFor="news-search" className="sr-only">Search posts</label>
                  <input
                    id="news-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts…"
                    className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-primary outline-none focus:border-primary"
                    data-testid="news-search"
                  />
                </div>
              </div>

              <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-12 lg:items-start">
                {/* Article cards */}
                <div>
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border rounded-2xl">
                      <p className="text-muted-foreground text-lg mb-4">No posts match that filter.</p>
                      <button
                        onClick={() => { setActiveCategory("All"); setQuery(""); }}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
                        data-testid="news-clear-filters"
                      >
                        <X size={14} aria-hidden="true" /> Clear filters
                      </button>
                    </div>
                  ) : (
                    <>
                      {isFiltering && (
                        <p className="text-sm text-muted-foreground mb-6" aria-live="polite">
                          Showing {filteredPosts.length} of {posts.length} posts
                        </p>
                      )}
                      <div className="grid md:grid-cols-2 gap-8">
                        {filteredPosts.map((post, idx) => (
                          <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: Math.min(idx, 4) * 0.08 }}
                            className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                            data-testid={`article-card-${post.id}`}
                          >
                            <div className="h-48 overflow-hidden">
                              <img
                                src={NEWS_IMAGES[idx % NEWS_IMAGES.length]}
                                alt=""
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>
                                  <Tag size={11} className="inline mr-1" />
                                  {post.category}
                                </span>
                                <span className="text-xs text-muted-foreground">{post.readTime}</span>
                              </div>
                              <h2 className="text-xl font-bold text-primary mb-3 leading-snug">{post.title}</h2>
                              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{post.excerpt}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar size={14} />
                                  <span>{formatPostDate(post.publishedAt || post.createdAt)}</span>
                                </div>
                                <Link
                                  href={`/news/${post.slug}`}
                                  className="text-accent-ink font-semibold text-sm flex items-center gap-1 hover:underline"
                                  data-testid={`article-read-more-${post.id}`}
                                >
                                  Read more <ArrowRight size={14} />
                                </Link>
                              </div>
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Every published post by title, so readers can scan the whole
                    archive and jump straight to one. Sticky on desktop; on
                    phones it follows the cards instead of pushing them down. */}
                <aside className="mt-14 lg:mt-0 lg:sticky lg:top-28" aria-label="All posts">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">All Posts</h2>
                  <nav className="border border-border rounded-2xl divide-y divide-border overflow-y-auto lg:max-h-[70vh]">
                    {posts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/news/${post.slug}`}
                        className="block px-4 py-3 hover:bg-muted/60 transition-colors"
                        data-testid={`sidebar-post-${post.id}`}
                      >
                        <span className="block text-sm font-semibold text-primary leading-snug">{post.title}</span>
                        <span className="block text-xs text-muted-foreground mt-1">
                          {formatPostDate(post.publishedAt || post.createdAt)} · {post.category}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </aside>
              </div>
            </>
          )}

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">Want updates delivered to your inbox?</p>
            <Link href="/volunteer">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full px-8" data-testid="news-subscribe-cta">
                Subscribe to Our Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
