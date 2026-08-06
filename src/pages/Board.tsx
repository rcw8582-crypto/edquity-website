import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Scale, HeartHandshake, CalendarDays } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/**
 * Kept in sync with EXPERTISE_OPTIONS in api/board.ts. The handler rejects
 * any value outside that list, so the two must change together.
 */
const EXPERTISE_OPTIONS = [
  "Board certified behavior analyst (BCBA)",
  "Speech and language pathology",
  "School psychology",
  "Low-incidence disabilities",
  "Special education teaching or administration",
  "Education policy",
  "Education law",
  "Finance, accounting, or audit",
  "Fundraising and development",
  "Nonprofit governance",
  "Communications",
  "Lived experience as a parent navigating the IEP process",
  "Other",
];

const OPEN_SEATS = [
  {
    title: "Parent director",
    count: "Three seats",
    body: "Parents of children with disabilities ages birth through 26. These seats hold the majority of the votes on the board.",
  },
  {
    title: "Treasurer",
    count: "One seat",
    body: "Finance, accounting, or audit background, with no prior relationship to the organization or its leadership. Parents of children with disabilities are welcome to apply for this seat.",
  },
];

const ADVISORY_ROLES = [
  "Board certified behavior analysts",
  "Speech and language pathologists",
  "School psychologists",
  "Specialists in low-incidence disabilities",
  "Education policy researchers and attorneys",
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  cityState: string;
  track: string;
  seatInterest: string;
  isParent: string;
  currentRole: string;
  priorBoardService: string;
  conflicts: string;
  whyEdatm: string;
  linkUrl: string;
  disabilityIdentify: string;
  howHeard: string;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  cityState: "",
  track: "",
  seatInterest: "",
  isParent: "",
  currentRole: "",
  priorBoardService: "",
  conflicts: "",
  whyEdatm: "",
  linkUrl: "",
  disabilityIdentify: "",
  howHeard: "",
};

const selectClass =
  "w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

