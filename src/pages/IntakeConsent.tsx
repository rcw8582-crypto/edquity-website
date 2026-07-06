import { Link } from "wouter";
import { ArrowLeft, CheckSquare } from "lucide-react";

const consents = [
  {
    id: 1,
    title: "Consent 1: Identity and Authorization",
    text: "I confirm that I am the parent or legal guardian of the child named in this form and that I am legally authorized to share my child's educational records and make decisions regarding their educational services.",
  },
  {
    id: 2,
    title: "Consent 2: Document Review and Service Authorization",
    text: "By submitting this form, I authorize Edquity at the Margins and its staff to receive, review, and retain my child's Individualized Education Program and any related educational documents I provide for the purpose of the IEP Audit and related educational equity services. I understand that these documents contain sensitive and personally identifiable information protected under the Family Educational Rights and Privacy Act and that Edquity at the Margins will not share, publish, or distribute these documents or their contents to any third party without my explicit written consent. This consent covers all services I may receive from Edquity at the Margins, including but not limited to the IEP Audit, the Advocacy Toolkit, and meeting preparation support.",
  },
  {
    id: 3,
    title: "Consent 3: Research, Case Study, and Impact Reporting Authorization",
    text: "I consent to the use of de-identified, aggregate data derived from my child's IEP document review and any related services for the following purposes: organizational program evaluation and annual impact reporting; the development of policy advocacy materials and public-facing publications produced by Edquity at the Margins; case studies examining special education policy, compliance, and equity outcomes, whether published internally or externally; and educational research conducted or co-conducted by Edquity at the Margins staff, including peer-reviewed scholarship examining special education policy, compliance, and equity. I understand that any data used for research, case study, or publication purposes will be fully de-identified, meaning that no information that could reasonably identify my child, my family, or our school district will appear in any published or publicly distributed material without my separate, explicit written authorization. I understand that my consent to participate in services is not contingent on my consent to research use of data, and that I may withdraw consent for research use at any time without affecting my access to services.",
    label: "I consent to research and impact reporting use of de-identified data.",
    optional: true,
  },
  {
    id: 4,
    title: "Consent 4: Communication Authorization",
    text: "I give Edquity at the Margins permission to contact me at the phone number and email address provided in this form regarding my child's case, service updates, scheduling, and any follow-up related to services I have requested.",
  },
];

export default function IntakeConsent() {
  return (
    <div className="pt-20">
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors" data-testid="back-home">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Parent Intake: Consent and Authorization</h1>
          <p className="text-muted-foreground mt-2">Section 7 of the Parent Intake Form &nbsp;|&nbsp; Updated May 2, 2026</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Please read each statement carefully before checking the box. Your consent is required to complete your intake and proceed with services. Each consent is independent. You may consent to services without consenting to research use of data.
          </p>

          <div className="space-y-8">
            {consents.map((consent) => (
              <div
                key={consent.id}
                className={`rounded-2xl border p-7 ${consent.optional ? "border-secondary/30 bg-secondary/5" : "border-border bg-white shadow-sm"}`}
                data-testid={`consent-section-${consent.id}`}
              >
                <h2 className="text-lg font-bold text-primary mb-4">{consent.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-5">{consent.text}</p>
                <div className="flex items-start gap-3 bg-muted/50 rounded-lg px-4 py-3">
                  <CheckSquare size={20} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-primary">
                    {consent.label ?? "I confirm the above statement."}
                    {consent.optional && (
                      <span className="ml-2 text-xs text-muted-foreground font-normal">(Optional, not required to receive services)</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary text-primary-foreground rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-3">Your IEP Audit is free</h2>
            <p className="text-primary-foreground/80 leading-relaxed">
              Thank you for completing your intake form. You will receive a confirmation email at the address you provided within 48 hours. Please reply to that confirmation email with your child's IEP document attached. Dr. Clarke-Wedderburn will confirm your IEP Audit appointment at that time.
            </p>
          </div>

          <div className="mt-10 text-sm text-muted-foreground space-y-2">
            <p>Related documents:</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</Link>
              <Link href="/terms-of-service" className="text-accent hover:underline">Terms of Service</Link>
              <Link href="/ferpa-compliance" className="text-accent hover:underline">FERPA Compliance Statement</Link>
              <Link href="/research-data-policy" className="text-accent hover:underline">Research Data Use Policy</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
