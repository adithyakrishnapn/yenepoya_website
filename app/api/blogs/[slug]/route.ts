import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { getBlogBySlug, validateBlogPayload } from "@/lib/blogs";

export const dynamic = "force-dynamic";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "blogs.json");

type Params = { params: Promise<{ slug: string }> };

type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  status: "published" | "draft";
  createdAt: string;
  updatedAt?: string;
};

async function readBlogs() {
  try {
    const raw = await readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as BlogRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as BlogRecord[];
  }
}

async function writeBlogs(blogs: BlogRecord[]) {
  await mkdir(STORE_DIR, { recursive: true });
  await writeFile(STORE_FILE, JSON.stringify(blogs, null, 2), "utf8");
}

export async function GET(_: NextRequest, { params }: Params) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  return NextResponse.json({ data: blog }, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { slug } = await params;

  try {
    const blogs = await readBlogs();
    const currentIndex = blogs.findIndex((b) => b.slug === slug);
    
    if (currentIndex < 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const body = await request.json();
    const { errors, value } = validateBlogPayload(body, true);
    if (errors.length) {
      return NextResponse.json({ error: errors[0] }, { status: 422 });
    }

    const nextSlug = value.slug || slug;
    if (nextSlug !== slug) {
      const hasDuplicate = blogs.some((b, idx) => idx !== currentIndex && b.slug === nextSlug);
      if (hasDuplicate) {
        return NextResponse.json({ error: "slug already exists" }, { status: 409 });
      }
    }

    const updated: BlogRecord = {
      ...blogs[currentIndex],
      ...value,
      slug: nextSlug,
      status: (value.status ?? blogs[currentIndex].status) as "published" | "draft",
      updatedAt: new Date().toISOString()
    };

    blogs[currentIndex] = updated;
    await writeBlogs(blogs);

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { slug } = await params;

  try {
    const blogs = await readBlogs();
    const currentIndex = blogs.findIndex((b) => b.slug === slug);
    
    if (currentIndex < 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    blogs.splice(currentIndex, 1);
    await writeBlogs(blogs);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}

