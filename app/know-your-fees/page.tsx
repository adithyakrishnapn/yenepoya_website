import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { PageBanner } from "@/components/page-banner";
import { KnowYourFeesForm } from "@/components/know-your-fees-form";

export const metadata: Metadata = {
  title: "Know Your Fees",
  description: "Select your campus and course to connect with our counsellor for the latest fee details.",
  keywords: ["know your fees", "fee structure 2026-27", "yenepoya admissions", "campus fee enquiry"],
  alternates: {
    canonical: absoluteUrl("/know-your-fees")
  },
  openGraph: {
    title: `Know Your Fees | ${siteConfig.shortName}`,
    description: "Choose your campus and course to get fee information with instant counsellor support.",
    url: absoluteUrl("/know-your-fees"),
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
    title: `Know Your Fees | ${siteConfig.shortName}`,
    description: "Choose your campus and course to get fee information with instant counsellor support.",
    images: [siteConfig.ogImage]
  }
};

const campuses = [
  "Bangalore Campus",
  "Mangalore Campus",
  "Moodbidri Campus",
  "Mudipu Campus",
  "Zulekha Nursing College"
];

export default function KnowYourFeesPage() {
  return (
    <>
      <PageBanner title="Know Your Fees" imageSrc="/assets/headercontent.jpeg" />

      <section className="section" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
        <div className="container grid grid-2" style={{ alignItems: "start", gap: "2rem" }}>
          <div className="card card-pad" style={{ display: "grid", gap: "1rem" }}>
            <span className="section-label">Step 1 of 1</span>
            <h1 className="section-title" style={{ margin: 0 }}>Know your fees in one minute.</h1>
            <p className="section-copy" style={{ margin: 0 }}>
              Select your campus and preferred course first, then share your basic contact details.
              When you click the WhatsApp button, we will submit your enquiry and open chat with our student counsellor.
            </p>

            <div className="grid" style={{ gap: "0.7rem" }}>
              {campuses.map((item) => (
                <div className="pill" key={item} style={{ justifyContent: "flex-start" }}>
                  {item}
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: "1rem" }}>
              <p className="text-soft" style={{ margin: 0 }}>
                Fee details may vary by campus, course specialization, and scholarship eligibility.
                Chat with our counsellor for the latest verified amount.
              </p>
            </div>
          </div>

          <div className="card card-pad" style={{ display: "grid", gap: "0.8rem" }}>
            <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.7rem", color: "var(--primary-dark)" }}>
              Fee Enquiry Form
            </h2>
            <p className="text-soft text-sm" style={{ margin: 0 }}>
              Campus first, then course, then contact details.
            </p>
            <KnowYourFeesForm />
          </div>
        </div>
      </section>
    </>
  );
}
