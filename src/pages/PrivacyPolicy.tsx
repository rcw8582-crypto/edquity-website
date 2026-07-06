import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import PageMeta from "@/components/PageMeta";

export default function PrivacyPolicy() {
  return (
    <div className="pt-20">
      <PageMeta
        title="Privacy Policy"
        description="How EDquity at the Margins collects, uses, and protects your personal information."
      />
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors" data-testid="back-home">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Edquity at the Margins &nbsp;|&nbsp; Effective Date: May 2, 2026</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="prose prose-lg prose-headings:text-primary prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-accent max-w-none">
            <p>This Privacy Policy describes how Edquity at the Margins collects, uses, stores, and protects personal information provided by families and visitors to edquityatthemargins.org and through our intake and inquiry forms.</p>

            <h2>1. Information We Collect</h2>
            <h3>1.1 Information You Provide Directly</h3>
            <p>When you complete our inquiry form, parent intake form, or contact us directly, we collect personal information, including your name, email address, phone number, and mailing address. Through our intake process, we also collect information about your child, including their name, date of birth, disability category, school district, current services, and educational history. You may also voluntarily upload your child's Individualized Education Program and related educational documents.</p>
            <h3>1.2 Information Collected Automatically</h3>
            <p>When you visit our website, we may collect standard technical information, including your IP address, browser type, pages visited, and time spent on the site. This information is collected through standard web analytics tools and is used solely to improve the performance and accessibility of our website.</p>

            <h2>2. How We Use Your Information</h2>
            <p>Edquity at the Margins uses the information you provide for the following purposes:</p>
            <ul>
              <li>To deliver the IEP Audit, the Advocacy Toolkit, and related free services</li>
              <li>To communicate with you about your child's case, service scheduling, and follow-up</li>
              <li>To maintain client records necessary for service delivery and organizational accountability</li>
              <li>To conduct de-identified program evaluation and produce annual impact reports</li>
              <li>To develop de-identified case studies, policy advocacy materials, and peer-reviewed research, subject to your separate research consent</li>
            </ul>

            <h2>3. Children's Educational Records and FERPA</h2>
            <p>Edquity at the Margins handles educational records, including Individualized Education Programs, with the utmost care and in accordance with the Family Educational Rights and Privacy Act (FERPA). Educational records you share with us are used exclusively to provide the services you have requested. We do not share, sell, or disclose your child's educational records to any third party without your explicit written consent, except as required by law. All staff and contractors who access educational records are required to maintain strict confidentiality.</p>

            <h2>4. Data Storage and Security</h2>
            <p>Personal information and educational documents submitted through our intake form are stored securely through Tally, our form platform, which uses industry-standard encryption. We implement reasonable administrative, technical, and physical safeguards to protect your information against unauthorized access, disclosure, or destruction. No method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security, but we are committed to protecting your information to the best of our ability.</p>

            <h2>5. Data Retention</h2>
            <p>We retain client records, including intake forms and educational documents, for a minimum of three years following the conclusion of services, consistent with standard nonprofit recordkeeping practices and applicable law. After that period, records are securely deleted or destroyed. You may request deletion of your records at any time by contacting us at <a href="mailto:info@edquityatthemargins.org">info@edquityatthemargins.org</a>, subject to any legal retention requirements.</p>

            <h2>6. Sharing of Information</h2>
            <p>Edquity at the Margins does not sell, rent, or trade your personal information. We do not share your information with third parties except in the following limited circumstances:</p>
            <ul>
              <li>With service providers who assist in our operations, such as our form platform, who are bound by confidentiality obligations</li>
              <li>When required by law, court order, or government regulation</li>
              <li>To protect the rights, safety, or property of Edquity at the Margins, our staff, or the public</li>
            </ul>

            <h2>7. Research and De-Identified Data</h2>
            <p>With your separate written consent, de-identified and aggregate data derived from your child's IEP document review and related services may be used for organizational impact reporting, case studies, policy advocacy, and peer-reviewed research. De-identified data means information from which all personally identifiable information has been removed, such that no individual, family, or school district can be reasonably identified. Your consent to research use of data is entirely voluntary and is not a condition of receiving services. You may withdraw your research consent at any time without affecting your access to services by notifying us in writing at <a href="mailto:info@edquityatthemargins.org">info@edquityatthemargins.org</a>.</p>

            <h2>8. Your Rights</h2>
            <p>You have the right to access the personal information we hold about you and your child, to request correction of inaccurate information, to request deletion of your records subject to legal retention requirements, and to withdraw consent for research use of data at any time. To exercise any of these rights, contact us at <a href="mailto:info@edquityatthemargins.org">info@edquityatthemargins.org</a>.</p>

            <h2>9. Changes to This Policy</h2>
            <p>Edquity at the Margins may update this Privacy Policy from time to time. We will notify existing clients of material changes by email and will post the updated policy on our website with a revised effective date. Your continued use of our services after any changes constitutes your acceptance of the updated policy.</p>

            <h2>10. Contact Us</h2>
            <p>Questions, concerns, or requests regarding this Privacy Policy should be directed to:</p>
            <address className="not-italic">
              <strong>Dr. Reba Clarke-Wedderburn, Ed.D.</strong><br />
              Founder and Executive Director, EDquity at the Margins<br />
              Gallatin, Tennessee 37066<br />
              <a href="mailto:info@edquityatthemargins.org">info@edquityatthemargins.org</a><br />
              <a href="tel:+17868106178">(786) 810-6178</a>
            </address>
          </div>
        </div>
      </section>
    </div>
  );
}
