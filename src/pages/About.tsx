import { motion } from "framer-motion";
import { Link } from "wouter";
import PageMeta from "@/components/PageMeta";

export default function About() {
  return (
    <div className="pt-20">
      <PageMeta
        title="About Dr. Reba Clarke-Wedderburn and Our Mission"
        description="Meet Dr. Reba Clarke-Wedderburn and learn how EDquity at the Margins demystifies the special education system for families to advocate for their child's federally guaranteed IEP rights."
      />
      {/* Header */}
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">About Us</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We pursue an education system in which marginalized families feel empowered and prepared to advocate for their child's federally guaranteed rights.
            </p>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              EDquity at the Margins is a Tennessee nonprofit corporation and an IRS-recognized{" "}
              <strong className="text-primary">501(c)(3) public charity</strong>, EIN 42-2295582. Every
              service we provide to families is free, funded by donations and by our paid work with
              schools and school systems.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-primary border-b-4 border-accent inline-block pb-2">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                EDquity at the Margins exists to demystify the special education system for marginalized families. We translate institutional special education practices into plain language so families can engage with schools as true, empowered partners. We provide advocacy, education, and support to families to ensure children receive the Free Appropriate Public Education (FAPE) that they are legally guaranteed.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-primary border-b-4 border-accent inline-block pb-2">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We work toward a public education system where a family's race, income, or language does not determine the quality of special education services their child receives, where every IEP table functions as a space of genuine collaboration, and where the law means what it says for every child it covers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/images/about.jpg"
              alt="Community meeting in school" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Founder Statement */}
      <section className="sp" style={{ background: "#122C54" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-3xl mx-auto text-center">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#22C55E", letterSpacing: 2, textTransform: "uppercase", marginBottom: 28 }}>From the Founder</p>
            <blockquote style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: "#fff", lineHeight: 1.6, margin: "0 0 36px", fontStyle: "italic" }}>
              "I want every child to have a 'ME' fighting for them."
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <div style={{ width: 40, height: 2, background: "#22C55E" }} />
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Dr. Reba Clarke-Wedderburn</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "4px 0 0", lineHeight: 1.5 }}>
                  Founder & Executive Director, EDquity at the Margins
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Bio & CV */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-4xl mx-auto">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#15803D", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Founder</p>
            <h2 className="text-3xl font-bold text-primary mb-6">Dr. Reba Clarke-Wedderburn</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Dr. Clarke-Wedderburn is an instructional coach, curriculum developer, and educator preparation specialist with 21 years of experience across K-12 teaching, instructional coaching, and higher education. She designs and facilitates graduate-level special education licensure coursework, coaches pre-service and in-service teachers through competency-based development, and builds standards-aligned curriculum grounded in equity, disability advocacy, and special education policy.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              She holds a Doctor of Education in Learning Organizations and Strategic Change from Lipscomb University, a Master of Science in Instructional Leadership from Union University, and a Bachelor of Science in Exceptional Education from Florida Atlantic University. She is the author of the F.L.O.W. equity-centered coaching framework.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Her certifications include Tennessee K-6 Elementary Education, Tennessee K-12 Special Education, and Tennessee Educational Administration. She has held roles at LEAD Public Schools, TNTP, Western Governors University, and the Nashville Teacher Residency. She currently serves as Program Specialist at Diverse Learners Cooperative.
            </p>
            <a
              href="/Clarke-Wedderburn-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#122C54", color: "#fff", padding: "13px 28px",
                borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Full CV
            </a>
          </div>
        </div>
      </section>

      {/* The Gap We Disrupt */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">The Gap We Disrupt</h2>
            <div className="prose prose-lg prose-p:text-muted-foreground prose-headings:text-primary max-w-none">
              <p>
                The Individuals with Disabilities Education Act (IDEA) established parents as equal partners in the IEP process, a mandate grounded in decades of research showing that family participation improves educational outcomes for children with disabilities. That mandate, however, has never been evenly enforced.
              </p>
              <p>
                School districts arrive at IEP meetings with teams of professionals, evaluators, and administrators whose command of specialized terminology and procedural rules creates a structural disadvantage for families who lack equivalent training. For families of color, economically disadvantaged families, and non-native English speakers, that disadvantage is compounded by documented patterns of racial and economic disparity in special education identification, placement, and service delivery.
              </p>
              <p>
                <strong>EDquity at the Margins addresses that gap directly.</strong> Parents hold knowledge about their children that no evaluation instrument can replicate, and our work translates that knowledge into legally binding educational plans through document analysis and sustained advocacy support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs. Named here because Ad Grants lists Programs among the key
          pages a reviewer reads, and because About previously described the
          mission and the founder without ever saying what we actually run. */}
      <section className="sp" style={{ background: "#f8fafc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8">Our Programs</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Free IEP Audit</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We review your child's IEP across six research-grounded domains, identify what is
                  missing or legally inadequate, and deliver a plain-language written report with
                  specific next steps before your next meeting. Families pay nothing.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">Free Parent Workshops</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Live sessions covering what the law entitles your child to, how to read the document
                  the school hands you, what to say when services are cut, and how to put a request in
                  writing so the district has to answer it. They run online on the third Thursday of
                  each month at 7:00 PM Central, and we partner with libraries and community
                  organizations to bring sessions in person.
                </p>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Alongside both, our{" "}
                <Link href="/resources" className="text-primary font-semibold hover:underline">Advocacy Toolkit</Link>{" "}
                is a free library you can download and use on your own, covering the thirteen IDEA
                disability categories, eligibility, the difference between IDEA and Section 504, who
                sits on an IEP team, and a notecatcher for the meeting itself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governance. The board page carries the detail; this states the facts a
          reviewer or a funder checks first and points at it, since neither this
          page nor Transparency linked to it before. */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8">Governance and Accountability</h2>
            <div className="space-y-5">
              <p className="text-lg text-muted-foreground leading-relaxed">
                EDquity at the Margins is a Tennessee nonprofit corporation and an IRS-recognized{" "}
                <strong className="text-primary">501(c)(3) public charity</strong>, EIN 42-2295582,
                headquartered in Gallatin, Tennessee. The IRS recognized our exempt status in May 2026.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We are governed by a board of seven. Two directors are seated, one election is pending,
                and most of the remaining seats are reserved for parents of children with disabilities.
                Directors do not have to live in Tennessee.{" "}
                <Link href="/board" className="text-primary font-semibold hover:underline">
                  Read how the board is being built and how to join
                </Link>
                .
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We never charge families for anything. We never accept payment from a school district in
                connection with an individual child's case. Schools that engage us pay for reviews of
                their own IEP quality across their system, and ten percent of every school engagement fee
                is designated to the Family Audit Fund, which keeps family services free.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
