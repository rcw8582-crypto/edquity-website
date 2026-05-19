import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Pencil, Trash2, Eye, EyeOff, LogOut, Mail, Users, FileText, CheckCircle2, XCircle, ClipboardList, Bell, Gift, Ban, Copy } from "lucide-react";
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

interface ScholarshipApp {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  childFirstName: string;
  childAge: string;
  school: string;
  district: string;
  state: string;
  situation: string;
  criteriaSelectedJson: string;
  status: string;
  scholarshipCode: string | null;
  adminNotes: string;
  submittedAt: string;
  reviewedAt: string | null;
}

interface SubsidyCode {
  id: number;
  code: string;
  familyName: string;
  familyEmail: string;
  discountPct: number;
  criteriaMetJson: string;
  adminNotes: string;
  issuedAt: string;
  expiresAt: string | null;
  usedAt: string | null;
  active: boolean;
}

const SUBSIDY_CRITERIA = [
  { id: "income_200pct", label: "Income at or below 200% of the Federal Poverty Level" },
  { id: "public_assistance", label: "Receiving public assistance (SNAP, Medicaid/CHIP, WIC, TANF, or housing assistance)" },
  { id: "single_parent", label: "Single-parent or single-guardian household" },
  { id: "foster_care", label: "Child in foster care, adopted from foster care, or in kinship placement" },
  { id: "hardship", label: "Significant hardship in the past 12 months (job loss, medical crisis, natural disaster, or domestic violence)" },
  { id: "language_barrier", label: "Non-English primary home language with limited access to language-appropriate advocacy resources" },
  { id: "rural", label: "Rural or tribal community with limited local special education support" },
  { id: "urgent", label: "Child facing a time-sensitive IEP crisis requiring immediate support" },
];

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

  const [tab, setTab] = useState<"posts" | "contact" | "volunteer" | "intake" | "newsletter" | "subsidy" | "scholarship_apps">("posts");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [contactSubs, setContactSubs] = useState<ContactSub[]>([]);
  const [volunteerSubs, setVolunteerSubs] = useState<VolunteerSub[]>([]);
  const [intakeSubs, setIntakeSubs] = useState<IntakeSub[]>([]);
  const [newsletterSubs, setNewsletterSubs] = useState<NewsletterSub[]>([]);
  const [subsidyCodes, setSubsidyCodes] = useState<SubsidyCode[]>([]);
  const [scholarshipApps, setScholarshipApps] = useState<ScholarshipApp[]>([]);
  const [decidingAppId, setDecidingAppId] = useState<number | null>(null);
  const [decideForm, setDecideForm] = useState<{ decision: string; adminNotes: string }>({ decision: "approved_full", adminNotes: "" });
  const [decideSaving, setDecideSaving] = useState(false);
  const [decideError, setDecideError] = useState("");
  const [subsidyForm, setSubsidyForm] = useState({
    familyName: "", familyEmail: "", discountPct: 100,
    criteriaMet: [] as string[], adminNotes: "", expiresAt: "",
  });
  const [subsidyCreating, setSubsidyCreating] = useState(false);
  const [subsidySaving, setSubsidySaving] = useState(false);
  const [subsidyError, setSubsidyError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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

  const loadTab = async (t: "posts" | "contact" | "volunteer" | "intake" | "newsletter" | "subsidy" | "scholarship_apps") => {
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
    } else if (t === "subsidy") {
      const r = await fetch("/api/admin/subsidy-codes", { headers: { "x-admin-key": adminKey } });
      if (r.ok) setSubsidyCodes(await r.json());
    } else if (t === "scholarship_apps") {
      const r = await fetch("/api/admin/scholarship-applications", { headers: { "x-admin-key": adminKey } });
      if (r.ok) setScholarshipApps(await r.json());
    }
  };

  const decideApp = async (id: number) => {
    setDecideSaving(true);
    setDecideError("");
    try {
      const r = await fetch(`/api/admin/scholarship-applications/${id}/decide`, {
        method: "PATCH",
        headers: apiHeaders(adminKey),
        body: JSON.stringify({ decision: decideForm.decision, adminNotes: decideForm.adminNotes }),
      });
      if (!r.ok) {
        const err = await r.json();
        setDecideError(err.error || "Decision failed.");
        return;
      }
      const reload = await fetch("/api/admin/scholarship-applications", { headers: { "x-admin-key": adminKey } });
      if (reload.ok) setScholarshipApps(await reload.json());
      setDecidingAppId(null);
      setDecideForm({ decision: "approved_full", adminNotes: "" });
    } catch {
      setDecideError("Network error.");
    } finally {
      setDecideSaving(false);
    }
  };

  const issueSubsidyCode = async () => {
    if (!subsidyForm.familyName || !subsidyForm.familyEmail || subsidyForm.criteriaMet.length === 0) {
      setSubsidyError("Family name, email, and at least one eligibility criterion are required.");
      return;
    }
    setSubsidySaving(true);
    setSubsidyError("");
    try {
      const r = await fetch("/api/admin/subsidy-codes", {
        method: "POST",
        headers: apiHeaders(adminKey),
        body: JSON.stringify({
          familyName: subsidyForm.familyName,
          familyEmail: subsidyForm.familyEmail,
          discountPct: subsidyForm.discountPct,
          criteriaMet: subsidyForm.criteriaMet,
          adminNotes: subsidyForm.adminNotes,
          expiresAt: subsidyForm.expiresAt || undefined,
        }),
      });
      if (!r.ok) {
        const err = await r.json();
        setSubsidyError(err.error || "Failed to issue code");
        return;
      }
      const reload = await fetch("/api/admin/subsidy-codes", { headers: { "x-admin-key": adminKey } });
      if (reload.ok) setSubsidyCodes(await reload.json());
      setSubsidyForm({ familyName: "", familyEmail: "", discountPct: 100, criteriaMet: [], adminNotes: "", expiresAt: "" });
      setSubsidyCreating(false);
    } catch {
      setSubsidyError("Network error");
    } finally {
      setSubsidySaving(false);
    }
  };

  const revokeCode = async (id: number) => {
    if (!confirm("Revoke this scholarship code? It will no longer be usable.")) return;
    await fetch(`/api/admin/subsidy-codes/${id}/revoke`, { method: "PATCH", headers: { "x-admin-key": adminKey } });
    const r = await fetch("/api/admin/subsidy-codes", { headers: { "x-admin-key": adminKey } });
    if (r.ok) setSubsidyCodes(await r.json());
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleCriterion = (id: string) => {
    setSubsidyForm(prev => ({
      ...prev,
      criteriaMet: prev.criteriaMet.includes(id)
        ? prev.criteriaMet.filter(c => c !== id)
        : [...prev.criteriaMet, id],
    }));
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
              { key: "subsidy", label: "Scholarship Codes", icon: <Gift size={15} /> },
              { key: "scholarship_apps", label: "Applications", icon: <ClipboardList size={15} /> },
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

        {tab === "subsidy" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">
                {subsidyCodes.length} Scholarship {subsidyCodes.length === 1 ? "Code" : "Codes"}
              </h2>
              {!subsidyCreating && (
                <Button onClick={() => { setSubsidyCreating(true); setSubsidyError(""); }} className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full gap-2">
                  <Gift size={16} /> Issue New Code
                </Button>
              )}
            </div>

            {subsidyCreating && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-border rounded-2xl p-8 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-primary">Issue Scholarship Code</h3>
                  <Button variant="outline" className="rounded-full" onClick={() => { setSubsidyCreating(false); setSubsidyError(""); }}>Cancel</Button>
                </div>
                {subsidyError && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">{subsidyError}</div>
                )}
                <div className="grid md:grid-cols-2 gap-5 mb-6">
                  <div className="space-y-2">
                    <Label>Family Name *</Label>
                    <Input value={subsidyForm.familyName} onChange={e => setSubsidyForm(p => ({ ...p, familyName: e.target.value }))} placeholder="Parent / guardian full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Family Email *</Label>
                    <Input type="email" value={subsidyForm.familyEmail} onChange={e => setSubsidyForm(p => ({ ...p, familyEmail: e.target.value }))} placeholder="Email address the code will be issued to" />
                  </div>
                  <div className="space-y-2">
                    <Label>Scholarship Level *</Label>
                    <select
                      value={subsidyForm.discountPct}
                      onChange={e => setSubsidyForm(p => ({ ...p, discountPct: parseInt(e.target.value) }))}
                      className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value={100}>Full Scholarship (100% free)</option>
                      <option value={50}>Partial Scholarship (50% off, family pays $62.50)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Expiration Date (optional)</Label>
                    <Input type="date" value={subsidyForm.expiresAt} onChange={e => setSubsidyForm(p => ({ ...p, expiresAt: e.target.value }))} />
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="block mb-3">Eligibility Criteria Met * <span className="text-muted-foreground font-normal">(select all that apply)</span></Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {SUBSIDY_CRITERIA.map(c => (
                      <label key={c.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${subsidyForm.criteriaMet.includes(c.id) ? "bg-green-50 border-green-300" : "border-border hover:bg-muted/30"}`}>
                        <input
                          type="checkbox"
                          checked={subsidyForm.criteriaMet.includes(c.id)}
                          onChange={() => toggleCriterion(c.id)}
                          className="mt-0.5 w-4 h-4 accent-green-500 shrink-0"
                        />
                        <span className="text-sm text-primary leading-snug">{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <Label>Documentation Notes *</Label>
                  <p className="text-xs text-muted-foreground">Describe how you determined this family meets the selected criteria. This note is internal only and will not be shared with the family.</p>
                  <Textarea
                    value={subsidyForm.adminNotes}
                    onChange={e => setSubsidyForm(p => ({ ...p, adminNotes: e.target.value }))}
                    rows={4}
                    placeholder="e.g. Family contacted via email on [date]. Reported receiving SNAP benefits. Child's IEP meeting is in 2 weeks and district has denied prior written notice request..."
                  />
                </div>

                <Button
                  onClick={issueSubsidyCode}
                  disabled={subsidySaving || !subsidyForm.familyName || !subsidyForm.familyEmail || subsidyForm.criteriaMet.length === 0}
                  className="bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full px-8"
                >
                  {subsidySaving ? "Issuing…" : "Issue Scholarship Code"}
                </Button>
              </motion.div>
            )}

            {subsidyCodes.length === 0 && !subsidyCreating ? (
              <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
                No scholarship codes issued yet.
              </div>
            ) : (
              <div className="space-y-4">
                {subsidyCodes.map(code => {
                  const criteriaMet: string[] = (() => { try { return JSON.parse(code.criteriaMetJson); } catch { return []; } })();
                  const criteriaLabels = criteriaMet.map(id => SUBSIDY_CRITERIA.find(c => c.id === id)?.label ?? id);
                  const statusColor = !code.active ? "bg-gray-100 text-gray-500" : code.usedAt ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-800";
                  const statusLabel = !code.active ? "Revoked" : code.usedAt ? "Used" : "Active";
                  return (
                    <div key={code.id} className="bg-white border border-border rounded-xl p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <code className="font-mono text-base font-bold text-primary bg-muted px-3 py-1 rounded-lg tracking-wider">{code.code}</code>
                          <button onClick={() => copyCode(code.code)} className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
                            <Copy size={12} /> {copiedCode === code.code ? "Copied!" : "Copy"}
                          </button>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor}`}>{statusLabel}</span>
                          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {code.discountPct === 100 ? "Full Scholarship" : `${code.discountPct}% Off`}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{formatDate(code.issuedAt)}</span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-3">
                        <span className="text-muted-foreground">Family: <span className="font-medium text-primary">{code.familyName}</span></span>
                        <span className="text-muted-foreground">Email: <a href={`mailto:${code.familyEmail}`} className="font-medium text-accent hover:underline">{code.familyEmail}</a></span>
                        {code.expiresAt && <span className="text-muted-foreground">Expires: <span className="font-medium text-primary">{new Date(code.expiresAt).toLocaleDateString()}</span></span>}
                        {code.usedAt && <span className="text-muted-foreground">Used: <span className="font-medium text-blue-700">{formatDate(code.usedAt)}</span></span>}
                      </div>

                      {criteriaLabels.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Criteria Met</p>
                          <div className="flex flex-wrap gap-2">
                            {criteriaLabels.map((lbl, i) => (
                              <span key={i} className="text-xs bg-green-50 text-green-800 border border-green-200 px-2 py-1 rounded-full">{lbl}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {code.adminNotes && (
                        <div className="bg-muted/40 rounded-lg px-4 py-3 mt-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Documentation Notes</p>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{code.adminNotes}</p>
                        </div>
                      )}

                      {code.active && !code.usedAt && (
                        <div className="mt-4">
                          <Button size="sm" variant="outline" onClick={() => revokeCode(code.id)}
                            className="rounded-full gap-1 text-xs text-red-600 border-red-200 hover:bg-red-50">
                            <Ban size={12} /> Revoke
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
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

        {tab === "scholarship_apps" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">
                {scholarshipApps.length} Scholarship {scholarshipApps.length === 1 ? "Application" : "Applications"}
              </h2>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full font-medium">
                  {scholarshipApps.filter(a => a.status === "pending").length} pending
                </span>
                <span className="px-2 py-1 bg-green-50 text-green-800 border border-green-200 rounded-full font-medium">
                  {scholarshipApps.filter(a => a.status.startsWith("approved")).length} approved
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded-full font-medium">
                  {scholarshipApps.filter(a => a.status === "denied").length} denied
                </span>
              </div>
            </div>

            {scholarshipApps.length === 0 ? (
              <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
                No scholarship applications yet.
              </div>
            ) : (
              <div className="space-y-5">
                {scholarshipApps.map((app) => {
                  const criteria: string[] = (() => { try { return JSON.parse(app.criteriaSelectedJson); } catch { return []; } })();
                  const isPending = app.status === "pending";
                  const isDeciding = decidingAppId === app.id;
                  const statusColor =
                    app.status === "approved_full" ? "bg-green-100 text-green-800" :
                    app.status === "approved_partial" ? "bg-teal-100 text-teal-800" :
                    app.status === "denied" ? "bg-red-100 text-red-700" :
                    "bg-yellow-50 text-yellow-800";
                  const statusLabel =
                    app.status === "approved_full" ? "Full Scholarship" :
                    app.status === "approved_partial" ? "Partial Scholarship" :
                    app.status === "denied" ? "Denied" : "Pending";

                  return (
                    <div key={app.id} className="bg-white border border-border rounded-xl p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="font-bold text-primary text-base">
                            {app.firstName} {app.lastName}
                          </p>
                          <a href={`mailto:${app.email}`} className="text-accent text-sm hover:underline">{app.email}</a>
                          <span className="text-muted-foreground text-sm"> · {app.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor}`}>{statusLabel}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(app.submittedAt)}</span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-sm mb-3">
                        <span className="text-muted-foreground">Child: <span className="font-medium text-primary">{app.childFirstName}, {app.childAge}</span></span>
                        <span className="text-muted-foreground">School: <span className="font-medium text-primary">{app.school}</span></span>
                        <span className="text-muted-foreground">District: <span className="font-medium text-primary">{app.district}</span></span>
                        <span className="text-muted-foreground">State: <span className="font-medium text-primary">{app.state}</span></span>
                      </div>

                      <div className="bg-muted/40 rounded-lg px-4 py-3 mb-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Situation</p>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{app.situation}</p>
                      </div>

                      {criteria.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Criteria Selected</p>
                          <div className="flex flex-wrap gap-2">
                            {criteria.map((c, i) => (
                              <span key={i} className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 rounded-full">{c}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {app.scholarshipCode && (
                        <div className="mb-3 flex items-center gap-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Code Issued:</p>
                          <code className="font-mono text-sm font-bold text-primary bg-muted px-3 py-1 rounded-lg tracking-wider">{app.scholarshipCode}</code>
                        </div>
                      )}

                      {app.adminNotes && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-3">
                          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Admin Notes</p>
                          <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{app.adminNotes}</p>
                        </div>
                      )}

                      {app.reviewedAt && (
                        <p className="text-xs text-muted-foreground mb-3">Reviewed: {formatDate(app.reviewedAt)}</p>
                      )}

                      {isPending && !isDeciding && (
                        <Button
                          size="sm"
                          onClick={() => { setDecidingAppId(app.id); setDecideForm({ decision: "approved_full", adminNotes: "" }); setDecideError(""); }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gap-2 text-xs"
                        >
                          <CheckCircle2 size={13} /> Make Decision
                        </Button>
                      )}

                      {isPending && isDeciding && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-4 border border-border rounded-xl p-5 bg-muted/20">
                          <h4 className="font-bold text-primary mb-4 text-sm">Decision for {app.firstName} {app.lastName}</h4>
                          {decideError && (
                            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">{decideError}</div>
                          )}
                          <div className="space-y-3 mb-4">
                            {[
                              { value: "approved_full", label: "Full Scholarship", desc: "100% free — family pays nothing. A code will be generated and emailed automatically." },
                              { value: "approved_partial", label: "Partial Scholarship", desc: "50% off — family pays $125. A code will be generated and emailed automatically." },
                              { value: "denied", label: "Not approved", desc: "Family will receive a polite email explaining that capacity is full." },
                            ].map(opt => (
                              <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${decideForm.decision === opt.value ? "bg-primary/5 border-primary/40" : "border-border hover:bg-muted/30"}`}>
                                <input
                                  type="radio"
                                  name="decision"
                                  value={opt.value}
                                  checked={decideForm.decision === opt.value}
                                  onChange={() => setDecideForm(p => ({ ...p, decision: opt.value }))}
                                  className="mt-0.5 w-4 h-4 accent-green-500 shrink-0"
                                />
                                <div>
                                  <p className="text-sm font-bold text-primary">{opt.label}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                          <div className="space-y-2 mb-4">
                            <label className="text-sm font-semibold text-primary block">Internal notes (optional)</label>
                            <p className="text-xs text-muted-foreground">These notes are for your records only and are not shared with the family.</p>
                            <textarea
                              value={decideForm.adminNotes}
                              onChange={e => setDecideForm(p => ({ ...p, adminNotes: e.target.value }))}
                              rows={3}
                              placeholder="Any context for your decision..."
                              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button
                              size="sm"
                              onClick={() => decideApp(app.id)}
                              disabled={decideSaving}
                              className="bg-accent hover:bg-accent/90 text-primary-foreground rounded-full gap-2 text-xs font-semibold"
                            >
                              {decideSaving ? "Saving…" : "Confirm Decision"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setDecidingAppId(null); setDecideError(""); }}
                              className="rounded-full text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