export default function Board() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [commitment, setCommitment] = useState(false);

  // Advisory-only applicants take on no fiduciary duty, so the term and
  // meeting acknowledgement does not apply to them.
  const directorTrack = form.track !== "" && form.track !== "Advisory Council";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleExpertise = (value: string) => {
    setExpertise((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expertise.length === 0) {
      setError("Please select at least one area of expertise.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, expertise, commitment: directorTrack ? commitment : false }),
      });
      if (!r.ok) {
        const data = await r.json();
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again or email us directly at info@edquityatthemargins.org.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      <PageMeta
        title="Join Our Board"
        description="EDquity at the Margins is seating its founding board of directors and an advisory council. We are recruiting parent directors, a treasurer, and clinical and policy advisors from across the country."
      />

      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Join Our Board</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We review IEPs for families who cannot afford an advocate. Families come to us from more than one state, so the board that governs this work should not sit entirely in Tennessee.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">Where the board stands</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Two directors are seated and one more is pending election, which leaves four open seats on a board of seven. Directors do not have to live in Tennessee.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A majority of the board are parents of children with disabilities, which is why most of the open seats are reserved for parents.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-primary mb-4">Open Director Seats</h2>
            <p className="text-muted-foreground text-lg">Four seats, recruited nationally, each carrying a full vote.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {OPEN_SEATS.map((seat, idx) => (
              <motion.div
                key={seat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-border rounded-2xl p-8 shadow-sm"
                data-testid={`board-seat-${idx}`}
              >
                <div className="bg-muted w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                  {idx === 0 ? <Users size={30} className="text-accent" /> : <Scale size={30} className="text-accent" />}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{seat.count}</p>
                <h3 className="text-xl font-bold text-primary mb-3">{seat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{seat.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto">
            <div className="bg-muted w-14 h-14 rounded-xl flex items-center justify-center mb-5">
              <HeartHandshake size={30} className="text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">The Advisory Council</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              A board of seven cannot hold every kind of expertise our programming needs, so the clinical and policy expertise sits on an advisory council instead. We are recruiting for it alongside the board. Council members advise on programming and review materials, and they carry no vote and no fiduciary duty.
            </p>
            <ul className="space-y-3 mb-6">
              {ADVISORY_ROLES.map((role) => (
                <li key={role} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{role}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Advisory council members are not directors. Keeping the two roles separate means clinicians can contribute their expertise without taking on governance duties.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto">
            <div className="bg-muted w-14 h-14 rounded-xl flex items-center justify-center mb-5">
              <CalendarDays size={30} className="text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">What We Ask</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Directors serve a three-year term and meet remotely four times a year, including an annual meeting in the first quarter. Every director completes a conflict of interest disclosure each year.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Advisory council members serve a one-year renewable appointment with a lighter commitment and no fiduciary duty.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              These are unpaid volunteer roles. The current board reviews every application. Election to the board is recorded in the minutes, and new directors then complete an onboarding packet with the conflict of interest disclosure, the board agreement, and the confidentiality agreement.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Apply</h2>
              <p className="text-muted-foreground">
                One application covers both the board and the advisory council. Tell us which fits you, and we will follow up either way.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-accent/10 border border-accent/30 rounded-2xl p-10 text-center"
                data-testid="board-success"
              >
                <CheckCircle2 size={56} className="text-accent mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-primary mb-3">We received your application.</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The board reviews applications on a rolling basis, and we will be in touch about next steps. If you would like to add anything, email us at info@edquityatthemargins.org.
                </p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-6"
                data-testid="board-form"
              >
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" name="fullName" required value={form.fullName} onChange={handleChange} data-testid="input-full-name" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} data-testid="input-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} data-testid="input-phone" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cityState">City and state</Label>
                  <Input id="cityState" name="cityState" required placeholder="Nashville, TN" value={form.cityState} onChange={handleChange} data-testid="input-city-state" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="track">Which role are you applying for?</Label>
                  <select id="track" name="track" required value={form.track} onChange={handleChange} className={selectClass} data-testid="select-track">
                    <option value="">Select...</option>
                    <option value="Board of Directors">Board of Directors</option>
                    <option value="Advisory Council">Advisory Council</option>
                    <option value="Either">Either, whichever fits best</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seatInterest">If a director seat, which one interests you?</Label>
                  <select id="seatInterest" name="seatInterest" required value={form.seatInterest} onChange={handleChange} className={selectClass} data-testid="select-seat-interest">
                    <option value="">Select...</option>
                    <option value="Parent director">Parent director</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Not sure yet">Not sure yet</option>
                    <option value="Not applying for a director seat">Not applying for a director seat</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isParent">Are you the parent of a child with a disability, ages birth through 26?</Label>
                  <select id="isParent" name="isParent" required value={form.isParent} onChange={handleChange} className={selectClass} data-testid="select-is-parent">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium leading-none mb-1">What would you bring? Select all that apply.</legend>
                  <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
                    {EXPERTISE_OPTIONS.map((option) => (
                      <label key={option} className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={expertise.includes(option)}
                          onChange={() => toggleExpertise(option)}
                          className="mt-1 h-4 w-4 rounded border-input accent-accent"
                          data-testid={`checkbox-expertise-${option.slice(0, 12).toLowerCase().replace(/\s+/g, "-")}`}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current role and organization</Label>
                  <Input id="currentRole" name="currentRole" required value={form.currentRole} onChange={handleChange} data-testid="input-current-role" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whyEdatm">Why do you want to serve with EDquity at the Margins?</Label>
                  <Textarea id="whyEdatm" name="whyEdatm" required rows={4} value={form.whyEdatm} onChange={handleChange} data-testid="input-why" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conflicts">
                    Do you currently work for, contract with, or hold a financial interest in a school district, LEA, or special education vendor?
                  </Label>
                  <Textarea
                    id="conflicts"
                    name="conflicts"
                    required
                    rows={3}
                    placeholder='Write "None" if none apply.'
                    value={form.conflicts}
                    onChange={handleChange}
                    data-testid="input-conflicts"
                  />
                  <p className="text-xs text-muted-foreground">
                    We ask because our reviews have to stay independent of the institutions they evaluate. A relationship here does not disqualify you; it tells us where recusal applies.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priorBoardService">Prior board or committee service (optional)</Label>
                  <Textarea id="priorBoardService" name="priorBoardService" rows={3} value={form.priorBoardService} onChange={handleChange} data-testid="input-prior-board" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkUrl">LinkedIn profile or resume link (optional)</Label>
                  <Input id="linkUrl" name="linkUrl" type="url" placeholder="https://" value={form.linkUrl} onChange={handleChange} data-testid="input-link" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disabilityIdentify">Do you identify as a person with a disability? (optional)</Label>
                  <select id="disabilityIdentify" name="disabilityIdentify" value={form.disabilityIdentify} onChange={handleChange} className={selectClass} data-testid="select-disability">
                    <option value="">Prefer not to answer</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Optional and never used to screen applications. It helps us report board composition accurately to funders.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="howHeard">How did you hear about this search? (optional)</Label>
                  <Input id="howHeard" name="howHeard" value={form.howHeard} onChange={handleChange} data-testid="input-how-heard" />
                </div>

                {directorTrack && (
                  <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer border-t border-border pt-6">
                    <input
                      type="checkbox"
                      checked={commitment}
                      onChange={(e) => setCommitment(e.target.checked)}
                      required
                      className="mt-1 h-4 w-4 rounded border-input accent-accent"
                      data-testid="checkbox-commitment"
                    />
                    <span>
                      I can serve a three-year term, attend four remote meetings a year, and complete an annual conflict of interest disclosure.
                    </span>
                  </label>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-primary-foreground font-semibold rounded-full"
                  data-testid="button-board-submit"
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
