import { useState, FormEvent } from "react";
import { CheckCircle2, CalendarDays, GraduationCap, HandHeart, Users, Clock, Compass, MapPin } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { trackInquirySubmitted } from "@/lib/analytics";

const NAVY = "#122C54";
const TEAL = "#14B8A6";
/** Passes 4.5:1 on white and slate. #14B8A6 measures 2.49 and fails. */
const TEAL_TEXT = "#0F766E";
const GREEN = "#22C55E";

interface FactProps { label: string; value: string; }
function Fact({ label, value }: FactProps) {
  return (
    <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: GREEN, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 8px" }}>{label}</p>
      <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.35 }}>{value}</p>
    </div>
  );
}

const BELIEFS = [
  "Scholars runs from July through May with the same students and the same adults all year. One workshop is not long enough to learn these skills. Students can come back every year until they graduate.",
  "The IEP or 504 plan belongs to the student. Every Scholar learns to read their own plan, say what helps them learn, and talk in their own meeting. They keep those skills after they graduate.",
  "Parents learn too. Parents go to their own workshops on the same days their students meet, so the parent and the student learn the same things at the same time.",
];

const SESSIONS: Array<[string, string]> = [
  ["July 12 to 16, 2027", "Summer intensive, five days"],
  ["Saturday, September 11, 2027", "Session 1"],
  ["Saturday, October 23, 2027", "Session 2"],
  ["Saturday, November 13, 2027", "Session 3"],
  ["Saturday, December 11, 2027", "Session 4"],
  ["Saturday, January 8, 2028", "Session 5"],
  ["Saturday, February 12, 2028", "Session 6"],
  ["Saturday, February 26, 2028", "College visit, Volunteer State"],
  ["Saturday, March 11, 2028", "Session 7"],
  ["Saturday, April 8, 2028", "Session 8"],
  ["Saturday, April 22, 2028", "College visit, Nashville"],
  ["Saturday, May 6, 2028", "Session 9"],
  ["Saturday, May 20, 2028", "Family showcase"],
];

const TRACK_LOWER = {
  band: "Grades 8 to 10",
  name: "Pathways",
  length: "Eight sessions",
  blurb: "What these students do during the year:",
  items: [
    "Take a strengths assessment that shows what they are good at",
    "Look up real jobs and find out what each job pays and what it requires",
    "Talk with an adult who works in a job the student is interested in",
    "Practice answering interview questions, get feedback, and practice again",
  ],
};

const TRACK_UPPER = {
  band: "Grades 11 to 12",
  name: "Scholars",
  length: "Six sessions plus orientation",
  blurb: "What these students do during the year:",
  items: [
    "Learn that the IEP stops when they graduate, and that college follows different laws",
    "Ask the school for their Summary of Performance and get a copy to keep",
    "Sign up with the disability services office at a college",
    "Learn how to tell a teacher what makes learning hard and what to ask for, without saying their diagnosis",
    "Keep all their due dates in one place, with one person who checks in on them",
    "Build a folder that holds their paperwork, the accommodations they ask for, and their next steps with dates",
  ],
};

const SHARED = [
  "Practice talking in their own IEP or 504 meeting",
  "Learn how to plan, get organized, start work without being told, and check their own progress",
  "Start and end every Saturday with the whole group",
  "Visit two colleges, and meet the disability services office at each one",
  "Get an IEP audit, or a 504 review, when they join and again in May",
  "Present to their family in May",
  "Come back every year until they graduate, then return to help younger students",
];

const EXPECTATIONS = [
  ["Attendance", "Each session builds on the one before it, so coming to every session matters. A Scholar who misses more than two of the nine Saturdays cannot finish the year. After any missed day, we meet with that Scholar one to one for fifteen minutes to catch them up."],
  ["What to wear", "Wear your program T-shirt with shorts or jeans. Shirts have to cover your midriff, and sleeves cannot be cut off. We give every Scholar their program T-shirt, so there is nothing to buy."],
  ["No cost, ever", "A sponsor pays for every seat. We provide food at every session, all materials and workbooks, and a chartered bus for the campus visits. Your family pays nothing for any of it."],
  ["Access", "We ask what your student needs when they enroll, and we set up the day to match. That can mean captions, materials sent ahead of time, extra breaks, or anything else. Every adult in the program passes a background check."],
];

