import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Users, BookOpen, Megaphone, CheckCircle2 } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ways = [
  {
    icon: <BookOpen size={32} className="text-accent" />,
    title: "Education & Training",
    description: "Help families understand their rights by co-facilitating workshops, translating materials, or developing educational resources.",
  },
  {
    icon: <Users size={32} className="text-accent" />,
    title: "Community Outreach",
    description: "Connect families to our services by representing EDquity at community events, parent groups, and school meetings.",
  },
  {
    icon: <Megaphone size={32} className="text-accent" />,
    title: "Advocacy Support",
    description: "Use your professional skills in law, social work, or education to support our advocacy programs and document review work.",
  },
  {
    icon: <Heart size={32} className="text-accent" />,
    title: "Administrative Help",
    description: "Keep operations running smoothly by supporting communications, data entry, fundraising campaigns, or grant research.",
  },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  interest: string;
  message: string;
}

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    interest: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const data = await r.json();
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      <PageMeta
        title="Volunteer With Us"
        description="Volunteer with EDquity at the Margins in education and training, community outreach, advocacy support, or administrative help. Match your background and availability to roles that directly change what a child's education looks like."
      />
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Get Involved</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you have two hours or twenty, your time and professional skills can directly change what a child's education looks like. We match volunteers to opportunities that fit their background and availability.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-primary mb-4">Ways to Help</h2>
            <p className="text-muted-foreground text-lg">Every role is grounded in real program needs, so your contribution has a direct line to families we serve.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            {ways.map((way, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-border rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow"
                data-testid={`volunteer-way-${idx}`}
              >
                <div className="bg-muted w-14 h-14 rounded-xl flex items-center justify-center mb-5">{way.icon}</div>
                <h3 className="text-lg font-bold text-primary mb-3">{way.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{way.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Sign Up to Volunteer</h2>
              <p className="text-muted-foreground">Share your background and interests and a member of our team will follow up within 48 hours.</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-accent/10 border border-accent/30 rounded-2xl p-10 text-center"
                data-testid="volunteer-success"
              >
                <CheckCircle2 size={56} className="text-accent mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-primary mb-3">We received your application.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A member of our team will follow up within 48 hours to discuss how your skills and availability align with current program needs.
                </p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-6"
                data-testid="volunteer-form"
              >
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Jane"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest">Area of Interest</Label>
                  <select
                    id="interest"
                    name="interest"
                    required
                    value={form.interest}
                    onChange={handleChange}
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid="select-interest"
                  >
                    <option value="">Select an area...</option>
                    <option value="Education & Training">Education & Training</option>
                    <option value="Community Outreach">Community Outreach</option>
                    <option value="Advocacy Support">Advocacy Support</option>
                    <option value="Administrative Help">Administrative Help</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Tell us about yourself (optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Relevant experience, availability, why you want to get involved..."
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    data-testid="input-message"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full"
                  data-testid="button-volunteer-submit"
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit Application"}
                </Button>
              </motion.form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
