import Link from "next/link";
import type { BlogPost } from "@/lib/blogs";

export function BlogCard({ blog }: { blog: BlogPost }) {
  return (
    <article className="blog-card fade-in">
      <div className="blog-card-top">
        <span className="blog-category">{blog.category}</span>
        <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
      </div>
      <div className="blog-card-body">
        <h3 className="blog-title">{blog.title}</h3>
        <p className="blog-excerpt">{blog.excerpt}</p>
      </div>
      <div className="blog-card-footer">
        <span className="blog-read-time">4 min read</span>
        <Link href={`/blog/${blog.slug}`} className="blog-link">
          Read Article →
        </Link>
      </div>
    </article>
  );
}