const SPONSOR_TIERS: Array<[string, string]> = [
  ["$1,000", "One Scholar's full year"],
  ["$5,000", "Five Scholars"],
  ["$10,000", "Ten Scholars"],
  ["$30,000", "The full thirty-Scholar cohort"],
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #cbd5e1",
  fontSize: 15, color: NAVY, background: "#fff", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 700, color: NAVY, margin: "0 0 6px" };
const fieldWrap: React.CSSProperties = { marginBottom: 18 };

export default function EdquityScholars() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      parentName: data.get("parentName"),
      parentEmail: data.get("parentEmail"),
      parentPhone: data.get("parentPhone"),
      studentName: data.get("studentName"),
      gradeLevel: data.get("gradeLevel"),
      schoolName: data.get("schoolName"),
      county: data.get("county"),
      state: data.get("state"),
      accessNeeds: data.get("accessNeeds"),
      questions: data.get("questions"),
      eligibilityConfirmed: data.get("eligibilityConfirmed") === "on",
    };
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/edquity-scholars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(typeof json.error === "string" ? json.error : "Something went wrong. Please email info@edquityatthemargins.org.");
        return;
      }
      trackInquirySubmitted("edquity-scholars");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please email your enrollment request to info@edquityatthemargins.org.");
    }
  }

  return (
    <div className="pt-20" style={{ fontFamily: "'Outfit', sans-serif", color: NAVY, background: "#fff" }}>
      <PageMeta
        title="EDquity Scholars: A Year-Long Program for Students in Grades 8 to 12"
        description="EDquity Scholars is a year-long, no-cost program for students in grades 8 through 12 with an IEP or a 504 plan. A five-day July intensive, nine monthly Saturdays, two campus visits with disability services appointments, parent workshops on the same days, an IEP audit or a 504 review at intake and again in May, while graduating seniors leave with their complete college transition package. A seat is $1,000, funded by a sponsor rather than by the family. The first cohort begins July 2027 in Gallatin."
      />

      {/* Hero */}
      <section className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: GREEN, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 20px" }}>For Students and Families</p>
          <h1 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 900, lineHeight: 1.08, color: "#fff", margin: "0 0 24px", letterSpacing: "-1.5px" }}>
            EDquity Scholars
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, maxWidth: 1000, margin: "0 auto 12px" }}>
            A year-long program for students in grades 8 through 12 with an Individualized Education Program (IEP) or a Section 504 plan. Scholars learn to read their own document, speak in their own meeting, and build the organization, planning, and self-advocacy skills that carry them through school and into college and work.
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 36px" }}>
            In person in Gallatin. Parents attend their own workshops on the same days.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <a href="#enroll" style={{ background: GREEN, color: NAVY, padding: "15px 32px", borderRadius: 8, fontWeight: 800, textDecoration: "none", fontSize: 16 }}>
              Reserve a Seat
            </a>
            <a href="#sponsor" style={{ background: "transparent", color: "#fff", padding: "15px 32px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 16, border: "2px solid rgba(255,255,255,0.4)" }}>
              Sponsor a Student
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, maxWidth: 920, margin: "0 auto" }}>
            <Fact label="First cohort" value="July 2027 through May 2028" />
            <Fact label="Format" value="A five-day July intensive, then one Saturday a month" />
            <Fact label="Seats" value="Thirty, across grades 8 through 12" />
            <Fact label="A seat" value="$1,000, funded by a sponsor" />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: TEAL_TEXT, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Why This Program Exists</p>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, lineHeight: 1.2, margin: "0 0 18px" }}>
            Speaking up for yourself and getting organized are skills. We teach them directly.
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px" }}>
            IEPs often set goals for organization, planning, and speaking up. Students learn those things fastest when a person teaches them directly and they get a full year to practice. Students also do better when they understand their own plan and can talk in the meetings about their own education. Scholars teaches both of those, across a full year instead of in one workshop.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: 0 }}>
            The second thing happens at graduation. The IEP stops. College follows two different laws, Section 504 and the ADA. Under those laws, no one has to find the student, test the student, or write a plan for them. The student has to ask. Most students are never told this, and most families find out after a hard first semester of college. Scholars teaches it years before graduation, while the high school team can still help.
          </p>
        </div>
      </section>

      {/* We believe */}
      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: "0 0 22px" }}>We believe</h2>
          <div style={{ display: "grid", gap: 16 }}>
            {BELIEFS.map((t) => (
              <div key={t} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 22px" }}>
                <CheckCircle2 size={20} color={TEAL_TEXT} style={{ flexShrink: 0, marginTop: 3 }} />
                <p style={{ fontSize: 15.5, color: "#475569", lineHeight: 1.7, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two tracks, one shared day */}
      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <GraduationCap size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>Two tracks, one shared day</h2>
          </div>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 26px", maxWidth: 760 }}>
            Students in grades 8 to 10 and students in grades 11 to 12 learn different things. Everyone comes on the same Saturday. The whole group starts together and ends together. In between, students work in a small group with only their own grade range. That small group is where most of the day happens.
          </p>

          <div className="rg-2" style={{ gap: 20, marginBottom: 24 }}>
            {[TRACK_LOWER, TRACK_UPPER].map((t, i) => (
              <div key={t.name} style={{ background: "#fff", border: `2px solid ${i === 0 ? TEAL : NAVY}`, borderRadius: 16, padding: "26px 26px 28px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? TEAL_TEXT : NAVY, letterSpacing: 1.4, textTransform: "uppercase", margin: "0 0 6px" }}>{t.band}</p>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: NAVY, margin: "0 0 4px", letterSpacing: "-0.5px" }}>{t.name}</h3>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b", margin: "0 0 14px" }}>{t.length}</p>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 18px" }}>{t.blurb}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                  {t.items.map((item) => (
                    <li key={item} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                      <CheckCircle2 size={17} color={i === 0 ? TEAL_TEXT : NAVY} style={{ flexShrink: 0, marginTop: 3 }} />
                      <span style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.55 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px 26px 26px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#B45309", letterSpacing: 1.4, textTransform: "uppercase", margin: "0 0 12px" }}>What both tracks share</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              {SHARED.map((t) => (
                <div key={t} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <CheckCircle2 size={17} color="#B45309" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.55 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How a program day runs */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Clock size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>How a program Saturday runs</h2>
          </div>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 22px" }}>
            Saturdays run from 9:00 in the morning to 1:00 in the afternoon. Each session teaches one skill. Scholars practice that skill until they can do it on their own. Nothing is graded. A Scholar who cannot do it yet gets taught again in smaller steps. We provide food every program day.
          </p>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 22 }}>
            {[
              ["Arrival", "Scholars arrive, get settled, and eat."],
              ["Culture block, whole group", "This changes each month. Sometimes a guest from the community comes in. Sometimes a Scholar teaches the group something they made. Sometimes the whole room learns one skill together."],
              ["Grade-band breakouts", "This is the longest part of the day. Each grade band works with its own teacher on its own material. They start by going back over last month's skill. They finish when they can do this month's skill. There is a break with food in the middle."],
              ["Closing, whole group", "Every Scholar writes down one thing they will do before the next session. Anyone who wants to reads theirs out loud. Then everyone says one thing they learned that day."],
            ].map(([name, desc], i) => (
              <div key={name} style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "13px 18px", background: i % 2 ? "#f8fafc" : "#fff", borderTop: i ? "1px solid #eef2f7" : "none" }}>
                <span style={{ fontWeight: 800, fontSize: 14, width: 230, flexShrink: 0 }}>{name}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#475569", flex: 1, minWidth: 220, lineHeight: 1.55 }}>{desc}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
            Four times a year, on a program day, parents attend a workshop from our parent workshop catalog while their students are in their small groups. Parents learn on the same days their students do.
          </p>
        </div>
      </section>

      {/* Schedule */}
      <section className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <CalendarDays size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>The program year</h2>
          </div>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 22px" }}>
            The year starts with five days together in July. After that we meet on the second Saturday of the month, September through May, from 9:00 in the morning to 1:00 in the afternoon. October is on the fourth Saturday instead, so it does not land on fall break. The two campus visits are on fourth Saturdays in February and April. The year ends on the third Saturday in May, when every Scholar presents to their family. Nothing meets on a school day, so no Scholar misses class. There are thirty seats, and we confirm them by email in the order requests arrive.
          </p>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
            {SESSIONS.map(([date, session], i) => (
              <div key={date} style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "13px 18px", background: i % 2 ? "#f8fafc" : "#fff", borderTop: i ? "1px solid #eef2f7" : "none" }}>
                <span style={{ fontWeight: 800, fontSize: 14, width: 230, flexShrink: 0 }}>{date}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#475569", flex: 1, minWidth: 220, lineHeight: 1.55 }}>{session}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus visits */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <MapPin size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>What happens on a campus visit</h2>
          </div>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px" }}>
            Every college gives tours. On our visits, Scholars take the tour and also meet with the campus disability services office. That office decides what accommodations a student gets in college. Most families do not know to ask for that meeting. Scholars bring their questions with them and get answers before they need them.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: 0 }}>
            The first cohort visits Volunteer State on February 26 and Tennessee State or Fisk on April 22. We travel by chartered bus. Every adult on the trip passes a background check. The trip costs families nothing.
          </p>
        </div>
      </section>

      {/* What we ask of families */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <Users size={22} color={TEAL} />
            <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: 0 }}>What we ask of families, and what families get</h2>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {EXPECTATIONS.map(([name, desc]) => (
              <div key={name} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 22px" }}>
                <p style={{ fontSize: 15, fontWeight: 800, margin: "0 0 6px" }}>{name}</p>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seats and sponsorship */}
      <section id="sponsor" className="sp" style={{ background: NAVY }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <HandHeart size={22} color={GREEN} />
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: "#fff", margin: 0 }}>How seats are funded</h2>
          </div>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, margin: "0 0 18px" }}>
            A seat is $1,000, which covers the cost of delivering a full year to one student: the summer intensive, nine Saturdays, two campus visits, materials, food, transportation, and each Scholar's two IEP audits or 504 reviews. Every seat is funded by a sponsor and is free to the family it serves; no family ever pays for a seat, and no documentation is ever required. Seats open as sponsorships are secured, which is exactly what sponsoring a Scholar funds. Requesting a seat costs nothing and carries no obligation.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, margin: "0 0 18px" }}>
            {SPONSOR_TIERS.map(([amount, what]) => (
              <div key={amount} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 22, fontWeight: 900, color: GREEN, margin: "0 0 6px" }}>{amount}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.4 }}>{what}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, margin: 0 }}>
            Individuals, businesses, and funders can sponsor an EDquity Scholar for $1,000, covering one student's full year, or sponsor several Scholars at once. Email <a href="mailto:info@edquityatthemargins.org" style={{ color: GREEN, fontWeight: 700 }}>info@edquityatthemargins.org</a> to sponsor, or give through our <a href="/donate" style={{ color: GREEN, fontWeight: 700 }}>donation page</a> and note "EDquity Scholars" with your gift.
          </p>
        </div>
      </section>

      {/* How to apply */}
      <section className="sp" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 800, margin: "0 0 14px" }}>How to request a seat</h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 14px" }}>
            Your student can join if they will be in grades 8 through 12 during the 2027-28 school year and have a current IEP or Section 504 plan. Every Scholar in the room has one. That means no student has to explain their plan to anyone. Asking for a seat takes about five minutes:
          </p>
          <ol style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, margin: "0 0 0 20px", padding: 0 }}>
            <li>Submit the form below. No payment is collected, because no family ever pays.</li>
            <li>We confirm your request by email right away.</li>
            <li>We email you again to confirm the seat. We confirm seats in the order requests arrive, as sponsors fund them.</li>
          </ol>
        </div>
      </section>

      {/* Enrollment form */}
      <section id="enroll" className="sp" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, textAlign: "center", margin: "0 0 10px" }}>Reserve a seat</h2>
          <p style={{ fontSize: 15, color: "#475569", textAlign: "center", lineHeight: 1.7, margin: "0 0 30px" }}>
            There are thirty seats, and we confirm them in the order requests arrive. This form asks for a seat. It does not commit you to anything. We collect no payment, and no family ever pays. We confirm each seat by email as sponsors fund them.
          </p>

          {status === "sent" ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 28, textAlign: "center" }}>
              <CheckCircle2 size={34} color={GREEN} style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 17, fontWeight: 800, margin: "0 0 8px" }}>Seat request received.</p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Check your inbox for a confirmation with the cohort dates. We will follow up by email to confirm your student's seat. Seats are sponsor-funded and free to your family; nothing is ever due.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 26px" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px" }}>Parent or guardian</p>
              <div className="rg-2">
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="parentName">Your full name *</label>
                  <input style={inputStyle} id="parentName" name="parentName" required maxLength={200} autoComplete="name" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="parentEmail">Email address *</label>
                  <input style={inputStyle} id="parentEmail" name="parentEmail" type="email" required maxLength={254} autoComplete="email" />
                </div>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="parentPhone">Phone</label>
                <input style={inputStyle} id="parentPhone" name="parentPhone" maxLength={60} autoComplete="tel" />
              </div>

              <p style={{ fontSize: 13, fontWeight: 800, color: TEAL_TEXT, textTransform: "uppercase", letterSpacing: 1, margin: "26px 0 16px" }}>Your student</p>
              <div className="rg-2">
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="studentName">Student's first name *</label>
                  <input style={inputStyle} id="studentName" name="studentName" required maxLength={200} />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="gradeLevel">Grade level, 2027-28 school year *</label>
                  <select style={inputStyle} id="gradeLevel" name="gradeLevel" required defaultValue="">
                    <option value="" disabled>Select one</option>
                    <option>8th grade</option>
                    <option>9th grade</option>
                    <option>10th grade</option>
                    <option>11th grade</option>
                    <option>12th grade</option>
                  </select>
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="schoolName">School *</label>
                  <input style={inputStyle} id="schoolName" name="schoolName" required maxLength={300} />
                </div>
                <div style={fieldWrap}>
                  <label style={labelStyle} htmlFor="county">County *</label>
                  <input style={inputStyle} id="county" name="county" required maxLength={120} />
                </div>
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="state">State *</label>
                <input style={inputStyle} id="state" name="state" required maxLength={60} defaultValue="Tennessee" />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="accessNeeds">Access needs</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} id="accessNeeds" name="accessNeeds" maxLength={2000} placeholder="Tell us anything that helps your student take part. For example: captions, materials sent ahead of time, or extra breaks." />
              </div>
              <div style={fieldWrap}>
                <label style={labelStyle} htmlFor="questions">Questions for us</label>
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} id="questions" name="questions" maxLength={2000} />
              </div>

              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 20, cursor: "pointer" }}>
                <input type="checkbox" name="eligibilityConfirmed" required style={{ marginTop: 3 }} />
                My student will be in grades 8 through 12 during the 2027-28 school year and has a current Individualized Education Program (IEP) or Section 504 plan. *
              </label>

              {status === "error" && (
                <p style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 8, padding: "12px 14px", fontSize: 14, marginBottom: 16 }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{ background: status === "sending" ? "#94a3b8" : GREEN, color: NAVY, padding: "15px 34px", borderRadius: 8, fontWeight: 800, fontSize: 16, border: "none", cursor: status === "sending" ? "wait" : "pointer", width: "100%" }}
              >
                {status === "sending" ? "Submitting..." : "Request a Seat"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
