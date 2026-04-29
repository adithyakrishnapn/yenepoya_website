import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAllBlogs, validateBlogPayload } from "@/lib/blogs";

export const dynamic = "force-dynamic";

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(STORE_DIR, "blogs.json");

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

export async function GET() {
  try {
    // Try to get from local file first, fallback to Firestore REST API
    const localBlogs = await readBlogs();
    if (localBlogs.length > 0) {
      return NextResponse.json({ data: localBlogs }, { status: 200 });
    }
    
    // Fallback to Firestore REST API
    const blogs = await getAllBlogs();
    return NextResponse.json({ data: blogs }, { status: 200 });
  } catch {
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { errors, value } = validateBlogPayload(body);

    if (errors.length) {
      return NextResponse.json({ error: errors[0] }, { status: 422 });
    }

    // Check for duplicate slug
    const existing = await readBlogs();
    if (existing.some((blog) => blog.slug === value.slug)) {
      return NextResponse.json({ error: "slug already exists" }, { status: 409 });
    }

    const newBlog: BlogRecord = {
      id: randomUUID(),
      title: value.title,
      slug: value.slug,
      excerpt: value.excerpt,
      content: value.content,
      image: value.image,
      category: value.category,
      seoTitle: value.seoTitle,
      seoDescription: value.seoDescription,
      seoKeywords: value.seoKeywords,
      status: (value.status ?? "published") as "published" | "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await writeBlogs([newBlog, ...existing]);
    return NextResponse.json({ success: true, data: newBlog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

