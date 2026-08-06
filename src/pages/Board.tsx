import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Scale, HeartHandshake, CalendarDays, Landmark } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";

/**
 * Every list below is validated server-side against an identical list in
 * api/board.ts, which rejects anything outside it. The two files must
 * change together or submissions start failing with a generic error.
 */
const TRACKS = ["Board of Directors", "Advisory Council", "Either"];

const SEAT_INTERESTS = [
  "Treasurer",
  "Development and Institutional Partnerships",
  "Secretary",
  "At-Large Director, Family Law or Disability Rights",
  "Parent Director",
  "Not sure yet",
  "Not applying for a director seat",
];

const ADVISORY_ROLE_OPTIONS = [
  "Board certified behavior analyst (BCBA)",
  "Speech and language pathologist",
  "School psychologist",
  "Low-incidence disabilities specialist",
  "Education policy researcher or attorney",
  "Other",
];

const NONPROFIT_BOARD_SERVICE = [
  "None yet",
  "Currently serve on one",
  "Have served on one",
  "Have served on two or more",
];

const NONPROFIT_ROLES = [
  "Board chair or president",
  "Treasurer",
  "Secretary",
  "Committee chair",
  "Committee member",
  "Advisory council member",
  "Nonprofit staff or executive",
  "None of these",
];

const NONPROFIT_COMPETENCIES = [
  "Budgeting and financial oversight",
  "Form 990 and tax compliance",
  "Audit or financial review",
  "Grant writing",
  "Fundraising and donor cultivation",
  "Bylaws and governance policy",
  "Strategic planning",
  "Executive director search or evaluation",
  "Risk management and insurance",
  "None of these",
];

const EDUCATION_SETTINGS = [
  "K-12 public school",
  "Charter school",
  "Private school",
  "District or LEA central office",
  "State education agency",
  "Higher education",
  "Education nonprofit or advocacy organization",
  "Education foundation or grantmaker",
  "None of these",
];

const EDUCATION_ROLES = [
  "General education teacher",
  "Special education teacher",
  "Related service provider",
  "School or district administrator",
  "Special education director or coordinator",
  "Researcher",
  "Policy professional",
  "Funder or program officer",
  "Parent advocate",
  "None of these",
];

const SPED_YEARS = ["None", "Fewer than three", "Three to ten", "More than ten"];

const FAMILIARITY = [
  "No background",
  "General awareness",
  "Working knowledge I apply in my work",
  "Deep expertise, this is my field",
];

const DISPUTE_EXPERIENCE = [
  "Due process hearings",
  "Mediation",
  "State complaints",
  "IEP facilitation",
  "None of these",
];

const FUNDRAISING_EXPERIENCE = [
  "Yes, I have led campaigns or major asks",
  "Yes, I have made asks or introductions",
  "No, and I am willing to learn",
  "No",
];

const PRIMARY_CONTRIBUTION = [
  "Lived experience as a parent",
  "Finance and financial oversight",
  "Fundraising and funder relationships",
  "Education law and policy",
  "Clinical or related-service expertise",
  "Nonprofit governance",
  "School system knowledge",
  "Communications",
  "Other",
];

