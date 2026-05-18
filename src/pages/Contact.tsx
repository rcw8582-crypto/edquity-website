import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Calendar, CheckCircle2 } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/contact", {
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
        title="Contact Us"
        description="Reach out to EDquity at the Margins by email, phone, or by booking a free discovery call. We respond within 24 to 48 business hours."
      />
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Get in Touch</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Whether you are ready to begin a review or still figuring out where to start, reach out and we will respond within 24 to 48 business hours.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-primary mb-8">Send a Message</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-accent/10 border border-accent/30 rounded-2xl p-10 text-center"
                  data-testid="contact-success"
                >
                  <CheckCircle2 size={56} className="text-accent mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-primary mb-3">Message received.</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A member of our team will respond within 24 to 48 business hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  data-testid="contact-form"
                >
                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Jane Doe"
                      required
                      value={form.name}
                      onChange={handleChange}
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                      data-testid="input-contact-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={handleChange}
                      data-testid="input-contact-subject"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your situation or what you need help with..."
                      rows={5}
                      required
                      value={form.message}
                      onChange={handleChange}
                      data-testid="input-contact-message"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full"
                    data-testid="button-contact-submit"
                    disabled={submitting}
                  >
                    {submitting ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-primary mb-8">Other Ways to Connect</h2>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-primary text-primary-foreground rounded-2xl p-7 space-y-4"
                data-testid="contact-email-card"
              >
                <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Mail size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold">Direct Email</h3>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">
                  Prefer to use your own email client? Reach out directly and we will respond within 24 to 48 business hours.
                </p>
                <a
                  href="mailto:info@edquityatthemargins.org"
                  className="text-accent font-semibold text-sm hover:underline"
                  data-testid="contact-email-link"
                >
                  info@edquityatthemargins.org
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white border border-border rounded-2xl p-7 space-y-4 shadow-sm"
                data-testid="contact-consultation-card"
              >
                <div className="bg-muted w-12 h-12 rounded-xl flex items-center justify-center">
                  <Calendar size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-primary">Free Consultation</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A free 30-minute discovery call via Zoom or phone is the most direct way to assess whether our services fit your child's current situation.
                </p>
                <a href="https://calendly.com/dr-reba/discovery" target="_blank" rel="noopener noreferrer" data-testid="contact-book-call">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full">
                    Book Your Call
                  </Button>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-border rounded-2xl p-7 space-y-4 shadow-sm"
                data-testid="contact-phone-card"
              >
                <div className="bg-muted w-12 h-12 rounded-xl flex items-center justify-center">
                  <Phone size={24} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-primary">Phone</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Available Monday through Friday, 9am to 5pm EST.
                </p>
                <a href="tel:+17868106178" className="text-accent font-semibold text-sm" data-testid="contact-phone-link">
                  (786) 810-6178
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
