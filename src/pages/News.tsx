import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

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

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function News() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-20">
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">News & Updates</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Resources, advocacy guidance, and updates from our team on special education law, IEP rights, and the families doing this work.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-border rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-2">No posts published yet.</p>
              <p className="text-muted-foreground text-sm">Check back soon for updates, resources, and advocacy guidance.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  data-testid={`article-card-${post.id}`}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={NEWS_IMAGES[idx % NEWS_IMAGES.length]}
                      alt=""
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
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </div>
                      <Link
                        href={`/news/${post.slug}`}
                        className="text-accent font-semibold text-sm flex items-center gap-1 hover:underline"
                        data-testid={`article-read-more-${post.id}`}
                      >
                        Read more <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">Want updates delivered to your inbox?</p>
            <Link href="/volunteer">
              <Button className="bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full px-8" data-testid="news-subscribe-cta">
                Subscribe to Our Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
