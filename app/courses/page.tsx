import Link from "next/link";
import { type Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Courses | Yenepoya Deemed to be University Mudipu Campus",
  description: "Explore Yenepoya Mudipu courses with industry certifications, degree options, and booking amount details.",
  keywords: ["Yenepoya courses", "BCA admissions", "BBA admissions", "MBA admissions", "Mudipu campus courses", "certified programs"],
  alternates: {
    canonical: absoluteUrl("/courses")
  },
  openGraph: {
    title: `Courses | ${siteConfig.shortName}`,
    description: "Explore the certified undergraduate and postgraduate courses offered at Yenepoya Mudipu Campus.",
    url: absoluteUrl("/courses"),
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
    title: `Courses | ${siteConfig.shortName}`,
    description: "Explore the certified undergraduate and postgraduate courses offered at Yenepoya Mudipu Campus.",
    images: [siteConfig.ogImage]
  }
};

const coursesList = [
  "BCA (Artificial Intelligence and DevOps) with Certification in Cloud Computing by IBM",
  "BCA (Artificial Intelligence, Machine Learning and Robotics) with Certification in IoT by IBM",
  "BCA (Artificial Intelligence and Cyber Security) with Certification in Cloud Computing by IBM",
  "BCA (Artificial Intelligence and Data Analytics) with Certification in Cloud by Google",
  "BCA (Artificial Intelligence and Data Analytics) by IBM",
  "BCA (Artificial Intelligence and Data Analytics) with Certification in AI Fundamentals by Microsoft Azure",
  "BCA (AI and Data science) with Certification in Machine Learning by IBM",
  "BCA (AI and Data science) with Certification in Cloud Computing by AWS",
  "BCA (CS and IT) with Certification in AI Services by IBM",
  "BCA (AI and Data Science) with Certification in Full Stack Development by IBM",
  "BBA (AI and Data Analytics) With Certification in Digital Business Management by IBM",
  "BBA (Aviation and Logistics) with certification in Airport and Cabin Crew Management",
  "BBA (Fin Tech and Banking) - TUV SUD",
  "BCA (Data Science and Big Data Analytics) with Certification in AI and Big Data by TUV SUD",
  "BBA (International Business and Business Analytics) with Certification in Digital Marketing by Meta",
  "BCA (Cyber Security and Ethical Hacking) with Certification in Cloud Computing by IBM",
  "BCA (Cyber Security and Digital Forensic) with Certification in Ethical Hacking by EC Council",
  "BBA (Human Resource & Marketing) with AIML by IBM",
  "BBA (Logistics and Supply Chain Management) with Certification in Port and Warehouse Management",
  "MBA (Human Resource, Marketing, Finance Management, Logistics, Supply Chain Management, Healthcare & Hospital Administration)"
].map(title => {
  let category = "Information Technology & Computer Science";
  if (title.includes("Aviation")) category = "Aviation & Management";
  if (title.includes("BBA") || title.includes("MBA") || title.includes("Logistics")) category = "Business Administration & Management";

  return {
    title,
    duration: title.startsWith("MBA") ? "2 Years" : "3 Years",
    price: "₹26,000",
    description: `Industry-aligned ${title.startsWith("MBA") ? "postgraduate" : "undergraduate"} training in ${category} with certification-focused outcomes.`
  };
});

import { CourseFilter } from "@/components/course-filter";

export default function CoursesPage() {
  return (
    <>
      <PageBanner title="Our Academic Programs" imageSrc="/assets/headercontent.jpeg" />

      <section className="section" style={{ background: "#f1f5f9" }}>
        <div className="container" style={{ paddingTop: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span className="section-label">Our Excellent Courses</span>
            <h1 className="section-title" style={{ marginTop: "0.75rem" }}>Industry-certified programs with transparent booking amount.</h1>
            <p className="section-description" style={{ marginTop: "1rem" }}>
              Programs are aligned with the course lineup shown on the Mudipu reference site. Standard booking amount shown below: <strong>₹26,000</strong>.
            </p>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/assets/brochure.pdf" download className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <span>📄</span> Download Fee Structure & Brochure
              </a>
            </div>
          </div>
          <CourseFilter courses={coursesList} />
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link href="/admissions/apply" className="btn btn-primary">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
