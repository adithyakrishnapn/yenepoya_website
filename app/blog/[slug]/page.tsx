import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogSlugs } from "@/lib/blogs";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return getBlogSlugs();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog not found",
      description: siteConfig.description
    };
  }

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt,
    keywords: blog.seoKeywords,
    alternates: {
      canonical: absoluteUrl(`/blog/${blog.slug}`)
    },
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      url: absoluteUrl(`/blog/${blog.slug}`),
      type: "article",
      siteName: siteConfig.name,
      images: [
        {
          url: blog.image,
          alt: blog.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt,
      images: [blog.image]
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const publishedDate = new Date(blog.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.seoDescription || blog.excerpt,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt ?? blog.createdAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name
    },
    mainEntityOfPage: absoluteUrl(`/blog/${blog.slug}`)
  };

  return (
    <article className="section" style={{ paddingTop: "3.5rem" }}>
      <div className="container grid" style={{ gap: "1.25rem" }}>
        <div className="meta-row">
          <span className="pill">{blog.category}</span>
          <span style={{ color: "var(--text-soft)" }}>{publishedDate}</span>
        </div>
        <h1 className="article-title" style={{ fontSize: "clamp(2.8rem, 6vw, 5.6rem)", margin: 0, maxWidth: "12ch" }}>
          {blog.title}
        </h1>
        <p className="section-copy" style={{ marginBottom: 0 }}>{blog.excerpt}</p>
        <div className="card card-pad article-content" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(jsonLd)}
      </script>
    </article>
  );
}
