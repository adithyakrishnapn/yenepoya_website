import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { PageBanner } from "@/components/page-banner";
import { ContactEnquiryForm } from "@/components/contact-enquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Yenepoya University Mudipu for admissions enquiries, program details, and support.",
  keywords: ["contact university", "admissions enquiry", "Yenepoya contact", "Mudipu campus contact"],
  alternates: {
    canonical: absoluteUrl("/contact")
  },
  openGraph: {
    title: `Contact | ${siteConfig.shortName}`,
    description: "Get in touch for admissions guidance, course enquiries, and campus support.",
    url: absoluteUrl("/contact"),
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
    title: `Contact | ${siteConfig.shortName}`,
    description: "Get in touch for admissions guidance, course enquiries, and campus support.",
    images: [siteConfig.ogImage]
  }
};

export default function ContactPage() {
  return (
    <>
      <PageBanner title="Contact Us" imageSrc="/assets/headercontent.jpeg" />
      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: "start", gap: "4rem" }}>
          <div>
            <span className="kicker">Get in Touch</span>
            <h2 className="section-title" style={{ marginTop: "0.75rem", fontSize: "2.2rem" }}>We're here to guide your academic journey.</h2>
            <p className="text-soft mt-4" style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
              Whether you have questions about our specialized PG programs, admissions pathways, or campus facilities, our dedicated admissions council is available round the clock.
            </p>
            <div className="card card-pad" style={{ marginTop: "1.5rem", display: "grid", gap: "0.75rem" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>Write to us directly</h3>
              <a href={`mailto:${siteConfig.contactEmail}`} className="btn btn-outline" style={{ width: "fit-content" }}>{siteConfig.contactEmail}</a>
            </div>
          </div>
          <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>Send a direct message</h3>
            <p className="text-soft text-sm">Need immediate assistance? Fill out the form below and our counselor will reach back to you.</p>
            <ContactEnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
