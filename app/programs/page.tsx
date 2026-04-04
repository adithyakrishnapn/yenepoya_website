import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore degree pathways, academic streams, and research opportunities at Yenepoya University Mudipu.",
  keywords: ["Yenepoya programs", "degree courses", "undergraduate programs", "postgraduate programs", "academic pathways"],
  alternates: {
    canonical: absoluteUrl("/programs")
  },
  openGraph: {
    title: `Programs | ${siteConfig.shortName}`,
    description: "Browse academic streams and degree pathways at Yenepoya Mudipu Campus.",
    url: absoluteUrl("/programs"),
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
    title: `Programs | ${siteConfig.shortName}`,
    description: "Browse academic streams and degree pathways at Yenepoya Mudipu Campus.",
    images: [siteConfig.ogImage]
  }
};

const programs = [
  ["Health Sciences", "Strong foundations for students pursuing patient-centered and research-led careers."],
  ["Management Studies", "Practical business learning with leadership, communication, and decision-making."],
  ["Computer Applications", "Technology-led coursework that supports product thinking and digital careers."],
  ["Commerce", "A structured path for finance, business operations, and analytical roles."],
  ["Humanities", "Disciplines that strengthen critical thinking, communication, and public understanding."],
  ["Research Opportunities", "Projects, seminars, and publishing support that can expand academic visibility."]
];

export default function ProgramsPage() {
  return (
    <section className="section" style={{ paddingTop: "3.5rem" }}>
      <div className="container">
        <span className="kicker">Programs</span>
        <h1 className="section-title" style={{ marginTop: "0.75rem" }}>Degree pathways built for clarity and search intent.</h1>
        <p className="section-copy">The structure below is intentionally simple so visitors can quickly find the right academic area and move toward admissions with less friction.</p>
        <div className="grid grid-2" style={{ marginTop: "1.5rem" }}>
          {programs.map(([title, copy]) => (
            <article key={title} className="card card-pad">
              <h2 style={{ marginTop: 0, fontFamily: "var(--font-display)", fontSize: "2rem" }}>{title}</h2>
              <p style={{ marginBottom: 0, color: "var(--text-soft)" }}>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
