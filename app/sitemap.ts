import type { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/lib/blogs";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getPublishedBlogs();

  const pages: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/programs",
    "/courses",
    "/admissions",
    "/blog",
    "/contact"
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/blog" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8
  }));

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: absoluteUrl(`/blog/${blog.slug}`),
    lastModified: new Date(blog.updatedAt ?? blog.createdAt),
    changeFrequency: "weekly",
    priority: 0.7
  }));

  return [...pages, ...blogEntries];
}
