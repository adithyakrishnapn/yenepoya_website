import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Admissions",
  description: "Find admissions details, required documents, and the application workflow for Yenepoya University Mudipu.",
  keywords: ["admissions", "apply now", "Yenepoya University", "student enrollment", "Mudipu admissions"],
  alternates: {
    canonical: absoluteUrl("/admissions")
  },
  openGraph: {
    title: `Admissions | ${siteConfig.shortName}`,
    description: "Review admissions steps, eligibility guidance, and application support for Yenepoya Mudipu Campus.",
    url: absoluteUrl("/admissions"),
    siteName: siteConfig.name,
    type: "article",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `Admissions | ${siteConfig.shortName}`,
    description: "Review admissions steps, eligibility guidance, and application support for Yenepoya Mudipu Campus.",
    images: [siteConfig.ogImage]
  }
};

const steps = [
  ["Submit an enquiry", "Share your interest so our admissions team can suggest the right program."],
  ["Counselling and eligibility check", "Receive one-to-one guidance on eligibility, course fit, and next steps."],
  ["Document verification", "Upload and verify required academic and identity documents."],
  ["Confirm admission", "Pay the booking amount and complete enrollment for the selected program."]
];

export default function AdmissionsPage() {
  return (
    <>
      <PageBanner title="Admissions" imageSrc="/assets/headercontent.jpeg" />
      <section className="section" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
        <div className="container card" style={{ padding: "2rem" }}>
          <div className="grid grid-2" style={{ alignItems: "center" }}>
            <div>
              <span className="section-label">Admissions Open 2026-27</span>
              <h1 className="section-title" style={{ marginTop: "0.75rem" }}>Admissions for the academic year 2026-27 are now open.</h1>
              <p className="section-copy">
                Start your application journey at Yenepoya Mudipu Campus with dedicated counselling support,
                transparent guidance, and fast-tracked enrollment assistance.
              </p>
              <div className="button-row">
                <Link href="/admissions/apply" className="button button-primary">Apply now</Link>
                <Link href="/contact" className="button button-secondary">Schedule counselling</Link>
              </div>
            </div>
            <div className="card card-pad" style={{ background: "linear-gradient(135deg, rgba(13,125,114,0.12), rgba(240,168,79,0.1))" }}>
              <h2 style={{ marginTop: 0, fontFamily: "var(--font-display)", fontSize: "2rem" }}>What we handle for you</h2>
              <div className="grid" style={{ gap: "0.7rem" }}>
                {[
                  "Program and eligibility matching",
                  "Application and document support",
                  "Deadline and follow-up coordination",
                  "Booking amount and admission confirmation"
                ].map((item) => (
                  <div key={item} className="pill" style={{ justifyContent: "flex-start" }}>{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container grid grid-2" style={{ alignItems: "start" }}>
          <div>
            <span className="section-label">Admission workflow</span>
            <h2 className="section-title" style={{ marginTop: "0.75rem" }}>Structured process, faster decision making.</h2>
          </div>
          <div className="card card-pad" style={{ display: "grid", gap: "0.9rem" }}>
            {steps.map(([title, copy], index) => (
              <div key={title} style={{ display: "grid", gap: 6 }}>
                <div className="meta-row">
                  <span className="pill">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{title}</strong>
                </div>
                <p style={{ margin: 0, color: "var(--text-soft)" }}>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container card" style={{ padding: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <p style={{ margin: 0, color: "var(--text-light)", fontWeight: 600 }}>
            Need help choosing the right course? Talk to our admissions counsellor.
          </p>
          <Link href="/courses" className="btn btn-outline">View Courses and Fees</Link>
        </div>
      </section>
    </>
  );
}