const SEATS = [
  {
    title: "Treasurer",
    slug: "treasurer",
    flag: "Priority seat",
    icon: <Scale size={28} className="text-accent" />,
    body: "You would oversee financial reporting, budgeting, and audit readiness as the organization grows from startup to operational scale, and you would chair the Finance Committee that you help establish in your first year. The work runs through reviewing monthly financial statements with the Executive Director, leading the annual budget process alongside the President, structuring restricted and unrestricted fund tracking for grant compliance, supporting Form 990 preparation and timely filing, and setting financial policies covering expense reimbursement, signature authority, and reserve targets.",
    who: "We welcome candidates with experience in nonprofit finance, public accounting, foundation grants management, or corporate finance. CPA licensure is appreciated and not required. This seat should go to someone with no prior relationship to the organization or its leadership.",
  },
  {
    title: "Development and Institutional Partnerships",
    slug: "development-and-institutional-partnerships",
    flag: "Priority seat",
    icon: <Landmark size={28} className="text-accent" />,
    body: "You would chair the Development Committee from its first meeting and own the founding-year fundraising plan alongside the Executive Director. The work runs through building the funder pipeline and grant calendar, opening doors to education foundations, school system leaders, and individual donors, advising the board on how school systems budget and procure so our institutional services are designed against how districts actually operate, and leading board giving. This seat carries no role in scoring and no preview of audit findings, because the independence of the review is what makes it worth buying.",
    who: "We welcome development professionals who have worked with education funders, people with foundation or grantmaking experience, former special education directors, and former district administrators. If you currently work for a school system or a foundation we might approach, that does not disqualify you, and it does mean we will define recusal in writing before you are seated.",
  },
  {
    title: "Secretary",
    slug: "secretary",
    flag: null,
    icon: <CalendarDays size={28} className="text-accent" />,
    body: "You would maintain the official record of every board and committee meeting, covering agendas, minutes, attendance, and votes, and you would serve as custodian of the governance documents, including the bylaws, the conflict of interest policy, and board resolutions. The role also carries timely distribution of meeting notices and materials, tracking of director terms and annual disclosures, compliance with Tennessee nonprofit corporation law and 501(c)(3) reporting obligations, coordination of the annual board self-assessment and new director onboarding, and signing official corporate documents alongside the President as the bylaws require.",
    who: "We welcome candidates with experience in nonprofit governance, corporate paralegal work, executive administration, project management, or organizational compliance. Attention to detail, strong writing, and comfort with cloud-based document systems matter more here than any specific credential.",
  },
  {
    title: "At-Large Director, Family Law or Disability Rights",
    slug: "family-law-or-disability-rights",
    flag: null,
    icon: <Scale size={28} className="text-accent" />,
    body: "You would provide strategic guidance on our family-facing services, our published guidance to families, and our legal compliance posture, and you would help shape program design so that our IEP reviews and family workshops reflect current IDEA case law, state special education regulations, and best practices in disability rights. You would review family-facing materials, including workshop curricula, report templates, and consent forms, for legal accuracy and accessibility. Beyond the materials, this seat opens doors, cultivating relationships with disability rights groups, family law clinics, and education advocacy networks.",
    who: "We welcome practicing attorneys, retired judges, law school faculty, leaders of advocacy organizations, and experienced parent advocates, along with anyone whose background runs through special education law, family law, disability rights advocacy, parent training and information centers, or IDEA dispute resolution.",
  },
  {
    title: "Parent Director",
    slug: "parent-director",
    flag: null,
    icon: <Users size={28} className="text-accent" />,
    body: "You would bring the perspective of a family who has been through the IEP process into every governance decision the board makes, which is why these seats hold the majority of the votes. The work includes reviewing family-facing materials before they reach families, judging whether programs are reaching the families they are meant to reach, serving on a standing committee, and referring other parents into the recruitment pipeline.",
    who: "This seat asks for lived experience as the parent or caregiver of a child with a disability ages birth through 26. No professional credential and no prior board service are required, and we will teach the governance side to anyone willing to learn it.",
  },
];

const ADVISORY_SEATS = [
  "A board certified behavior analyst, to advise on how behavior plans, functional assessments, and behavior goals are read and written.",
  "A speech and language pathologist, to advise on communication goals, speech and language services, and augmentative communication.",
  "A school psychologist, to advise on evaluation and eligibility, psychoeducational reports, and how assessment data should be read.",
  "A specialist in low-incidence disabilities, to advise on programming and service intensity for students with significant support needs.",
  "An education policy researcher or attorney, to advise on policy content and how state regulations differ from the federal floor.",
];

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  cityState: string;
  track: string;
  seatInterest: string;
  advisoryRole: string;
  isParent: string;
  nonprofitBoardService: string;
  nonprofitExperience: string;
  spedYears: string;
  ideaFamiliarity: string;
  section504Familiarity: string;
  lawKnowledgeSource: string;
  fundraisingExperience: string;
  networks: string;
  primaryContribution: string;
  currentRoleOrg: string;
  whyEdatm: string;
  conflicts: string;
  priorBoardService: string;
  professionalLicense: string;
  linkedinUrl: string;
  disabilityIdentify: string;
  howHeard: string;
}

