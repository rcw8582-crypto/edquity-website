/**
 * RelatedPosts
 *
 * Renders up to three cards linking to other blog posts. Used at
 * the bottom of an individual post page. Hidden entirely when no
 * related posts exist (single-post blog or first-post case).
 *
 * Card visual style mirrors the News listing cards so a reader who
 * came from /news recognizes them.
 */

import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { getRelatedPosts, type BlogPost } from "@/lib/posts";

const NEWS_IMAGES = [
  "/images/news-1.png",
  "/images/news-2.png",
  "/images/news-3.png",
  "/images/news-4.png",
  "/images/news-5.png",
  "/images/news-6.png",
];

const categoryColors: Record<string, string> = {
  Education: "bg-blue-100 text-blue-800",
  Advocacy: "bg-green-100 text-green-800",
  Policy: "bg-purple-100 text-purple-800",
  Community: "bg-orange-100 text-orange-800",
  Events: "bg-pink-100 text-pink-800",
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface RelatedPostsProps {
  currentSlug: string;
  count?: number;
}

export default function RelatedPosts({ currentSlug, count = 3 }: RelatedPostsProps) {
  const related: BlogPost[] = getRelatedPosts(currentSlug, count);
  if (related.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="mb-10">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Keep reading</p>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Related articles</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((post, idx) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <Link
                href={`/news/${post.slug}`}
                className="block h-48 overflow-hidden"
                aria-label={`Read ${post.title}`}
              >
                <img
                  src={NEWS_IMAGES[(post.id - 1) % NEWS_IMAGES.length]}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      categoryColors[post.category] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Tag size={11} className="inline mr-1" aria-hidden="true" />
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2 leading-snug">
                  <Link
                    href={`/news/${post.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} aria-hidden="true" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </span>
                  <Link
                    href={`/news/${post.slug}`}
                    className="inline-flex items-center gap-1 text-accent font-semibold hover:gap-2 transition-all"
                  >
                    Read
                    <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
