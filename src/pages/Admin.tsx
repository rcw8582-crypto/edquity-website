import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Pencil, Trash2, Eye, EyeOff, LogOut, Mail, Users, FileText, XCircle, ClipboardList, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "edquity_admin_key";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

interface ContactSub {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: string;
}

interface VolunteerSub {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  interest: string;
  message: string | null;
  createdAt: string;
}

interface IntakeSub {
  id: number;
  parentName: string;
  email: string;
  phone: string;
  childFirstName: string;
  childGrade: string;
  schoolDistrict: string;
  state: string;
  serviceInterest: string;
  situation: string;
  createdAt: string;
}

interface NewsletterSub {
  id: number;
  email: string;
  firstName: string | null;
  subscribedAt: string;
  active: boolean;
}

const CATEGORIES = ["Education", "Advocacy", "Policy", "Community", "Events"];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function apiHeaders(key: string) {
  return { "Content-Type": "application/json", "x-admin-key": key };
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Education",
  readTime: "5 min read",
  published: false,
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [keyInput, setKeyInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authed, setAuthed] = useState(false);

  const [tab, setTab] = useState<"posts" | "contact" | "volunteer" | "intake" | "newsletter">("posts");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [contactSubs, setContactSubs] = useState<ContactSub[]>([]);
  const [volunteerSubs, setVolunteerSubs] = useState<VolunteerSub[]>([]);
  const [intakeSubs, setIntakeSubs] = useState<IntakeSub[]>([]);
  const [newsletterSubs, setNewsletterSubs] = useState<NewsletterSub[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fetchPosts = useCallback(async (key: string) => {
    const r = await fetch("/api/admin/posts", { headers: { "x-admin-key": key } });
    if (r.status === 401) return null;
    return r.json() as Promise<BlogPost[]>;
  }, []);

  const verifyAndLoad = async (key: string) => {
    setLoading(true);
    const data = await fetchPosts(key);
    setLoading(false);
    if (!data) {
      setAuthError("Incorrect admin password.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, key);
    setAdminKey(key);
    setAuthed(true);
    setPosts(data);
  };

  useEffect(() => {
    if (adminKey) verifyAndLoad(adminKey);
  }, []);

  const loadTab = async (t: "posts" | "contact" | "volunteer" | "intake" | "newsletter") => {
    setTab(t);
    if (t === "posts") {
      const data = await fetchPosts(adminKey);
      if (data) setPosts(data);
    } else if (t === "contact") {
      const r = await fetch("/api/admin/submissions/contact", { headers: { "x-admin-key": adminKey } });
      if (r.ok) setContactSubs(await r.json());
    } else if (t === "volunteer") {
      const r = await fetch("/api/admin/submissions/volunteer", { headers: { "x-admin-key": adminKey } });
      if (r.ok) setVolunteerSubs(await r.json());
    } else if (t === "intake") {
      const r = await fetch("/api/admin/submissions/intake", { headers: { "x-admin-key": adminKey } });
      if (r.ok) setIntakeSubs(await r.json());
    } else if (t === "newsletter") {
      const r = await fetch("/api/admin/newsletter", { headers: { "x-admin-key": adminKey } });
      if (r.ok) setNewsletterSubs(await r.json());
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setCreating(true);
    setEditing(null);
    setSaveError("");
  };

  const openEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      readTime: post.readTime,
      published: post.published,
    });
    setEditing(post);
    setCreating(false);
    setSaveError("");
  };

  const handleFormChange = (field: string, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && typeof value === "string" && !editing) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const savePost = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const url = editing ? `/api/admin/posts/${editing.id}` : "/api/admin/posts";
      const method = editing ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: apiHeaders(adminKey),
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const err = await r.json();
        setSaveError(err.error || "Save failed");
        return;
      }
      const updated = await fetchPosts(adminKey);
      if (updated) setPosts(updated);
      setEditing(null);
      setCreating(false);
    } catch {
      setSaveError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    const updated = await fetchPosts(adminKey);
    if (updated) setPosts(updated);
  };

  const togglePublish = async (post: BlogPost) => {
    await fetch(`/api/admin/posts/${post.id}`, {
      method: "PUT",
      headers: apiHeaders(adminKey),
      body: JSON.stringify({ published: !post.published }),
    });
    const updated = await fetchPosts(adminKey);
    if (updated) setPosts(updated);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAdminKey("");
    setAuthed(false);
    setEditing(null);
    setCreating(false);
  };

  if (!authed) {
    return (
      <div className="pt-20 min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-2xl p-10 w-full max-w-md shadow-sm"
        >
          <h1 className="text-2xl font-bold text-primary mb-2">Admin Access</h1>
          <p className="text-muted-foreground text-sm mb-8">Enter your admin password to continue.</p>
          {authError && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
              <XCircle size={16} /> {authError}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyAndLoad(keyInput);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="admin-key">Admin Password</Label>
              <Input
                id="admin-key"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter password"
                required
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full"
              disabled={loading}
            >
              {loading ? "Verifying…" : "Sign In"}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const showForm = creating || editing;

  return (
    <div className="pt-20 min-h-screen bg-muted/30">
      <div className="bg-primary text-primary-foreground py-6 px-4 md:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">EDquity Admin</h1>
            <p className="text-primary-foreground/70 text-sm">Manage blog posts and view inquiries</p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10 rounded-full gap-2"
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex gap-2 mb-8 bg-white border border-border rounded-xl p-1 w-fit">
          {(
            [
              { key: "posts", label: "Blog Posts", icon: <FileText size={15} /> },
              { key: "contact", label: "Contact Inquiries", icon: <Mail size={15} /> },
              { key: "volunteer", label: "Volunteer Applications", icon: <Users size={15} /> },
              { key: "intake", label: "Intake Forms", icon: <ClipboardList size={15} /> },
              { key: "newsletter", label: "Newsletter", icon: <Bell size={15} /> },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => loadTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "posts" && (
          <div>
            {!showForm && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">
                  {posts.length} {posts.length === 1 ? "Post" : "Posts"}
                </h2>
                <Button onClick={openCreate} className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full gap-2">
                  <PlusCircle size={16} /> New Post
                </Button>
              </div>
            )}

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-border rounded-2xl p-8 mb-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary">
                    {creating ? "New Post" : `Editing: ${editing?.title}`}
                  </h2>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setCreating(false);
                      setEditing(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                {saveError && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
                    {saveError}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => handleFormChange("title", e.target.value)}
                      placeholder="Post title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug (URL path)</Label>
                    <Input
                      value={form.slug}
                      onChange={(e) => handleFormChange("slug", e.target.value)}
                      placeholder="post-url-slug"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                      value={form.category}
                      onChange={(e) => handleFormChange("category", e.target.value)}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Read Time</Label>
                    <Input
                      value={form.readTime}
                      onChange={(e) => handleFormChange("readTime", e.target.value)}
                      placeholder="5 min read"
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <Label>Excerpt (shown on news index)</Label>
                  <Textarea
                    value={form.excerpt}
                    onChange={(e) => handleFormChange("excerpt", e.target.value)}
                    rows={3}
                    placeholder="Brief summary shown on the News page…"
                  />
                </div>
                <div className="space-y-2 mb-6">
                  <Label>Content (separate paragraphs with a blank line)</Label>
                  <Textarea
                    value={form.content}
                    onChange={(e) => handleFormChange("content", e.target.value)}
                    rows={14}
                    placeholder="Write your full article here. Separate paragraphs with a blank line between them."
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex items-center gap-3 mb-8">
                  <input
                    type="checkbox"
                    id="published"
                    checked={form.published}
                    onChange={(e) => handleFormChange("published", e.target.checked)}
                    className="w-4 h-4 accent-green-500"
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    Publish immediately (visible on the News page)
                  </Label>
                </div>
                <Button
                  onClick={savePost}
                  disabled={saving || !form.title || !form.slug || !form.excerpt}
                  className="bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full px-8"
                >
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create Post"}
                </Button>
              </motion.div>
            )}

            {!showForm && (
              <div className="space-y-3">
                {posts.length === 0 && (
                  <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
                    No posts yet. Create your first post above.
                  </div>
                )}
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border border-border rounded-xl px-6 py-4 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-primary truncate">{post.title}</span>
                        {post.published ? (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium shrink-0">
                            Published
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium shrink-0">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {post.category} · /news/{post.slug} · {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublish(post)}
                        className="rounded-full gap-1 text-xs"
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published ? <EyeOff size={13} /> : <Eye size={13} />}
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(post)}
                        className="rounded-full gap-1 text-xs"
                      >
                        <Pencil size={13} /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deletePost(post.id)}
                        className="rounded-full gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 size={13} /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "contact" && (
          <div>
            <h2 className="text-xl font-bold text-primary mb-6">
              {contactSubs.length} Contact {contactSubs.length === 1 ? "Inquiry" : "Inquiries"}
            </h2>
            {contactSubs.length === 0 ? (
              <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
                No contact submissions yet.
              </div>
            ) : (
              <div className="space-y-4">
                {contactSubs.map((sub) => (
                  <div key={sub.id} className="bg-white border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-primary">{sub.name}</p>
                        <a href={`mailto:${sub.email}`} className="text-accent text-sm hover:underline">
                          {sub.email}
                        </a>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</span>
                    </div>
                    {sub.subject && (
                      <p className="text-sm font-medium text-primary mb-2">{sub.subject}</p>
                    )}
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                    <div className="mt-4">
                      <a href={`mailto:${sub.email}?subject=Re: ${sub.subject || "Your inquiry"}`}>
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full gap-2 text-xs">
                          <Mail size={12} /> Reply
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "volunteer" && (
          <div>
            <h2 className="text-xl font-bold text-primary mb-6">
              {volunteerSubs.length} Volunteer {volunteerSubs.length === 1 ? "Application" : "Applications"}
            </h2>
            {volunteerSubs.length === 0 ? (
              <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
                No volunteer applications yet.
              </div>
            ) : (
              <div className="space-y-4">
                {volunteerSubs.map((sub) => (
                  <div key={sub.id} className="bg-white border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-primary">
                          {sub.firstName} {sub.lastName}
                        </p>
                        <a href={`mailto:${sub.email}`} className="text-accent text-sm hover:underline">
                          {sub.email}
                        </a>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</span>
                    </div>
                    <p className="text-sm font-medium text-primary mb-2">Interest: {sub.interest}</p>
                    {sub.message && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                    )}
                    <div className="mt-4">
                      <a href={`mailto:${sub.email}?subject=Your volunteer application`}>
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full gap-2 text-xs">
                          <Mail size={12} /> Reply
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === "intake" && (
          <div>
            <h2 className="text-xl font-bold text-primary mb-6">
              {intakeSubs.length} Intake {intakeSubs.length === 1 ? "Submission" : "Submissions"}
            </h2>
            {intakeSubs.length === 0 ? (
              <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
                No intake submissions yet.
              </div>
            ) : (
              <div className="space-y-4">
                {intakeSubs.map((sub) => (
                  <div key={sub.id} className="bg-white border border-border rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-primary">{sub.parentName}</p>
                        <a href={`mailto:${sub.email}`} className="text-accent text-sm hover:underline">{sub.email}</a>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(sub.createdAt)}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm mb-3">
                      <span className="text-muted-foreground">Child: <span className="font-medium text-primary">{sub.childFirstName}</span></span>
                      <span className="text-muted-foreground">Grade: <span className="font-medium text-primary">{sub.childGrade}</span></span>
                      <span className="text-muted-foreground">State: <span className="font-medium text-primary">{sub.state}</span></span>
                      <span className="text-muted-foreground">District: <span className="font-medium text-primary">{sub.schoolDistrict}</span></span>
                      <span className="text-muted-foreground col-span-2">Service: <span className="font-medium text-primary">{sub.serviceInterest}</span></span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap border-t border-border pt-3">{sub.situation}</p>
                    <div className="mt-4 flex gap-2">
                      <a href={`mailto:${sub.email}?subject=Your EDquity Intake Form`}>
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full gap-2 text-xs">
                          <Mail size={12} /> Reply
                        </Button>
                      </a>
                      <a href={`tel:${sub.phone}`}>
                        <Button size="sm" variant="outline" className="rounded-full text-xs">
                          {sub.phone}
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "newsletter" && (
          <div>
            <h2 className="text-xl font-bold text-primary mb-6">
              {newsletterSubs.length} Newsletter {newsletterSubs.length === 1 ? "Subscriber" : "Subscribers"}
            </h2>
            {newsletterSubs.length === 0 ? (
              <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
                No newsletter subscribers yet.
              </div>
            ) : (
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-6 py-3 font-semibold text-primary">Email</th>
                      <th className="text-left px-6 py-3 font-semibold text-primary">Name</th>
                      <th className="text-left px-6 py-3 font-semibold text-primary">Subscribed</th>
                      <th className="text-left px-6 py-3 font-semibold text-primary">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsletterSubs.map((sub) => (
                      <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                        <td className="px-6 py-3">
                          <a href={`mailto:${sub.email}`} className="text-accent hover:underline font-medium">{sub.email}</a>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">{sub.firstName || "-"}</td>
                        <td className="px-6 py-3 text-muted-foreground">{formatDate(sub.subscribedAt)}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${sub.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                            {sub.active ? "Active" : "Unsubscribed"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
