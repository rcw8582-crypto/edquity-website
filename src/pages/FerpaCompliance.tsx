import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import PageMeta from "@/components/PageMeta";

export default function FerpaCompliance() {
  return (
    <div className="pt-20">
      <PageMeta
        title="FERPA Compliance Statement"
        description="How EDquity at the Margins handles educational records consistent with the Family Educational Rights and Privacy Act."
      />
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors" data-testid="back-home">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">FERPA Compliance Statement</h1>
          <p className="text-muted-foreground mt-2">Edquity at the Margins &nbsp;|&nbsp; Effective Date: May 2, 2026</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="prose prose-lg prose-headings:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-accent max-w-none">
            <p>This statement describes how Edquity at the Margins handles educational records in compliance with the Family Educational Rights and Privacy Act of 1974 (FERPA), 20 U.S.C. Section 1232g.</p>

            <h2>Our Commitment</h2>
            <p>Edquity at the Margins is committed to protecting the privacy and confidentiality of children's educational records. The families we serve place significant trust in us when they share their children's most sensitive educational information, and we take that responsibility seriously. This statement describes the specific steps we take to protect educational records and to ensure that families retain control over their children's information.</p>

            <h2>What Constitutes an Educational Record</h2>
            <p>Under FERPA, educational records include any records, files, documents, or data that are directly related to a student and maintained by an educational agency or institution, or by a party acting for or on behalf of such an agency or institution. In the context of our services, educational records include Individualized Education Programs, evaluation reports, progress reports, assessment data, and any other documents related to a child's special education services that a family shares with Edquity at the Margins.</p>

            <h2>How We Receive Educational Records</h2>
            <p>Edquity at the Margins receives educational records directly from parents and legal guardians, who have the right under FERPA to access and share their child's educational records. We do not solicit or receive educational records directly from schools or school districts. All records are submitted voluntarily by the parent or guardian following completion of the intake process and receipt of a signed consent authorizing us to receive and review those records.</p>

            <h2>How We Use Educational Records</h2>
            <p>Educational records shared with Edquity at the Margins are used exclusively for the purpose of delivering the services requested by the family, including the IEP Audit, the Advocacy Toolkit, and related support. Records are reviewed by trained staff and contractors who are bound by confidentiality obligations. Records are not shared with any third party without the explicit written consent of the parent or guardian, except as required by law.</p>

            <h2>De-Identification for Research and Reporting</h2>
            <p>With the separate written consent of the parent or guardian, de-identified data derived from educational records may be used for organizational impact reporting, case studies, policy advocacy, and peer-reviewed research. De-identification is conducted in accordance with the safe harbor standard, which requires the removal or generalization of at least 18 categories of potentially identifying information, including name, date of birth, geographic identifiers smaller than a state, and any other unique characteristics that could reasonably identify an individual child, family, or school district.</p>

            <h2>Record Security and Retention</h2>
            <p>Educational records submitted through our intake process are stored using industry-standard encryption through our form platform. Access to educational records is limited to staff and contractors directly involved in service delivery. Records are retained for a minimum of three years following the conclusion of services and are securely deleted or destroyed thereafter. Parents and guardians may request deletion of their records at any time, subject to applicable legal retention requirements.</p>

            <h2>Parent and Guardian Rights</h2>
            <p>Parents and legal guardians retain the following rights with respect to educational records shared with Edquity at the Margins:</p>
            <ul>
              <li>The right to access records shared with us at any time by submitting a written request</li>
              <li>The right to request correction of inaccurate records</li>
              <li>The right to request deletion of records, subject to legal retention requirements</li>
              <li>The right to withdraw consent for research use of de-identified data at any time without affecting access to services</li>
              <li>The right to receive a copy of this FERPA Compliance Statement upon request</li>
            </ul>

            <h2>Contact</h2>
            <p>Questions or concerns regarding this FERPA Compliance Statement or the handling of educational records should be directed to:</p>
            <address className="not-italic">
              <strong>Dr. Reba Clarke-Wedderburn, Ed.D.</strong><br />
              Founder and Executive Director, EDquity at the Margins<br />
              <a href="mailto:info@edquityatthemargins.org">info@edquityatthemargins.org</a><br />
              <a href="tel:+17868106178">(786) 810-6178</a>
            </address>
          </div>
        </div>
      </section>
    </div>
  );
}
