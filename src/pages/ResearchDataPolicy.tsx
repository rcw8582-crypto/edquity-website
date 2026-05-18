import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function ResearchDataPolicy() {
  return (
    <div className="pt-20">
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors" data-testid="back-home">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Research Data Use Policy</h1>
          <p className="text-muted-foreground mt-2">Edquity at the Margins &nbsp;|&nbsp; Effective Date: May 2, 2026</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="prose prose-lg prose-headings:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-accent max-w-none">
            <p>This policy describes how Edquity at the Margins uses service data for organizational learning, impact reporting, case study development, and peer-reviewed research.</p>

            <h2>Purpose</h2>
            <p>Edquity at the Margins is committed to evidence-based practice and to contributing to the broader field of special education equity research. The organization collects service data through its intake process and service delivery with the dual purpose of improving organizational programs and generating knowledge that can inform policy, practice, and scholarship. This policy describes how that data is used, protected, and governed.</p>

            <h2>Types of Data Use</h2>

            <h3>Organizational Program Evaluation</h3>
            <p>Edquity at the Margins uses aggregate, de-identified service data to evaluate the effectiveness of its programs, track outcomes for families served, and produce annual impact reports. This data may be shared with funders and the public in summary form as part of the organization's accountability and transparency obligations.</p>

            <h3>Case Studies</h3>
            <p>With the written consent of the parent or guardian, de-identified case narratives may be developed from service data to illustrate the impact of the organization's work, inform policy advocacy, and support educational research. Case studies are de-identified in accordance with the safe harbor standard and are reviewed internally before publication to ensure that no identifying information remains.</p>

            <h3>Policy Advocacy</h3>
            <p>De-identified, aggregate data from the organization's service experience may be used to develop policy briefs, public comment submissions, legislative testimony, and other advocacy materials that document the gap between federal special education requirements and the experiences of marginalized families.</p>

            <h3>Peer-Reviewed Research</h3>
            <p>Staff of Edquity at the Margins may conduct or co-conduct peer-reviewed research using de-identified service data. Such research will be conducted in accordance with applicable ethical standards, including Institutional Review Board oversight where required, and will be submitted only to publications that subject research to rigorous peer review. No identifying information will appear in published research without the separate, explicit written authorization of the parent or guardian.</p>

            <h2>Consent Requirements</h2>
            <p>Research and case study use of data requires separate, voluntary written consent from the parent or guardian, which is collected through Consent 3 of the parent intake form. Consent to research use of data is not a condition of receiving services. Parents and guardians may withdraw their research consent at any time without affecting their access to services by notifying Edquity at the Margins in writing at <a href="mailto:info@edquityatthemargins.org">info@edquityatthemargins.org</a>.</p>

            <h2>De-Identification Standards</h2>
            <p>All data used for research, case studies, or public reporting is de-identified in accordance with the safe harbor standard established under HIPAA and consistent with FERPA de-identification requirements. This standard requires the removal or generalization of at least 18 categories of potentially identifying information. Edquity at the Margins applies this standard rigorously and conducts an internal review of all de-identified materials prior to any external use or publication.</p>

            <h2>IRB Oversight</h2>
            <p>Peer-reviewed research involving human subjects data conducted by Edquity at the Margins staff will be submitted to an appropriate Institutional Review Board for review prior to data collection or analysis. The organization is committed to conducting research that meets the ethical standards of the academic community and that protects the rights and welfare of the families whose data contributes to that research.</p>

            <h2>Data Governance</h2>
            <p>The Founder and Executive Director of Edquity at the Margins serves as the primary data steward and is responsible for ensuring that all data use conforms to this policy, to the organization's Privacy Policy, and to applicable law. Any proposed use of service data that falls outside the scope of this policy requires approval from the Board of Directors prior to implementation.</p>

            <h2>Contact</h2>
            <p>Questions regarding this Research Data Use Policy should be directed to <a href="mailto:info@edquityatthemargins.org">info@edquityatthemargins.org</a>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
