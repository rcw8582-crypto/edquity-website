import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageMeta from "@/components/PageMeta";
import { getPostBySlug } from "@/lib/posts";

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

export default function NewsPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-6">
        <PageMeta
          title="Article Not Found"
          description="The article you are looking for could not be found."
        />
        <h1 className="text-3xl font-bold text-primary">Article not found.</h1>
        <Link href="/news">
          <Button className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full">
            Back to News
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <PageMeta title={post.title} description={post.excerpt} />

      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link href="/news" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to News
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>
              <Tag size={11} className="inline mr-1" />
              {post.category}
            </span>
            <span className="text-primary-foreground/60 text-sm">{post.readTime}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold leading-tight mb-6"
          >
            {post.title}
          </motion.h1>
          <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
            <Calendar size={15} />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-12 relative z-10">
        <div className="rounded-2xl overflow-hidden shadow-lg h-72 md:h-96">
          <img
            src={NEWS_IMAGES[(post.id - 1) % NEWS_IMAGES.length]}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xl text-primary font-medium leading-relaxed mb-10 border-l-4 border-accent pl-5 py-2">
              {post.excerpt}
            </p>
            <div
              className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-ul:my-6 prose-ol:my-6 prose-li:text-muted-foreground prose-li:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>

          <div className="mt-16 pt-10 border-t border-border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Link href="/news">
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <ArrowLeft size={16} className="mr-2" /> Back to News
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full px-8">
                Book a Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
