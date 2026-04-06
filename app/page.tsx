import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { getPublishedBlogs } from "@/lib/blogs";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yenepoya University Mudipu | Excellence in Higher Education",
  description: "Discover Yenepoya University Mudipu: admissions, certified programs, campus life, and career-focused higher education in Arts, Science, Commerce, and Management.",
  keywords: ["Yenepoya University Mudipu", "higher education", "admissions", "programs", "MBA", "undergraduate", "postgraduate"],
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    type: "website",
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
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  }
};

const homeFeeStructure = [
  {
    program: "BCA (Artificial Intelligence and DevOps)",
    duration: "3 Years",
    bookingAmount: "₹26,000"
  },
  {
    program: "BCA (Cyber Security and Ethical Hacking)",
    duration: "3 Years",
    bookingAmount: "₹26,000"
  },
  {
    program: "BBA (Aviation and Logistics)",
    duration: "3 Years",
    bookingAmount: "₹26,000"
  },
  {
    program: "MBA (HR, Marketing, Finance, Logistics)",
    duration: "2 Years",
    bookingAmount: "₹26,000"
  }
];

export default async function HomePage() {
  const blogs = await getPublishedBlogs();
  const featuredBlogs = blogs.slice(0, 3);

  return (
    <>
      {/* ANNOUNCEMENT BANNER */}
      <div className="announcement-banner">
        <span>🎓 Admissions 2026-27 now open · Transform your future with us</span>
      </div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container grid grid-2" style={{ alignItems: "center", gap: "4rem" }}>
          <div className="hero-content">
            <h1 className="hero-title">
              Where Excellence Meets <span className="gradient-text">Innovation</span>
            </h1>
            <p className="hero-subtitle">
              Shape your destiny with world-class education, industry mentorship, and global opportunities at Yenepoya University Mudipu—where careers take flight.
            </p>
            <div className="button-group">
              <Link href="/admissions/apply" className="btn btn-primary">
                Start Your Journey
              </Link>
              <Link href="/programs" className="btn btn-outline">
                Explore Programs
              </Link>
            </div>
            <p className="section-text" style={{ marginBottom: 0 }}>
              From first-year mentoring to placement training, every stage of your student journey is built with clear academic support and measurable career outcomes.
            </p>
            <div className="stats-inline">
              {[
                { number: "18,500+", label: "Alumni Network" },
                { number: "150+", label: "Global Partners" },
                { number: "95%", label: "Placement Rate" }
              ].map((stat) => (
                <div key={stat.label} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-arch-stage">
              <Image
                src="/assets/hero.png"
                alt="Yenepoya student empowerment"
                className="hero-student-image"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "contain", objectPosition: "bottom center" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="section about-section">
        <div className="container grid grid-2" style={{ alignItems: "center", gap: "4rem" }}>
          <div className="about-image fade-in-left">
            <Image
              src="/assets/about-img-1.jpeg"
              alt="Yenepoya campus excellence"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
            <div className="image-overlay"></div>
          </div>
          <div className="about-content fade-in-right">
            <div className="section-label">About Us</div>
            <h2 className="section-title">
              A Legacy of Academic Excellence & Innovation
            </h2>
            <p className="section-text">
              Since 2017, Yenepoya Institute of Arts, Science, Commerce & Management has fostered transformational education across five dynamic disciplines. Our institution combines rigorous academics with real-world experience, preparing graduates for leadership roles in an interconnected global economy.
            </p>
            <p className="section-text">
              With world-class faculty, state-of-the-art facilities, and industry partnerships spanning across 150+ organizations, we ensure every student graduates career-ready and globally competitive.
            </p>
            <p className="section-text">
              Our learning model combines project-based assignments, certification tracks, and internship-linked teaching to keep students aligned with current industry expectations.
            </p>
            <div className="button-group">
              <Link href="/about" className="btn btn-primary-outline">
                Discover Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section className="section programs-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Academic Excellence</div>
            <h2 className="section-title">Five Pathways to Success</h2>
            <p className="section-description">
              Choose from industry-aligned programs designed to unlock your potential and launch a thriving career.
            </p>
            <p className="section-text" style={{ margin: "1rem auto 0", maxWidth: "68ch" }}>
              Each program includes mentoring, communication training, and skill certifications so students build both subject depth and workplace readiness.
            </p>
          </div>

          <div className="programs-grid">
            {[
              {
                title: "Arts, Design & Humanities",
                icon: "🎨",
                description: "Cultivate critical thinking, creativity, and communication excellence across psychology, journalism, and visual arts.",
                specialties: ["Psychology", "English", "Journalism", "Design Studies"]
              },
              {
                title: "Computer Science & IT",
                icon: "💻",
                description: "Master emerging technologies with hands-on training in AI, cybersecurity, cloud computing, and full-stack development.",
                specialties: ["BCA AI & DevOps", "Cyber Security", "Data Analytics", "Full Stack Dev"]
              },
              {
                title: "Applied Sciences",
                icon: "🔬",
                description: "Engage in cutting-edge research and laboratory work in biotechnology, clinical sciences, and life sciences innovation.",
                specialties: ["Biotechnology", "Research Methods", "Clinical Support", "Innovation Lab"]
              },
              {
                title: "Commerce & Finance",
                icon: "💼",
                description: "Build expertise in accounting, financial analysis, taxation, and business strategy for the modern economy.",
                specialties: ["B.Com", "Financial Analytics", "Taxation", "Business Strategy"]
              },
              {
                title: "Management & Leadership",
                icon: "👥",
                description: "Develop leadership acumen, entrepreneurial mindset, and operational excellence for executive roles.",
                specialties: ["BBA", "MBA LEAP", "Marketing", "Human Resources"]
              },
              {
                title: "MBA LEAP - Global Track",
                icon: "🌍",
                description: "Immersive international MBA combining Malaysia exposure, IBM certifications, and live industry projects.",
                specialties: ["Global Immersion", "IBM Certs", "Paid Internship", "Placement Support"]
              }
            ].map((prog) => (
              <div key={prog.title} className="program-card fade-in">
                <div className="program-icon">{prog.icon}</div>
                <h3>{prog.title}</h3>
                <p>{prog.description}</p>
                <div className="program-tags">
                  {prog.specialties.map((spec) => (
                    <span key={spec} className="tag">{spec}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEE STRUCTURE SECTION */}
      <section className="section" style={{ background: "#f8fafc" }}>
        <div className="container">
          <div className="section-header">
            <div className="section-label">Fee Structure</div>
            <h2 className="section-title">Program Booking Amount at a Glance</h2>
            <p className="section-description">
              Transparent fee preview for popular programs. Standard booking amount currently listed across programs is <strong>₹26,000</strong>.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: "1.2rem" }}>
            {homeFeeStructure.map((item) => (
              <article key={item.program} className="card card-pad" style={{ display: "grid", gap: "0.6rem" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>{item.program}</h3>
                <p className="text-soft" style={{ margin: 0 }}>Duration: {item.duration}</p>
                <p style={{ margin: 0, fontWeight: 700, color: "var(--accent-gold)" }}>Booking Amount: {item.bookingAmount}</p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Link href="/courses" className="btn btn-outline">View Full Fee Structure</Link>
          </div>
        </div>
      </section>

      {/* PARTNERSHIPS SECTION */}
      <section className="section partnerships-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trusted by Industry Leaders</h2>
            <p className="section-description">
              Educational collaborations with leading technology and industry organizations worldwide
            </p>
            <p className="section-text" style={{ margin: "1rem auto 0", maxWidth: "64ch" }}>
              Our partner ecosystem enables practical certification pathways, career-aligned workshops, and curriculum co-design for future-ready graduates.
            </p>
          </div>

          <div className="partners-grid">
            {[
              { name: "IBM", src: "/assets/logos/ibm.png" },
              { name: "Google Cloud", src: "/assets/logos/google-cloud.png" },
              { name: "Microsoft Azure", src: "/assets/logos/azure.png" },
              { name: "AWS", src: "/assets/logos/aws.png" },
              { name: "Meta", src: "/assets/logos/meta.png" },
              { name: "EC Council", src: "/assets/logos/ec-council.png" },
              { name: "TUV SUD", src: "/assets/logos/tuv.png" }
            ].map((partner) => (
              <div key={partner.name} className="partner-card fade-in">
                <Image
                  src={`https://mudipu.yenepoyauniversity.online${partner.src}`}
                  alt={partner.name}
                  width={140}
                  height={60}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section accreditation-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Accredited & <span className="gradient-text">Recognized By</span>
            </h2>
            <p className="section-description">
              Recognized for academic excellence and quality education
            </p>
          </div>

          <div className="accreditation-grid">
            {[
              { name: "NAAC A+", src: "/assets/logos/naac.png" },
              { name: "NIRF", src: "/assets/logos/nirf.png" },
              { name: "AICTE", src: "/assets/logos/aicte.png" },
              { name: "UGC", src: "/assets/logos/ugc.png" },
              { name: "NABL", src: "/assets/logos/nabl.png" },
              { name: "ARIIA", src: "/assets/logos/ariia.png" },
              { name: "THE Rankings", src: "/assets/logos/the.png" },
              { name: "NABH", src: "/assets/logos/nabh.png" }
            ].map((org) => (
              <div key={org.name} className="accredit-card fade-in">
                <Image
                  src={`https://mudipu.yenepoyauniversity.online${org.src}`}
                  alt={org.name}
                  width={160}
                  height={70}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMPUS FEATURES */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Campus Life</div>
            <h2 className="section-title">Beyond Classrooms</h2>
            <p className="section-description">
              A supportive campus ecosystem with technology-enabled learning, active student communities, and guided personal growth.
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                image: "/assets/ict enabled.jpeg",
                title: "Digital Innovation Hub",
                description: "State-of-the-art ICT infrastructure with smart classrooms, research labs, and collaborative learning spaces."
              },
              {
                image: "/assets/simulationcenter.jpeg",
                title: "Simulation Center",
                description: "Advanced simulation environments for hands-on clinical and technical training with real-world scenarios."
              },
              {
                image: "/assets/homeawafromhome.jpeg",
                title: "Community & Culture",
                description: "Vibrant campus culture with student clubs, events, mentoring programs, and holistic development initiatives."
              }
            ].map((feature) => (
              <div key={feature.title} className="feature-card fade-in">
                <div className="feature-image">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="section blog-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Insights & Stories</div>
            <h2 className="section-title">Latest from Our Community</h2>
            <p className="section-description">
              Explore student stories, career guidance, admission updates, and thought leadership from Yenepoya Mudipu.
            </p>
          </div>

          <div className="blog-grid">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Link href="/blog" className="btn btn-outline">View All Blogs</Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container cta-container">
          <h2 className="cta-title">Ready to Transform Your Future?</h2>
          <p className="cta-subtitle">
            Join a community of achievers, innovators, and leaders. Begin your journey today.
          </p>
          <div className="button-group cta-buttons">
            <Link href="/admissions/apply" className="btn btn-primary">
              Apply Now
            </Link>
            <Link href="/contact" className="btn btn-light">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