const EMPTY_FORM: FormState = {
  fullName: "", email: "", phone: "", cityState: "", track: "", seatInterest: "",
  advisoryRole: "", isParent: "", nonprofitBoardService: "", nonprofitExperience: "",
  spedYears: "", ideaFamiliarity: "", section504Familiarity: "", lawKnowledgeSource: "",
  fundraisingExperience: "", networks: "", primaryContribution: "", currentRoleOrg: "",
  whyEdatm: "", conflicts: "", priorBoardService: "", professionalLicense: "",
  linkedinUrl: "", disabilityIdentify: "", howHeard: "",
};

const selectClass =
  "w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function slug(s: string) {
  return s.slice(0, 16).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
}

/**
 * Both of these live at module scope on purpose. Defined inside Board they
 * would be a new component type on every render, so React would unmount and
 * remount the field after each keystroke, dropping focus mid-word and
 * resetting the select the user just changed.
 */
function CheckGroup({
  legend, options, selected, onToggle,
}: {
  legend: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium leading-none mb-2">{legend}</legend>
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="mt-1 h-4 w-4 rounded border-input accent-accent"
              data-testid={`checkbox-${slug(legend)}-${slug(option)}`}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Select({
  id, label, options, value, onChange, required = true, help,
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  help?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={onChange}
        className={selectClass}
        data-testid={`select-${id}`}
      >
        <option value="">{required ? "Select..." : "Prefer not to answer"}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

export default function Board() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [nonprofitRoles, setNonprofitRoles] = useState<string[]>([]);
  const [nonprofitCompetencies, setNonprofitCompetencies] = useState<string[]>([]);
  const [educationSettings, setEducationSettings] = useState<string[]>([]);
  const [educationRoles, setEducationRoles] = useState<string[]>([]);
  const [disputeExperience, setDisputeExperience] = useState<string[]>([]);
  const [commitmentConfirmed, setCommitmentConfirmed] = useState(false);
  const [fundraisingConfirmed, setFundraisingConfirmed] = useState(false);
  const [resumePath, setResumePath] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [resumeStatus, setResumeStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resumeError, setResumeError] = useState("");

  /**
   * Uploads straight to private storage the moment a file is chosen, rather
   * than bundling it into the submit. The applicant sees the failure while
   * they are still looking at the field, and a five megabyte document never
   * goes near the JSON body of the application post.
   */
  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumePath("");
    setResumeError("");
    if (!file) {
      setResumeStatus("idle");
      return;
    }
    setResumeName(file.name);
    setResumeStatus("uploading");
    try {
      const ticket = await fetch("/api/board-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
      });
      const data = await ticket.json();
      if (!ticket.ok) {
        setResumeError(data.error || "We could not upload that file.");
        setResumeStatus("error");
        return;
      }
      const put = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) {
        setResumeError("The upload did not finish. Please try again.");
        setResumeStatus("error");
        return;
      }
      setResumePath(data.path);
      setResumeStatus("done");
    } catch {
      setResumeError("Network error during upload. Please try again.");
      setResumeStatus("error");
    }
  };

  // "Either" shows both sets, because someone who does not yet know where
  // they fit should not have to guess before reading what each role is.
  const directorTrack = form.track !== "" && form.track !== "Advisory Council";
  const advisoryTrack = form.track !== "" && form.track !== "Board of Directors";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumePath) {
      setError(
        resumeStatus === "uploading"
          ? "Your resume is still uploading. Give it a moment and try again."
          : "Please upload your resume before submitting."
      );
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          resumePath,
          nonprofitRoles,
          nonprofitCompetencies,
          educationSettings,
          educationRoles,
          disputeExperience,
          commitmentConfirmed,
          fundraisingConfirmed: directorTrack ? fundraisingConfirmed : false,
        }),
      });
      if (!r.ok) {
        const data = await r.json();
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again or email us at info@edquityatthemargins.org.");
    } finally {
      setSubmitting(false);
    }
  };

  /** Curries the shared props so each call site stays one readable line. */
  const sel = (id: keyof FormState) => ({
    id,
    value: form[id],
    onChange: handleChange as (e: React.ChangeEvent<HTMLSelectElement>) => void,
  });

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
              We review IEPs for families who cannot afford an advocate, and those families live in several states, so the board that governs this work should not sit entirely in Tennessee.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">Where the board stands</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Two directors are seated and one more is pending election. We are recruiting for the seats below, and directors do not have to live in Tennessee. A majority of the board must be parents of children with disabilities.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">What board members do</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Board members advise on strategy and support the growth of the organization. That work includes serving as a subject matter expert in your field, contributing to programming, and presenting alongside the Executive Director at events and conferences.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Every director participates in fundraising. That does not mean writing a check. It means sharing our work with your network, introducing us to people and organizations who might give or fund, and helping find paths to contributions from the stakeholders you can reach.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Board service does not involve working with families directly. Directors do not review individual cases, attend IEP meetings, or advise families about their children. The exception is volunteer activity at a conference or community event, where a director may talk with parents and explain what the organization offers.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Seats we are recruiting</h2>
            <p className="text-muted-foreground text-lg">
              The Treasurer and the Development and Institutional Partnerships seats are our priorities. We review applications for every seat on a rolling basis.
            </p>
          </div>
          <div className="grid gap-6 max-w-4xl mx-auto">
            {SEATS.map((seat, idx) => (
              <motion.div
                key={seat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(idx, 3) * 0.06 }}
                className="bg-white border border-border rounded-2xl p-8 shadow-sm"
                data-testid={`board-seat-${idx}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-muted w-12 h-12 rounded-xl flex items-center justify-center shrink-0">{seat.icon}</div>
                  <div>
                    {seat.flag && (
                      <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">{seat.flag}</p>
                    )}
                    <h3 className="text-xl font-bold text-primary">{seat.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{seat.body}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{seat.who}</p>
                <Link
                  href={`/board/roles/${seat.slug}`}
                  className="text-sm font-semibold text-accent underline"
                  data-testid={`seat-description-${seat.slug}`}
                >
                  Read the full position description
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">Committees</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every director serves on at least one standing committee. Three are active in the founding year: Finance, chaired by the Treasurer; Governance, which handles recruitment, onboarding, terms, and annual disclosures; and Development, chaired by the Development and Institutional Partnerships director. A Program Committee opens once the board is seated.
            </p>
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
              A board of seven cannot hold every kind of expertise our programming needs, so the clinical and policy expertise sits on an advisory council instead. Council members are not directors. They hold no vote and no fiduciary duty, and keeping the two roles separate means clinicians contribute what they know without taking on governance work.
            </p>

            <h3 className="text-xl font-bold text-primary mb-3">What council members do</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You would review our materials before they reach families, checking that what we publish reflects current practice in your field. You would advise on workshop content and program design in your specialty, flag guidance that has gone out of date, and, if you want to, present alongside the Executive Director at workshops and conferences.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Council members do not consult on individual cases. We do not send you a child's file or ask you to advise a family, and the exception is the same one that applies to our directors, where a council member volunteering at a conference or community event may talk with parents and explain what we offer.
            </p>

            <h3 className="text-xl font-bold text-primary mb-3">Who we are seating</h3>
            <ul className="space-y-3 mb-8">
              {ADVISORY_SEATS.map((role) => (
                <li key={role} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{role}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-bold text-primary mb-3">The commitment</h3>
            <p className="text-muted-foreground leading-relaxed">
              A one-year renewable appointment, roughly two to four hours a quarter. The council convenes twice a year, and the rest of the work happens when a material needs your eyes.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <Link href="/board/roles" className="text-accent font-semibold underline">
                Read the position description for every council role
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">What we ask of directors</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              This is our founding year, so the commitment is heavier now than it will be later.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-semibold text-primary"> </th>
                    <th className="text-left py-3 pr-4 font-semibold text-primary">Founding year</th>
                    <th className="text-left py-3 font-semibold text-primary">After year one</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-primary">Board meetings</td>
                    <td className="py-3 pr-4">Six per year, virtual, 90 minutes</td>
                    <td className="py-3">Six per year</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-primary">Committee meetings</td>
                    <td className="py-3 pr-4">Monthly, 45 to 60 minutes</td>
                    <td className="py-3">Quarterly</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-primary">Working sessions</td>
                    <td className="py-3 pr-4">Two virtual half-days</td>
                    <td className="py-3">None scheduled</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-primary">Individual time</td>
                    <td className="py-3 pr-4">Five to eight hours per month</td>
                    <td className="py-3">Around three hours per month</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Directors serve a three-year term and complete a conflict of interest disclosure each year. These are unpaid volunteer roles. We do not require a personal gift. Directors who choose to give are appreciated, and no one is asked to give as a condition of serving or of being considered for a seat.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-4">How selection works</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The current board reviews every application. Election is recorded in the minutes, and new directors then complete an onboarding packet with the conflict of interest disclosure, the board agreement, and the confidentiality agreement, along with the founding-year commitments attached to their seat.
            </p>
          </div>
        </div>
      </section>

      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Apply</h2>
              <p className="text-muted-foreground">
                One application covers both the board and the advisory council. Tell us which one fits, and we will follow up either way. We do not require a financial contribution from directors or council members.
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
                className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-8"
                data-testid="board-form"
              >
                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
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
                  <Select {...sel("track")} label="Which role are you applying for?" options={TRACKS} />
                  {directorTrack && (
                    <Select {...sel("seatInterest")} label="Which seat interests you?" options={SEAT_INTERESTS} />
                  )}
                  {advisoryTrack && (
                    <Select {...sel("advisoryRole")} label="Which advisory role fits you?" options={ADVISORY_ROLE_OPTIONS} />
                  )}
                  <Select
                    {...sel("isParent")}
                    label="Are you the parent of a child with a disability, ages birth through 26?"
                    options={["Yes", "No"]}
                  />
                </div>

                <div className="space-y-6 border-t border-border pt-8">
                  <h3 className="text-lg font-bold text-primary">Nonprofit experience</h3>
                  <Select {...sel("nonprofitBoardService")} label="Nonprofit board service" options={NONPROFIT_BOARD_SERVICE} />
                  <CheckGroup legend="Roles you have held" options={NONPROFIT_ROLES} selected={nonprofitRoles} onToggle={(v) => toggle(setNonprofitRoles, v)} />
                  <CheckGroup legend="Where you have working competence" options={NONPROFIT_COMPETENCIES} selected={nonprofitCompetencies} onToggle={(v) => toggle(setNonprofitCompetencies, v)} />
                  <div className="space-y-2">
                    <Label htmlFor="nonprofitExperience">Describe your most relevant nonprofit experience</Label>
                    <Textarea id="nonprofitExperience" name="nonprofitExperience" rows={3} value={form.nonprofitExperience} onChange={handleChange} data-testid="input-nonprofit-experience" />
                  </div>
                </div>

                <div className="space-y-6 border-t border-border pt-8">
                  <h3 className="text-lg font-bold text-primary">Education sector experience</h3>
                  <CheckGroup legend="Settings you have worked in" options={EDUCATION_SETTINGS} selected={educationSettings} onToggle={(v) => toggle(setEducationSettings, v)} />
                  <CheckGroup legend="How you have worked in education" options={EDUCATION_ROLES} selected={educationRoles} onToggle={(v) => toggle(setEducationRoles, v)} />
                  <Select {...sel("spedYears")} label="Years working in or with special education" options={SPED_YEARS} />
                </div>

                <div className="space-y-6 border-t border-border pt-8">
                  <h3 className="text-lg font-bold text-primary">Knowledge of education law</h3>
                  <Select {...sel("ideaFamiliarity")} label="Your familiarity with IDEA" options={FAMILIARITY} />
                  <Select {...sel("section504Familiarity")} label="Your familiarity with Section 504 and the ADA" options={FAMILIARITY} />
                  <CheckGroup legend="Dispute resolution experience" options={DISPUTE_EXPERIENCE} selected={disputeExperience} onToggle={(v) => toggle(setDisputeExperience, v)} />
                  <div className="space-y-2">
                    <Label htmlFor="lawKnowledgeSource">Where your knowledge of education law comes from (optional)</Label>
                    <Textarea id="lawKnowledgeSource" name="lawKnowledgeSource" rows={2} value={form.lawKnowledgeSource} onChange={handleChange} data-testid="input-law-source" />
                  </div>
                </div>

                {directorTrack && (
                  <div className="space-y-6 border-t border-border pt-8">
                    <h3 className="text-lg font-bold text-primary">Fundraising</h3>
                    <Select {...sel("fundraisingExperience")} label="Have you raised money for a nonprofit before?" options={FUNDRAISING_EXPERIENCE} />
                    <div className="space-y-2">
                      <Label htmlFor="networks">Describe the networks or communities you could open to us</Label>
                      <Textarea id="networks" name="networks" rows={3} value={form.networks} onChange={handleChange} data-testid="input-networks" />
                    </div>
                  </div>
                )}

                <div className="space-y-6 border-t border-border pt-8">
                  <h3 className="text-lg font-bold text-primary">About you</h3>
                  <Select {...sel("primaryContribution")} label="What is your primary contribution to this board?" options={PRIMARY_CONTRIBUTION} />
                  <div className="space-y-2">
                    <Label htmlFor="currentRoleOrg">Current role and organization</Label>
                    <Input id="currentRoleOrg" name="currentRoleOrg" required value={form.currentRoleOrg} onChange={handleChange} data-testid="input-current-role" />
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
                      id="conflicts" name="conflicts" required rows={3}
                      placeholder='Write "None" if none apply.'
                      value={form.conflicts} onChange={handleChange} data-testid="input-conflicts"
                    />
                    <p className="text-xs text-muted-foreground">
                      We ask because our reviews have to stay independent of the institutions they evaluate. A relationship here does not disqualify you; it tells us where recusal applies.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priorBoardService">Prior board or committee service (optional)</Label>
                    <Textarea id="priorBoardService" name="priorBoardService" rows={2} value={form.priorBoardService} onChange={handleChange} data-testid="input-prior-board" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professionalLicense">Professional license or credential, and the state that issued it (optional)</Label>
                    <Input id="professionalLicense" name="professionalLicense" value={form.professionalLicense} onChange={handleChange} data-testid="input-license" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn profile</Label>
                    <Input
                      id="linkedinUrl" name="linkedinUrl" type="url" required
                      placeholder="https://www.linkedin.com/in/..."
                      value={form.linkedinUrl} onChange={handleChange} data-testid="input-linkedin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume</Label>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      required
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeChange}
                      className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                      data-testid="input-resume"
                    />
                    <p className="text-xs text-muted-foreground">
                      {resumeStatus === "uploading" && "Uploading…"}
                      {resumeStatus === "done" && `Uploaded: ${resumeName}`}
                      {resumeStatus === "error" && <span className="text-red-600">{resumeError}</span>}
                      {resumeStatus === "idle" && "PDF or Word document, 5 MB maximum."}
                    </p>
                  </div>
                  <Select
                    {...sel("disabilityIdentify")}
                    label="Do you identify as a person with a disability? (optional)"
                    options={["Yes", "No"]}
                    required={false}
                    help="Optional and never used to screen applications. It helps us report board composition accurately to funders."
                  />
                  <div className="space-y-2">
                    <Label htmlFor="howHeard">How did you hear about this search? (optional)</Label>
                    <Input id="howHeard" name="howHeard" value={form.howHeard} onChange={handleChange} data-testid="input-how-heard" />
                  </div>
                </div>

                {form.track !== "" && (
                  <div className="space-y-4 border-t border-border pt-8">
                    <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={commitmentConfirmed}
                        onChange={(e) => setCommitmentConfirmed(e.target.checked)}
                        required
                        className="mt-1 h-4 w-4 rounded border-input accent-accent"
                        data-testid="checkbox-commitment"
                      />
                      <span>
                        {directorTrack
                          ? "I can serve a three-year term, attend six board meetings a year, join monthly committee meetings through the founding year, attend two virtual working sessions, and commit five to eight hours a month."
                          : "I can serve a one-year renewable appointment at roughly two to four hours a quarter."}
                      </span>
                    </label>
                    {directorTrack && (
                      <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fundraisingConfirmed}
                          onChange={(e) => setFundraisingConfirmed(e.target.checked)}
                          required
                          className="mt-1 h-4 w-4 rounded border-input accent-accent"
                          data-testid="checkbox-fundraising"
                        />
                        <span>
                          I will participate in fundraising by sharing our work with my network, making introductions, and helping identify potential contributors.
                        </span>
                      </label>
                    )}
                  </div>
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
