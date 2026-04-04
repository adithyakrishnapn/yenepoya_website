import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/site";
import { PageBanner } from "@/components/page-banner";
import { AdmissionsApplyForm } from "@/components/admissions-apply-form";

export const metadata: Metadata = {
  title: "Apply Now",
  description: "Submit your admission application details for Yenepoya Mudipu Campus.",
  keywords: ["Yenepoya apply now", "admission form", "student application", "Mudipu admissions"],
  alternates: {
    canonical: absoluteUrl("/admissions/apply")
  }
};

export default function ApplyNowPage() {
  return (
    <>
      <PageBanner title="Apply Now" imageSrc="/assets/headercontent.jpeg" />

      <section className="section" style={{ paddingTop: "3rem" }}>
        <div className="container grid grid-2" style={{ alignItems: "start", gap: "2rem" }}>
          <div className="card card-pad" style={{ padding: "1.5rem" }}>
            <span className="section-label">Admissions Form</span>
            <h1 className="section-title" style={{ marginTop: "0.8rem" }}>Share your details to begin admission.</h1>
            <p className="section-copy">
              Complete this form with your personal, academic, and course-preference details.
              Our admissions team will contact you with eligibility guidance and next steps.
            </p>
            <AdmissionsApplyForm />
          </div>

          <div className="card card-pad" style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "2rem" }}>Before you submit</h2>
            <p className="section-copy" style={{ margin: 0 }}>
              Keep your latest marks card, valid ID proof, and passport-size photograph ready for faster processing.
            </p>

            <div className="grid" style={{ gap: "0.65rem" }}>
              {["Booking amount starts from ₹26,000", "Counselling support after form submission", "Document verification by admissions team", "Course and career pathway guidance"].map((item) => (
                <div className="pill" key={item} style={{ justifyContent: "flex-start" }}>{item}</div>
              ))}
            </div>

            <div className="card" style={{ padding: "1rem" }}>
              <p style={{ margin: 0, color: "var(--text-light)" }}>
                Already submitted details? Visit the admissions overview for workflow updates and counselling support.
              </p>
              <div style={{ marginTop: "0.75rem" }}>
                <Link href="/admissions" className="btn btn-outline">Go to Admissions Page</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}