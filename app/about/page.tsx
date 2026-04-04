import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Yenepoya University Mudipu, its mission, modern learning environment, and student-first academic approach.",
  keywords: ["about Yenepoya University Mudipu", "university mission", "student support", "Mudipu campus", "higher education"],
  alternates: {
    canonical: absoluteUrl("/about")
  },
  openGraph: {
    title: `About | ${siteConfig.shortName}`,
    description: "Discover the mission, vision, and academic identity of Yenepoya Mudipu Campus.",
    url: absoluteUrl("/about"),
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
    title: `About | ${siteConfig.shortName}`,
    description: "Discover the mission, vision, and academic identity of Yenepoya Mudipu Campus.",
    images: [siteConfig.ogImage]
  }
};

export default function AboutPage() {
  return (
    <>
      <PageBanner title="About Us" imageSrc="/assets/headercontent.jpeg" />
      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: "start", gap: "4rem" }}>
          <div>
            <span className="kicker">About Yenepoya</span>
            <h2 className="section-title" style={{ marginTop: "0.75rem", fontSize: "2.2rem" }}>A modern academic identity with clear purpose.</h2>
            <p className="text-soft mt-4" style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
              Yenepoya Institute of Arts, Science, Commerce, and Management (YIASCM) is a constituent unit of YENEPOYA (Deemed-to-be-University) instituted in the year 2017 with a vision to provide quality and industry-aligned education in the fields of Arts, Design and Humanities, Computer Science and Information Technology, Applied Sciences, Commerce and Finance and Management.
            </p>
            <p className="text-soft mt-3" style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
              Our modern campus at Mudipu is designed to foster a rich academic environment, equipped with state-of-the-art laboratories, a comprehensive Simulation Center, and ICT-enabled classrooms ensuring that our students receive world-class practical education alongside strong theoretical foundations.
            </p>
          </div>
          <div className="card card-pad" style={{ display: "grid", gap: "1rem" }}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>Why Choose Us</h2>
            <div className="grid" style={{ gap: "0.9rem" }}>
              {[
                "15,000+ Excellent Students Nationwide",
                "600+ Highly Qualified Expert Teachers",
                "Dedicated industry integrations with IBM",
                "Advanced Simulation Center (ACTS YEN)",
                "Supportive 'Home Away From Home' Campus"
              ].map((item) => (
                <div key={item} className="pill" style={{ justifyContent: "flex-start", padding: "1rem", borderRadius: "8px", background: "rgba(245, 147, 0, 0.1)", color: "var(--primary)", border: "1px solid rgba(245, 147, 0, 0.3)" }}>
                  <span style={{ marginRight: "0.5rem" }}>→</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
