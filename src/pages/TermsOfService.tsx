import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import PageMeta from "@/components/PageMeta";

export default function TermsOfService() {
  return (
    <div className="pt-20">
      <PageMeta
        title="Terms of Service"
        description="Terms and conditions for using the EDquity at the Margins website and engaging our services."
      />
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors" data-testid="back-home">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Edquity at the Margins &nbsp;|&nbsp; Effective Date: May 2, 2026</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="prose prose-lg prose-headings:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-accent max-w-none">
            <p>These Terms of Service govern your use of the services provided by Edquity at the Margins, a Tennessee nonprofit corporation. By submitting an intake form and completing payment, you agree to these terms.</p>

            <h2>1. Services Provided</h2>
            <p>Edquity at the Margins provides IEP document analysis, family advocacy coaching, and family education workshops to marginalized families of children with disabilities. The specific services delivered to each family are determined through the intake process and confirmed in writing prior to service delivery.</p>
            <h3>1.1 IEP Document Analysis</h3>
            <p>The IEP Document Analysis service consists of a comprehensive review of your child's Individualized Education Program by a trained advocate, followed by a written summary of findings and recommended next steps. This service does not constitute legal advice and does not create an attorney-client relationship. Edquity at the Margins is not a law firm and does not provide legal representation.</p>
            <h3>1.2 Family Advocacy Coaching</h3>
            <p>The Family Advocacy Coaching service provides ongoing, individualized coaching support through the annual IEP cycle, including meeting preparation, progress monitoring support, and sustained engagement guidance. Coaching services are available to families who have completed the IEP Document Analysis and elected to continue with ongoing support.</p>
            <h3>1.3 Family Education Workshops</h3>
            <p>Family Education Workshops are virtual group sessions covering IDEA rights, IEP interpretation, meeting preparation, and related topics. Workshop registration is separate from the intake process and does not require completion of the IEP Document Analysis.</p>

            <h2>2. Fees and Payment</h2>
            <p>The IEP Document Analysis intake fee is $125, payable at the time of intake form submission through our secure payment processor. This fee is non-refundable once the document review has begun. Family Advocacy Coaching and workshop fees are established separately and communicated in writing prior to service delivery. Edquity at the Margins reserves the right to adjust fees with reasonable notice. Fee waivers or sliding-scale arrangements may be available on a case-by-case basis at the discretion of the organization.</p>

            <h2>3. Not Legal Advice</h2>
            <p>The services provided by Edquity at the Margins are educational and advocacy in nature and do not constitute legal advice. Nothing in any written summary, coaching session, workshop, or communication from Edquity at the Margins should be construed as legal advice or as establishing an attorney-client relationship. Families who require legal representation in special education proceedings should consult a licensed attorney.</p>

            <h2>4. Confidentiality</h2>
            <p>Edquity at the Margins treats all client information, including educational records, as confidential and handles such information in accordance with our Privacy Policy and applicable law, including the Family Educational Rights and Privacy Act. Staff and contractors are required to maintain strict confidentiality regarding client information.</p>

            <h2>5. Client Responsibilities</h2>
            <p>Families engaging the services of Edquity at the Margins agree to:</p>
            <ul>
              <li>Provide accurate and complete information through the intake process</li>
              <li>Submit educational documents in a timely manner following intake confirmation</li>
              <li>Communicate scheduling needs and changes in a timely manner</li>
              <li>Engage with coaching and workshop services in good faith</li>
            </ul>

            <h2>6. Limitation of Liability</h2>
            <p>Edquity at the Margins provides services in good faith based on the information and documents provided by the family. The organization makes no guarantee regarding specific educational outcomes, IEP amendments, service changes, or school district responses. Edquity at the Margins's liability to any client is limited to the amount of fees paid for the specific service at issue.</p>

            <h2>7. Termination of Services</h2>
            <p>Either party may terminate the service relationship with reasonable written notice. Edquity at the Margins reserves the right to decline or terminate services if a client engages in abusive, harassing, or threatening behavior toward staff or contractors. Fees paid for services already delivered are non-refundable.</p>

            <h2>8. Governing Law</h2>
            <p>These Terms of Service are governed by the laws of the State of Tennessee. Any disputes arising under these terms shall be resolved in the courts of Sumner County, Tennessee.</p>

            <h2>9. Changes to These Terms</h2>
            <p>Edquity at the Margins may update these Terms of Service from time to time. Existing clients will be notified of material changes by email. Continued use of services after notification of changes constitutes acceptance of the updated terms.</p>

            <h2>10. Contact</h2>
            <p>Questions regarding these Terms of Service should be directed to <a href="mailto:info@edquityatthemargins.org">info@edquityatthemargins.org</a>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
