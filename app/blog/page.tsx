import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard } from "@/components/blog-card";
import { getPublishedBlogs } from "@/lib/blogs";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { PageBanner } from "@/components/page-banner";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read SEO-friendly articles, campus updates, and academic insights from Yenepoya University Mudipu.",
  keywords: ["university blog", "SEO articles", "campus news", "academic insights", "Mudipu blog"],
  alternates: {
    canonical: absoluteUrl("/blog")
  },
  openGraph: {
    title: `Blog | ${siteConfig.shortName}`,
    description: "Read the latest campus stories, admissions updates, and student insights from Yenepoya Mudipu Campus.",
    url: absoluteUrl("/blog"),
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
    title: `Blog | ${siteConfig.shortName}`,
    description: "Read the latest campus stories, admissions updates, and student insights from Yenepoya Mudipu Campus.",
    images: [siteConfig.ogImage]
  }
};

export default async function BlogIndexPage() {
  const blogs = await getPublishedBlogs();
  const featuredBlog = blogs[0];
  const remainingBlogs = blogs.slice(1);

  return (
    <>
      <PageBanner title="Happenings at Yenepoya" imageSrc="/assets/headercontent.jpeg" />
      <section className="section blog-index-section" style={{ paddingTop: "3rem" }}>
        <div className="container">
          <div className="blog-header-panel card">
            <div className="blog-header-copy">
              <span className="section-label">Our Blogs</span>
              <h1 className="section-title" style={{ marginTop: "0.75rem" }}>Latest updates, achievements, and campus stories.</h1>
              <p className="section-description" style={{ margin: "1rem 0 0" }}>
                Explore student life, admissions insights, campus milestones, and thought pieces from Yenepoya Mudipu Campus.
              </p>
            </div>
            <div className="blog-header-stats">
              <div className="blog-stat-card">
                <strong>{blogs.length}</strong>
                <span>Published stories</span>
              </div>
              <div className="blog-stat-card">
                <strong>Fresh</strong>
                <span>Admissions and campus updates</span>
              </div>
            </div>
          </div>

          {featuredBlog ? (
            <article className="featured-blog card">
              <div className="featured-blog-copy">
                <span className="section-label">Featured Story</span>
                <h2 className="featured-blog-title">{featuredBlog.title}</h2>
                <p className="featured-blog-excerpt">{featuredBlog.excerpt}</p>
                <div className="meta-row" style={{ marginTop: "1rem" }}>
                  <span className="pill">{featuredBlog.category}</span>
                  <span style={{ color: "var(--text-light)" }}>{new Date(featuredBlog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <Link href={`/blog/${featuredBlog.slug}`} className="btn btn-primary" style={{ marginTop: "1.25rem", width: "fit-content" }}>
                  Read Featured Article
                </Link>
              </div>
              <div className="featured-blog-side">
                <div className="featured-blog-badge">Insights</div>
                <p>
                  In-depth articles on student success, course selection, and campus developments.
                </p>
              </div>
            </article>
          ) : null}

          <div className="blog-grid blog-grid-compact" style={{ marginTop: "1.8rem" }}>
            {remainingBlogs.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
          {blogs.length === 0 ? (
            <div className="card" style={{ marginTop: "1.5rem", padding: "1.2rem" }}>
              <p style={{ margin: 0, color: "var(--text-light)" }}>
                No blog posts published yet. New updates will appear here soon.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
